import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../state/auth-store";

interface Props {
  allowed: Array<"user" | "instructor" | "admin">;
}

export function RoleGate({ allowed }: Props) {
  const user = useAuthStore((s) => s.user);

  if (!user || !allowed.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
