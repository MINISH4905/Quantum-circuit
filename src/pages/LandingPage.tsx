import "./LandingPage.css";
import { useLearnerProgressStore, getOverallProgress, getRecommendedTopic } from "../state/learner-progress-store";
import { getTopic } from "../learner/roadmap";

interface LandingPageProps {
  onExplore: () => void;
  onLearn: () => void;
  onFolders: () => void;
  onLearningCenter: () => void;
  onLearnerModule: () => void;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
  target: "dashboard" | "learner" | "folders" | "learning-center" | "learner-module";
}

const FEATURES: Feature[] = [
  {
    icon: "📁",
    title: "Folders",
    description: "Every circuit you save lands here, alongside one-click worked examples like Deutsch–Jozsa and Grover's Search.",
    target: "folders",
  },
  {
    icon: "⚛",
    title: "Interactive Circuit Editor",
    description: "Drag, drop, and wire up gates on a live qubit grid, with real Qiskit simulation and instant visualizations.",
    target: "dashboard",
  },
  {
    icon: "🎓",
    title: "Learner",
    description: "An AI tutor that explains your circuit, plus 10 core quantum computing concepts to learn as you go.",
    target: "learner",
  },
  {
    icon: "📚",
    title: "Learning Center",
    description: "A guided path through Qiskit's official learning content, fetched straight from GitHub.",
    target: "learning-center",
  },
  {
    icon: "🧭",
    title: "Learner Module",
    description: "Pick a role — Beginner, Professional, or Advanced — and get a roadmap tailored to it.",
    target: "learner-module",
  },
];

const CTA_LABEL: Record<Feature["target"], string> = {
  dashboard: "Open dashboard →",
  learner: "Open Learner →",
  folders: "Open Folders →",
  "learning-center": "Open Learning Center →",
  "learner-module": "Open Learner Module →",
};

export function LandingPage({ onExplore, onLearn, onFolders, onLearningCenter, onLearnerModule }: LandingPageProps) {
  const handlers: Record<Feature["target"], () => void> = {
    dashboard: onExplore,
    learner: onLearn,
    folders: onFolders,
    "learning-center": onLearningCenter,
    "learner-module": onLearnerModule,
  };
  const go = (target: Feature["target"]) => handlers[target]();

  const completedTopicIds = useLearnerProgressStore((s) => s.completedTopicIds);
  const currentTopicId = useLearnerProgressStore((s) => s.currentTopicId);
  const progress = { completedTopicIds, currentTopicId };
  const overall = getOverallProgress(progress);
  const currentTopic = currentTopicId ? getTopic(currentTopicId) : getRecommendedTopic(progress);
  const hasStarted = overall.completed > 0 || currentTopicId !== null;

  return (
    <div className="landing-page">
      <div className="landing-glow" aria-hidden="true" />

      <header className="landing-nav">
        <span className="landing-brand">Quantum Circuit Lab</span>
      </header>

      <main className="landing-hero">
        <div className="landing-hero-text">
          <p className="landing-eyebrow">Build. Simulate. Understand.</p>
          <h1 className="landing-title">
            Learn quantum computing by <span className="landing-title-accent">building circuits</span>
          </h1>
          <p className="landing-subtitle">
            A visual circuit editor, real Qiskit simulation, and Bloch/Q-sphere visualizations — all in one workspace.
          </p>
          <button type="button" className="landing-cta" onClick={onExplore}>
            Explore the Dashboard
            <span className="landing-cta-arrow" aria-hidden="true">→</span>
          </button>
        </div>

        <div className="landing-hero-visual" aria-hidden="true">
          <div className="qubit-orbit-scene">
            <div className="qubit-core" />
            <div className="qubit-ring qubit-ring-1">
              <div className="qubit-particle" />
            </div>
            <div className="qubit-ring qubit-ring-2">
              <div className="qubit-particle" />
            </div>
            <div className="qubit-ring qubit-ring-3">
              <div className="qubit-particle" />
            </div>
          </div>
        </div>
      </main>

      <section className="landing-features landing-features-trio" aria-label="Platform sections">
        {FEATURES.map((f) => (
          <button
            type="button"
            className="landing-feature-card"
            key={f.title}
            onClick={() => go(f.target)}
            title={CTA_LABEL[f.target]}
          >
            <span className="landing-feature-icon" aria-hidden="true">
              {f.icon}
            </span>
            <h3 className="landing-feature-title">{f.title}</h3>

            {f.target === "learner" ? (
              <>
                <p className="landing-feature-desc">Quantum Learning Roadmap</p>
                <div className="landing-feature-progress-bar" aria-hidden="true">
                  <div className="landing-feature-progress-fill" style={{ width: `${overall.percent}%` }} />
                </div>
                <p className="landing-feature-progress-label">
                  {overall.percent}% · {overall.completed}/{overall.total} topics
                </p>
                {currentTopic && (
                  <p className="landing-feature-desc landing-feature-current">
                    {hasStarted ? "Current: " : "Start with: "}
                    {currentTopic.title}
                  </p>
                )}
                <span className="landing-feature-cta" aria-hidden="true">
                  {hasStarted ? "Continue Learning →" : CTA_LABEL[f.target]}
                </span>
              </>
            ) : (
              <>
                <p className="landing-feature-desc">{f.description}</p>
                <span className="landing-feature-cta" aria-hidden="true">
                  {CTA_LABEL[f.target]}
                </span>
              </>
            )}
          </button>
        ))}
      </section>

      <footer className="landing-footer">
        <button type="button" className="landing-cta landing-cta-secondary" onClick={onExplore}>
          Get started →
        </button>
      </footer>
    </div>
  );
}
