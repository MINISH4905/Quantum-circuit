import { useState, type ReactNode } from "react";
import App from "./App";
import { LandingPage } from "./pages/LandingPage";
import { LearnerPage } from "./pages/LearnerPage";
import { FoldersPage } from "./pages/FoldersPage";
import { LearningCenter } from "./pages/LearningCenter";
import { LearnerModule } from "./pages/LearnerModule";
import { BackendSimulationController } from "./components/simulation/BackendSimulationController";
import { TutorController } from "./components/tutor/TutorController";
import { TourProvider } from "./context/TourContext";
import { AppTour } from "./components/Tour/AppTour";
import "./AppRoot.css";

type View = "landing" | "dashboard" | "learner" | "folders" | "learning-center" | "learner-module";

function AppRoot() {
  const [view, setView] = useState<View>("landing");

  // Mounted unconditionally (not just inside the dashboard/App) so the
  // Learner page's embedded panels — which read the same circuit/tutor
  // stores — get live AI Tutor analysis and backend simulation results too.
  const controllers = (
    <>
      <BackendSimulationController />
      <TutorController />
    </>
  );

  let content: ReactNode;

  if (view === "landing") {
    content = (
      <>
        {controllers}
        <LandingPage
          onExplore={() => setView("dashboard")}
          onLearn={() => setView("learner")}
          onFolders={() => setView("folders")}
          onLearningCenter={() => setView("learning-center")}
          onLearnerModule={() => setView("learner-module")}
        />
      </>
    );
  } else if (view === "learner-module") {
    content = (
      <>
        {controllers}
        <LearnerModule onHome={() => setView("landing")} onOpenEditor={() => setView("dashboard")} />
      </>
    );
  } else if (view === "learner") {
    content = (
      <>
        {controllers}
        <LearnerPage onHome={() => setView("landing")} onOpenEditor={() => setView("dashboard")} />
      </>
    );
  } else if (view === "folders") {
    content = (
      <>
        {controllers}
        <FoldersPage onHome={() => setView("landing")} onOpenEditor={() => setView("dashboard")} />
      </>
    );
  } else if (view === "learning-center") {
    content = (
      <>
        {controllers}
        <LearningCenter onHome={() => setView("landing")} onOpenEditor={() => setView("dashboard")} />
      </>
    );
  } else {
    // Circuit simulator dashboard — the only view the guided tour covers.
    content = (
      <div className="dashboard-with-home">
        {controllers}
        <button
          type="button"
          className="home-float-btn"
          onClick={() => setView("landing")}
          aria-label="Back to home"
          title="Back to home"
        >
          ← Home
        </button>
        <button
          type="button"
          className="home-float-btn learn-float-btn"
          data-tour="learn-nav"
          onClick={() => setView("learning-center")}
          aria-label="Go to Learning Center"
          title="Learning Center"
        >
          📚 Learn
        </button>
        <App />
        <AppTour />
      </div>
    );
  }

  return <TourProvider>{content}</TourProvider>;
}

export default AppRoot;
