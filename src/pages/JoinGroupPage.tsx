import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  joinGroup,
  leaveGroup,
  getMyMemberships,
  type JoinResult,
  type GroupMembership,
} from "../api/groups-api";
import "./JoinGroupPage.css";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString();
}

export function JoinGroupPage() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [success, setSuccess] = useState<JoinResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [memberships, setMemberships] = useState<GroupMembership[]>([]);

  async function loadMemberships() {
    try {
      setMemberships(await getMyMemberships());
    } catch {
      // silent – memberships are supplementary
    }
  }

  useEffect(() => {
    loadMemberships();
  }, []);

  function handleCodeChange(value: string) {
    setCode(value);
    setError(null);
    setSuccess(null);
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;

    setJoining(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await joinGroup(trimmed);
      setSuccess(result);
      setCode("");
      await loadMemberships();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to join group";
      setError(msg);
    } finally {
      setJoining(false);
    }
  }

  async function handleLeave(groupId: string, groupName: string) {
    if (!window.confirm(`Leave "${groupName}"?`)) return;
    try {
      await leaveGroup(groupId);
      await loadMemberships();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to leave group";
      setError(msg);
    }
  }

  return (
    <div className="join-page">
      <header className="join-header">
        <button className="join-back" onClick={() => navigate("/dashboard")}>
          &larr; Dashboard
        </button>
        <h1>Join a Group</h1>
      </header>

      <div className="join-content">
        {/* ---- Join form card ---- */}
        <div className="join-card">
          <p>Enter the group code your instructor shared with you</p>

          <form className="join-form" onSubmit={handleJoin}>
            <input
              className="join-input"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="e.g. Ab3xK9mN"
              maxLength={16}
              autoFocus
            />
            <button
              type="submit"
              className="join-submit"
              disabled={joining || !code.trim()}
            >
              {joining ? "Joining…" : "Join Group"}
            </button>
          </form>

          {success && (
            <div className="join-success">
              <strong>You've joined {success.group_name}!</strong>
              Instructor: {success.instructor_name}
              <button
                className="join-success-action"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {error && <div className="join-error">{error}</div>}
        </div>

        {/* ---- Current memberships ---- */}
        <div className="join-memberships">
          <h2>Your Groups</h2>

          {memberships.length === 0 ? (
            <p className="join-memberships-empty">
              You haven't joined any groups yet.
            </p>
          ) : (
            memberships.map((m) => (
              <div className="join-membership-card" key={m.group_id}>
                <div className="join-membership-info">
                  <span className="join-membership-name">{m.group_name}</span>
                  <span className="join-membership-meta">
                    Instructor: {m.instructor_name}
                  </span>
                  <span className="join-membership-meta">
                    Joined {formatDate(m.joined_at)}
                  </span>
                </div>
                <button
                  className="join-leave-btn"
                  onClick={() => handleLeave(m.group_id, m.group_name)}
                >
                  Leave
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
