import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  listUsers,
  updateUserRole,
  listGroups,
  createGroup,
  deleteGroup,
  type AdminUser,
  type AdminGroup,
} from "../api/admin-api";
import { useAuthStore } from "../state/auth-store";
import "./AdminDashboard.css";

/* ------------------------------------------------------------------ */
/*  Toast                                                              */
/* ------------------------------------------------------------------ */

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className="admin-toast">{message}</div>;
}

/* ------------------------------------------------------------------ */
/*  Users tab                                                          */
/* ------------------------------------------------------------------ */

function UsersTab() {
  const currentUser = useAuthStore((s) => s.user);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listUsers(
        page,
        perPage,
        roleFilter || undefined,
        debouncedSearch || undefined,
      );
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, roleFilter, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const handleRoleChange = async (userId: string, newRole: "user" | "instructor") => {
    try {
      await updateUserRole(userId, newRole);
      setToast("Role updated successfully");
      fetchUsers();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  return (
    <div>
      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="admin-filter"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-empty">Loading...</div>
      ) : users.length === 0 ? (
        <div className="admin-empty">No users found</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="admin-user-cell">
                      {u.picture ? (
                        <img
                          className="admin-avatar"
                          src={u.picture}
                          alt=""
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="admin-avatar-placeholder">
                          {u.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                      {u.name}
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`admin-role-badge ${u.role}`}>{u.role}</span>
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    {u.role === "admin" ? (
                      <span style={{ fontSize: 12, color: "var(--text-faint)" }}>--</span>
                    ) : (
                      <select
                        className="admin-role-select"
                        value={u.role}
                        disabled={u.id === currentUser?.id}
                        onChange={(e) =>
                          handleRoleChange(u.id, e.target.value as "user" | "instructor")
                        }
                      >
                        <option value="user">User</option>
                        <option value="instructor">Instructor</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}

      {toast && <Toast message={toast} onDone={() => setToast("")} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Groups tab                                                         */
/* ------------------------------------------------------------------ */

function GroupsTab() {
  const [groups, setGroups] = useState<AdminGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  /* Create-form state */
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newInstructorId, setNewInstructorId] = useState("");
  const [instructors, setInstructors] = useState<AdminUser[]>([]);
  const [creating, setCreating] = useState(false);

  /* Clipboard copied state per group */
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listGroups();
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

  /* Fetch instructors when create form opens */
  useEffect(() => {
    if (!showCreate) return;
    let cancelled = false;
    listUsers(1, 100, "instructor").then((data) => {
      if (!cancelled) setInstructors(data.users);
    });
    return () => {
      cancelled = true;
    };
  }, [showCreate]);

  const handleCopy = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      /* clipboard not available */
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete group "${name}"? This cannot be undone.`)) return;
    try {
      await deleteGroup(id);
      setToast("Group deleted");
      fetchGroups();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed to delete group");
    }
  };

  const handleCreate = async () => {
    if (!newName.trim() || !newInstructorId) return;
    setCreating(true);
    try {
      await createGroup(newName.trim(), newInstructorId);
      setToast("Group created");
      setNewName("");
      setNewInstructorId("");
      setShowCreate(false);
      fetchGroups();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="admin-groups-header">
        <span />
        <button
          className="admin-btn-primary"
          onClick={() => setShowCreate((v) => !v)}
        >
          {showCreate ? "Cancel" : "Create Group"}
        </button>
      </div>

      {showCreate && (
        <div className="admin-create-form">
          <label>
            Group Name
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. CS 101 Section A"
            />
          </label>
          <label>
            Instructor
            <select
              value={newInstructorId}
              onChange={(e) => setNewInstructorId(e.target.value)}
            >
              <option value="">Select instructor...</option>
              {instructors.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({i.email})
                </option>
              ))}
            </select>
          </label>
          <button
            className="admin-btn-primary"
            disabled={creating || !newName.trim() || !newInstructorId}
            onClick={handleCreate}
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
      )}

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-empty">Loading...</div>
      ) : groups.length === 0 ? (
        <div className="admin-empty">No groups yet</div>
      ) : (
        <div className="admin-group-grid">
          {groups.map((g) => (
            <div className="admin-group-card" key={g.id}>
              <h3>{g.name}</h3>
              <div className="admin-group-code-row">
                <span className="admin-group-code">{g.code}</span>
                <button
                  className="admin-copy-btn"
                  onClick={() => handleCopy(g.id, g.code)}
                >
                  {copiedId === g.id ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="admin-group-meta">
                Instructor: {g.instructor.name} ({g.instructor.email})
              </div>
              <div className="admin-group-meta">
                Members: {g.member_count}
              </div>
              <div className="admin-group-actions">
                <button
                  className="admin-btn-danger"
                  onClick={() => handleDelete(g.id, g.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast message={toast} onDone={() => setToast("")} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"users" | "groups">("users");

  return (
    <div className="admin-page">
      <header className="admin-header">
        <button className="admin-back" onClick={() => navigate("/dashboard")}>
          &larr; Dashboard
        </button>
        <h1>Admin Panel</h1>
      </header>

      <nav className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`admin-tab ${activeTab === "groups" ? "active" : ""}`}
          onClick={() => setActiveTab("groups")}
        >
          Groups
        </button>
      </nav>

      {activeTab === "users" && <UsersTab />}
      {activeTab === "groups" && <GroupsTab />}
    </div>
  );
}
