import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getMyGroups, type GroupDetail } from "../api/groups-api";
import "./InstructorDashboard.css";

/* ------------------------------------------------------------------ */
/*  Group card                                                         */
/* ------------------------------------------------------------------ */

function GroupCard({ group }: { group: GroupDetail }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(group.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <div className="instructor-card">
      <h2 className="instructor-group-name">{group.name}</h2>

      <div className="instructor-code-label">Group Code</div>
      <div className="instructor-code-section">
        <span className="instructor-code">{group.code}</span>
        <button className="instructor-copy-btn" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="instructor-hint">Share this code with your students</div>

      <div className="instructor-divider" />

      <h3 className="instructor-members-title">
        Members ({group.members.length})
      </h3>

      {group.members.length === 0 ? (
        <div className="instructor-no-members">No students have joined yet</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="instructor-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {group.members.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{new Date(m.joined_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export function InstructorDashboard() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<GroupDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyGroups();
      setGroups(data.groups);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load groups");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return (
    <div className="instructor-page">
      <header className="instructor-header">
        <button className="instructor-back" onClick={() => navigate("/dashboard")}>
          &larr; Dashboard
        </button>
        <h1>My Groups</h1>
      </header>

      {error && <div className="instructor-error">{error}</div>}

      {loading ? (
        <div className="instructor-loading">Loading...</div>
      ) : groups.length === 0 ? (
        <div className="instructor-empty-card">
          <h2>No Groups Yet</h2>
          <p>
            You haven't been assigned any groups yet. An admin will create a
            group for you.
          </p>
        </div>
      ) : (
        groups.map((g) => <GroupCard key={g.id} group={g} />)
      )}
    </div>
  );
}
