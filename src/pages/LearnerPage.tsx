import { useState } from "react";
import "./PageHeader.css";
import "./LearnerPage.css";
import { LEARNER_CONCEPTS } from "../learner/concepts";

interface LearnerPageProps {
  onHome: () => void;
  onOpenEditor: () => void;
}

const THUMB_VARIANTS = 6;

export function LearnerPage({ onHome, onOpenEditor }: LearnerPageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="learner-page">
      <header className="page-nav">
        <span className="page-brand">Quantum Circuit Lab</span>
        <button type="button" className="page-home-btn" onClick={onHome}>
          ← Home
        </button>
      </header>

      <div className="page-intro">
        <p className="page-eyebrow">Learner</p>
        <h1 className="page-title">Learn Quantum Computing</h1>
        <p className="page-subtitle">
          A live AI tutor for the circuit you're building, plus 10 core concepts — click any card to read more.
        </p>
      </div>

      <section className="learner-grid" aria-label="Learner catalog">
        <button type="button" className="course-card course-card-tool" onClick={onOpenEditor}>
          <span className="course-thumb course-thumb-tool" aria-hidden="true">
            ✨
          </span>
          <span className="course-badge course-badge-tool">Tool</span>
          <span className="course-body">
            <span className="course-title">AI Tutor</span>
            <span className="course-blurb">Explains the exact circuit you build, live, in the editor.</span>
            <span className="course-meta">Open in Circuit Editor →</span>
          </span>
        </button>

        {LEARNER_CONCEPTS.map((concept, i) => {
          const isOpen = expandedId === concept.id;
          return (
            <button
              type="button"
              key={concept.id}
              className={`course-card${isOpen ? " is-expanded" : ""}`}
              onClick={() => setExpandedId(isOpen ? null : concept.id)}
              aria-expanded={isOpen}
            >
              <span className={`course-thumb course-thumb-${(i % THUMB_VARIANTS) + 1}`} aria-hidden="true">
                {concept.title.charAt(0)}
              </span>
              <span className="course-badge">{concept.tag}</span>
              <span className="course-body">
                <span className="course-title">{concept.title}</span>
                <span className="course-blurb">{concept.blurb}</span>
                <span className="course-meta">{isOpen ? "Hide details ↑" : "Read more →"}</span>

                {isOpen && (
                  <span className="course-details">
                    <span className="course-analogy">{concept.analogy}</span>
                    <span className="course-explanation">{concept.explanation}</span>
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </section>
    </div>
  );
}
