// Edge Function: AI damage detection on a single job photo.
//
// The gap-analysis research behind this found no roofing CRM — including
// CompanyCam, whose whole product is photos — doing this well yet. This is
// real computer-vision work, not a catch-up feature: point a photo at the
// model, get back what's visibly documented in it.
//
// Same sandbox contract as ai-assistant:
//   * ANTHROPIC_API_KEY never reaches the browser.
//   * The model sees exactly one image and nothing else about the tenant —
//     no database access, no other jobs, no customer data.
//   * The system prompt is explicit that this assists a field rep who
//     verifies in person; it is not a claim determination, and it must
//     never invent damage that isn't visibly in the frame.
//
// Graceful degradation is the contract: with no key deployed this returns
// { ok: false, reason: "unconfigured" } and the "Scan for damage" button
// simply doesn't appear — see AUTH().detectPhotoDamage in src/main.jsx.
//
// Deploy:  supabase functions deploy photo-damage-detect
// Secrets: ANTHROPIC_API_KEY  (shared with ai-assistant; never prefix VITE_)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

const MODEL = "claude-sonnet-4-5";
const MAX_IMAGE_BYTES = 5_000_000; // base64 text length, not decoded bytes — plenty for a downscaled job photo
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const SYSTEM = `You are the damage-detection assistant inside RoofStride, a CRM used by roofing contractors. You are shown exactly one job-site photo and nothing else.

Rules:
- Report ONLY what is visibly documented in this specific image. Never infer damage that isn't in the frame, and never reason from what roofs "typically" look like after a storm.
- Categories, when applicable: "Hail impact", "Wind damage / lifted or missing shingles", "Granule loss", "Cracking or curling", "Flashing damage", "Ponding or moisture", "Other visible damage". Use the closest category; do not invent new ones for a normal photo.
- If the photo shows no roofing damage, isn't a roof at all (a person, a receipt, an interior room, a clear elevation with nothing wrong), or is too unclear to tell, return an empty findings array. An empty result is correct and expected most of the time — most photos in a job's album are not damage evidence.
- Each finding needs a confidence: "high" (unambiguous, textbook example), "medium" (visible but could be something else, e.g. wear vs. impact), or "low" (worth a second look, not clearly damage).
- This assists a field rep who will verify in person before it goes anywhere near a claim or an estimate — never state a finding as certain, and never estimate repair cost or dollar value.
- Respond with ONLY a JSON object, no other text, in exactly this shape:
{"findings": [{"type": "Hail impact", "confidence": "high", "description": "one plain sentence describing exactly what's visible and where in the frame"}]}
If there is nothing to report: {"findings": []}`;

function json(o: unknown, status = 200) {
  return new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const key = Deno.env.get("ANTHROPIC_API_KEY");
    if (!key) return json({ ok: false, reason: "unconfigured" });

    const authHeader = req.headers.get("Authorization") ?? "";
    const caller = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return json({ ok: false, reason: "unauthenticated", error: "Not signed in" }, 401);

    const payload = await req.json().catch(() => ({}));
    const mimeType = String(payload.mimeType || "");
    const imageBase64 = String(payload.imageBase64 || "");
    if (!ALLOWED_MIME.has(mimeType)) return json({ ok: false, reason: "bad-mime", error: "Unsupported image type" }, 400);
    if (!imageBase64) return json({ ok: false, reason: "empty", error: "No image" }, 400);
    if (imageBase64.length > MAX_IMAGE_BYTES) return json({ ok: false, reason: "too-large", error: "Image too large" }, 400);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        system: SYSTEM,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mimeType, data: imageBase64 } },
            { type: "text", text: "Report visible damage in this photo, following the JSON format exactly." },
          ],
        }],
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("anthropic error", res.status, detail.slice(0, 500));
      return json({ ok: false, reason: "provider", status: res.status });
    }

    const data = await res.json();
    const text = (data.content || [])
      .filter((b: Record<string, unknown>) => b.type === "text")
      .map((b: Record<string, string>) => b.text)
      .join("\n")
      .trim();

    let parsed: { findings?: unknown[] } | null = null;
    try { parsed = JSON.parse(text); }
    catch {
      // The model was asked for JSON only; fall back to pulling the first
      // {...} block in case it wrapped the answer in prose anyway.
      const m = text.match(/\{[\s\S]*\}/);
      if (m) { try { parsed = JSON.parse(m[0]); } catch { /* give up below */ } }
    }
    if (!parsed || !Array.isArray(parsed.findings)) return json({ ok: false, reason: "unparseable" });

    const findings = parsed.findings
      .filter((f): f is Record<string, unknown> => !!f && typeof f === "object")
      .slice(0, 8)
      .map((f) => ({
        type: String(f.type || "Other visible damage").slice(0, 60),
        confidence: ["high", "medium", "low"].includes(String(f.confidence)) ? String(f.confidence) : "low",
        description: String(f.description || "").slice(0, 300),
      }))
      .filter((f) => f.description);

    return json({ ok: true, findings, model: MODEL });
  } catch (e) {
    console.error("photo-damage-detect", e);
    return json({ ok: false, reason: "error" });
  }
});
