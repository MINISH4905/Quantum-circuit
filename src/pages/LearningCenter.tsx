import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./PageHeader.css";
import "./LearningCenter.css";
import "./learning-center/RoadmapGraph.css";
import "./learning-center/ConceptPage.css";
import "highlight.js/styles/github-dark-dimmed.css";
import { useLearningData } from "./learning-center/useLearningData";
import { useLearningProgress } from "./learning-center/useLearningProgress";
import { RoadmapGraph, type NodeFilter } from "./learning-center/RoadmapGraph";
import { ConceptPage } from "./learning-center/ConceptPage";
import type { LearningConcept, LearningModule, LearningStage } from "./learning-center/types";

interface LearningCenterProps {
  onHome: () => void;
  onOpenEditor: () => void;
}

interface LearningCenterViewState {
  page: "roadmap" | "concept";
  conceptSourceFile: string | null;
}

const ROADMAP_VIEW: LearningCenterViewState = { page: "roadmap", conceptSourceFile: null };
const HASH_PREFIX = "#learn/";

function readConceptSourceFileFromHash(): string | null {
  const hash = window.location.hash;
  if (!hash.startsWith(HASH_PREFIX)) return null;
  return decodeURIComponent(hash.slice(HASH_PREFIX.length));
}

function findConceptContext(
  roadmap: LearningStage[],
  sourceFile: string | null
): { stage: LearningStage; learningModule: LearningModule; concept: LearningConcept } | null {
  if (!sourceFile) return null;
  for (const stage of roadmap) {
    for (const learningModule of stage.modules) {
      const concept = learningModule.concepts.find((c) => c.sourceFile === sourceFile);
      if (concept) return { stage, learningModule, concept };
    }
  }
  return null;
}

const FILTER_LABEL: Record<NodeFilter, string> = {
  all: "All",
  "in-progress": "In Progress",
  completed: "Completed",
};

/** Standalone Learning Center — a node-graph roadmap (RoadmapGraph) that
 * swaps for a dedicated full-page concept view (ConceptPage) when a concept
 * is opened, rather than a side panel. Still no router: reached via the
 * existing useState view switch in AppRoot.tsx, and within the page the
 * concept navigation is mirrored into the URL hash (#learn/{sourceFile})
 * for shareable deep links. */
