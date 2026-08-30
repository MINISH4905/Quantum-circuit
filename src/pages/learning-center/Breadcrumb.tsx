export interface BreadcrumbSegment {
  label: string;
  onClick?: () => void;
}

/** Roadmap > Stage > Module > Concept — buttons with onClick, not links, per
 * this app's no-router navigation model. The last segment (current page) is
 * never clickable. */
export function Breadcrumb({ segments }: { segments: BreadcrumbSegment[] }) {
  return (
    <nav className="lc-breadcrumb" aria-label="Breadcrumb">
      {segments.map((seg, i) => (
        <span className="lc-breadcrumb-item" key={`${i}-${seg.label}`}>
          {seg.onClick ? (
            <button type="button" className="lc-breadcrumb-link" onClick={seg.onClick}>
              {seg.label}
            </button>
          ) : (
            <span className="lc-breadcrumb-current" aria-current="page">
              {seg.label}
            </span>
          )}
          {i < segments.length - 1 && (
            <span className="lc-breadcrumb-sep" aria-hidden="true">
              /
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
