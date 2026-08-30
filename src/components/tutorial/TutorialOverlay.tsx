import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useTutorialStore } from "../../state/tutorial-store";
import { useCircuitStore } from "../../state/circuit-store";
import { getGate } from "../../circuit/gate-registry/registry";
import { createEmptyCircuit } from "../../circuit/model/types";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function getElementRect(selector: string): Rect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}

export function TutorialOverlay() {
  const status = useTutorialStore((s) => s.status);
  const tutorial = useTutorialStore((s) => s.tutorial);
  const stepIndex = useTutorialStore((s) => s.currentStepIndex);
  const errorHint = useTutorialStore((s) => s.errorHint);
  const currentStep = useTutorialStore((s) => s.currentStep);
  const totalSteps = useTutorialStore((s) => s.totalSteps);
  const restart = useTutorialStore((s) => s.restart);
  const exit = useTutorialStore((s) => s.exit);

  const setCircuit = useCircuitStore((s) => s.setCircuit);
  const setCircuitName = useCircuitStore((s) => s.setName);
  const addOperation = useCircuitStore((s) => s.addOperation);

  const [sourceRect, setSourceRect] = useState<Rect | null>(null);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const step = currentStep();
  const total = totalSteps();

  const measure = useCallback(() => {
    if (!step) {
      setSourceRect(null);
      setTargetRect(null);
      return;
    }
    setSourceRect(getElementRect(`[data-gate-id="${step.gateId}"]`));
    const targetQubit = step.controls?.[0] ?? step.targets[0];
    setTargetRect(
      getElementRect(`[data-qubit="${targetQubit}"][data-timestep="${step.timeStep}"]`)
    );
  }, [step]);

  useEffect(() => {
    if (status === "idle" || status === "complete") return;
    measure();
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [status, stepIndex, measure]);

  const handleSkip = useCallback(() => {
    if (!step) return;
    const gate = getGate(step.gateId);
    if (!gate) return;
    addOperation({
      gate: step.gateId,
      targets: step.targets,
      controls: step.controls?.length ? step.controls : undefined,
      timeStep: step.timeStep,
      parameters: gate.parameterCount > 0 ? Array(gate.parameterCount).fill(Math.PI / 2) : undefined,
    });
  }, [step, addOperation]);

  const handleRestart = useCallback(() => {
    if (!tutorial) return;
    setCircuit(createEmptyCircuit(tutorial.qubits, tutorial.classicalBits));
    setCircuitName(`${tutorial.title} (Tutorial)`);
    restart();
  }, [tutorial, setCircuit, setCircuitName, restart]);

  const handleTryAnother = useCallback(() => {
    exit();
  }, [exit]);

  if (status === "idle") return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pad = 6;
  const isError = status === "step-error";
  const isSuccess = status === "step-success";
  const isComplete = status === "complete";
  const progress = isComplete ? 100 : ((stepIndex) / total) * 100;

  return createPortal(
    <div
      className={`tutorial-overlay${isError ? " is-error" : ""}${isSuccess ? " is-success" : ""}`}
      aria-hidden="true"
    >
      {!isComplete && (
        <>
          <svg
            className="tutorial-overlay-svg"
            viewBox={`0 0 ${vw} ${vh}`}
            preserveAspectRatio="none"
            width={vw}
            height={vh}
          >
            <defs>
              <mask id="tut-mask">
                <rect width={vw} height={vh} fill="white" />
                {sourceRect && (
                  <rect
                    x={sourceRect.x - pad}
                    y={sourceRect.y - pad}
                    width={sourceRect.w + pad * 2}
                    height={sourceRect.h + pad * 2}
                    rx="8"
                    fill="black"
                  />
                )}
                {targetRect && (
                  <rect
                    x={targetRect.x - pad}
                    y={targetRect.y - pad}
                    width={targetRect.w + pad * 2}
                    height={targetRect.h + pad * 2}
                    rx="6"
                    fill="black"
                  />
                )}
                {cardRef.current && (() => {
                  const cr = cardRef.current!.getBoundingClientRect();
                  return (
                    <rect
                      x={cr.left - 4}
                      y={cr.top - 4}
                      width={cr.width + 8}
                      height={cr.height + 8}
                      rx="12"
                      fill="black"
                    />
                  );
                })()}
              </mask>
            </defs>
            <rect width={vw} height={vh} fill="rgba(0,0,0,0.55)" mask="url(#tut-mask)" />
          </svg>

          {sourceRect && (
            <div
              className="tutorial-highlight-pulse is-source"
              style={{
                left: sourceRect.x - pad,
                top: sourceRect.y - pad,
                width: sourceRect.w + pad * 2,
                height: sourceRect.h + pad * 2,
              }}
            />
          )}
          {targetRect && (
            <div
              className="tutorial-highlight-pulse is-target"
              style={{
                left: targetRect.x - pad,
                top: targetRect.y - pad,
                width: targetRect.w + pad * 2,
                height: targetRect.h + pad * 2,
              }}
            />
          )}
        </>
      )}

      {!isComplete && (
        <div ref={cardRef} className="tutorial-instruction" onClick={(e) => e.stopPropagation()}>
          <div className="tutorial-progress-bar">
            <div className="tutorial-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="tutorial-step-counter">
            Step {stepIndex + 1} of {total}
          </div>
          <p className="tutorial-instruction-text">{step?.instruction}</p>
          {isError && errorHint && (
            <p className="tutorial-hint-text">{errorHint}</p>
          )}
          {isSuccess && (
            <p className="tutorial-success-text">Correct!</p>
          )}
          <div className="tutorial-controls">
            <button type="button" className="tutorial-ctrl-btn" onClick={handleSkip} disabled={isError || isSuccess}>
              Skip
            </button>
            <button type="button" className="tutorial-ctrl-btn" onClick={handleRestart}>
              Restart
            </button>
            <button type="button" className="tutorial-ctrl-btn is-exit" onClick={exit}>
              Exit
            </button>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="tutorial-completion" onClick={(e) => e.stopPropagation()}>
          <h2 className="tutorial-completion-title">
            You built the {tutorial?.title}!
          </h2>
          <p className="tutorial-completion-message">{tutorial?.completionMessage}</p>
          <div className="tutorial-completion-actions">
            <button type="button" className="tutorial-ctrl-btn is-primary" onClick={exit}>
              Keep Exploring
            </button>
            <button type="button" className="tutorial-ctrl-btn" onClick={handleTryAnother}>
              Try Another
            </button>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
