-- ============================================================
-- 039 — record WHERE a storm alert's number came from
--
-- Storm alerts used to have exactly one source: a trained spotter
-- phoned a hail size in to the NWS. Radar-detected hail is now a
-- source too, and it is the one that catches most storms — spotter
-- reports are sparse, and hail regularly crosses a whole subdivision
-- with nobody calling it in.
--
-- The two are not interchangeable evidence. A spotter held a stone
-- against a ruler; radar inferred a size from reflectivity above the
-- freezing level. Both are worth acting on, and a rep should knock on
-- either. But quoting a radar ESTIMATE to an adjuster as though
-- someone had MEASURED it is how a claim gets picked apart, so the
-- alert has to be able to say which it was — on screen, and months
-- later when the claim is being built.
--
-- Defaults to 'reported' so every alert raised before this migration
-- keeps its correct meaning: at the time, spotter reports were the
-- only thing that could raise one.
--
-- Idempotent. Safe to re-run.
-- ============================================================

alter table crm_storm_alerts
  add column if not exists source text not null default 'reported';   -- 'reported' | 'radar'
