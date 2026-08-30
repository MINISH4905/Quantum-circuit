import { useState } from "react";
import { useTutorStore } from "../../state/tutor-store";
import type { HandsOnTask } from "./conceptExample";

type TutorMode = "explain" | "hint" | "debug" | "why" | "challenge" | "review";

const MODE_LABEL: Record<TutorMode, string> = {
  explain: "Explain",
  hint: "Hint",
  debug: "Debug",
  why: "Why?",
  challenge: "Challenge",
  review: "Review",
};
const MODES = Object.keys(MODE_LABEL) as TutorMode[];

interface TutorModesProps {
  task: HandsOnTask;
  isTaskComplete: boolean;
  hintsRevealed: number;
  attemptCount: number;
  /** The most recent diagnose() result from "Check My Work" (see
   * conceptExample.ts) — Debug mode surfaces this alongside the backend's
   * circuit warning, since it names the specific mistake rather than a
   * generic issue. */
  lastDiagnosis: string | null;
  onRevealNextHint: () => void;
}

/** Adaptive Review signal (spec 5.4): recommends Review/Practice/Continue/
 * Challenge from local signals already tracked — attempt count and hint
 * usage — no analytics backend involved. */
function getAdaptiveNote(isTaskComplete: boolean, hintsRevealed: number, attemptCount: number): string | null {
  if (isTaskComplete) {
    if (hintsRevealed === 0 && attemptCount <= 1) return "You solved it on the first try with no hints — try the Challenge tab for something harder.";
    if (hintsRevealed > 0 || attemptCount > 2) return "You got there, but needed some help along the way — a little practice on similar circuits would help it stick.";
    return null;
  }
  if (attemptCount >= 3) return "A few attempts haven't landed yet — worth reviewing the concept explanation above, or requesting another hint.";
  return null;
}

/** Six tutor "modes" layered on top of the existing tutor-store (populated
 * by the untouched TutorController/backend analyze call) plus the current
 * hands-on task's own data — no new backend endpoint, no change to
 * TutorPanel/tutor-store/TutorController. Hint mode reveals the task's
 * hints one at a time rather than dumping the answer; Review summarizes
 * local task/hint/attempt state, including an adaptive next-step note.
 * This is a deliberate scope choice: the existing backend only exposes one
 * analyze() call (circuit in, explanation/warning/optimization out) —
 * building real per-mode LLM prompts would need new backend endpoints that
 * can't be verified in this environment (the backend isn't running here),
 * so modes are built from what's already flowing client-side instead. */
export function TutorModes({ task, isTaskComplete, hintsRevealed, attemptCount, lastDiagnosis, onRevealNextHint }: TutorModesProps) {
  const [mode, setMode] = useState<TutorMode>("explain");
  const result = useTutorStore((s) => s.result);
  const loading = useTutorStore((s) => s.loading);
  const error = useTutorStore((s) => s.error);

  return (
    <div className="tutor-modes">
      <div className="tutor-mode-tabs" role="tablist" aria-label="Tutor mode">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            className={`tutor-mode-tab${mode === m ? " is-active" : ""}`}
            onClick={() => setMode(m)}
          >
            {MODE_LABEL[m]}
          </button>
        ))}
      </div>

      <div className="tutor-mode-body">
        {/* Hint/Challenge/Review are local (task data + progress state) and
            work regardless of backend availability. Only Explain/Why depend
            purely on the tutor-store result; Debug also has a local
            fallback (the task's own diagnose()), so it isn't fully blocked
            by a backend outage either. */}
        {mode === "explain" &&
          (error ? (
            <p className="tutor-mode-muted">{error}</p>
          ) : result ? (
            <p>{result.explanation}</p>
          ) : (
            <p className="tutor-mode-muted">{loading ? "Analyzing circuit…" : "Run the circuit to get an explanation."}</p>
          ))}

        {mode === "hint" && (
          <>
            {hintsRevealed === 0 && <p className="tutor-mode-muted">Stuck? Reveal a hint below — they build up gradually.</p>}
            {task.hints.slice(0, hintsRevealed).map((hint, i) => (
              <p key={i}>
                <strong>Hint {i + 1}:</strong> {hint}
              </p>
            ))}
            {hintsRevealed < task.hints.length ? (
              <button type="button" className="page-home-btn" onClick={onRevealNextHint}>
                Reveal hint {hintsRevealed + 1} of {task.hints.length}
              </button>
            ) : (
              <p className="tutor-mode-muted">That's all the hints for this task.</p>
            )}
          </>
        )}

        {mode === "debug" && (
          <>
            {lastDiagnosis && <p>{lastDiagnosis}</p>}
            {error ? (
              <p className="tutor-mode-muted">{error}</p>
            ) : result?.warning.detected ? (
              <p>{result.warning.message}</p>
            ) : !lastDiagnosis ? (
              <p className="tutor-mode-muted">{result ? "No conceptual issues detected in the current circuit." : "Click Check My Work, or run the circuit, to check for issues."}</p>
            ) : null}
          </>
        )}

        {mode === "why" &&
          (error ? (
            <p className="tutor-mode-muted">{error}</p>
          ) : result ? (
            <>
              <p>{result.explanation}</p>
              <p>{result.optimization}</p>
            </>
          ) : (
            <p className="tutor-mode-muted">Run the circuit to see why it behaves this way.</p>
          ))}

        {mode === "challenge" && <p>{task.challenge}</p>}

        {mode === "review" && (
          <>
            <p>
              {isTaskComplete
                ? `You completed this challenge${hintsRevealed > 0 ? ` using ${hintsRevealed} hint${hintsRevealed === 1 ? "" : "s"}` : " without needing a hint"}${attemptCount > 0 ? ` in ${attemptCount} attempt${attemptCount === 1 ? "" : "s"}` : ""}. ${task.successMessage}`
                : "Complete the hands-on challenge above to see your review."}
            </p>
            {getAdaptiveNote(isTaskComplete, hintsRevealed, attemptCount) && (
              <p className="tutor-mode-muted">{getAdaptiveNote(isTaskComplete, hintsRevealed, attemptCount)}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
