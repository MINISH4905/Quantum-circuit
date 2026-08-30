import { create } from "zustand";
import type { TutorAnalysis, ChatMessage, SourceInfo } from "../api/tutor-api";

interface TutorState {
  result: TutorAnalysis | null;
  error: string | null;
  loading: boolean;
  chatMessages: ChatMessage[];
  chatLoading: boolean;
  chatError: string | null;
  isStreaming: boolean;
  streamingContent: string;
  streamingSources: SourceInfo[];
  streamingConfidence: number;
  setResult: (result: TutorAnalysis | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  addChatMessage: (msg: ChatMessage) => void;
  setChatLoading: (loading: boolean) => void;
  setChatError: (error: string | null) => void;
  clearChat: () => void;
  startStreaming: () => void;
  appendStreamToken: (token: string) => void;
  setStreamingSources: (sources: SourceInfo[]) => void;
  setStreamingConfidence: (score: number) => void;
  finalizeStream: () => void;
}

export const useTutorStore = create<TutorState>((set, get) => ({
  result: null,
  error: null,
  loading: false,
  chatMessages: [],
  chatLoading: false,
  chatError: null,
  isStreaming: false,
  streamingContent: "",
  streamingSources: [],
  streamingConfidence: 0,
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  addChatMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  setChatLoading: (loading) => set({ chatLoading: loading }),
  setChatError: (error) => set({ chatError: error }),
  clearChat: () => set({ chatMessages: [], chatError: null }),
  startStreaming: () => set({ isStreaming: true, streamingContent: "", streamingSources: [], streamingConfidence: 0 }),
  appendStreamToken: (token) => set((s) => ({ streamingContent: s.streamingContent + token })),
  setStreamingSources: (sources) => set({ streamingSources: sources }),
  setStreamingConfidence: (score) => set({ streamingConfidence: score }),
  finalizeStream: () => {
    const { streamingContent, streamingSources, streamingConfidence } = get();
    set((s) => ({
      chatMessages: [...s.chatMessages, {
        role: "assistant" as const,
        content: streamingContent,
        sources: streamingSources,
        confidenceScore: streamingConfidence || undefined,
      }],
      isStreaming: false,
      streamingContent: "",
      streamingSources: [],
      streamingConfidence: 0,
    }));
  },
}));
