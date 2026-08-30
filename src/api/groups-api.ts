const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? "http://localhost:8000";

export interface GroupMembership {
  group_id: string;
  group_name: string;
  group_code: string;
  instructor_name: string;
  joined_at: string;
}

export interface GroupDetail {
  id: string;
  name: string;
  code: string;
  members: Array<{ id: string; name: string; email: string; joined_at: string }>;
}

export interface JoinResult {
  group_id: string;
  group_name: string;
  group_code: string;
  instructor_name: string;
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

export async function joinGroup(code: string): Promise<JoinResult> {
  const res = await fetch(`${BACKEND_URL}/api/groups/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
    credentials: "include",
  });
  if (!res.ok) throw new Error(await extractDetail(res));
  return await res.json();
}

// Paths and response shapes below mirror backend/app/routers/groups.py exactly:
// DELETE /leave/{id}, GET /my, GET /membership — and /my and /membership each
// return a bare array, not an object wrapper.

export async function leaveGroup(groupId: string): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/groups/leave/${groupId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(await extractDetail(res));
}

/** Instructor-only: the groups the caller owns, each with its members. */
export async function getMyGroups(): Promise<GroupDetail[]> {
  const res = await fetch(`${BACKEND_URL}/api/groups/my`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(await extractDetail(res));
  return await res.json();
}

export async function getMyMemberships(): Promise<GroupMembership[]> {
  const res = await fetch(`${BACKEND_URL}/api/groups/membership`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(await extractDetail(res));
  return await res.json();
}
