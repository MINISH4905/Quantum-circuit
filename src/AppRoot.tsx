import { useState } from "react";
import App from "./App";
import { LandingPage } from "./pages/LandingPage";
import { LearnerPage } from "./pages/LearnerPage";
import { FoldersPage } from "./pages/FoldersPage";
import "./AppRoot.css";

type View = "landing" | "dashboard" | "learner" | "folders";

function AppRoot() {
  const [view, setView] = useState<View>("landing");

  if (view === "landing") {
    return (
      <LandingPage
        onExplore={() => setView("dashboard")}
        onLearn={() => setView("learner")}
        onFolders={() => setView("folders")}
      />
    );
  }

  if (view === "learner") {
    return <LearnerPage onHome={() => setView("landing")} onOpenEditor={() => setView("dashboard")} />;
  }

  if (view === "folders") {
    return <FoldersPage onHome={() => setView("landing")} onOpenEditor={() => setView("dashboard")} />;
  }

  return (
    <div className="dashboard-with-home">
      <button
        type="button"
        className="home-float-btn"
        onClick={() => setView("landing")}
        aria-label="Back to home"
        title="Back to home"
      >
        ← Home
      </button>
      <App />
    </div>
  );
}

export default AppRoot;
