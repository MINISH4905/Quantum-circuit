import { create } from "zustand";

/** Page-specific key so each guided page can track its own "seen" state independently. */
export const WALKTHROUGH_STORAGE_KEY = "interactive-circuits-walkthrough-completed";

export function hasSeenWalkthrough(): boolean {
  try {
    return window.localStorage.getItem(WALKTHROUGH_STORAGE_KEY) === "true";
  } catch {
    // Storage unavailable (e.g. private browsing) — don't force a tour every load.
    return true;
  }
}

function persistSeen() {
  try {
    window.localStorage.setItem(WALKTHROUGH_STORAGE_KEY, "true");
  } catch {
    /* nothing we can do if storage is unavailable */
  }
}

interface WalkthroughState {
  isOpen: boolean;
  stepIndex: number;
  start: () => void;
  dismiss: () => void;
  setStep: (index: number) => void;
}

/** Single shared walkthrough state — drives both the first-time auto-launch
 * and the Help → "Take a tour" restart, so there is only one implementation. */
export const useWalkthroughStore = create<WalkthroughState>((set) => ({
  isOpen: false,
  stepIndex: 0,

  start: () => set({ isOpen: true, stepIndex: 0 }),

  dismiss: () => {
    persistSeen();
    set({ isOpen: false });
  },

  setStep: (index) => set({ stepIndex: index }),
}));
