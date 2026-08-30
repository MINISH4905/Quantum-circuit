import { useCallback, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useAssessmentStore } from "../../../state/assessment-store";
import { gradeChallenge, type ChallengeGrade } from "./grading";
import type { AssessmentChallenge, LearningConcept } from "../types";

interface ChallengeCardProps {
  challenge: AssessmentChallenge;
  concept: LearningConcept;
}

function formatProbability(value: number): string {
  return value.toFixed(3);
}

/** One auto-graded coding challenge: a Qiskit editor plus a Check button that
 * grades the answer entirely in the browser (parse → simulate → compare).
 *
 * Uses its own standalone Monaco instance rather than CodeEditorPanel, which is
 * wired to the shared circuit-store — grading an assessment answer must not
 * overwrite whatever circuit the learner has open in the Circuit Editor. */
export function ChallengeCard({ challenge, concept }: ChallengeCardProps) {
  const savedCode = useAssessmentStore((s) => s.getChallengeCode(concept.sourceFile, challenge.id));
  const saveChallengeCode = useAssessmentStore((s) => s.saveChallengeCode);
  const recordChallengeAttempt = useAssessmentStore((s) => s.recordChallengeAttempt);
  const passed = useAssessmentStore((s) => s.isChallengePassed(concept.sourceFile, challenge.id));

  const [code, setCode] = useState<string>(savedCode ?? challenge.starterCode);
  const [grade, setGrade] = useState<ChallengeGrade | null>(null);

  useEffect(() => {
    setCode(savedCode ?? challenge.starterCode);
    setGrade(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge.id, concept.sourceFile]);

  const check = useCallback(() => {
    const result = gradeChallenge(challenge, code);
    setGrade(result);
    saveChallengeCode(concept.sourceFile, challenge.id, code);
    recordChallengeAttempt({
      sourceFile: concept.sourceFile,
      conceptTitle: concept.title,
      challengeId: challenge.id,
      passed: result.ok,
      code,
    });
  }, [challenge, code, concept.sourceFile, concept.title, saveChallengeCode, recordChallengeAttempt]);

  const reset = useCallback(() => {
    setCode(challenge.starterCode);
    setGrade(null);
  }, [challenge.starterCode]);

  return (
    <div className="asm-challenge">
      <div className="asm-challenge-desc">{challenge.description}</div>

      <p className="asm-challenge-hint">
        Write plain Qiskit statements — <code>qc = QuantumCircuit(n, n)</code> then <code>qc.h(0)</code>,{" "}
        <code>qc.cx(0, 1)</code>, <code>qc.measure(0, 0)</code>. A <code>def</code> wrapper is accepted and unwrapped for
        you.
      </p>

      <div className="asm-editor">
        <Editor
          height="240px"
          language="python"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
          }}
        />
      </div>

      <div className="asm-challenge-actions">
        <button type="button" className="page-home-btn" onClick={check}>
          Check my code
        </button>
        <button type="button" className="asm-reset-btn" onClick={reset}>
          Reset to starter
        </button>
        {passed && !grade && <span className="asm-challenge-badge">✓ Passed previously</span>}
      </div>

      {grade && (
        <div className={`asm-challenge-result ${grade.ok ? "is-pass" : "is-fail"}`} role="status">
          <p className="asm-challenge-verdict">
            {grade.ok ? "✓ Correct — output matches the target distribution." : "✗ Not matching the target yet."}
          </p>

          {grade.message && <p className="asm-challenge-message">{grade.message}</p>}

          {grade.parseErrors.length > 0 && (
            <ul className="asm-parse-errors">
              {grade.parseErrors.map((err, i) => (
                <li key={i}>
                  <strong>Line {err.line}:</strong> {err.message}
                </li>
              ))}
            </ul>
          )}

          {grade.rows.length > 0 && (
            <div className="asm-prob-table-wrap">
              <table className="asm-prob-table">
                <thead>
                  <tr>
                    <th>Outcome</th>
                    <th>Expected</th>
                    <th>Your circuit</th>
                    <th>Δ</th>
                  </tr>
                </thead>
                <tbody>
                  {grade.rows.map((row) => (
                    <tr key={row.bitstring} className={row.ok ? "is-ok" : "is-off"}>
                      <td>
                        <code>{row.bitstring}</code>
                      </td>
                      <td>{formatProbability(row.expected)}</td>
                      <td>{formatProbability(row.actual)}</td>
                      <td>{row.ok ? "—" : formatProbability(row.delta)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
