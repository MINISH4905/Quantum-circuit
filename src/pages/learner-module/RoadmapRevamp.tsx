import { useMemo, useState } from "react";
import "./RoadmapRevamp.css";

/* Revamped learner roadmap — presentational only.
 *
 * Deliberately takes plain data via props and owns nothing but local UI state
 * (which tab is active, which module is expanded). No store, no hash routing,
 * no progress mutation — wiring it to useLearningProgress / RoadmapGraph's
 * real callbacks is a separate step once the design is signed off.
 */

export type ModuleStatus = "not-started" | "in-progress" | "complete";
export type RoadmapFilter = "all" | "in-progress" | "completed";

export interface RevampLesson {
  id: string;
  title: string;
  complete: boolean;
  current?: boolean;
}

export interface RevampModule {
  id: string;
  title: string;
  lessons: RevampLesson[];
  estimatedTime?: string;
}

export interface RevampStage {
  id: string;
  title: string;
  modules: RevampModule[];
}

export interface RoadmapRevampProps {
  roleLabel: string;
  stages: RevampStage[];
  streak: number;
  handsOnCompleted: number;
  handsOnTotal: number;
  resume: { moduleTitle: string; lessonTitle: string; nextLessonTitle?: string } | null;

  /* Filter and expansion are optionally controlled. LearnerModule owns them
   * because expansion has to survive this component unmounting when a concept
   * page is opened; the standalone design preview passes neither and gets
   * local state instead. */
  filter?: RoadmapFilter;
  onFilterChange?: (filter: RoadmapFilter) => void;
  expandedModuleIds?: Set<string>;
  onToggleModule?: (moduleId: string) => void;

  onOpenLesson?: (lessonId: string) => void;
  onContinue?: () => void;
  onChangePath?: () => void;

  /** The wired page keeps its own nav above this component and hides its
   * duplicate intro block, so the head renders here instead. */
  showPageHead?: boolean;
}

