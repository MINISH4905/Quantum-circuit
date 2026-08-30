import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./PageHeader.css";
import "./LearnerModule.css";
import "./LearningCenter.css";
import "./learning-center/RoadmapGraph.css";
import "./learning-center/ConceptPage.css";
import "highlight.js/styles/github-dark-dimmed.css";
import { useLearningData } from "./learning-center/useLearningData";
import { useLearningProgress } from "./learning-center/useLearningProgress";
import { RoadmapGraph, type NodeFilter } from "./learning-center/RoadmapGraph";
import { ConceptPage } from "./learning-center/ConceptPage";
import { getConceptExample } from "./learning-center/conceptExample";
import type { LearningConcept, LearningModule, LearningStage } from "./learning-center/types";
import { useLearnerRoleStore } from "../state/learner-role-store";
import { useLearnerTaskStore } from "../state/learner-task-store";
import { useLearnerStreakStore } from "../state/learner-streak-store";
import { RoleSelect } from "./learner-module/RoleSelect";
import { ROLE_INFO, getRoadmapForRole, getRecommendedConcept } from "./learner-module/roles";

interface LearnerModuleProps {
  onHome: () => void;
  onOpenEditor: () => void;
}

interface LearnerModuleViewState {
  page: "roadmap" | "concept";
  conceptSourceFile: string | null;
}

interface ConceptContext {
  stage: LearningStage;
  learningModule: LearningModule;
  concept: LearningConcept;
}

const ROADMAP_VIEW: LearnerModuleViewState = { page: "roadmap", conceptSourceFile: null };
const HASH_PREFIX = "#learner-module/";

function readConceptSourceFileFromHash(): string | null {
  const hash = window.location.hash;
  if (!hash.startsWith(HASH_PREFIX)) return null;
  return decodeURIComponent(hash.slice(HASH_PREFIX.length));
}

