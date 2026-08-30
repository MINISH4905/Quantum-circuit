import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ALL_TOPICS, type RoadmapTopic } from "../learner/roadmap";

export type TopicStatus = "completed" | "current" | "available" | "locked";

export const STATUS_GLYPH: Record<TopicStatus, string> = {
  completed: "✓",
  current: "◉",
  available: "○",
  locked: "🔒",
};

interface LearnerProgressState {
  completedTopicIds: string[];
  currentTopicId: string | null;
  markComplete: (id: string) => void;
  setCurrent: (id: string) => void;
  resetProgress: () => void;
}

/** Learner roadmap progress, persisted the same way saved-circuits-store
 * persists circuits — a single, already-established pattern for local
 * client state, not a second state-management system. */
export const useLearnerProgressStore = create<LearnerProgressState>()(
  persist(
    (set) => ({
      completedTopicIds: [],
      currentTopicId: null,

      markComplete: (id) =>
        set((state) => ({
          completedTopicIds: state.completedTopicIds.includes(id)
            ? state.completedTopicIds
            : [...state.completedTopicIds, id],
        })),

      setCurrent: (id) => set({ currentTopicId: id }),

      resetProgress: () => set({ completedTopicIds: [], currentTopicId: null }),
    }),
    { name: "quantum-circuit-lab.learner-progress" }
  )
);

interface ProgressSnapshot {
  completedTopicIds: string[];
  currentTopicId: string | null;
}

export function isTopicUnlocked(topic: RoadmapTopic, progress: ProgressSnapshot): boolean {
  return topic.prerequisites.every((id) => progress.completedTopicIds.includes(id));
}

export function getTopicStatus(topic: RoadmapTopic, progress: ProgressSnapshot): TopicStatus {
  if (progress.completedTopicIds.includes(topic.id)) return "completed";
  if (topic.id === progress.currentTopicId) return "current";
  if (isTopicUnlocked(topic, progress)) return "available";
  return "locked";
}

export function getOverallProgress(progress: ProgressSnapshot): { completed: number; total: number; percent: number } {
  const total = ALL_TOPICS.length;
  const completed = progress.completedTopicIds.length;
  return { completed, total, percent: total === 0 ? 0 : Math.round((completed / total) * 100) };
}

/** First topic, in roadmap order, that is unlocked and not yet completed —
 * what "Continue Learning" jumps to when there's no active topic. */
export function getRecommendedTopic(progress: ProgressSnapshot): RoadmapTopic | undefined {
  return ALL_TOPICS.find(
    (topic) => !progress.completedTopicIds.includes(topic.id) && isTopicUnlocked(topic, progress)
  );
}
