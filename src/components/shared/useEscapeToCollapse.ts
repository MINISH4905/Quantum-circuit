import { useEffect } from "react";

/** Shared by ExpandableModule and the circuit editor's in-page expand — one
 * place for the "Esc collapses the active module" behavior. */
export function useEscapeToCollapse(active: boolean, onCollapse: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCollapse();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, onCollapse]);
}
