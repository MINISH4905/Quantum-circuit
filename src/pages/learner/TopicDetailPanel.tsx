import { useCallback, useEffect, useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { getTopic, type RoadmapTopic } from "../../learner/roadmap";
import type { TopicStatus } from "../../state/learner-progress-store";
import { handleDragEnd, handleAddGateClick } from "../../circuit/interactions";
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
import { LearningMaterials } from "./LearningMaterials";

const sensorOptions = { activationConstraint: { distance: 4 } };

type SectionKey = "circuit" | "code" | "probability" | "bloch" | "qsphere" | "tutor" | "materials";

const STATUS_LABEL: Record<TopicStatus, string> = {
  completed: "Completed",
  current: "In progress",
  available: "Available",
  locked: "Locked",
};

interface TopicDetailPanelProps {
  topic: RoadmapTopic;
  status: TopicStatus;
  nextTopic: RoadmapTopic | undefined;
  onMarkComplete: () => void;
  onSelectTopic: (id: string) => void;
  onOpenEditor: () => void;
  onReloadExampleCircuit: () => void;
}

/** The topic's live "learning module" — reuses the exact same circuit editor
 * and visualization components as the main dashboard (each is self-contained,
 * reading only the shared circuit/simulation/tutor stores), so there is no
 * second implementation of any of these. Subsections mount lazily, only once
 * opened, so a topic with a demo circuit doesn't pay for Monaco + Bloch +
 * Q-sphere + Tutor rendering cost until the learner actually asks for it. */
export function TopicDetailPanel({
  topic,
  status,
  nextTopic,
  onMarkComplete,
  onSelectTopic,
  onOpenEditor,
  onReloadExampleCircuit,
}: TopicDetailPanelProps) {
  const sensors = useSensors(useSensor(PointerSensor, sensorOptions));
  const [openSections, setOpenSections] = useState<Partial<Record<SectionKey, boolean>>>({});

  useEffect(() => {
    setOpenSections({});
  }, [topic.id]);

  const toggleSection = useCallback((key: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const hasCircuit = !!topic.exampleCircuit;

  return (
    <div className="topic-detail-panel" aria-label={`${topic.title} learning module`}>
      <div className="topic-detail-header">
        <div className="topic-detail-meta">
          <span className={`topic-detail-difficulty is-${topic.difficulty}`}>{topic.difficulty}</span>
          <span className="topic-detail-status-pill" data-status={status}>
            {STATUS_LABEL[status]}
          </span>
        </div>
        <h2 className="topic-detail-title">{topic.title}</h2>
        {topic.prerequisites.length > 0 && (
          <div className="topic-detail-prereqs">
            <span className="topic-detail-prereqs-label">Prerequisites:</span>
            {topic.prerequisites.map((id) => (
              <span key={id} className="topic-chip">
                {getTopic(id)?.title ?? id}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="topic-detail-body">
        <section className="topic-detail-prose">
          <h3 className="topic-detail-prose-title">Concept</h3>
          <p>{topic.description}</p>
          <h3 className="topic-detail-prose-title">Why It Matters</h3>
          <p>{topic.whyItMatters}</p>
        </section>

        <div className="topic-detail-actions">
          <button
            type="button"
            className="page-home-btn topic-action-primary"
            onClick={onMarkComplete}
            disabled={status === "completed"}
          >
            {status === "completed" ? "✓ Completed" : "Mark Complete"}
          </button>
          {nextTopic && (
            <button type="button" className="page-home-btn" onClick={() => onSelectTopic(nextTopic.id)}>
              Next Topic → {nextTopic.title}
            </button>
          )}
          {hasCircuit && (
            <button type="button" className="page-home-btn" onClick={onOpenEditor}>
              Open in Circuit Editor →
            </button>
          )}
        </div>

        {topic.githubSource && (
          <DetailSection title="Learning Materials" isOpen={!!openSections.materials} onToggle={() => toggleSection("materials")}>
            <LearningMaterials collectionId={topic.githubSource.collectionId} />
          </DetailSection>
        )}

        {hasCircuit && (
          <>
            <DetailSection title="Interactive Circuit" isOpen={!!openSections.circuit} onToggle={() => toggleSection("circuit")}>
              <div className="topic-circuit-embed-actions">
                <button type="button" className="page-home-btn" onClick={onReloadExampleCircuit}>
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

            <DetailSection title="Qiskit Code" isOpen={!!openSections.code} onToggle={() => toggleSection("code")}>
              <div className="topic-panel-embed topic-panel-embed-tall">
                <CodeEditorPanel />
              </div>
            </DetailSection>

            {topic.showProbability && (
              <DetailSection title="Probability" isOpen={!!openSections.probability} onToggle={() => toggleSection("probability")}>
                <div className="topic-panel-embed">
                  <ProbabilitiesPanel />
                </div>
              </DetailSection>
            )}

            {topic.showBloch && (
              <DetailSection title="Bloch Sphere" isOpen={!!openSections.bloch} onToggle={() => toggleSection("bloch")}>
                <div className="topic-panel-embed">
                  <BlochSpheresPanel />
                </div>
              </DetailSection>
            )}

            {topic.showQSphere && (
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
      </div>
    </div>
  );
}
