import type { LearningModule, LearningStage } from "./types";

export type NodeFilter = "all" | "in-progress" | "completed";

interface RoadmapGraphProps {
  roadmap: LearningStage[];
  isConceptComplete: (sourceFile: string) => boolean;
  getModuleCompletionPercent: (learningModule: LearningModule) => number;
  getStageCompletionPercent: (stage: LearningStage) => number;
  filter: NodeFilter;
  expandedModuleIds: Set<string>;
  onToggleModule: (moduleId: string) => void;
  onOpenConcept: (sourceFile: string) => void;
  /** Optional — marks one concept node with a ★ "recommended next" badge
   * (see LearnerModule.tsx's dashboard summary). Undefined/null behaves
   * exactly as before, so the Learning Center (which doesn't pass this) is
   * unaffected. */
  recommendedSourceFile?: string | null;
}

type ModuleState = "not-started" | "in-progress" | "complete";

function moduleState(percent: number): ModuleState {
  if (percent >= 100) return "complete";
  if (percent > 0) return "in-progress";
  return "not-started";
}

/** roadmap.sh-style node graph: a solid vertical spine runs through module
 * nodes (the primary path); each module's concepts branch off alternating
 * left/right with dashed connectors, expandable inline. Every stage and
 * module is always unlocked and explorable — filtering only dims
 * non-matching nodes, it never hides or gates anything. Pure CSS/divs, no
 * graph library. Expand/collapse state is owned by the parent (LearningCenter)
 * so it survives this component unmounting when the concept page is shown. */
export function RoadmapGraph({
  roadmap,
  isConceptComplete,
  getModuleCompletionPercent,
  getStageCompletionPercent,
  filter,
  expandedModuleIds,
  onToggleModule,
  onOpenConcept,
  recommendedSourceFile = null,
}: RoadmapGraphProps) {
  if (roadmap.length === 0) {
    return (
      <p className="lc-empty-state">
        Content is still being fetched. Run <code>npm run fetch-content</code> to populate.
      </p>
    );
  }

  return (
    <div className="rg-canvas">
      {roadmap.map((stage) => {
        const stagePercent = getStageCompletionPercent(stage);

        return (
          <section className="rg-stage" key={stage.id} aria-label={stage.title}>
            <h2 className="rg-stage-header">
              <span className="rg-stage-header-text">{stage.title}</span>
              <span className="rg-stage-header-meta">{stagePercent}% complete</span>
            </h2>

            {stage.modules.length === 0 ? (
              <p className="lc-empty-state">More modules coming soon.</p>
            ) : (
              <div className="rg-module-list">
                {stage.modules.map((learningModule) => {
                  const percent = getModuleCompletionPercent(learningModule);
                  const state = moduleState(percent);
                  const isExpanded = expandedModuleIds.has(learningModule.id);
                  const moduleDimmed =
                    filter === "completed" ? state !== "complete" : filter === "in-progress" ? state !== "in-progress" : false;

                  return (
                    <div className="rg-module-group" key={learningModule.id}>
                      <div className="rg-module-node-wrap">
                        <button
                          type="button"
                          className={`rg-module-node is-${state}${moduleDimmed ? " is-dimmed" : ""}`}
                          onClick={() => onToggleModule(learningModule.id)}
                          aria-expanded={isExpanded}
                        >
                          {state === "complete" && (
                            <span className="rg-node-icon" aria-hidden="true">
                              ✓
                            </span>
                          )}
                          <span className="rg-module-node-title">{learningModule.title}</span>
                          {learningModule.prerequisites.length > 0 && (
                            <span className="rg-module-node-prereq">Requires: {learningModule.prerequisites.join(", ")}</span>
                          )}
                          {learningModule.concepts.length > 0 && (
                            <span className="rg-module-node-count">
                              {learningModule.concepts.length} lesson{learningModule.concepts.length === 1 ? "" : "s"} ·{" "}
                              {isExpanded ? "hide" : "show"}
                            </span>
                          )}
                        </button>
                      </div>

                      {learningModule.concepts.length > 0 && (
                        <div className={`rg-concept-branches${isExpanded ? " is-expanded" : ""}`}>
                          {learningModule.concepts.map((concept, i) => {
                            const done = isConceptComplete(concept.sourceFile);
                            // A concept only reads as "in progress" if its module is
                            // actually partway done — otherwise an untouched concept in
                            // an untouched module would stay bright while its dimmed
                            // module header makes it look inconsistent.
                            const conceptDimmed =
                              filter === "completed" ? !done : filter === "in-progress" ? !(!done && state === "in-progress") : false;
                            const side = i % 2 === 0 ? "is-left" : "is-right";
                            const isRecommended = !done && concept.sourceFile === recommendedSourceFile;
                            return (
                              <div className={`rg-concept-row ${side}`} key={concept.sourceFile}>
                                {isExpanded && <span className="rg-concept-connector" aria-hidden="true" />}
                                <button
                                  type="button"
                                  className={`rg-concept-node${done ? " is-complete" : ""}${isRecommended ? " is-recommended" : ""}${conceptDimmed ? " is-dimmed" : ""}`}
                                  onClick={() => onOpenConcept(concept.sourceFile)}
                                  tabIndex={isExpanded ? 0 : -1}
                                  title={isRecommended ? "Recommended next" : undefined}
                                >
                                  <span className="rg-node-icon" aria-hidden="true">
                                    {done ? "✓" : isRecommended ? "★" : "○"}
                                  </span>
                                  <span className="rg-concept-node-title">{concept.title}</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
