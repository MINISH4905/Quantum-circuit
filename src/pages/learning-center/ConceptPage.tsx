import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { handleDragEnd, handleAddGateClick } from "../../circuit/interactions";
import { useCircuitStore } from "../../state/circuit-store";
import { useLearnerTaskStore } from "../../state/learner-task-store";
import { runSimulation } from "../../simulation/state-vector-simulator";
import { GateToolbox } from "../../components/gates/GateToolbox";
import { GateInspector } from "../../components/panels/GateInspector";
import { CanvasToolbar } from "../../components/circuit/CanvasToolbar";
import { CircuitCanvas } from "../../components/circuit/CircuitCanvas";
import { CodeEditorPanel } from "../../components/code-editor/CodeEditorPanel";
import { ProbabilitiesPanel } from "../../components/simulation/ProbabilitiesPanel";
import { BlochSpheresPanel } from "../../components/simulation/BlochSpheresPanel";
import { QSpherePanel } from "../../components/simulation/QSpherePanel";
import { TutorPanel } from "../../components/tutor/TutorPanel";
import { DetailSection } from "../../components/shared/DetailSection";
import { Breadcrumb } from "./Breadcrumb";
import { ConceptViewer } from "./ConceptViewer";
import { AssessmentPanel } from "./assessment/AssessmentPanel";
import { sanitizeLearningContent } from "./sanitizeContent";
import { getConceptExample } from "./conceptExample";
import { TutorModes } from "./TutorModes";
import "../../App.css";
import "../LearnerPage.css";
import "./ConceptPage.css";
import type { LearningConcept, LearningModule, LearningStage } from "./types";

interface ConceptPageProps {
  stage: LearningStage;
  learningModule: LearningModule;
  concept: LearningConcept;
  isComplete: boolean;
  onMarkComplete: () => void;
  onOpenEditor: () => void;
  onBack: () => void;
  onNavigateConcept: (sourceFile: string) => void;
}

const sensorOptions = { activationConstraint: { distance: 4 } };
type SectionKey = "circuit" | "task" | "code" | "probability" | "bloch" | "qsphere" | "tutor";
interface TaskFeedback {
  ok: boolean;
  message: string;
}

/** Full-page concept view — replaces the roadmap graph entirely while a
 * concept is open (not a side panel). Reuses the existing ConceptViewer
 * (markdown rendering, Mark Complete, Try in Circuit Lab) and Breadcrumb
 * unmodified; this just adds the page chrome (back button, breadcrumb,
 * GitHub link, prev/next-within-module navigation), plus — when
 * getConceptExample finds a matching demo — the same embedded interactive
 * editor + visualization panels the Learner page's TopicDetailPanel uses
 * (GateToolbox/CircuitCanvas/CodeEditorPanel/ProbabilitiesPanel/
 * BlochSpheresPanel/QSpherePanel/TutorPanel, all self-contained against the
 * shared circuit/simulation/tutor stores — no second implementation of any
 * of them). There's no separate per-stage or per-module page in this app,
 * so every breadcrumb segment except the current concept returns to the
 * single roadmap view. */
