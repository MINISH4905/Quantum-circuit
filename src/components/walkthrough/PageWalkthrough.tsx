import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { hasSeenWalkthrough, useWalkthroughStore } from "../../state/walkthrough-store";
import { WALKTHROUGH_STEPS, type WalkthroughPlacement } from "./steps";

const MARGIN = 12;
const SPOTLIGHT_PADDING = 6;
const TOOLTIP_WIDTH = 320;
const TOOLTIP_EST_HEIGHT = 190;

interface TooltipRect {
  top: number;
  left: number;
  width: number;
}

function computeTooltipPos(rect: DOMRect | null, placement: WalkthroughPlacement): TooltipRect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(TOOLTIP_WIDTH, vw - MARGIN * 2);

  if (!rect) {
    return { top: (vh - TOOLTIP_EST_HEIGHT) / 2, left: (vw - width) / 2, width };
  }

  let top: number;
  let left: number;
  switch (placement) {
    case "bottom":
      top = rect.bottom + MARGIN;
      left = rect.left + rect.width / 2 - width / 2;
      break;
    case "top":
      top = rect.top - MARGIN - TOOLTIP_EST_HEIGHT;
      left = rect.left + rect.width / 2 - width / 2;
      break;
    case "left":
      top = rect.top + rect.height / 2 - TOOLTIP_EST_HEIGHT / 2;
      left = rect.left - MARGIN - width;
      break;
    case "right":
    default:
      top = rect.top + rect.height / 2 - TOOLTIP_EST_HEIGHT / 2;
      left = rect.right + MARGIN;
      break;
  }

  left = Math.min(Math.max(left, MARGIN), vw - width - MARGIN);
  top = Math.min(Math.max(top, MARGIN), vh - MARGIN - 40);
  return { top, left, width };
}

/** Single reusable onboarding tour for the Interactive Circuits page. Used both
 * for the first-time auto-launch and for the Help → "Take a Tour" restart. */
export function PageWalkthrough() {
  const isOpen = useWalkthroughStore((s) => s.isOpen);
  const stepIndex = useWalkthroughStore((s) => s.stepIndex);
  const start = useWalkthroughStore((s) => s.start);
  const dismiss = useWalkthroughStore((s) => s.dismiss);
  const setStep = useWalkthroughStore((s) => s.setStep);

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasSeenWalkthrough()) {
      const id = window.setTimeout(() => start(), 400);
      return () => window.clearTimeout(id);
    }
  }, [start]);

  const step = WALKTHROUGH_STEPS[stepIndex];
  const isLast = stepIndex === WALKTHROUGH_STEPS.length - 1;
  const isFirst = stepIndex === 0;

  const measureTarget = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(step.target);
    setTargetRect(el ? el.getBoundingClientRect() : null);
  }, [step]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    measureTarget();
  }, [isOpen, measureTarget]);

  useEffect(() => {
    if (!isOpen) return;
    const onReflow = () => measureTarget();
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);
    return () => {
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow, true);
    };
  }, [isOpen, measureTarget]);

  useEffect(() => {
    if (!isOpen) return;
    tooltipRef.current?.focus();
  }, [isOpen, stepIndex]);

  const handleNext = useCallback(() => {
    if (isLast) {
      dismiss();
    } else {
      setStep(stepIndex + 1);
    }
  }, [isLast, dismiss, setStep, stepIndex]);

  const handleBack = useCallback(() => {
    if (!isFirst) setStep(stepIndex - 1);
  }, [isFirst, setStep, stepIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss();
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleBack();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, dismiss, handleNext, handleBack]);

  const pos = step ? computeTooltipPos(targetRect, step.placement) : null;

  useLayoutEffect(() => {
    if (!isOpen || !pos) return;
    const el = tooltipRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const clampedTop = Math.min(Math.max(pos.top, MARGIN), Math.max(MARGIN, vh - MARGIN - rect.height));
    const clampedLeft = Math.min(Math.max(pos.left, MARGIN), Math.max(MARGIN, vw - MARGIN - rect.width));
    // Correct synchronously, before paint, using measured height/width instead of
    // the fixed estimate — avoids the tooltip landing off-screen for very tall/short targets.
    el.style.top = `${clampedTop}px`;
    el.style.left = `${clampedLeft}px`;
  });

  if (!isOpen || !step || !pos) return null;

  return (
    <div className="walkthrough-root" aria-live="polite">
      {targetRect ? (
        <div
          className="walkthrough-spotlight"
          style={{
            top: targetRect.top - SPOTLIGHT_PADDING,
            left: targetRect.left - SPOTLIGHT_PADDING,
            width: targetRect.width + SPOTLIGHT_PADDING * 2,
            height: targetRect.height + SPOTLIGHT_PADDING * 2,
          }}
        />
      ) : (
        <div className="walkthrough-backdrop" />
      )}

      <div
        ref={tooltipRef}
        className="walkthrough-tooltip"
        style={{ top: pos.top, left: pos.left, width: pos.width }}
        role="dialog"
        aria-modal="false"
        aria-labelledby="walkthrough-title"
        aria-describedby="walkthrough-desc"
        tabIndex={-1}
      >
        <div className="walkthrough-step-indicator">
          {stepIndex + 1} of {WALKTHROUGH_STEPS.length}
        </div>
        <h3 id="walkthrough-title" className="walkthrough-title">
          {step.title}
        </h3>
        <p id="walkthrough-desc" className="walkthrough-desc">
          {step.description}
        </p>
        <div className="walkthrough-actions">
          <button type="button" className="walkthrough-skip" onClick={dismiss}>
            Skip
          </button>
          <div className="walkthrough-nav-btns">
            {!isFirst && (
              <button type="button" onClick={handleBack}>
                Back
              </button>
            )}
            <button type="button" className="walkthrough-primary" onClick={handleNext}>
              {isLast ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
