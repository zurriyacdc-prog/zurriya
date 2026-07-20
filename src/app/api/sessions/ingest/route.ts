import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { adminClient } from '@/lib/supabase/admin';

// Server-to-server auth for one external caller (the CUE app) — distinct from
// the session-cookie pattern the other routes use, since there's no logged-in
// Supabase user on this request at all.
function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.SESSION_INGEST_TOKEN;
  if (!expected) return false;

  const header = request.headers.get('authorization') ?? '';
  const match = /^Bearer (.+)$/.exec(header);
  if (!match) return false;
  const provided = match[1];

  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(provided);
  if (expectedBuf.length !== providedBuf.length) return false;
  return timingSafeEqual(expectedBuf, providedBuf);
}

const percentageGoalSchema = z.object({
  scoringModel: z.literal('percentage'),
  goalId: z.string().min(1),
  name: z.string().min(1),
  baseline: z.number(),
  current: z.number(),
  target: z.number(),
});

const ladderGoalSchema = z.object({
  scoringModel: z.literal('ladder'),
  goalId: z.string().min(1),
  name: z.string().min(1),
  hierarchyType: z.enum(['motor', 'vocal']),
  currentPromptLevel: z.string().min(1),
  independenceScore: z.number().min(0).max(100),
});

const ingestSchema = z.object({
  sessionId: z.string().min(1),
  childId: z.string().uuid(),
  sessionDate: z.string().min(1),
  sessionStartTime: z.string().min(1),
  sessionEndTime: z.string().min(1),
  durationMinutes: z.number().nonnegative(),
  therapistName: z.string().min(1),
  goals: z.array(z.discriminatedUnion('scoringModel', [percentageGoalSchema, ladderGoalSchema])),
  behaviorSummary: z.array(z.object({ parentFacingLabel: z.string().min(1), count: z.number().nonnegative() })),
  reinforcementSummary: z.object({ totalReinforcementEvents: z.number().nonnegative() }),
  parentSummary: z.string(),
});

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Malformed JSON body' }, { status: 400 });
  }

  const parsed = ingestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }
  const payload = parsed.data;

  const { data: child, error: childLookupError } = await adminClient
    .from('children')
    .select('id')
    .eq('id', payload.childId)
    .maybeSingle();

  if (childLookupError) {
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
  }
  if (!child) {
    return NextResponse.json({ error: `No child found for childId ${payload.childId}` }, { status: 404 });
  }

  // Upsert on the external session id so a retried delivery (CUE queues and
  // retries on reconnect) updates the same row instead of duplicating it.
  const { error: upsertError } = await adminClient.from('sessions').upsert(
    {
      child_id: payload.childId,
      source: 'cue',
      external_session_id: payload.sessionId,
      therapist_id: null,
      therapist_name: payload.therapistName,
      session_date: payload.sessionDate,
      type: null,
      duration_minutes: payload.durationMinutes,
      engagement_score: null,
      notes_en: null,
      notes_ar: null,
      goals: payload.goals,
      behavior_summary: payload.behaviorSummary,
      reinforcement_summary: payload.reinforcementSummary,
      parent_summary: payload.parentSummary || null,
    },
    { onConflict: 'external_session_id' },
  );

  if (upsertError) {
    return NextResponse.json({ error: 'Failed to store session' }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