/* --- icons ---------------------------------------------------------------
 * Inline strokes rather than emoji: emoji render differently per platform and
 * read as filler. These inherit currentColor so chips restyle themselves.
 */

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 3.2c0-.4.3-.7.7-.7H7c.6 0 1 .5 1 1v9.3c0-.5-.4-.9-1-.9H3.2a.7.7 0 01-.7-.7V3.2zM13.5 3.2c0-.4-.3-.7-.7-.7H9c-.6 0-1 .5-1 1v9.3c0-.5.4-.9 1-.9h3.8c.4 0 .7-.3.7-.7V3.2z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTerminal({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.8" y="2.8" width="12.4" height="10.4" rx="1.8" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.6 6.4L6.6 8l-2 1.6M8.4 10h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconFlame({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.8s3.6 2.7 3.6 6a3.6 3.6 0 11-7.2 0c0-1.2.5-2.1 1.1-2.9.2 1 .8 1.6 1.4 1.6.9 0 1.1-1.1 1.1-4.7z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* --- derivations ---------------------------------------------------------- */

function moduleStatus(m: RevampModule): ModuleStatus {
  const done = m.lessons.filter((l) => l.complete).length;
  if (done === 0) return "not-started";
  return done === m.lessons.length ? "complete" : "in-progress";
}

function modulePercent(m: RevampModule): number {
  if (m.lessons.length === 0) return 0;
  return Math.round((m.lessons.filter((l) => l.complete).length / m.lessons.length) * 100);
}

const STATUS_LABEL: Record<ModuleStatus, string> = {
  "not-started": "Not Started",
  "in-progress": "In Progress",
  complete: "Completed",
};

const FILTER_LABEL: Record<RoadmapFilter, string> = {
  all: "All",
  "in-progress": "In Progress",
  completed: "Completed",
};

export function RoadmapRevamp({
  roleLabel,
  stages,
  streak,
  handsOnCompleted,
  handsOnTotal,
  resume,
  filter: filterProp,
  onFilterChange,
  expandedModuleIds,
  onToggleModule,
  onOpenLesson,
  onContinue,
  onChangePath,
  showPageHead = true,
}: RoadmapRevampProps) {
  const [filterState, setFilterState] = useState<RoadmapFilter>("all");
  const [expandedState, setExpandedState] = useState<Set<string>>(new Set());

  const filter = filterProp ?? filterState;
  const setFilter = onFilterChange ?? setFilterState;
  const expanded = expandedModuleIds ?? expandedState;

  const allModules = useMemo(() => stages.flatMap((s) => s.modules), [stages]);

  const totals = useMemo(() => {
    const lessons = allModules.flatMap((m) => m.lessons);
    const done = lessons.filter((l) => l.complete).length;
    return {
      done,
      total: lessons.length,
      percent: lessons.length === 0 ? 0 : Math.round((done / lessons.length) * 100),
    };
  }, [allModules]);

  const counts = useMemo(() => {
    const s = allModules.map(moduleStatus);
    return {
      all: s.length,
      "in-progress": s.filter((x) => x === "in-progress").length,
      completed: s.filter((x) => x === "complete").length,
    } as Record<RoadmapFilter, number>;
  }, [allModules]);

  const matchesFilter = (status: ModuleStatus) =>
    filter === "all" ||
    (filter === "in-progress" && status === "in-progress") ||
    (filter === "completed" && status === "complete");

  const toggle = (id: string) => {
    if (onToggleModule) {
      onToggleModule(id);
      return;
    }
    setExpandedState((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Step numbers run continuously across stages so the roadmap reads as one
  // path. Derived from the unfiltered order and looked up per module, so
  // switching tabs never renumbers a module the learner has already seen.
  const stepNumbers = useMemo(() => {
    const map = new Map<string, number>();
    allModules.forEach((m, i) => map.set(m.id, i + 1));
    return map;
  }, [allModules]);

  return (
    <div className="rmv">
      <div className="rmv-container">
        {showPageHead && (
          <header className="rmv-page-head">
            <p className="rmv-eyebrow">Learner Module</p>
            <h1 className="rmv-page-title">Your Personalized Quantum Path</h1>
            <p className="rmv-page-sub">
              A roadmap tailored to your role, built from the same curriculum as the Learning Center.
            </p>
          </header>
        )}

        {/* ---- Hero status card ---- */}
        <section className="rmv-hero" aria-labelledby="rmv-journey-heading">
          <div className="rmv-hero-head">
            <div>
              <p className="rmv-eyebrow">Your Learning Journey</p>
              <h2 className="rmv-hero-role" id="rmv-journey-heading">
                {roleLabel}
              </h2>
            </div>
            <button type="button" className="rmv-btn rmv-btn-ghost" onClick={onChangePath}>
              Change path
            </button>
          </div>

          <div className="rmv-hero-figure">
            <span className="rmv-hero-percent">{totals.percent}%</span>
            <span className="rmv-hero-figure-label">
              {totals.done} of {totals.total} concepts completed
            </span>
          </div>

          <div
            className="rmv-bar"
            role="progressbar"
            aria-valuenow={totals.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall path progress"
          >
            <div
              className={`rmv-bar-fill${totals.percent === 0 ? " is-zero" : ""}`}
              style={{ width: totals.percent === 0 ? undefined : `${totals.percent}%` }}
            />
          </div>

          <div className="rmv-chips">
            <span className="rmv-chip is-accent">
              <IconBook className="rmv-chip-icon" />
              <strong>
                {totals.done}/{totals.total}
              </strong>{" "}
              concepts
            </span>
            {handsOnTotal > 0 && (
              <span className="rmv-chip">
                <IconTerminal className="rmv-chip-icon" />
                <strong>
                  {handsOnCompleted}/{handsOnTotal}
                </strong>{" "}
                hands-on
              </span>
            )}
            <span className="rmv-chip is-streak">
              <IconFlame className="rmv-chip-icon" />
              <strong>{streak}</strong> session{streak === 1 ? "" : "s"}
            </span>
          </div>

          {resume && (
            <div className="rmv-resume">
              <div>
                <p className="rmv-resume-label">{totals.done > 0 ? "Continue where you left off" : "Start here"}</p>
                <p className="rmv-resume-title">{resume.lessonTitle}</p>
                <p className="rmv-resume-meta">
                  {resume.moduleTitle}
                  {resume.nextLessonTitle && <span className="rmv-resume-next"> · Next: {resume.nextLessonTitle}</span>}
                </p>
              </div>
              <button type="button" className="rmv-btn rmv-btn-primary" onClick={onContinue}>
                {totals.done > 0 ? "Continue Learning" : "Start Learning"} →
              </button>
            </div>
          )}
        </section>

        {/* ---- Filter tabs ---- */}
        <div className="rmv-tabs" role="tablist" aria-label="Filter modules">
          {(Object.keys(FILTER_LABEL) as RoadmapFilter[]).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              className={`rmv-tab${filter === f ? " is-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {FILTER_LABEL[f]}
              <span className="rmv-tab-count">{counts[f]}</span>
            </button>
          ))}
        </div>

        {/* ---- Stepper ---- */}
        {stages.map((stage, stageIdx) => {
          const stageLessons = stage.modules.flatMap((m) => m.lessons);
          const stageDone = stageLessons.filter((l) => l.complete).length;
          const stagePercent = stageLessons.length === 0 ? 0 : Math.round((stageDone / stageLessons.length) * 100);

          const visible = stage.modules.filter((m) => matchesFilter(moduleStatus(m)));
          if (visible.length === 0) return null;

          return (
            <section className="rmv-section" key={stage.id}>
              <div className="rmv-section-head">
                <span className="rmv-section-index">{stageIdx + 1}</span>
                <h2 className="rmv-section-title">{stage.title}</h2>
                <div className="rmv-section-meter">
                  <div
                    className="rmv-bar"
                    role="progressbar"
                    aria-valuenow={stagePercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${stage.title} progress`}
                  >
                    <div
                      className={`rmv-bar-fill${stagePercent === 0 ? " is-zero" : ""}`}
                      style={{ width: stagePercent === 0 ? undefined : `${stagePercent}%` }}
                    />
                  </div>
                  <span className="rmv-section-percent">{stagePercent}%</span>
                </div>
              </div>

              <ol className="rmv-steps">
                {visible.map((m, i) => {
                  const stepNumber = stepNumbers.get(m.id) ?? i + 1;
                  const status = moduleStatus(m);
                  const percent = modulePercent(m);
                  const doneCount = m.lessons.filter((l) => l.complete).length;
                  const isOpen = expanded.has(m.id);
                  const isLast = i === visible.length - 1;

                  const lineClass =
                    status === "complete" ? " is-filled" : status === "in-progress" ? " is-partial" : "";

                  return (
                    <li className={`rmv-step is-${status === "in-progress" ? "active" : status}`} key={m.id}>
                      <div className="rmv-step-rail" aria-hidden="true">
                        <span className="rmv-step-node">
                          {status === "complete" ? <IconCheck className="rmv-chip-icon" /> : stepNumber}
                        </span>
                        {!isLast && <span className={`rmv-step-line${lineClass}`} />}
                      </div>

                      <div className="rmv-card">
                        <button
                          type="button"
                          className="rmv-card-toggle"
                          onClick={() => toggle(m.id)}
                          aria-expanded={isOpen}
                        >
                          <div className="rmv-card-head">
                            <div>
                              <h3 className="rmv-card-title">{m.title}</h3>
                              <p className="rmv-card-meta">
                                <span>
                                  {m.lessons.length} lesson{m.lessons.length === 1 ? "" : "s"}
                                </span>
                                {m.estimatedTime && (
                                  <>
                                    <span className="rmv-card-meta-dot" />
                                    <span>{m.estimatedTime}</span>
                                  </>
                                )}
                                <span className="rmv-card-meta-dot" />
                                <span>{isOpen ? "Hide lessons" : "Show lessons"}</span>
                              </p>
                            </div>
                            <span
                              className={`rmv-badge${
                                status === "complete" ? " is-complete" : status === "in-progress" ? " is-active" : ""
                              }`}
                            >
                              <span className="rmv-badge-dot" />
                              {STATUS_LABEL[status]}
                            </span>
                          </div>

                          <div className="rmv-card-progress">
                            <div
                              className="rmv-bar"
                              role="progressbar"
                              aria-valuenow={percent}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`${m.title} progress`}
                            >
                              <div
                                className={`rmv-bar-fill${percent === 0 ? " is-zero" : ""}`}
                                style={{ width: percent === 0 ? undefined : `${percent}%` }}
                              />
                            </div>
                            <span className="rmv-card-progress-label">
                              {doneCount}/{m.lessons.length}
                            </span>
                          </div>
                        </button>

                        {isOpen && (
                          <ul className="rmv-lessons">
                            {m.lessons.map((l) => (
                              <li key={l.id}>
                                <button
                                  type="button"
                                  className={`rmv-lesson${l.complete ? " is-complete" : ""}${
                                    l.current ? " is-current" : ""
                                  }`}
                                  onClick={() => onOpenLesson?.(l.id)}
                                >
                                  <span className="rmv-lesson-tick">
                                    <IconCheck className="rmv-chip-icon" />
                                  </span>
                                  {l.title}
                                  {l.current && <span className="rmv-lesson-flag">Next up</span>}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
