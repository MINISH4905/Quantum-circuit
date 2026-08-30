import type { RoadmapSection } from "../../learner/roadmap";

interface RoadmapMainTreeProps {
  sections: RoadmapSection[];
  completedTopicIds: string[];
  highlightSectionId?: string;
  onSelectSection: (id: string) => void;
}

/** Top-level roadmap view: just the seven main curriculum "tabs" as a clean
 * vertical chain — a single connecting spine through the center of each box,
 * matching roadmap.sh's own main-trunk pattern (Internet → HTML → CSS → ...)
 * but in this app's existing dark theme. Clicking a box navigates into that
 * section's curriculum. */
export function RoadmapMainTree({ sections, completedTopicIds, highlightSectionId, onSelectSection }: RoadmapMainTreeProps) {
  return (
    <div className="roadmap-main-tree" aria-label="Roadmap sections">
      {sections.map((section) => {
        const total = section.topics.length;
        const completed = section.topics.filter((t) => completedTopicIds.includes(t.id)).length;
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
        const isComplete = total > 0 && completed === total;
        const isHighlighted = section.id === highlightSectionId;

        return (
          <div className="roadmap-main-node" key={section.id}>
            <button
              type="button"
              className={`roadmap-main-box${isComplete ? " is-complete" : ""}${isHighlighted ? " is-highlighted" : ""}`}
              onClick={() => onSelectSection(section.id)}
            >
              <span className="roadmap-main-title">{section.title}</span>
              <span className="roadmap-main-desc">{section.description}</span>
              <span className="roadmap-main-progress-row">
                <span className="roadmap-main-progress-bar" aria-hidden="true">
                  <span className="roadmap-main-progress-fill" style={{ width: `${percent}%` }} />
                </span>
                <span className="roadmap-main-progress-label">
                  {completed} / {total}
                </span>
              </span>
              <span className="roadmap-main-cta" aria-hidden="true">
                {isHighlighted ? "Continue →" : "View curriculum →"}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
