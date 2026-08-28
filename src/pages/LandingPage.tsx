import "./LandingPage.css";

interface LandingPageProps {
  onExplore: () => void;
  onLearn: () => void;
  onFolders: () => void;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
  target: "dashboard" | "learner" | "folders";
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
];

const CTA_LABEL: Record<Feature["target"], string> = {
  dashboard: "Open dashboard →",
  learner: "Open Learner →",
  folders: "Open Folders →",
};

export function LandingPage({ onExplore, onLearn, onFolders }: LandingPageProps) {
  const handlers: Record<Feature["target"], () => void> = {
    dashboard: onExplore,
    learner: onLearn,
    folders: onFolders,
  };
  const go = (target: Feature["target"]) => handlers[target]();

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
            <p className="landing-feature-desc">{f.description}</p>
            <span className="landing-feature-cta" aria-hidden="true">
              {CTA_LABEL[f.target]}
            </span>
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