function findConceptContext(roadmap: LearningStage[], sourceFile: string | null): ConceptContext | null {
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

/** The interactive role-ordered roadmap + concept page. Reuses RoadmapGraph
 * and ConceptPage as-is (same components the Learning Center uses) — only
 * the stage ordering passed into RoadmapGraph differs per role (see
 * roles.ts). View state / hash deep-linking / scroll restore mirrors
 * LearningCenter.tsx's proven pattern, under its own #learner-module/ hash
 * prefix so the two features' deep links never collide. */
export function LearnerModule({ onHome, onOpenEditor }: LearnerModuleProps) {
  const { roadmap } = useLearningData();
  const progress = useLearningProgress();
  const { isConceptComplete, markConceptComplete, getModuleCompletionPercent, getStageCompletionPercent } = progress;

  const role = useLearnerRoleStore((s) => s.role);
  const setRole = useLearnerRoleStore((s) => s.setRole);
  const clearRole = useLearnerRoleStore((s) => s.clearRole);
  const lastOpenedSourceFile = useLearnerRoleStore((s) => s.lastOpenedSourceFile);
  const setLastOpened = useLearnerRoleStore((s) => s.setLastOpened);

  const completedTaskIds = useLearnerTaskStore((s) => s.completedTaskIds);
  const streak = useLearnerStreakStore((s) => s.streak);
  const recordVisit = useLearnerStreakStore((s) => s.recordVisit);
  useEffect(() => {
    recordVisit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orderedRoadmap = useMemo(() => (role ? getRoadmapForRole(roadmap, role) : []), [roadmap, role]);

  const [view, setView] = useState<LearnerModuleViewState>(ROADMAP_VIEW);
  const [filter, setFilter] = useState<NodeFilter>("all");
  const [expandedModuleIds, setExpandedModuleIds] = useState<Set<string>>(new Set());
  const [justCompletedModule, setJustCompletedModule] = useState<{ stage: LearningStage; learningModule: LearningModule } | null>(
    null
  );

  const scrollYRef = useRef(0);
  const pendingRestoreRef = useRef(false);

  const expandModuleFor = useCallback(
    (sourceFile: string) => {
      const ctx = findConceptContext(orderedRoadmap, sourceFile);
      if (!ctx) return;
      setExpandedModuleIds((prev) => new Set(prev).add(ctx.learningModule.id));
    },
    [orderedRoadmap]
  );

  const navigateToConcept = useCallback(
    (sourceFile: string) => {
      // Navigate even if the sourceFile turns out invalid (stale/typo'd
      // hash) so the render logic can show the "curriculum topic not found"
      // state — but don't pollute expand state or the resume point with a
      // concept that doesn't exist.
      const found = !!findConceptContext(orderedRoadmap, sourceFile);
      if (found) {
        expandModuleFor(sourceFile);
        setLastOpened(sourceFile);
      }
      setView({ page: "concept", conceptSourceFile: sourceFile });
      window.history.replaceState(null, "", `${HASH_PREFIX}${encodeURIComponent(sourceFile)}`);
    },
    [expandModuleFor, setLastOpened, orderedRoadmap]
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

  useLayoutEffect(() => {
    if (view.page === "roadmap" && pendingRestoreRef.current) {
      window.scrollTo(0, scrollYRef.current);
      pendingRestoreRef.current = false;
    }
  }, [view.page]);

  // Deep link: only takes over if a role is already chosen — a concept hash
  // with no role selected has nowhere to belong yet, so it's ignored until
  // the learner picks a path. Navigates even for an invalid sourceFile so
  // the "curriculum topic not found" state renders instead of silently
  // falling back to the roadmap.
  useEffect(() => {
    if (!role) return;
    const sourceFile = readConceptSourceFileFromHash();
    if (sourceFile) navigateToConcept(sourceFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const toggleModule = useCallback((moduleId: string) => {
    setExpandedModuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  }, []);

  const conceptContext = useMemo(
    () => (view.page === "concept" ? findConceptContext(orderedRoadmap, view.conceptSourceFile) : null),
    [orderedRoadmap, view]
  );
  // "Invalid Curriculum ID" state: the hash pointed at a sourceFile that
  // doesn't exist in this role's roadmap (stale link, typo, ...).
  const conceptNotFound = view.page === "concept" && !conceptContext;

  const handleMarkComplete = useCallback(() => {
    if (!conceptContext) return;
    const alreadyDone = isConceptComplete(conceptContext.concept.sourceFile);
    markConceptComplete(conceptContext.concept.sourceFile);
    if (!alreadyDone) {
      const nowComplete = conceptContext.learningModule.concepts.every(
        (c) => c.sourceFile === conceptContext.concept.sourceFile || isConceptComplete(c.sourceFile)
      );
      if (nowComplete) setJustCompletedModule({ stage: conceptContext.stage, learningModule: conceptContext.learningModule });
    }
  }, [conceptContext, isConceptComplete, markConceptComplete]);

  const dismissModuleComplete = useCallback(() => {
    setJustCompletedModule(null);
    backToRoadmap();
  }, [backToRoadmap]);

  const { totalConcepts, completedConcepts } = useMemo(() => {
    let total = 0;
    let completed = 0;
    for (const stage of orderedRoadmap) {
      for (const learningModule of stage.modules) {
        total += learningModule.concepts.length;
        completed += progress.getModuleCompletionCount(learningModule);
      }
    }
    return { totalConcepts: total, completedConcepts: completed };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderedRoadmap, progress.getModuleCompletionCount]);
  const overallPercent = totalConcepts === 0 ? 0 : Math.round((completedConcepts / totalConcepts) * 100);

  // Hands-on challenge totals across the whole role roadmap (5.5 dashboard).
  const { handsOnTotal, handsOnCompleted } = useMemo(() => {
    let total = 0;
    let completed = 0;
    for (const stage of orderedRoadmap) {
      for (const learningModule of stage.modules) {
        for (const concept of learningModule.concepts) {
          if (getConceptExample(concept)) {
            total++;
            if (completedTaskIds.includes(concept.sourceFile)) completed++;
          }
        }
      }
    }
    return { handsOnTotal: total, handsOnCompleted: completed };
  }, [orderedRoadmap, completedTaskIds]);

  // Resume point: the last-opened concept if it's still incomplete,
  // otherwise the first not-yet-completed concept in role order.
  const resumeContext = useMemo(() => {
    if (lastOpenedSourceFile) {
      const ctx = findConceptContext(orderedRoadmap, lastOpenedSourceFile);
      if (ctx && !isConceptComplete(ctx.concept.sourceFile)) return ctx;
    }
    return getRecommendedConcept(orderedRoadmap, isConceptComplete);
  }, [orderedRoadmap, lastOpenedSourceFile, isConceptComplete]);

  const nextConceptTitle = useMemo(() => {
    if (!resumeContext) return null;
    let passedCurrent = false;
    for (const stage of orderedRoadmap) {
      for (const learningModule of stage.modules) {
        for (const concept of learningModule.concepts) {
          if (passedCurrent && !isConceptComplete(concept.sourceFile)) return concept.title;
          if (concept.sourceFile === resumeContext.concept.sourceFile) passedCurrent = true;
        }
      }
    }
    return null;
  }, [orderedRoadmap, resumeContext, isConceptComplete]);

  const hasStarted = completedConcepts > 0 || lastOpenedSourceFile !== null;

  // Hands-on tally for the just-completed module, shown in its summary card.
  const moduleHandsOn = useMemo(() => {
    if (!justCompletedModule) return null;
    let total = 0;
    let completed = 0;
    for (const concept of justCompletedModule.learningModule.concepts) {
      if (getConceptExample(concept)) {
        total++;
        if (completedTaskIds.includes(concept.sourceFile)) completed++;
      }
    }
    return { total, completed };
  }, [justCompletedModule, completedTaskIds]);

  return (
    <div className="learner-module-page">
      <header className="page-nav">
        <span className="page-brand">Quantum Circuit Lab</span>
        <button type="button" className="page-home-btn" onClick={onHome}>
          ← Home
        </button>
      </header>

      <div className="page-intro">
        <p className="page-eyebrow">Learner Module</p>
        <h1 className="page-title">Your Personalized Quantum Path</h1>
        <p className="page-subtitle">A roadmap tailored to your role, built from the same content as the Learning Center.</p>
      </div>

      <div className="lm-content">
        {!role ? (
          <RoleSelect onSelect={setRole} />
        ) : conceptNotFound ? (
          <div className="lm-not-found">
            <p>This curriculum topic could not be found.</p>
            <button type="button" className="page-home-btn" onClick={backToRoadmap}>
              ← Back to Roadmap
            </button>
          </div>
        ) : view.page === "concept" && conceptContext ? (
          <ConceptPage
            stage={conceptContext.stage}
            learningModule={conceptContext.learningModule}
            concept={conceptContext.concept}
            isComplete={isConceptComplete(conceptContext.concept.sourceFile)}
            onMarkComplete={handleMarkComplete}
            onOpenEditor={onOpenEditor}
            onBack={backToRoadmap}
            onNavigateConcept={navigateToConcept}
          />
        ) : (
          <>
            <div className="lm-dashboard-summary">
              <div className="lm-dashboard-summary-head">
                <div>
                  <p className="lm-role-summary-eyebrow">Your Learning Journey</p>
                  <h2 className="lm-roadmap-toolbar-title">{ROLE_INFO[role].label}</h2>
                </div>
                <button type="button" className="lm-change-path-btn" onClick={clearRole}>
                  Change path
                </button>
              </div>

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
                  {completedConcepts} of {totalConcepts} concepts completed — {overallPercent}%
                </span>
              </div>

              <div className="lm-dashboard-stats-row">
                {handsOnTotal > 0 && (
                  <span className="lm-dashboard-stat">
                    Hands-on: {handsOnCompleted}/{handsOnTotal} challenges
                  </span>
                )}
                <span className="lm-dashboard-stat">
                  🔥 {streak} session{streak === 1 ? "" : "s"}
                </span>
              </div>

              {resumeContext ? (
                <div className="lm-dashboard-summary-row">
                  <div className="lm-dashboard-summary-text">
                    <p className="lm-dashboard-summary-current">
                      {hasStarted ? "Current: " : "Start with: "}
                      <strong>{resumeContext.concept.title}</strong>
                      <span className="lm-dashboard-summary-meta"> · {resumeContext.learningModule.title}</span>
                    </p>
                    {nextConceptTitle && <p className="lm-dashboard-summary-next">Next: {nextConceptTitle}</p>}
                  </div>
                  <button
                    type="button"
                    className="page-home-btn lm-continue-btn"
                    onClick={() => openConcept(resumeContext.concept.sourceFile)}
                  >
                    {hasStarted ? "Continue Learning →" : "Start Learning →"}
                  </button>
                </div>
              ) : (
                <p className="lm-dashboard-summary-current">🎉 You've completed every concept on this path.</p>
              )}
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
              roadmap={orderedRoadmap}
              isConceptComplete={isConceptComplete}
              getModuleCompletionPercent={getModuleCompletionPercent}
              getStageCompletionPercent={getStageCompletionPercent}
              filter={filter}
              expandedModuleIds={expandedModuleIds}
              onToggleModule={toggleModule}
              onOpenConcept={openConcept}
              recommendedSourceFile={resumeContext?.concept.sourceFile ?? null}
            />
          </>
        )}
      </div>

      {justCompletedModule && (
        <div className="lm-module-complete-overlay" role="dialog" aria-modal="true" aria-label="Module completed">
          <div className="lm-module-complete-card">
            <p className="lm-role-summary-eyebrow">Module Completed</p>
            <h2 className="lm-module-complete-title">{justCompletedModule.learningModule.title}</h2>
            <p className="lm-module-complete-stage">{justCompletedModule.stage.title}</p>

            <p className="lm-module-complete-label">You learned:</p>
            <ul className="lm-module-complete-list">
              {justCompletedModule.learningModule.concepts.map((c) => (
                <li key={c.sourceFile}>✓ {c.title}</li>
              ))}
            </ul>

            {moduleHandsOn && moduleHandsOn.total > 0 && (
              <p className="lm-module-complete-hands-on">
                Hands-on: {moduleHandsOn.completed} / {moduleHandsOn.total} challenges
              </p>
            )}

            {resumeContext && (
              <p className="lm-module-complete-next">
                Next Recommended: {resumeContext.stage.title} — {resumeContext.learningModule.title}
              </p>
            )}

            <button type="button" className="page-home-btn lm-continue-btn" onClick={dismissModuleComplete}>
              Continue Learning →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
