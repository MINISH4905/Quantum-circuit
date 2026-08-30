import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./PageHeader.css";
import "./LearnerModule.css";
import "./LearningCenter.css";
import "./learning-center/RoadmapGraph.css";
import "./learning-center/ConceptPage.css";
import "highlight.js/styles/github-dark-dimmed.css";
import { useLearningData } from "./learning-center/useLearningData";
import { useLearningProgress } from "./learning-center/useLearningProgress";
import { RoadmapRevamp, type RoadmapFilter, type RevampStage } from "./learner-module/RoadmapRevamp";
import { ConceptPage } from "./learning-center/ConceptPage";
import type { LearningConcept, LearningModule, LearningStage } from "./learning-center/types";
import { useLearnerRoleStore } from "../state/learner-role-store";
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

/** The interactive role-ordered roadmap + concept page.
 *
 * The roadmap itself is rendered by RoadmapRevamp; ConceptPage is reused as-is
 * (the same component the Learning Center uses). Only the stage ordering
 * differs per role (see roles.ts). View state / hash deep-linking / scroll
 * restore mirrors LearningCenter.tsx's proven pattern, under its own
 * #learner-module/ hash prefix so the two features' deep links never collide.
 *
 * Filter and expansion state stay owned here rather than inside RoadmapRevamp:
 * this component unmounts the roadmap when a concept opens, so local state
 * there would reset every time the learner came back. */
export function LearnerModule({ onHome, onOpenEditor }: LearnerModuleProps) {
  const { roadmap } = useLearningData();
  const progress = useLearningProgress();
  const { isConceptComplete, markConceptComplete } = progress;

  const role = useLearnerRoleStore((s) => s.role);
  const setRole = useLearnerRoleStore((s) => s.setRole);
  const clearRole = useLearnerRoleStore((s) => s.clearRole);
  const lastOpenedSourceFile = useLearnerRoleStore((s) => s.lastOpenedSourceFile);
  const setLastOpened = useLearnerRoleStore((s) => s.setLastOpened);

  const streak = useLearnerStreakStore((s) => s.streak);
  const recordVisit = useLearnerStreakStore((s) => s.recordVisit);
  useEffect(() => {
    recordVisit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orderedRoadmap = useMemo(() => (role ? getRoadmapForRole(roadmap, role) : []), [roadmap, role]);

  const [view, setView] = useState<LearnerModuleViewState>(ROADMAP_VIEW);
  const [filter, setFilter] = useState<RoadmapFilter>("all");
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

  // Overall totals are no longer computed here — RoadmapRevamp derives them
  // from the same per-lesson `complete` flags it renders, so the headline
  // percentage can never drift out of step with the cards below it.

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

  /* Adapter: the domain model (stages > modules > concepts, completion looked
   * up by sourceFile) mapped onto RoadmapRevamp's flat presentational shape.
   * Lesson `id` is the concept's sourceFile, so onOpenLesson hands straight
   * back the key openConcept already expects — no second lookup table. */
  const revampStages: RevampStage[] = useMemo(
    () =>
      orderedRoadmap.map((stage) => ({
        id: stage.id,
        title: stage.title,
        modules: stage.modules.map((learningModule) => ({
          id: learningModule.id,
          title: learningModule.title,
          estimatedTime: learningModule.estimatedTime || undefined,
          lessons: learningModule.concepts.map((concept) => ({
            id: concept.sourceFile,
            title: concept.title,
            complete: isConceptComplete(concept.sourceFile),
            current: concept.sourceFile === resumeContext?.concept.sourceFile,
          })),
        })),
      })),
    [orderedRoadmap, isConceptComplete, resumeContext]
  );

  // The revamped roadmap paints its own full-bleed background and owns its
  // page header, so it renders as a direct child of the page rather than
  // inside .lm-content's 1200px column — otherwise its surface would appear
  // as an inset navy block floating on the old near-black shell.
  const showRevampedRoadmap = !!role && !conceptNotFound && view.page === "roadmap";

  return (
    <div className={`learner-module-page${showRevampedRoadmap ? " lm-revamp-shell" : ""}`}>
      <header className="page-nav">
        <span className="page-brand">Quantum Circuit Lab</span>
        <button type="button" className="page-home-btn" onClick={onHome}>
          ← Home
        </button>
      </header>

      {!showRevampedRoadmap && (
        <div className="page-intro">
          <p className="page-eyebrow">Learner Module</p>
          <h1 className="page-title">Your Personalized Quantum Path</h1>
          <p className="page-subtitle">
            A roadmap tailored to your role, built from the same content as the Learning Center.
          </p>
        </div>
      )}

      {showRevampedRoadmap && role ? (
        <RoadmapRevamp
          roleLabel={ROLE_INFO[role].label}
          stages={revampStages}
          streak={streak}
          resume={
            resumeContext
              ? {
                  moduleTitle: resumeContext.learningModule.title,
                  lessonTitle: resumeContext.concept.title,
                  nextLessonTitle: nextConceptTitle ?? undefined,
                }
              : null
          }
          filter={filter}
          onFilterChange={setFilter}
          expandedModuleIds={expandedModuleIds}
          onToggleModule={toggleModule}
          onOpenLesson={openConcept}
          onContinue={() => resumeContext && openConcept(resumeContext.concept.sourceFile)}
          onChangePath={clearRole}
        />
      ) : (
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
          ) : (
            conceptContext && (
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
            )
          )}
        </div>
      )}

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
