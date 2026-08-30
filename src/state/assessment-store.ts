import { create } from "zustand";
import { persist } from "zustand/middleware";
import { postAttempt, type AttemptPayload } from "../api/assessments-api";

// Assessment results, keyed by concept.sourceFile (globally unique — see the
// sourceFile-vs-id note in src/pages/learning-center/useLearningProgress.ts).
//
// Local-first: every attempt lands in localStorage immediately so grading keeps
// working when signed out or when the backend is down, and is *also* POSTed to
// the backend so it counts towards the student's tracked progress and shows up
// on the instructor dashboard. A failed POST is intentionally swallowed — the
// learner still sees their mark.

export interface BestScore {
  score: number;
  maxScore: number;
  attempts: number;
  updatedAt: string;
}

interface QuizAttemptInput {
  sourceFile: string;
  conceptTitle: string;
  score: number;
  maxScore: number;
  answers: Array<{ index: number; id: string; chosen: string | null }>;
}

interface ChallengeAttemptInput {
  sourceFile: string;
  conceptTitle: string;
  challengeId: string;
  passed: boolean;
  code: string;
}

interface AssessmentState {
  /** sourceFile → best quiz score so far. */
  bestScores: Record<string, BestScore>;
  /** `${sourceFile}::${challengeId}` → true once passed. */
  passedChallenges: Record<string, true>;
  /** `${sourceFile}::${challengeId}` → last code the learner checked. */
  challengeCode: Record<string, string>;

  recordQuizAttempt: (input: QuizAttemptInput) => void;
  recordChallengeAttempt: (input: ChallengeAttemptInput) => void;
  saveChallengeCode: (sourceFile: string, challengeId: string, code: string) => void;

  bestQuizScore: (sourceFile: string) => BestScore | null;
  isChallengePassed: (sourceFile: string, challengeId: string) => boolean;
  getChallengeCode: (sourceFile: string, challengeId: string) => string | null;
}

const challengeKey = (sourceFile: string, challengeId: string) => `${sourceFile}::${challengeId}`;

/** Fire-and-forget backend sync. Anonymous users get a 401 and unconfigured /
 * offline backends get a network error; both are expected, so neither is
 * surfaced — the local record is the source of truth for the UI. */
function syncAttempt(payload: AttemptPayload) {
  void postAttempt(payload).catch(() => {
    /* offline or signed out — local progress already saved */
  });
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      bestScores: {},
      passedChallenges: {},
      challengeCode: {},

      recordQuizAttempt: ({ sourceFile, conceptTitle, score, maxScore, answers }) => {
        set((state) => {
          const previous = state.bestScores[sourceFile];
          const attempts = (previous?.attempts ?? 0) + 1;
          // Best score is kept, not the latest — retries can never lose marks.
          const keepPrevious = previous !== undefined && previous.score >= score;
          return {
            bestScores: {
              ...state.bestScores,
              [sourceFile]: {
                score: keepPrevious ? previous.score : score,
                maxScore,
                attempts,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });

        syncAttempt({
          source_file: sourceFile,
          concept_title: conceptTitle,
          kind: "quiz",
          challenge_id: null,
          score,
          max_score: maxScore,
          passed: maxScore > 0 && score === maxScore,
          answers,
        });
      },

      recordChallengeAttempt: ({ sourceFile, conceptTitle, challengeId, passed, code }) => {
        if (passed) {
          set((state) => ({
            passedChallenges: { ...state.passedChallenges, [challengeKey(sourceFile, challengeId)]: true as const },
          }));
        }

        syncAttempt({
          source_file: sourceFile,
          concept_title: conceptTitle,
          kind: "challenge",
          challenge_id: challengeId,
          score: passed ? 1 : 0,
          max_score: 1,
          passed,
          answers: { code },
        });
      },

      saveChallengeCode: (sourceFile, challengeId, code) =>
        set((state) => ({
          challengeCode: { ...state.challengeCode, [challengeKey(sourceFile, challengeId)]: code },
        })),

      bestQuizScore: (sourceFile) => get().bestScores[sourceFile] ?? null,
      isChallengePassed: (sourceFile, challengeId) => !!get().passedChallenges[challengeKey(sourceFile, challengeId)],
      getChallengeCode: (sourceFile, challengeId) => get().challengeCode[challengeKey(sourceFile, challengeId)] ?? null,
    }),
    {
      name: "quantum-circuit-lab.assessments",
      // Selectors are derived from state, so only the data is persisted.
      partialize: (state) => ({
        bestScores: state.bestScores,
        passedChallenges: state.passedChallenges,
        challengeCode: state.challengeCode,
      }),
    }
  )
);
