import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import type { LearningConcept } from "./types";

const CIRCUIT_KEYWORDS = /circuit|gate|qubit|quantumcircuit|qasm|cnot|hadamard/i;
const MIN_CONTENT_LENGTH = 50;

interface ConceptViewerProps {
  concept: LearningConcept;
  isComplete: boolean;
  onMarkComplete: () => void;
  onOpenEditor: () => void;
}

export function ConceptViewer({ concept, isComplete, onMarkComplete, onOpenEditor }: ConceptViewerProps) {
  const hasContent = concept.content.trim().length >= MIN_CONTENT_LENGTH;
  const showTryInCircuitLab = CIRCUIT_KEYWORDS.test(concept.content);

  return (
    <article className="lc-concept-viewer" aria-label={concept.title}>
      <div className="lc-concept-header">
        <h2 className="lc-concept-title">{concept.title}</h2>
        <div className="lc-concept-actions">
          {showTryInCircuitLab && (
            <button type="button" className="page-home-btn lc-try-circuit-btn" onClick={onOpenEditor}>
              Try in Circuit Lab →
            </button>
          )}
          {isComplete ? (
            <span className="lc-completed-badge">Completed ✓</span>
          ) : (
            <button type="button" className="page-home-btn lc-mark-complete-btn" onClick={onMarkComplete}>
              Mark as Complete
            </button>
          )}
        </div>
      </div>

      {hasContent ? (
        <div className="lc-markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeHighlight, rehypeKatex]}>
            {concept.content}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="lc-content-fallback">
          <p>Full content coming soon — view on GitHub</p>
          <a href={concept.githubUrl} target="_blank" rel="noreferrer noopener">
            View on GitHub →
          </a>
        </div>
      )}
    </article>
  );
}
