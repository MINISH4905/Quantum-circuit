import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../state/auth-store";

export function ProtectedRoute() {
  const status = useAuthStore((s) => s.status);
  const location = useLocation();

  if (status === "unauthenticated") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
