// Edge Function: the roofing knowledge assistant.
//
// The client does the retrieval — it already holds the whole reference
// library in memory and scores it locally — and sends only the handful of
// records that matched, plus (optionally) a redacted summary of the open job.
// This function's whole job is to turn that grounded context into an answer
// in the provider's voice, and to keep the API key on the server.
//
// Why it is a sandbox:
//   * ANTHROPIC_API_KEY never reaches the browser. A VITE_-prefixed variable
//     would be compiled into the bundle and be public; this one is not.
//   * The model only ever sees what the client sent. It has no database
//     access, no tools, and no ability to reach back into the tenant.
//   * The system prompt confines answers to the supplied records, requires a
//     citation, and refuses to give legal advice — matching the disclaimer
//     shown on screen.
//
// Graceful degradation is the contract: with no key deployed this returns
// { ok: false, reason: "unconfigured" } and the app falls back to the local
// retrieval answer it has always given. It must never look broken.
//
// Deploy:  supabase functions deploy ai-assistant
// Secrets: ANTHROPIC_API_KEY  (never prefix this with VITE_)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

const MODEL = "claude-sonnet-4-5";
const MAX_RECORDS = 14;
const MAX_BODY = 1800;     // characters per record — the library is dense
const MAX_QUESTION = 1200;

const SYSTEM = `You are the knowledge assistant inside RoofStride, a CRM used by roofing contractors. You are talking to a roofer, an estimator, or a company owner — in the field, often on a phone, usually mid-claim.

You answer ONLY from the reference records supplied in the user message. These come from the app's own library: building code provisions, manufacturer install specifications and warranty terms, NRCA best practice, insurance policy provisions, carrier behavior patterns, claim playbooks, supplement templates, and glossary terms.

Rules:
- Ground every substantive claim in a supplied record and name the source in the answer, e.g. "per IRC R905.2.8.5" or "per GAF's technical bulletin". If a record carries a citation, use it verbatim.
- If the records do not answer the question, say so plainly and say what would answer it (a specific code section, the carrier's scope sheet, a manufacturer's technical services line). Do not fill the gap from memory — a confidently wrong code cite gets a supplement denied and costs the contractor real money.
- Code varies by jurisdiction and policies vary by carrier. When the answer depends on either, say which one and tell them to verify locally.
- You are not a lawyer and this is not legal advice. Do not tell anyone whether they have a legal claim, and do not draft anything that reads as a legal demand. Explaining what a policy provision or regulation says, and how a contractor typically documents a position, is fine.
- Never invent a code section, a manufacturer specification, a warranty term, a phone number, or a dollar figure.
- If a job summary is supplied, use it — answer for that roof specifically rather than in general.

Style: short. Lead with the answer, then the reasoning, then the cite. Plain sentences, no headers, no bullet lists longer than four items. Write the way a good superintendent explains something on a roof: direct, concrete, no hedging beyond what is genuinely uncertain.`;

function clip(s: unknown, n: number): string {
  const t = String(s ?? "").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (o: unknown, status = 200) =>
    new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json" } });

  try {
    const key = Deno.env.get("ANTHROPIC_API_KEY");
    // Not an error: the app is designed to work without this.
    if (!key) return json({ ok: false, reason: "unconfigured" });

    // Only signed-in seats. The tenant isn't used to fetch anything — the
    // check exists so this isn't an open relay to a paid API.
    const authHeader = req.headers.get("Authorization") ?? "";
    const caller = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return json({ ok: false, reason: "unauthenticated", error: "Not signed in" }, 401);

    const payload = await req.json().catch(() => ({}));
    const question = clip(payload.question, MAX_QUESTION);
    if (!question) return json({ ok: false, reason: "empty", error: "No question" }, 400);

    const records = Array.isArray(payload.records) ? payload.records.slice(0, MAX_RECORDS) : [];
    if (!records.length) {
      // Nothing matched locally, so there is nothing to ground an answer in.
      // Say so rather than letting the model answer from memory.
      return json({ ok: false, reason: "no-context" });
    }

    const context = records.map((r: Record<string, unknown>, i: number) => {
      const cite = r.cite ? ` [${clip(r.cite, 80)}]` : "";
      return `<record id="${i + 1}" source="${clip(r.source, 60)}"${cite ? ` cite="${clip(r.cite, 80)}"` : ""}>
${clip(r.title, 200)}
${clip(r.body, MAX_BODY)}
</record>`;
    }).join("\n\n");

    const jobLine = payload.job
      ? `\n\nThe user is looking at this job right now:\n<job>\n${clip(JSON.stringify(payload.job), 1200)}\n</job>`
      : "";

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 900,
        system: SYSTEM,
        messages: [{
          role: "user",
          content: `Reference records:\n\n${context}${jobLine}\n\nQuestion: ${question}`,
        }],
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("anthropic error", res.status, detail.slice(0, 500));
      // Still not a hard failure for the caller — it falls back to local.
      return json({ ok: false, reason: "provider", status: res.status });
    }

    const data = await res.json();
    const answer = (data.content || [])
      .filter((b: Record<string, unknown>) => b.type === "text")
      .map((b: Record<string, string>) => b.text)
      .join("\n")
      .trim();
    if (!answer) return json({ ok: false, reason: "empty-answer" });

    return json({ ok: true, answer, model: MODEL });
  } catch (e) {
    console.error("ai-assistant", e);
    return json({ ok: false, reason: "error" });
  }
});
