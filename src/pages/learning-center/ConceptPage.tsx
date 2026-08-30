import { useCallback, useMemo, useRef, useState } from "react";
import { useCircuitStore } from "../../state/circuit-store";
import { createEmptyCircuit } from "../../circuit/model/types";
import { parseCode } from "../../circuit/framework";
import { generateCircuitCode } from "../../api/tutor-api";
import { Breadcrumb } from "./Breadcrumb";
import { ConceptViewer } from "./ConceptViewer";
import { sanitizeLearningContent } from "./sanitizeContent";
import { getConceptExample } from "./conceptExample";
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

// Module-level so a concept's AI-generated circuit is only fetched once per
// page session, not re-generated (and re-billed) every time the learner
// reopens the same concept. Keyed by sourceFile since concept `id`s repeat
// across modules. Deliberately in-memory only — stale across a hard reload
// is fine, this is a cost/latency optimization, not a durability guarantee.
const generatedCodeCache = new Map<string, string>();

/** Full-page concept view — replaces the roadmap graph entirely while a
 * concept is open (not a side panel). Reuses the existing ConceptViewer
 * (markdown rendering, Mark Complete, Try in Circuit Lab) and Breadcrumb
 * unmodified; this just adds the page chrome (back button, breadcrumb,
 * GitHub link, prev/next-within-module navigation) plus a single "Open in
 * Circuit Editor" entry point, shown for every concept in the syllabus.
 *
 * For the concepts getConceptExample doesn't have a hand-authored circuit
 * for (most of them), the AI tutor generates one instead: it's asked for
 * Qiskit code restricted to the editor's exact supported syntax subset,
 * that code is run through the same parser the Code Editor uses, and the
 * resulting circuit is loaded — so every concept opens with something
 * actually built from that concept's content, not a blank canvas or last
 * concept's leftover circuit. Falls back to blank only if generation or
 * parsing fails (offline backend, unparseable output, etc). The embedded
 * circuit/task/code/probability/Bloch/Q-sphere/tutor panels this page used
 * to render inline were dropped in favor of sending learners into the real
 * Circuit Editor page, which already has all of that. */
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
  const [isGenerating, setIsGenerating] = useState(false);
  const requestSourceFileRef = useRef<string | null>(null);

  const index = learningModule.concepts.findIndex((c) => c.sourceFile === concept.sourceFile);
  const prevConcept = index > 0 ? learningModule.concepts[index - 1] : null;
  const nextConcept = index >= 0 && index < learningModule.concepts.length - 1 ? learningModule.concepts[index + 1] : null;

  // The fetched markdown embeds custom MDX components (IBMVideo, Admonition,
  // Accordion, ...) that react-markdown can't render — sanitized here rather
  // than inside ConceptViewer/the data layer so neither has to change.
  const displayConcept = useMemo(() => ({ ...concept, content: sanitizeLearningContent(concept.content) }), [concept]);

  const example = useMemo(() => getConceptExample(concept), [concept]);

  const loadBlank = useCallback(() => {
    useCircuitStore.getState().setCircuit(createEmptyCircuit(2, 2));
    useCircuitStore.getState().setName(concept.title);
  }, [concept.title]);

  // Always replaces whatever circuit was already in the editor — without
  // this, a concept with no curated example would silently leave behind
  // whichever unrelated topic's circuit was last loaded.
  const openInEditor = useCallback(async () => {
    if (example) {
      useCircuitStore.getState().setCircuit(example.build());
      useCircuitStore.getState().setName(`${example.label} — ${concept.title}`);
      onOpenEditor();
      return;
    }

    const sourceFile = concept.sourceFile;
    const cached = generatedCodeCache.get(sourceFile);
    if (cached) {
      const { circuit } = parseCode("qiskit", cached);
      if (circuit) {
        useCircuitStore.getState().setCircuit(circuit);
        useCircuitStore.getState().setName(concept.title);
        onOpenEditor();
        return;
      }
    }

    requestSourceFileRef.current = sourceFile;
    setIsGenerating(true);
    try {
      const { code } = await generateCircuitCode(concept.title, concept.content);
      // The learner may have navigated to a different concept while this
      // was in flight — a stale response landing now would silently
      // overwrite whatever circuit belongs to the concept they're on now.
      if (requestSourceFileRef.current !== sourceFile) return;

      const { circuit } = parseCode("qiskit", code);
      if (circuit) {
        generatedCodeCache.set(sourceFile, code);
        useCircuitStore.getState().setCircuit(circuit);
        useCircuitStore.getState().setName(concept.title);
      } else {
        loadBlank();
      }
    } catch {
      if (requestSourceFileRef.current === sourceFile) loadBlank();
    } finally {
      if (requestSourceFileRef.current === sourceFile) {
        setIsGenerating(false);
        onOpenEditor();
      }
    }
  }, [example, concept.sourceFile, concept.title, concept.content, onOpenEditor, loadBlank]);

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
        <ConceptViewer concept={displayConcept} isComplete={isComplete} onMarkComplete={onMarkComplete} onOpenEditor={onOpenEditor} />

        <div className="topic-circuit-embed-actions">
          <button type="button" className="page-home-btn" onClick={openInEditor} disabled={isGenerating}>
            {isGenerating ? "Generating circuit…" : "Open in Circuit Editor →"}
          </button>
        </div>

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
