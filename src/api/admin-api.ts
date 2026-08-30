const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? "http://localhost:8001";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  picture: string | null;
  role: string;
  created_at: string;
  last_login: string;
}

export interface AdminGroup {
  id: string;
  name: string;
  code: string;
  instructor: { id: string; name: string; email: string };
  member_count: number;
  created_at: string;
}

export interface PaginatedUsers {
  users: AdminUser[];
  total: number;
  page: number;
  per_page: number;
}

async function extractDetail(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.detail === "string") return body.detail;
  } catch {
    // not JSON
  }
  return `HTTP ${res.status}`;
}

export async function listUsers(
  page?: number,
  perPage?: number,
  role?: string,
  search?: string,
): Promise<PaginatedUsers> {
  const params = new URLSearchParams();
  if (page !== undefined) params.set("page", String(page));
  if (perPage !== undefined) params.set("per_page", String(perPage));
  if (role) params.set("role", role);
  if (search) params.set("search", search);

  const qs = params.toString();
  const res = await fetch(`${BACKEND_URL}/api/admin/users${qs ? `?${qs}` : ""}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(await extractDetail(res));
  return await res.json();
}

export async function updateUserRole(
  userId: string,
  role: "user" | "instructor",
): Promise<AdminUser> {
  const res = await fetch(`${BACKEND_URL}/api/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
    credentials: "include",
  });
  if (!res.ok) throw new Error(await extractDetail(res));
  return await res.json();
}

export async function listGroups(): Promise<{ groups: AdminGroup[] }> {
  const res = await fetch(`${BACKEND_URL}/api/admin/groups`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(await extractDetail(res));
  return await res.json();
}

export async function createGroup(
  name: string,
  instructorId: string,
): Promise<AdminGroup> {
  const res = await fetch(`${BACKEND_URL}/api/admin/groups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, instructor_id: instructorId }),
    credentials: "include",
  });
  if (!res.ok) throw new Error(await extractDetail(res));
  return await res.json();
}

export async function deleteGroup(groupId: string): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/admin/groups/${groupId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(await extractDetail(res));
}
