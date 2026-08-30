import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StreakState {
  lastVisitDate: string | null;
  streak: number;
  recordVisit: () => void;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
function isYesterday(dateKey: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateKey === yesterday.toISOString().slice(0, 10);
}

/** Simple calendar-day visit streak for the Learner Module dashboard —
 * persisted the same way role/progress already are. Same day: no change.
 * Consecutive day: +1. Any gap: resets to 1. */
export const useLearnerStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      lastVisitDate: null,
      streak: 0,
      recordVisit: () => {
        const today = todayKey();
        const { lastVisitDate, streak } = get();
        if (lastVisitDate === today) return;
        const next = lastVisitDate && isYesterday(lastVisitDate) ? streak + 1 : 1;
        set({ lastVisitDate: today, streak: next });
      },
    }),
    { name: "quantum-circuit-lab.learner-streak" }
  )
);