export function ConceptPage({
  stage,
  learningModule,
  concept,
  isComplete,
  onMarkComplete,
  onOpenEditor,
  onBack,
  onNavigateConcept,
}: ConceptPageProps) {
  const sensors = useSensors(useSensor(PointerSensor, sensorOptions));
  const [openSections, setOpenSections] = useState<Partial<Record<SectionKey, boolean>>>({});
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [taskFeedback, setTaskFeedback] = useState<TaskFeedback | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const loadedExampleFor = useRef<string | null>(null);
  const completedTaskIds = useLearnerTaskStore((s) => s.completedTaskIds);
  const isTaskComplete = completedTaskIds.includes(concept.sourceFile);

  useEffect(() => {
    setOpenSections({});
    setHintsRevealed(0);
    setTaskFeedback(null);
    setAttemptCount(0);
  }, [concept.sourceFile]);

  const index = learningModule.concepts.findIndex((c) => c.sourceFile === concept.sourceFile);
  const prevConcept = index > 0 ? learningModule.concepts[index - 1] : null;
  const nextConcept = index >= 0 && index < learningModule.concepts.length - 1 ? learningModule.concepts[index + 1] : null;

  // The fetched markdown embeds custom MDX components (IBMVideo, Admonition,
  // Accordion, ...) that react-markdown can't render — sanitized here rather
  // than inside ConceptViewer/the data layer so neither has to change.
  const displayConcept = useMemo(() => ({ ...concept, content: sanitizeLearningContent(concept.content) }), [concept]);

  // Assessment nodes carry a structured `assessment` object; their prose
  // `content` states the correct answer and explanation for every question
  // inline, so it must never be rendered. AssessmentPanel replaces the markdown
  // body for these and reveals the key only after a submission.
  const assessment = concept.type === "assessment" ? concept.assessment : undefined;

  // Suppressed on assessments: getConceptExample matches on title, so
  // "Assessment — Deutsch's algorithm" would otherwise pull in the guided
  // tutorial (hints, Check My Work) underneath a graded assessment. The
  // assessment's own coding challenges cover the hands-on part.
  const example = useMemo(() => (assessment ? null : getConceptExample(concept)), [assessment, concept]);

  const loadExample = useCallback(() => {
    if (!example) return;
    useCircuitStore.getState().setCircuit(example.build());
    useCircuitStore.getState().setName(`${example.label} — ${concept.title}`);
    loadedExampleFor.current = concept.sourceFile;
  }, [example, concept.sourceFile, concept.title]);

  const openInEditor = useCallback(() => {
    loadExample();
    onOpenEditor();
  }, [loadExample, onOpenEditor]);

  const checkTaskWork = useCallback(() => {
    if (!example) return;
    try {
      const circuit = useCircuitStore.getState().circuit;
      const result = runSimulation(circuit);
      const ok = example.task.checkSuccess(result.probabilities);
      setAttemptCount((n) => n + 1);
      setTaskFeedback({
        ok,
        message: ok
          ? example.task.successMessage
          : example.task.diagnose?.(circuit) ?? "Not quite yet — check the Probability panel above against the goal, then try again.",
      });
      if (ok) useLearnerTaskStore.getState().markTaskComplete(concept.sourceFile);
    } catch {
      setTaskFeedback({ ok: false, message: "Couldn't simulate the current circuit — check it doesn't have validation errors." });
    }
  }, [example, concept.sourceFile]);

  const revealNextHint = useCallback(() => {
    if (!example) return;
    setHintsRevealed((n) => Math.min(n + 1, example.task.hints.length));
  }, [example]);

  const toggleSection = useCallback(
    (key: SectionKey) => {
      // Side effects (loading the example circuit into the store) must not
      // live inside the setOpenSections updater — React can invoke that
      // function during render (e.g. Strict Mode), and a store update from
      // in there triggers "Cannot update a component while rendering a
      // different component" for anything subscribed to circuit-store
      // (BackendSimulationController).
      const willOpen = !openSections[key];
      if (willOpen && key === "circuit" && loadedExampleFor.current !== concept.sourceFile) {
        loadExample();
      }
      setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [concept.sourceFile, loadExample, openSections]
  );

  return (
    <div className="cpg-page">
      <div className="cpg-header">
        <button type="button" className="cpg-back-btn" onClick={onBack}>
          ← Back to Roadmap
        </button>
        <Breadcrumb
          segments={[
            { label: "Roadmap", onClick: onBack },
            { label: stage.title, onClick: onBack },
            { label: learningModule.title, onClick: onBack },
            { label: concept.title },
          ]}
        />
      </div>

      <div className="cpg-body">
        {assessment ? (
          <AssessmentPanel
            concept={concept}
            assessment={assessment}
            isComplete={isComplete}
            onMarkComplete={onMarkComplete}
          />
        ) : (
          <ConceptViewer concept={displayConcept} isComplete={isComplete} onMarkComplete={onMarkComplete} onOpenEditor={onOpenEditor} />
        )}

        {example && (
          <>
            <div className="topic-circuit-embed-actions">
              <button type="button" className="page-home-btn" onClick={openInEditor}>
                Open in Circuit Editor →
              </button>
            </div>

            <DetailSection title="Interactive Circuit" isOpen={!!openSections.circuit} onToggle={() => toggleSection("circuit")}>
              <div className="topic-circuit-embed-actions">
                <button type="button" className="page-home-btn" onClick={loadExample}>
                  Reload example circuit
                </button>
              </div>
              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="topic-circuit-embed">
                  <div className="app-left-col">
                    <GateToolbox onAddGate={handleAddGateClick} />
                    <GateInspector />
                  </div>
                  <div className="app-center-col">
                    <CanvasToolbar showExpandToggle={false} />
                    <CircuitCanvas />
                  </div>
                </div>
              </DndContext>
            </DetailSection>

            <DetailSection title="Hands-on Challenge" isOpen={!!openSections.task} onToggle={() => toggleSection("task")}>
              <p className="hot-goal">
                <strong>Goal:</strong> {example.task.goal}
              </p>
              <ol className="hot-steps">
                {example.task.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              <div className="hot-check-row">
                <button type="button" className="page-home-btn" onClick={checkTaskWork}>
                  Check My Work
                </button>
                {isTaskComplete && <span className="hot-complete-badge">✓ Challenge complete</span>}
              </div>
              {taskFeedback && <p className={`hot-feedback ${taskFeedback.ok ? "is-success" : "is-pending"}`}>{taskFeedback.message}</p>}

              <TutorModes
                task={example.task}
                isTaskComplete={isTaskComplete}
                hintsRevealed={hintsRevealed}
                attemptCount={attemptCount}
                lastDiagnosis={taskFeedback && !taskFeedback.ok ? taskFeedback.message : null}
                onRevealNextHint={revealNextHint}
              />
            </DetailSection>

            <DetailSection title="Qiskit Code" isOpen={!!openSections.code} onToggle={() => toggleSection("code")}>
              <div className="topic-panel-embed topic-panel-embed-tall">
                <CodeEditorPanel />
              </div>
            </DetailSection>

            {example.showProbability && (
              <DetailSection title="Probability" isOpen={!!openSections.probability} onToggle={() => toggleSection("probability")}>
                <div className="topic-panel-embed">
                  <ProbabilitiesPanel />
                </div>
              </DetailSection>
            )}

            {example.showBloch && (
              <DetailSection title="Bloch Sphere" isOpen={!!openSections.bloch} onToggle={() => toggleSection("bloch")}>
                <div className="topic-panel-embed">
                  <BlochSpheresPanel />
                </div>
              </DetailSection>
            )}

            {example.showQSphere && (
              <DetailSection title="Q-sphere" isOpen={!!openSections.qsphere} onToggle={() => toggleSection("qsphere")}>
                <div className="topic-panel-embed">
                  <QSpherePanel />
                </div>
              </DetailSection>
            )}

            <DetailSection title="AI Tutor" isOpen={!!openSections.tutor} onToggle={() => toggleSection("tutor")}>
              <div className="topic-panel-embed topic-panel-embed-tall">
                <TutorPanel />
              </div>
            </DetailSection>
          </>
        )}

        {!example && !assessment && (
          <p className="cpg-no-hands-on">This concept currently has no hands-on challenge. Continue to the next topic.</p>
        )}

        <a className="cpg-github-link" href={concept.githubUrl} target="_blank" rel="noreferrer noopener">
          Open on GitHub →
        </a>
      </div>

      <nav className="cpg-concept-nav" aria-label="Concept navigation">
        <button
          type="button"
          className="cpg-nav-btn"
          disabled={!prevConcept}
          onClick={() => prevConcept && onNavigateConcept(prevConcept.sourceFile)}
        >
          ← {prevConcept ? prevConcept.title : "No previous concept"}
        </button>
        <button
          type="button"
          className="cpg-nav-btn cpg-nav-btn-next"
          disabled={!nextConcept}
          onClick={() => nextConcept && onNavigateConcept(nextConcept.sourceFile)}
        >
          {nextConcept ? nextConcept.title : "No next concept"} →
        </button>
      </nav>
    </div>
  );
}
