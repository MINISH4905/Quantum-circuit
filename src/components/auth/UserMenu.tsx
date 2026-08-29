import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../state/auth-store";
import type { AuthUser } from "../../api/auth-api";
import "./UserMenu.css";

interface Props {
  user: AuthUser;
}

export function UserMenu({ user }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleNav = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const handleSignOut = async () => {
    setOpen(false);
    await logout();
    navigate("/");
  };

  const roleLabel = user.role === "user" ? "Learner" : user.role;

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className={`user-menu-trigger${open ? " open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {user.picture ? (
          <img
            className="user-menu-avatar"
            src={user.picture}
            alt={user.name}
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="user-menu-initial">
            {user.name.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="chevron">&#9662;</span>
      </button>

      {open && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <div className="user-menu-name">{user.name}</div>
            <div className="user-menu-email">{user.email}</div>
            <span className={`user-menu-role ${user.role}`}>{roleLabel}</span>
          </div>

          <div className="user-menu-divider" />

          {user.role === "admin" && (
            <button className="user-menu-item" onClick={() => handleNav("/admin")}>
              Admin Panel
            </button>
          )}

          {(user.role === "instructor" || user.role === "admin") && (
            <button className="user-menu-item" onClick={() => handleNav("/instructor")}>
              My Groups
            </button>
          )}

          <button className="user-menu-item" onClick={() => handleNav("/join-group")}>
            Join a Group
          </button>

          <div className="user-menu-divider" />

          <button className="user-menu-item sign-out" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
