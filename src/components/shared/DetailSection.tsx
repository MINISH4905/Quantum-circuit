import type { ReactNode } from "react";

interface DetailSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

/** Collapsible section used by any per-concept/per-topic learning page to
 * lazily mount an embedded panel (circuit editor, code, visualizations,
 * tutor) — extracted from the Learner page's TopicDetailPanel so the new
 * JSON-driven ConceptPage can reuse the exact same collapsible chrome
 * instead of a second implementation. */
export function DetailSection({ title, isOpen, onToggle, children }: DetailSectionProps) {
  return (
    <div className="topic-detail-section">
      <button type="button" className="topic-detail-section-toggle" onClick={onToggle} aria-expanded={isOpen}>
        <span>{title}</span>
        <span className="topic-detail-section-chevron" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && <div className="topic-detail-section-body">{children}</div>}
    </div>
  );
}
