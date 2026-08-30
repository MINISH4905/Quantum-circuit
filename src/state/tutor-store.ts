import { create } from "zustand";
import type { TutorAnalysis, ChatMessage } from "../api/tutor-api";

interface TutorState {
  result: TutorAnalysis | null;
  error: string | null;
  loading: boolean;
  chatMessages: ChatMessage[];
  chatLoading: boolean;
  chatError: string | null;
  setResult: (result: TutorAnalysis | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  addChatMessage: (msg: ChatMessage) => void;
  setChatLoading: (loading: boolean) => void;
  setChatError: (error: string | null) => void;
  clearChat: () => void;
}

export const useTutorStore = create<TutorState>((set) => ({
  result: null,
  error: null,
  loading: false,
  chatMessages: [],
  chatLoading: false,
  chatError: null,
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  addChatMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  setChatLoading: (loading) => set({ chatLoading: loading }),
  setChatError: (error) => set({ chatError: error }),
  clearChat: () => set({ chatMessages: [], chatError: null }),
}));
