import { createContext, useContext, useState, type ReactNode } from "react";

interface TourContextValue {
  run: boolean;
  startTour: () => void;
  stopTour: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

/** Shared run/stop state for the guided circuit-simulator tour (see AppTour),
 * so the Help menu's "Take a Tour" item and the tour's own first-visit
 * auto-launch drive the same instance. */
export function TourProvider({ children }: { children: ReactNode }) {
  const [run, setRun] = useState(false);

  const value: TourContextValue = {
    run,
    startTour: () => setRun(true),
    stopTour: () => setRun(false),
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within a TourProvider");
  return ctx;
}
