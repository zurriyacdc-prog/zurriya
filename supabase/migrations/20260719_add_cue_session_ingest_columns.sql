-- Adds support for sessions ingested from the CUE (Technothera ABA) app via
-- POST /api/sessions/ingest, alongside the existing Portal-native manual
-- session entry flow. All new columns are nullable so existing rows and the
-- existing recordSession() insert path are unaffected.
--
-- No supabase/migrations pipeline existed in this repo before this file —
-- run this manually against the project (Supabase SQL editor, or
-- `supabase db push` if the project is linked with the CLI).

alter table public.sessions
  add column if not exists source text not null default 'portal',
  add column if not exists external_session_id text,
  add column if not exists therapist_name text,
  add column if not exists goals jsonb,
  add column if not exists behavior_summary jsonb,
  add column if not exists reinforcement_summary jsonb,
  add column if not exists parent_summary text;

alter table public.sessions
  add constraint sessions_source_check check (source in ('portal', 'cue'));

-- One row per external (CUE) session — lets the ingest route upsert on
-- conflict so a queued/retried delivery after a network failure never creates
-- a duplicate row. Only enforced when set (portal-native rows leave this null).
create unique index if not exists sessions_external_session_id_key
  on public.sessions (external_session_id)
  where external_session_id is not null;

-- CUE sends a free-text therapist name, not a Zurriya user id — therapist_id
-- has no matching row to point to for ingested sessions, so it must be nullable.
alter table public.sessions
  alter column therapist_id drop not null;

-- CUE has no equivalent of Zurriya's session "type" categories — ingested rows
-- don't populate this column, so it needs a default/nullable path too.
alter table public.sessions
  alter column type drop not null;