export function LearningCenter({ onHome, onOpenEditor }: LearningCenterProps) {
  const { roadmap } = useLearningData();
  const progress = useLearningProgress();
  const { isConceptComplete, markConceptComplete, getModuleCompletionPercent, getStageCompletionPercent } = progress;

  const [view, setView] = useState<LearningCenterViewState>(ROADMAP_VIEW);
  const [filter, setFilter] = useState<NodeFilter>("all");
  // Owned here (not inside RoadmapGraph) so it survives the roadmap
  // unmounting while the concept page is shown.
  const [expandedModuleIds, setExpandedModuleIds] = useState<Set<string>>(new Set());

  // Roadmap scroll position, saved right before switching to a concept page
  // so "Back to Roadmap" can restore it. pendingRestoreRef guards against
  // restoring on unrelated re-renders.
  const scrollYRef = useRef(0);
  const pendingRestoreRef = useRef(false);

  const expandModuleFor = useCallback(
    (sourceFile: string) => {
      const ctx = findConceptContext(roadmap, sourceFile);
      if (!ctx) return;
      setExpandedModuleIds((prev) => new Set(prev).add(ctx.learningModule.id));
    },
    [roadmap]
  );

  // Switches to the concept page for `sourceFile` without touching the
  // saved roadmap scroll position — used for prev/next-within-module
  // navigation and the initial hash deep link, neither of which should
  // overwrite the "return to roadmap" scroll target.
  const navigateToConcept = useCallback(
    (sourceFile: string) => {
      expandModuleFor(sourceFile);
      setView({ page: "concept", conceptSourceFile: sourceFile });
      window.history.replaceState(null, "", `${HASH_PREFIX}${encodeURIComponent(sourceFile)}`);
      window.scrollTo(0, 0);
    },
    [expandModuleFor]
  );

  const openConcept = useCallback(
    (sourceFile: string) => {
      scrollYRef.current = window.scrollY;
      navigateToConcept(sourceFile);
    },
    [navigateToConcept]
  );

  const backToRoadmap = useCallback(() => {
    setView(ROADMAP_VIEW);
    pendingRestoreRef.current = true;
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }, []);

  // Restore the roadmap scroll position once the roadmap is back in the DOM.
  useLayoutEffect(() => {
    if (view.page === "roadmap" && pendingRestoreRef.current) {
      window.scrollTo(0, scrollYRef.current);
      pendingRestoreRef.current = false;
    }
  }, [view.page]);

  // Deep link: read the hash once on mount and open that concept's page directly.
  useEffect(() => {
    const sourceFile = readConceptSourceFileFromHash();
    if (sourceFile && findConceptContext(roadmap, sourceFile)) {
      navigateToConcept(sourceFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleModule = useCallback((moduleId: string) => {
    setExpandedModuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  }, []);

  const conceptContext = useMemo(
    () => (view.page === "concept" ? findConceptContext(roadmap, view.conceptSourceFile) : null),
    [roadmap, view]
  );

  const { totalConcepts, completedConcepts } = useMemo(() => {
    let total = 0;
    let completed = 0;
    for (const stage of roadmap) {
      for (const learningModule of stage.modules) {
        total += learningModule.concepts.length;
        completed += progress.getModuleCompletionCount(learningModule);
      }
    }
    return { totalConcepts: total, completedConcepts: completed };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmap, progress.getModuleCompletionCount]);
  const overallPercent = totalConcepts === 0 ? 0 : Math.round((completedConcepts / totalConcepts) * 100);

  return (
    <div className="learning-center-page">
      <header className="page-nav">
        <span className="page-brand">Quantum Circuit Lab</span>
        <button type="button" className="page-home-btn" onClick={onHome}>
          ← Home
        </button>
      </header>

      <div className="page-intro">
        <p className="page-eyebrow">Learning Center</p>
        <h1 className="page-title">Quantum Computing Roadmap</h1>
        <p className="page-subtitle">A structured path from qubits to quantum algorithms.</p>
      </div>

      <div className="lc-content">
        {view.page === "concept" && conceptContext ? (
          <ConceptPage
            stage={conceptContext.stage}
            learningModule={conceptContext.learningModule}
            concept={conceptContext.concept}
            isComplete={isConceptComplete(conceptContext.concept.sourceFile)}
            onMarkComplete={() => markConceptComplete(conceptContext.concept.sourceFile)}
            onOpenEditor={onOpenEditor}
            onBack={backToRoadmap}
            onNavigateConcept={navigateToConcept}
          />
        ) : (
          <>
            <div className="lc-progress-summary">
              <div
                className="lc-progress-bar"
                role="progressbar"
                aria-valuenow={overallPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="lc-progress-fill" style={{ width: `${overallPercent}%` }} />
              </div>
              <span className="lc-progress-summary-label">
                {completedConcepts} of {totalConcepts} concepts completed
              </span>
            </div>

            <div className="lc-filter-pills" role="group" aria-label="Filter roadmap nodes">
              {(Object.keys(FILTER_LABEL) as NodeFilter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`roadmap-filter-chip${filter === f ? " is-active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {FILTER_LABEL[f]}
                </button>
              ))}
            </div>

            <RoadmapGraph
              roadmap={roadmap}
              isConceptComplete={isConceptComplete}
              getModuleCompletionPercent={getModuleCompletionPercent}
              getStageCompletionPercent={getStageCompletionPercent}
              filter={filter}
              expandedModuleIds={expandedModuleIds}
              onToggleModule={toggleModule}
              onOpenConcept={openConcept}
            />
          </>
        )}
      </div>
    </div>
  );
}
