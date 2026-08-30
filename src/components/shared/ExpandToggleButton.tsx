interface ExpandToggleButtonProps {
  expanded: boolean;
  onClick: () => void;
  label: string;
}

/** Same small icon-btn used everywhere else in the toolbar/panel headers —
 * just toggles the shared expand state for a given module. */
export function ExpandToggleButton({ expanded, onClick, label }: ExpandToggleButtonProps) {
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={onClick}
      aria-label={expanded ? `Collapse ${label}` : `Expand ${label}`}
      title={expanded ? "Collapse" : "Expand"}
    >
      {expanded ? "✕" : "⤢"}
    </button>
  );
}
