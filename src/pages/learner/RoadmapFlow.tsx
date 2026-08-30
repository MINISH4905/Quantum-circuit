import { useLayoutEffect, useRef, useState } from "react";
import type { RoadmapSection, RoadmapTopic } from "../../learner/roadmap";
import { getTopicStatus, STATUS_GLYPH } from "../../state/learner-progress-store";

interface ProgressSnapshot {
  completedTopicIds: string[];
  currentTopicId: string | null;
}

interface RoadmapFlowProps {
  sections: { section: RoadmapSection; topics: RoadmapTopic[] }[];
  progress: ProgressSnapshot;
  selectedTopicId: string | null;
  onSelectTopic: (id: string) => void;
}

/** roadmap.sh-style connected flowchart: a vertical trunk of section nodes,
 * each fanning out via dotted bezier curves (an SVG overlay, positions
 * computed from the actual rendered DOM via ResizeObserver — no fixed/
 * hardcoded coordinates) to its topic nodes. Built in this app's own dark
 * theme/card language rather than roadmap.sh's own colors or branding. */
export function RoadmapFlow({ sections, progress, selectedTopicId, onSelectTopic }: RoadmapFlowProps) {
  return (
    <div className="roadmap-flow-outer">
      {sections.map(({ section, topics }) => (
        <RoadmapFlowSection
          key={section.id}
          section={section}
          topics={topics}
          progress={progress}
          selectedTopicId={selectedTopicId}
          onSelectTopic={onSelectTopic}
        />
      ))}
    </div>
  );
}

function RoadmapFlowSection({
  section,
  topics,
  progress,
  selectedTopicId,
  onSelectTopic,
}: {
  section: RoadmapSection;
  topics: RoadmapTopic[];
  progress: ProgressSnapshot;
  selectedTopicId: string | null;
  onSelectTopic: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trunkRef = useRef<HTMLDivElement | null>(null);
  const branchRefs = useRef<Map<string, HTMLElement | null>>(new Map());
  const [paths, setPaths] = useState<string[]>([]);

  const completedCount = section.topics.filter((t) => progress.completedTopicIds.includes(t.id)).length;

  useLayoutEffect(() => {
    const container = containerRef.current;
    const trunk = trunkRef.current;
    if (!container || !trunk) return;

    const recompute = () => {
      const cRect = container.getBoundingClientRect();
      const tRect = trunk.getBoundingClientRect();
      const originX = tRect.right - cRect.left;
      const originY = tRect.top - cRect.top + tRect.height / 2;
      const next: string[] = [];
      topics.forEach((topic) => {
        const el = branchRefs.current.get(topic.id);
        if (!el) return;
        const bRect = el.getBoundingClientRect();
        const targetX = bRect.left - cRect.left;
        const targetY = bRect.top - cRect.top + bRect.height / 2;
        const midX = (originX + targetX) / 2;
        next.push(`M ${originX} ${originY} C ${midX} ${originY} ${midX} ${targetY} ${targetX} ${targetY}`);
      });
      setPaths(next);
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(container);
    topics.forEach((topic) => {
      const el = branchRefs.current.get(topic.id);
      if (el) ro.observe(el);
    });
    window.addEventListener("resize", recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics.map((t) => t.id).join(","), progress.completedTopicIds.length]);

  return (
    <div className="roadmap-flow-section">
      <div className="roadmap-flow-row" ref={containerRef}>
        <div className="roadmap-trunk-node" ref={trunkRef}>
          <span className="roadmap-trunk-title">{section.title}</span>
          <span className="roadmap-trunk-progress">
            {completedCount} / {section.topics.length}
          </span>
        </div>

        <svg className="roadmap-flow-svg" aria-hidden="true">
          {paths.map((d, i) => (
            <path key={i} d={d} className="roadmap-flow-path" />
          ))}
        </svg>

        <div className="roadmap-flow-branches">
          {topics.map((topic) => {
            const status = getTopicStatus(topic, progress);
            const isSelected = topic.id === selectedTopicId;
            return (
              <button
                key={topic.id}
                ref={(el) => {
                  branchRefs.current.set(topic.id, el);
                }}
                type="button"
                className={`roadmap-branch-node is-${status}${isSelected ? " is-selected" : ""}`}
                onClick={() => onSelectTopic(topic.id)}
                disabled={status === "locked"}
                aria-current={isSelected ? "true" : undefined}
              >
                <span className="roadmap-node-head">
                  <span className={`roadmap-branch-status is-${status}`} aria-hidden="true">
                    {STATUS_GLYPH[status]}
                  </span>
                  <span className="roadmap-node-title">{topic.title}</span>
                  <span className={`roadmap-node-difficulty is-${topic.difficulty}`}>{topic.difficulty}</span>
                </span>
                <p className="roadmap-node-snippet">{topic.description}</p>
                {status === "current" && <span className="roadmap-topic-continue">Continue →</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
