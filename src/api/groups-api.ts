const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? "http://localhost:8001";

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

export async function leaveGroup(groupId: string): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/groups/${groupId}/leave`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error(await extractDetail(res));
}

export async function getMyGroups(): Promise<{ groups: GroupDetail[] }> {
  const res = await fetch(`${BACKEND_URL}/api/groups/mine`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(await extractDetail(res));
  return await res.json();
}

export async function getMyMemberships(): Promise<{ memberships: GroupMembership[] }> {
  const res = await fetch(`${BACKEND_URL}/api/groups/memberships`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(await extractDetail(res));
  return await res.json();
}
