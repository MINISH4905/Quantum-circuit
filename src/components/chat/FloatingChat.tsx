import { useState, useCallback, useEffect, useRef } from "react";
import { useTutorStore } from "../../state/tutor-store";
import { chatWithTutor } from "../../api/tutor-api";
import type { SourceInfo } from "../../api/tutor-api";
import { formatMarkdown } from "../../utils/format-chat";
import "./FloatingChat.css";

const SUGGESTIONS = [
  "What is a qubit?",
  "Explain superposition",
  "How does entanglement work?",
  "What is a quantum gate?",
];

function confidenceBadge(score: number | undefined) {
  if (score == null || score <= 0) return null;
  const level = score >= 0.8 ? "high" : score >= 0.5 ? "medium" : "low";
  const label = score >= 0.8 ? "High" : score >= 0.5 ? "Medium" : "Low";
  return (
    <span className={`tutor-confidence is-${level}`} title={`Confidence: ${Math.round(score * 100)}%`}>
      {label} {Math.round(score * 100)}%
    </span>
  );
}

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const chatMessages = useTutorStore((s) => s.chatMessages);
  const chatLoading = useTutorStore((s) => s.chatLoading);
  const chatError = useTutorStore((s) => s.chatError);
  const addChatMessage = useTutorStore((s) => s.addChatMessage);
  const setChatLoading = useTutorStore((s) => s.setChatLoading);
  const setChatError = useTutorStore((s) => s.setChatError);

  const [expandedSources, setExpandedSources] = useState<Record<number, boolean>>({});

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    const handleClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-code-action]");
      if (!btn) return;
      const codeBlock = btn.closest<HTMLElement>(".tutor-chat-code-wrap");
      const code = codeBlock?.querySelector("code")?.textContent ?? "";
      if (btn.dataset.codeAction === "copy") {
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = "Copied!";
          setTimeout(() => { btn.textContent = "Copy"; }, 1500);
        });
      }
    };
    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, []);

  const handleSend = useCallback(async () => {
    const question = input.trim();
    if (!question || chatLoading) return;

    setInput("");
    addChatMessage({ role: "user", content: question });
    setChatLoading(true);
    setChatError(null);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const resp = await chatWithTutor(
        question,
        null,
        chatMessages.concat({ role: "user", content: question }),
        controller.signal,
      );
      addChatMessage({ role: "assistant", content: resp.answer, sources: resp.sources, confidenceScore: resp.confidence_score });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setChatError(err instanceof Error ? err.message : "Failed to get response");
    } finally {
      setChatLoading(false);
    }
  }, [input, chatLoading, chatMessages, addChatMessage, setChatLoading, setChatError]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  // Show on all pages including dashboard

  return (
    <>
      <button
        className={`floating-chat-fab${open ? " is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Ask AI"}
        title="Ask AI"
      >
        {open ? "✕" : "\u{1F4AC}"}
      </button>

      {open && (
        <div className="floating-chat-panel">
          <div className="floating-chat-header">
            <span className="floating-chat-header-title">
              <span className="floating-chat-header-dot" />
              Ask AI
            </span>
            <button className="floating-chat-close" onClick={() => setOpen(false)} aria-label="Close">
              &times;
            </button>
          </div>

          <div className="floating-chat-messages" ref={messagesRef}>
            {chatMessages.length === 0 && !chatLoading && (
              <div className="tutor-chat-welcome">
                <p className="tutor-chat-welcome-title">Ask me anything</p>
                <p className="tutor-chat-welcome-sub">
                  Questions about quantum computing, gates, algorithms, or concepts.
                </p>
                <div className="tutor-chat-suggestions">
                  {SUGGESTIONS.map((q) => (
                    <button key={q} className="tutor-chat-suggestion" onClick={() => setInput(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`tutor-chat-msg is-${msg.role}`}>
                <div className="tutor-chat-msg-label">
                  {msg.role === "user" ? "You" : "AI Tutor"}
                  {msg.role === "assistant" && confidenceBadge(msg.confidenceScore)}
                </div>
                <div
                  className="tutor-chat-msg-content"
                  dangerouslySetInnerHTML={
                    msg.role === "assistant" ? { __html: formatMarkdown(msg.content, { showApplyButtons: false }) } : undefined
                  }
                >
                  {msg.role === "user" ? msg.content : undefined}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="tutor-chat-sources">
                    <button
                      className="tutor-chat-sources-toggle"
                      onClick={() => setExpandedSources((prev) => ({ ...prev, [i]: !prev[i] }))}
                    >
                      Sources ({msg.sources.length}) {expandedSources[i] ? "▾" : "▸"}
                    </button>
                    {expandedSources[i] && (
                      <ul className="tutor-chat-sources-list">
                        {msg.sources.map((s: SourceInfo) => (
                          <li key={s.index} className="tutor-chat-source-item">
                            <span className="tutor-source-ref">[{s.index}]</span>
                            {s.url ? (
                              <a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a>
                            ) : (
                              <span>{s.title}</span>
                            )}
                            {s.framework && <span className="tutor-source-badge">{s.framework}</span>}
                            {s.doc_type && <span className="tutor-source-badge is-type">{s.doc_type}</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
            {chatLoading && (
              <div className="tutor-chat-msg is-assistant">
                <div className="tutor-chat-msg-label">AI Tutor</div>
                <div className="tutor-chat-msg-content tutor-chat-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            {chatError && <div className="tutor-chat-error">{chatError}</div>}
            <div ref={endRef} />
          </div>

          <div className="floating-chat-input-bar">
            <input
              type="text"
              className="floating-chat-input"
              placeholder="Ask about quantum concepts..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={chatLoading}
              autoFocus
            />
            <button
              type="button"
              className="floating-chat-send"
              onClick={handleSend}
              disabled={!input.trim() || chatLoading}
              aria-label="Send message"
            >
              &#x27A4;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
