import type { ElementType, ReactNode } from "react";
import { useEscapeToCollapse } from "./useEscapeToCollapse";

interface ExpandableModuleProps {
  as?: ElementType;
  id?: string;
  dataTour?: string;
  className: string;
  ariaLabel?: string;
  title: string;
  expanded: boolean;
  onCollapse: () => void;
  children: ReactNode;
}

/** Wraps an existing panel's root element so it can grow into a focused,
 * full-screen view without unmounting — the panel's own internal state
 * (local UI state, refs, etc.) is untouched since it's the same component
 * instance the whole time, just re-classed and given a backdrop. */
export function ExpandableModule({
  as: Tag = "section",
  id,
  dataTour,
  className,
  ariaLabel,
  title,
  expanded,
  onCollapse,
  children,
}: ExpandableModuleProps) {
  useEscapeToCollapse(expanded, onCollapse);

  return (
    <>
      {expanded && <div className="expandable-backdrop" onClick={onCollapse} aria-hidden="true" />}
      <Tag
        id={id}
        data-tour={dataTour}
        className={`${className}${expanded ? " module-expanded" : ""}`}
        role={expanded ? "dialog" : undefined}
        aria-modal={expanded ? true : undefined}
        aria-label={expanded ? title : ariaLabel}
      >
        {children}
      </Tag>
    </>
  );
}
