import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./state/auth-store";
import App from "./App";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { LearnerPage } from "./pages/LearnerPage";
import { FoldersPage } from "./pages/FoldersPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { InstructorDashboard } from "./pages/InstructorDashboard";
import { JoinGroupPage } from "./pages/JoinGroupPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoleGate } from "./components/auth/RoleGate";
import "./AppRoot.css";

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
