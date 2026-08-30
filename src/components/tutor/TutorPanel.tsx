import { useState, useCallback, useEffect, useRef } from "react";
import { useCircuitStore } from "../../state/circuit-store";
import { useUiStore } from "../../state/ui-store";
import { useTutorStore } from "../../state/tutor-store";
import { chatWithTutor } from "../../api/tutor-api";
import { formatMarkdown } from "../../utils/format-chat";

type TutorTab = "explain" | "steps" | "gates" | "chat";

const SUGGESTIONS = [
  "What is a qubit?",
  "Explain superposition",
  "How does entanglement work?",
  "What is a quantum gate?",
];

export function TutorPanel() {
  const hasErrors = useCircuitStore((s) => s.errors.length > 0);
  const hasGates = useCircuitStore((s) => s.circuit.operations.length > 0);
  const operations = useCircuitStore((s) => s.circuit.operations);
  const circuit = useCircuitStore((s) => s.circuit);

  const result = useTutorStore((s) => s.result);
  const error = useTutorStore((s) => s.error);
  const loading = useTutorStore((s) => s.loading);

  const chatMessages = useTutorStore((s) => s.chatMessages);
  const chatLoading = useTutorStore((s) => s.chatLoading);
  const chatError = useTutorStore((s) => s.chatError);
  const addChatMessage = useTutorStore((s) => s.addChatMessage);
  const setChatLoading = useTutorStore((s) => s.setChatLoading);
  const setChatError = useTutorStore((s) => s.setChatError);

  const stepData = useUiStore((s) => s.highlightedStepData);
  const highlightStep = useUiStore((s) => s.highlightStep);

  const [activeTab, setActiveTab] = useState<TutorTab>("explain");
  const [chatInput, setChatInput] = useState("");
  const activeStepIndex = stepData?.stepIndex ?? null;
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    highlightStep(null);
  }, [result, highlightStep]);

  useEffect(() => {
    if (activeStepIndex === null) return;
    const card = document.querySelector(`.tutor-step-card[data-step-index="${activeStepIndex}"]`);
    card?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeStepIndex]);

  useEffect(() => {
    if (activeTab === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatLoading, activeTab]);

  useEffect(() => {
    const container = chatMessagesRef.current;
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

  const getOpIdForStep = useCallback(
    (stepIndex: number, step: { opId?: string }) => {
      if (step.opId) return step.opId;
      const sorted = [...operations].sort((a, b) =>
        a.timeStep !== b.timeStep ? a.timeStep - b.timeStep : a.id.localeCompare(b.id)
      );
      return sorted[stepIndex]?.id ?? null;
    },
    [operations]
  );

  const handleStepClick = useCallback(
    (stepIndex: number, step: { opId?: string; gate: string; qubits: string; action: string }) => {
      if (activeStepIndex === stepIndex) {
        highlightStep(null);
        return;
      }
      const opId = getOpIdForStep(stepIndex, step);
      const totalSteps = result?.steps?.length ?? 0;
      highlightStep(opId, { gate: step.gate, qubits: step.qubits, action: step.action, stepIndex, totalSteps });

      if (opId) {
        requestAnimationFrame(() => {
          const el = document.querySelector(`[data-op-id="${opId}"]`);
          el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
        });
      }
    },
    [activeStepIndex, getOpIdForStep, highlightStep, result]
  );

  const handleChatSend = useCallback(async () => {
    const question = chatInput.trim();
    if (!question || chatLoading) return;

    setChatInput("");
    addChatMessage({ role: "user", content: question });
    setChatLoading(true);
    setChatError(null);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await chatWithTutor(
        question,
        circuit.operations.length > 0 ? circuit : null,
        chatMessages.concat({ role: "user", content: question }),
        controller.signal
      );
      addChatMessage({ role: "assistant", content: res.answer });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setChatError(err instanceof Error ? err.message : "Failed to get response");
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, chatLoading, chatMessages, circuit, addChatMessage, setChatLoading, setChatError]);

  const handleChatKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChatSend();
      }
    },
    [handleChatSend]
  );

  return (
    <section className="tutor-panel" id="wt-ai-tutor" aria-label="AI circuit tutor">
      <div className="probabilities-header">
        <h2 className="panel-title" style={{ margin: 0 }}>
          AI Tutor
        </h2>
        {result && (
          <span
            className={`tutor-badge${result.source === "deterministic" ? " is-deterministic" : ""}`}
            title={result.source === "deterministic" ? "No LLM configured — showing rule-based analysis" : "Powered by Groq"}
          >
            {result.source === "deterministic" ? "rule-based" : "AI"}
          </span>
        )}
      </div>

      <div className="probabilities-body tutor-body">
        {hasErrors && <p className="inspector-empty">Fix circuit validation errors to get tutor feedback.</p>}

        {!hasErrors && !hasGates && !result && activeTab !== "chat" && (
          <p className="inspector-empty">Add a gate to the circuit to get an explanation, warnings, and tips.</p>
        )}

        {!hasErrors && loading && !result && activeTab !== "chat" && <p className="inspector-empty">Analyzing circuit...</p>}

        {!hasErrors && error && activeTab !== "chat" && (
          <p className="sim-fallback-note" role="alert">
            {error}
          </p>
        )}

        {/* Tab navigation — always visible */}
        <div className="tutor-tabs" role="tablist">
          <button
            className={`tutor-tab${activeTab === "explain" ? " is-active" : ""}`}
            role="tab"
            aria-selected={activeTab === "explain"}
            onClick={() => setActiveTab("explain")}
          >
            Explanation
          </button>
          <button
            className={`tutor-tab${activeTab === "steps" ? " is-active" : ""}`}
            role="tab"
            aria-selected={activeTab === "steps"}
            onClick={() => setActiveTab("steps")}
          >
            Steps {result ? `(${result.steps?.length ?? 0})` : ""}
          </button>
          <button
            className={`tutor-tab${activeTab === "gates" ? " is-active" : ""}`}
            role="tab"
            aria-selected={activeTab === "gates"}
            onClick={() => setActiveTab("gates")}
          >
            Gate Defs {result ? `(${result.gateDefinitions?.length ?? 0})` : ""}
          </button>
          <button
            className={`tutor-tab${activeTab === "chat" ? " is-active" : ""}`}
            role="tab"
            aria-selected={activeTab === "chat"}
            onClick={() => setActiveTab("chat")}
          >
            Ask AI
          </button>
        </div>

        {!hasErrors && result && activeTab !== "chat" && (
          <div className={`tutor-sections${loading ? " is-refreshing" : ""}`}>
            {/* Algorithm detection banner */}
            {activeTab === "explain" && result.algorithm && !result.algorithm.startsWith("Custom") && (
              <div className="tutor-algorithm-banner">
                <span className="tutor-algorithm-icon">&#x1F9EC;</span>
                <span>{result.algorithm}</span>
              </div>
            )}

            {/* Explanation tab */}
            {activeTab === "explain" && (
              <>
                <div className="tutor-section">
                  <p className="tutor-section-text">{result.explanation}</p>
                </div>

                <div className={`tutor-section${result.warning.detected ? " is-warning" : ""}`}>
                  <h3 className="tutor-section-title">Conceptual Warning</h3>
                  {result.warning.detected ? (
                    <p className="tutor-section-text">{result.warning.message}</p>
                  ) : (
                    <p className="tutor-section-text tutor-section-muted">No conceptual issues detected.</p>
                  )}
                </div>

                <div className="tutor-section">
                  <h3 className="tutor-section-title">Optimization</h3>
                  <p className="tutor-section-text">{result.optimization}</p>
                </div>
              </>
            )}

            {/* Steps tab */}
            {activeTab === "steps" && (
              <div className="tutor-steps">
                {activeStepIndex !== null && (
                  <button
                    className="tutor-clear-highlight"
                    onClick={() => highlightStep(null)}
                  >
                    Clear highlight
                  </button>
                )}
                {result.steps && result.steps.length > 0 ? (
                  result.steps.map((s, i) => (
                    <div
                      key={s.step}
                      data-step-index={i}
                      className={`tutor-step-card${activeStepIndex === i ? " is-active-step" : ""}`}
                      onClick={() => handleStepClick(i, s)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleStepClick(i, s); } }}
                      title="Click to highlight this gate on the circuit"
                    >
                      <div className="tutor-step-header">
                        <span className="tutor-step-number">{s.step}</span>
                        <span className="tutor-step-gate">{s.gate}</span>
                        <span className="tutor-step-qubits">{s.qubits}</span>
                        {activeStepIndex === i && <span className="tutor-step-indicator" aria-label="Highlighted on canvas" />}
                      </div>
                      <p className="tutor-step-action">{s.action}</p>
                      <p className="tutor-step-state">
                        State: <code>{s.stateAfter}</code>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="tutor-section-muted">No steps to display.</p>
                )}
              </div>
            )}

            {/* Gate definitions tab */}
            {activeTab === "gates" && (
              <div className="tutor-gate-defs">
                {result.gateDefinitions && result.gateDefinitions.length > 0 ? (
                  result.gateDefinitions.map((g) => (
                    <div key={g.gate} className="tutor-gate-card">
                      <h4 className="tutor-gate-name">{g.gate}</h4>
                      <p className="tutor-gate-def">{g.definition}</p>
                      {g.matrix && (
                        <code className="tutor-gate-matrix">{g.matrix}</code>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="tutor-section-muted">No gate definitions to display.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Ask AI chat tab */}
        {activeTab === "chat" && (
          <div className="tutor-chat-container">
            <div className="tutor-chat-messages" ref={chatMessagesRef}>
              {chatMessages.length === 0 && !chatLoading && (
                <div className="tutor-chat-welcome">
                  <p className="tutor-chat-welcome-title">Ask me anything</p>
                  <p className="tutor-chat-welcome-sub">
                    Quantum computing, gates, algorithms, or CS concepts.
                  </p>
                  <div className="tutor-chat-suggestions">
                    {SUGGESTIONS.map((q) => (
                      <button
                        key={q}
                        className="tutor-chat-suggestion"
                        onClick={() => setChatInput(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`tutor-chat-msg is-${msg.role}`}>
                  <div className="tutor-chat-msg-label">{msg.role === "user" ? "You" : "AI Tutor"}</div>
                  <div
                    className="tutor-chat-msg-content"
                    dangerouslySetInnerHTML={
                      msg.role === "assistant" ? { __html: formatMarkdown(msg.content, { showApplyButtons: true }) } : undefined
                    }
                  >
                    {msg.role === "user" ? msg.content : undefined}
                  </div>
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
              <div ref={chatEndRef} />
            </div>

            <div className="tutor-chat-input-bar">
              <input
                type="text"
                className="tutor-chat-input"
                placeholder="Ask about quantum concepts..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleChatKeyDown}
                disabled={chatLoading}
                autoFocus
              />
              <button
                type="button"
                className="tutor-chat-send"
                onClick={handleChatSend}
                disabled={!chatInput.trim() || chatLoading}
                aria-label="Send message"
              >
                &#x27A4;
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
