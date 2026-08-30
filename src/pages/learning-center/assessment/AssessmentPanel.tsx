import { useCallback, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { DetailSection } from "../../../components/shared/DetailSection";
import { useAssessmentStore } from "../../../state/assessment-store";
import { gradeQuiz, isAutoGradable, type QuizGrade } from "./grading";
import { ChallengeCard } from "./ChallengeCard";
import "./AssessmentPanel.css";
import type { AssessmentQuestion, ConceptAssessment, LearningConcept } from "../types";

interface AssessmentPanelProps {
  concept: LearningConcept;
  assessment: ConceptAssessment;
  isComplete: boolean;
  onMarkComplete: () => void;
}

/** Interactive replacement for the markdown body on `type: "assessment"`
 * concepts.
 *
 * The prose in `concept.content` spells out "Correct: C" and the full
 * explanation for every question, so an assessment node must never be handed to
 * ConceptViewer — this component renders the structured `concept.assessment`
 * instead and reveals the key only after a submission. That swap (in
 * ConceptPage) is the actual fix for the answers-visible-upfront bug.
 *
 * Answers are held by question *position*, not id: seven shipped assessments
 * repeat an id (see the note on gradeQuiz). */
export function AssessmentPanel({ concept, assessment, isComplete, onMarkComplete }: AssessmentPanelProps) {
  // Memoized so the callbacks below aren't invalidated on every render (the
  // `?? []` fallback would otherwise allocate a new array each time).
  const questions = useMemo(() => assessment.questions ?? [], [assessment.questions]);
  const gradableChallenges = useMemo(
    () => (assessment.challenges ?? []).filter(isAutoGradable),
    [assessment.challenges]
  );

  const [answers, setAnswers] = useState<(string | null)[]>(() => questions.map(() => null));
  const [grade, setGrade] = useState<QuizGrade | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const recordQuizAttempt = useAssessmentStore((s) => s.recordQuizAttempt);
  const bestQuizScore = useAssessmentStore((s) => s.bestQuizScore(concept.sourceFile));

  // Reset when navigating between assessments — this component stays mounted
  // across concept changes inside ConceptPage.
  useEffect(() => {
    setAnswers(questions.map(() => null));
    setGrade(null);
    setOpenSections({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concept.sourceFile]);

  const answeredCount = answers.filter((a) => a !== null).length;
  const allAnswered = questions.length > 0 && answeredCount === questions.length;

  // Options are `disabled` once graded, so this can't fire on a locked quiz —
  // no need to guard on `grade` here (and no side effects inside the updater).
  const selectAnswer = useCallback((index: number, optionKey: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = optionKey;
      return next;
    });
  }, []);

  const submit = useCallback(() => {
    const result = gradeQuiz(questions, answers);
    setGrade(result);
    recordQuizAttempt({
      sourceFile: concept.sourceFile,
      conceptTitle: concept.title,
      score: result.score,
      maxScore: result.total,
      answers: result.results.map((r) => ({ index: r.index, id: r.id, chosen: r.chosen })),
    });
  }, [questions, answers, recordQuizAttempt, concept.sourceFile, concept.title]);

  const retry = useCallback(() => {
    setGrade(null);
    setAnswers(questions.map(() => null));
  }, [questions]);

  const percent = grade && grade.total > 0 ? Math.round((grade.score / grade.total) * 100) : 0;

  return (
    <article className="asm-panel" aria-label={concept.title}>
      <header className="asm-header">
        <div className="asm-header-text">
          <p className="asm-eyebrow">Assessment</p>
          <h2 className="asm-title">{concept.title}</h2>
          <p className="asm-meta">
            {questions.length} question{questions.length === 1 ? "" : "s"}
            {gradableChallenges.length > 0 && ` · ${gradableChallenges.length} coding challenge${gradableChallenges.length === 1 ? "" : "s"}`}
            {bestQuizScore && ` · Best: ${bestQuizScore.score}/${bestQuizScore.maxScore}`}
          </p>
        </div>
        <div className="asm-header-actions">
          {isComplete ? (
            <span className="lc-completed-badge">Completed ✓</span>
          ) : (
            <button type="button" className="page-home-btn" onClick={onMarkComplete}>
              Mark as Complete
            </button>
          )}
        </div>
      </header>

      {questions.length === 0 ? (
        <p className="asm-empty">This assessment has no questions yet.</p>
      ) : (
        <section className="asm-quiz" aria-label="Quiz">
          <div className="asm-quiz-head">
            <h3 className="asm-section-title">Quiz</h3>
            {!grade && (
              <span className="asm-progress-label">
                {answeredCount} of {questions.length} answered
              </span>
            )}
          </div>

          {grade && (
            <div className={`asm-score-banner ${grade.score === grade.total ? "is-perfect" : percent >= 60 ? "is-pass" : "is-fail"}`} role="status">
              <span className="asm-score-value">
                {grade.score} / {grade.total}
              </span>
              <span className="asm-score-percent">{percent}%</span>
              <span className="asm-score-text">
                {grade.score === grade.total
                  ? "Perfect — every question correct."
                  : `${grade.total - grade.score} to review. Explanations are shown below.`}
              </span>
            </div>
          )}

          <ol className="asm-question-list">
            {questions.map((question, index) => (
              <QuestionCard
                key={index}
                index={index}
                question={question}
                chosen={answers[index]}
                result={grade?.results[index] ?? null}
                onSelect={selectAnswer}
              />
            ))}
          </ol>

          <div className="asm-submit-row">
            {grade ? (
              <button type="button" className="page-home-btn" onClick={retry}>
                Retry assessment
              </button>
            ) : (
              <button type="button" className="page-home-btn asm-submit-btn" disabled={!allAnswered} onClick={submit}>
                Submit answers
              </button>
            )}
            {!grade && !allAnswered && (
              <span className="asm-submit-hint">Answer all {questions.length} questions to submit.</span>
            )}
          </div>
        </section>
      )}

      {gradableChallenges.length > 0 ? (
        <section className="asm-challenges" aria-label="Coding challenges">
          <h3 className="asm-section-title">Coding challenges</h3>
          {gradableChallenges.map((challenge) => (
            <DetailSection
              key={challenge.id}
              title={`${challenge.title} · ${challenge.difficulty}`}
              isOpen={!!openSections[challenge.id]}
              onToggle={() => setOpenSections((prev) => ({ ...prev, [challenge.id]: !prev[challenge.id] }))}
            >
              <ChallengeCard challenge={challenge} concept={concept} />
            </DetailSection>
          ))}
        </section>
      ) : (
        <p className="asm-quiz-only-note">
          This assessment is quiz-only — it has no auto-graded coding challenge.
        </p>
      )}
    </article>
  );
}

interface QuestionCardProps {
  index: number;
  question: AssessmentQuestion;
  chosen: string | null;
  result: { chosen: string | null; correct: string; isCorrect: boolean } | null;
  onSelect: (index: number, optionKey: string) => void;
}

/** Markdown (with math) is used for question, option and explanation text —
 * the content is full of `cos²(π/8)`, `|Φ⁺⟩` and inline LaTeX. Same plugin set
 * as ConceptViewer, minus syntax highlighting (no code blocks here). */
function QuestionCard({ index, question, chosen, result, onSelect }: QuestionCardProps) {
  const graded = result !== null;
  const groupName = `asm-q-${index}`;

  return (
    <li className={`asm-question ${graded ? (result.isCorrect ? "is-correct" : "is-incorrect") : ""}`}>
      <div className="asm-question-head">
        <span className="asm-question-number">Q{index + 1}</span>
        {graded && (
          <span className={`asm-verdict ${result.isCorrect ? "is-correct" : "is-incorrect"}`}>
            {result.isCorrect ? "✓ Correct" : "✗ Incorrect"}
          </span>
        )}
      </div>

      <div className="asm-question-text">
        <Md>{question.question}</Md>
      </div>

      <div className="asm-options" role="radiogroup" aria-label={`Question ${index + 1} options`}>
        {question.options.map((option) => {
          const isChosen = chosen === option.key;
          const isKey = graded && option.key === result.correct;
          const isWrongPick = graded && isChosen && !result.isCorrect;
          return (
            <label
              key={option.key}
              className={`asm-option ${isChosen ? "is-chosen" : ""} ${isKey ? "is-key" : ""} ${isWrongPick ? "is-wrong" : ""} ${graded ? "is-locked" : ""}`}
            >
              <input
                type="radio"
                name={groupName}
                value={option.key}
                checked={isChosen}
                disabled={graded}
                onChange={() => onSelect(index, option.key)}
              />
              <span className="asm-option-key">{option.key}</span>
              <span className="asm-option-text">
                <Md>{option.text}</Md>
              </span>
              {isKey && <span className="asm-option-tag">Correct answer</span>}
            </label>
          );
        })}
      </div>

      {/* Revealed only after submission — this is the bug being fixed. */}
      {graded && (
        <div className="asm-explanation">
          <span className="asm-explanation-label">Explanation</span>
          <Md>{question.explanation}</Md>
        </div>
      )}
    </li>
  );
}

function Md({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
      {children}
    </ReactMarkdown>
  );
}
