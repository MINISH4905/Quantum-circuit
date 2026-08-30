import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "./state/auth-store";
import App from "./App";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RoadmapPreview } from "./pages/RoadmapPreview";
import { LearnerPage } from "./pages/LearnerPage";
import { FoldersPage } from "./pages/FoldersPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { InstructorDashboard } from "./pages/InstructorDashboard";
import { JoinGroupPage } from "./pages/JoinGroupPage";
import { MyProgressPage } from "./pages/MyProgressPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoleGate } from "./components/auth/RoleGate";
import { LearningCenter } from "./pages/LearningCenter";
import { LearnerModule } from "./pages/LearnerModule";

import "./AppRoot.css";

// LearningCenter/LearnerModule take onHome/onOpenEditor callback props
// (built against the useState-view-switching convention) rather than using
// useNavigate() internally — these thin wrappers adapt that prop interface
// to this app's actual react-router navigation without touching either
// component's internals.
function LearningCenterRoute() {
  const navigate = useNavigate();
  return <LearningCenter onHome={() => navigate("/")} onOpenEditor={() => navigate("/dashboard")} />;
}
function LearnerModuleRoute() {
  const navigate = useNavigate();
  return <LearnerModule onHome={() => navigate("/")} onOpenEditor={() => navigate("/dashboard")} />;
}

function AppRoot() {
  const checkSession = useAuthStore((s) => s.checkSession);
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (status === "loading") {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Design preview for the roadmap revamp — static mock data, no auth so
       * it can be reviewed without a session. Remove alongside
       * pages/RoadmapPreview.tsx once the design is signed off and wired. */}
      <Route path="/roadmap-preview" element={<RoadmapPreview />} />

      {/* Protected routes — require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={
          <div className="dashboard-with-home">
            <App />
          </div>
        } />
        <Route path="/learner" element={<LearnerPage />} />
        <Route path="/folders" element={<FoldersPage />} />
        <Route path="/join-group" element={<JoinGroupPage />} />
        <Route path="/my-progress" element={<MyProgressPage />} />
        <Route path="/learning-center" element={<LearningCenterRoute />} />
        <Route path="/learner-module" element={<LearnerModuleRoute />} />

        {/* Instructor + Admin */}
        <Route element={<RoleGate allowed={["instructor", "admin"]} />}>
          <Route path="/instructor" element={<InstructorDashboard />} />
        </Route>

        {/* Admin only */}
        <Route element={<RoleGate allowed={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoot;
