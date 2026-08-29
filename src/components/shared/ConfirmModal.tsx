import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
  width?: number;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  children,
  width,
}: ConfirmModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div className="confirm-modal-backdrop" onMouseDown={onCancel}>
      <div
        ref={panelRef}
        className="confirm-modal"
        style={width ? { width } : undefined}
        tabIndex={-1}
        role="dialog"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className="confirm-modal-title">{title}</h2>
        {children ? (
          children
        ) : (
          <>
            {message && <p className="confirm-modal-message">{message}</p>}
            <div className="confirm-modal-actions">
              <button type="button" className="confirm-modal-btn" onClick={onCancel}>
                {cancelLabel}
              </button>
              <button type="button" className="confirm-modal-btn is-primary" onClick={onConfirm}>
                {confirmLabel}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
