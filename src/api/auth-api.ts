const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? "http://localhost:8000";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture: string | null;
  role: "user" | "instructor" | "admin";
  memberships: Array<{
    group_id: string;
    group_name: string;
    group_code: string;
    instructor_name: string;
    joined_at: string;
  }>;
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/me`, {
      credentials: "include",
    });
    if (res.status === 401) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await fetch(`${BACKEND_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export function getGoogleLoginUrl(): string {
  return `${BACKEND_URL}/auth/google/login`;
}
