import { parseQiskitCode, type ParseError } from "../../../circuit/parser/qiskit-parser";
import { runSimulation } from "../../../simulation/state-vector-simulator";
import type { AssessmentChallenge, AssessmentQuestion } from "../types";

// Pure grading logic — no React, no I/O, no store access, so it can be unit
// tested directly (see grading.test.ts). The UI layer (AssessmentPanel) only
// renders what these functions return.

export interface QuestionResult {
  /** Position in the assessment — the identity used everywhere, see below. */
  index: number;
  id: string;
  /** Option key the learner picked, or null if left blank. */
  chosen: string | null;
  correct: string;
  isCorrect: boolean;
}

export interface QuizGrade {
  score: number;
  total: number;
  results: QuestionResult[];
}

/** Answers are indexed by question *position*, not by `question.id`.
 *
 * Seven assessments in the shipped content repeat an id — they run
 * Q1, Q2, Q3, Q3, Q5, and the second one's text literally reads "(Duplicate
 * numbering in original - corrected)". Keying answers by id would make both
 * questions share one radio group and mis-score the pair, so position is the
 * identity throughout the quiz UI and grading. */
export function gradeQuiz(questions: AssessmentQuestion[], answers: (string | null)[]): QuizGrade {
  const results = questions.map((q, index) => {
    const chosen = answers[index] ?? null;
    return { index, id: q.id, chosen, correct: q.correct, isCorrect: chosen === q.correct };
  });
  return {
    score: results.filter((r) => r.isCorrect).length,
    total: questions.length,
    results,
  };
}

const BITSTRING = /^[01]+$/;

/** A challenge can only be auto-graded when its target is a genuine bitstring →
 * probability map we can compare against a simulated circuit. The other target
 * shapes in the content (`statevector` labels, classical `value` scalars, and
 * null) carry nothing mechanically checkable, so they're filtered out of the UI
 * instead of being graded on a guess.
 *
 * The shape is validated, not just the `type` tag, because some entries are
 * mislabelled `measurement_probability` while holding something else entirely —
 * e.g. `{"11_1iter": ">0.7", "11_2iter": ">0.7"}`, which is a two-circuit
 * comparison task with label keys and comparison-string values. A learner can
 * never satisfy that against a single simulated circuit, so showing it would
 * mean an unpassable challenge. Requirements:
 *   - at least one entry
 *   - every key a pure bitstring, all of the same width (one basis state each)
 *   - every value a finite number
 */
export function isAutoGradable(challenge: AssessmentChallenge): boolean {
  const target = challenge.target;
  if (!target || target.type !== "measurement_probability") return false;
  if (typeof target.target !== "object" || target.target === null) return false;

  const entries = Object.entries(target.target as Record<string, unknown>);
  if (entries.length === 0) return false;

  const width = entries[0][0].length;
  return entries.every(
    ([key, value]) =>
      BITSTRING.test(key) && key.length === width && typeof value === "number" && Number.isFinite(value)
  );
}

const DEF_LINE = /^\s*def\s+\w+\s*\(.*\)\s*(->\s*[^:]+)?:\s*$/;
const RETURN_OR_PASS = /^\s*(return\b.*|pass)\s*$/;

/** The starter code in the content is function-wrapped (42 of 44 challenges):
 *
 *     def chsh_bell_state(qc: QuantumCircuit, qs: list) -> QuantumCircuit:
 *         # Your code here
 *         pass
 *
 * parseQiskitCode is deliberately a strict line-oriented subset — it rejects
 * `def`, indentation and `return`. Rather than loosen the parser (which the
 * code editor and Qiskit round-tripping also depend on), flatten the learner's
 * answer here: drop the `def` header, dedent the body, and drop bare
 * `return`/`pass` lines.
 *
 * Line numbers are preserved (removed lines become blank) so parse errors still
 * point at the right line in the learner's editor.
 */
export function normalizeLearnerCode(source: string): string {
  const lines = source.split(/\r?\n/);
  const defIndex = lines.findIndex((l) => DEF_LINE.test(l));
  if (defIndex === -1) return source;

  // Indentation of the first non-blank line after the def header defines the
  // body's base indent; strip exactly that much from each subsequent line.
  const body = lines.slice(defIndex + 1);
  const firstCode = body.find((l) => l.trim().length > 0);
  const baseIndent = firstCode ? (/^[ \t]*/.exec(firstCode)?.[0].length ?? 0) : 0;

  return lines
    .map((line, i) => {
      if (i === defIndex) return "";
      if (i < defIndex) return line;
      if (RETURN_OR_PASS.test(line)) return "";
      return line.slice(0, baseIndent).trim().length === 0 ? line.slice(baseIndent) : line.trimStart();
    })
    .join("\n");
}

export interface ProbabilityRow {
  bitstring: string;
  expected: number;
  actual: number;
  delta: number;
  ok: boolean;
}

export interface ChallengeGrade {
  ok: boolean;
  parseErrors: ParseError[];
  rows: ProbabilityRow[];
  worstDelta: number;
  /** Set when the challenge isn't auto-gradable or the code produced no circuit. */
  message: string | null;
}

const DEFAULT_TOLERANCE = 0.1;

/** Grades a coding challenge by flattening the answer, parsing it with the
 * existing Qiskit parser, simulating it with the existing local statevector
 * simulator, and comparing outcome probabilities against the target. */
export function gradeChallenge(challenge: AssessmentChallenge, code: string): ChallengeGrade {
  const empty = { rows: [], worstDelta: 0, parseErrors: [] };

  if (!isAutoGradable(challenge)) {
    return { ...empty, ok: false, message: "This challenge is not auto-graded." };
  }

  const { circuit, errors } = parseQiskitCode(normalizeLearnerCode(code));
  if (errors.length > 0) {
    return { ...empty, ok: false, parseErrors: errors, message: null };
  }
  if (!circuit) {
    return {
      ...empty,
      ok: false,
      message: "No circuit found — start with qc = QuantumCircuit(...) and add gates to it.",
    };
  }

  const expected = challenge.target!.target as Record<string, number>;
  const tolerance = challenge.target!.tolerance ?? DEFAULT_TOLERANCE;

  let actual: Record<string, number>;
  try {
    actual = runSimulation(circuit).probabilities;
  } catch {
    return { ...empty, ok: false, message: "Couldn't simulate that circuit — check it for validation errors." };
  }

  // runSimulation omits basis states below 1e-12, while targets list explicit
  // zeros. Comparing over the *union* of both key sets means a missing key
  // reads as 0 and an extra, unwanted outcome still fails the check.
  const bitstrings = [...new Set([...Object.keys(expected), ...Object.keys(actual)])].sort();

  const rows: ProbabilityRow[] = bitstrings.map((bitstring) => {
    const exp = expected[bitstring] ?? 0;
    const act = actual[bitstring] ?? 0;
    const delta = Math.abs(exp - act);
    return { bitstring, expected: exp, actual: act, delta, ok: delta <= tolerance };
  });

  const worstDelta = rows.reduce((max, r) => Math.max(max, r.delta), 0);
  return { ok: rows.every((r) => r.ok), parseErrors: [], rows, worstDelta, message: null };
}
