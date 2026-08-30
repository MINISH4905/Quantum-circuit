const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? "http://localhost:8000";

export interface AttemptPayload {
  source_file: string;
  concept_title: string;
  kind: "quiz" | "challenge";
  challenge_id: string | null;
  score: number;
  max_score: number;
  passed: boolean;
  /** Free-form: the picked option keys for a quiz, the submitted code for a challenge. */
  answers: unknown;
}

export interface AttemptOut {
  id: string;
  source_file: string;
  concept_title: string;
  kind: string;
  challenge_id: string | null;
  score: number;
  max_score: number;
  passed: boolean;
  created_at: string;
}

export interface AssessmentSummary {
  source_file: string;
  concept_title: string;
  /** Best quiz mark. Both are 0 when only coding challenges were attempted. */
  best_score: number;
  max_score: number;
  attempts: number;
  challenges_passed: number;
  passed: boolean;
  last_attempt_at: string;
}

export interface MemberProgress {
  user_id: string;
  name: string;
  email: string;
  assessments_completed: number;
  quizzes_attempted: number;
  challenges_passed: number;
  /** Mean of best quiz scores as a percentage, or null with no attempts. */
  average_percent: number | null;
  last_activity_at: string | null;
}

async function extractDetail(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.detail === "string") return body.detail;
  } catch {
    // not JSON
  }
  return `HTTP ${res.status}`;
}

export async function postAttempt(payload: AttemptPayload): Promise<AttemptOut> {
  const res = await fetch(`${BACKEND_URL}/api/assessments/attempts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!res.ok) throw new Error(await extractDetail(res));
  return await res.json();
}

/** The signed-in learner's own progress: best score per assessment. */
export async function getMyProgress(): Promise<{ assessments: AssessmentSummary[] }> {
  const res = await fetch(`${BACKEND_URL}/api/assessments/progress`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(await extractDetail(res));
  return await res.json();
}

/** Instructor-only: per-student progress for one of the caller's own groups. */
export async function getGroupProgress(groupId: string): Promise<{ members: MemberProgress[] }> {
  const res = await fetch(`${BACKEND_URL}/api/assessments/groups/${groupId}/progress`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(await extractDetail(res));
  return await res.json();
}
