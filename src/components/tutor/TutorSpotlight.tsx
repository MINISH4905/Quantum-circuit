import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useUiStore } from "../../state/ui-store";
import { useTutorStore } from "../../state/tutor-store";
import { useCircuitStore } from "../../state/circuit-store";

interface Rect { x: number; y: number; w: number; h: number }

type Placement = "right" | "left" | "below" | "above";

const CARD_W = 260;
const CARD_H_EST = 155;
const GAP = 18;
const VIEWPORT_PAD = 12;

function pickPlacement(gate: Rect): Placement {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const spaceRight = vw - (gate.x + gate.w) - VIEWPORT_PAD;
  const spaceLeft = gate.x - VIEWPORT_PAD;
  const spaceBelow = vh - (gate.y + gate.h) - VIEWPORT_PAD;
  const spaceAbove = gate.y - VIEWPORT_PAD;

  if (spaceRight >= CARD_W + GAP) return "right";
  if (spaceLeft >= CARD_W + GAP) return "left";
  if (spaceBelow >= CARD_H_EST + GAP) return "below";
  if (spaceAbove >= CARD_H_EST + GAP) return "above";
  return "right";
}

function cardPosition(gate: Rect, placement: Placement): { left: number; top: number } {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const gcx = gate.x + gate.w / 2;
  const gcy = gate.y + gate.h / 2;

  let left: number;
  let top: number;

  switch (placement) {
    case "right":
      left = gate.x + gate.w + GAP;
      top = gcy - CARD_H_EST / 2;
      break;
    case "left":
      left = gate.x - GAP - CARD_W;
      top = gcy - CARD_H_EST / 2;
      break;
    case "below":
      left = gcx - CARD_W / 2;
      top = gate.y + gate.h + GAP;
      break;
    case "above":
      left = gcx - CARD_W / 2;
      top = gate.y - GAP - CARD_H_EST;
      break;
  }

  left = Math.max(VIEWPORT_PAD, Math.min(left, vw - CARD_W - VIEWPORT_PAD));
  top = Math.max(VIEWPORT_PAD, Math.min(top, vh - CARD_H_EST - VIEWPORT_PAD));
  return { left, top };
}

function connectorPath(gate: Rect, card: Rect, placement: Placement): string {
  const gcx = gate.x + gate.w / 2;
  const gcy = gate.y + gate.h / 2;

  let sx: number, sy: number, ex: number, ey: number;

  switch (placement) {
    case "right":
      sx = gate.x + gate.w + 4;
      sy = gcy;
      ex = card.x - 2;
      ey = card.y + card.h / 2;
      break;
    case "left":
      sx = gate.x - 4;
      sy = gcy;
      ex = card.x + card.w + 2;
      ey = card.y + card.h / 2;
      break;
    case "below":
      sx = gcx;
      sy = gate.y + gate.h + 4;
      ex = card.x + card.w / 2;
      ey = card.y - 2;
      break;
    case "above":
      sx = gcx;
      sy = gate.y - 4;
      ex = card.x + card.w / 2;
      ey = card.y + card.h + 2;
      break;
  }

  const dx = ex - sx;
  const dy = ey - sy;

  if (placement === "right" || placement === "left") {
    const cpx = dx * 0.4;
    return `M${sx},${sy} C${sx + cpx},${sy} ${ex - cpx},${ey} ${ex},${ey}`;
  } else {
    const cpy = dy * 0.4;
    return `M${sx},${sy} C${sx},${sy + cpy} ${ex},${ey - cpy} ${ex},${ey}`;
  }
}

export function TutorSpotlight() {
  const highlightedOpId = useUiStore((s) => s.highlightedOpId);
  const stepData = useUiStore((s) => s.highlightedStepData);
  const highlightStep = useUiStore((s) => s.highlightStep);
  const tutorSteps = useTutorStore((s) => s.result?.steps);
  const operations = useCircuitStore((s) => s.circuit.operations);

  const [gateRect, setGateRect] = useState<Rect | null>(null);
  const [cardRect, setCardRect] = useState<Rect | null>(null);
  const [placement, setPlacement] = useState<Placement>("right");
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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

  const navigateStep = useCallback(
    (direction: -1 | 1) => {
      if (!tutorSteps || !stepData) return;
      const newIndex = stepData.stepIndex + direction;
      if (newIndex < 0 || newIndex >= tutorSteps.length) return;
      const newStep = tutorSteps[newIndex];
      const opId = getOpIdForStep(newIndex, newStep);
      highlightStep(opId, {
        gate: newStep.gate,
        qubits: newStep.qubits,
        action: newStep.action,
        stepIndex: newIndex,
        totalSteps: tutorSteps.length,
      });
      if (opId) {
        requestAnimationFrame(() => {
          const el = document.querySelector(`[data-op-id="${opId}"]`);
          el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
        });
      }
    },
    [tutorSteps, stepData, getOpIdForStep, highlightStep]
  );

  const measure = useCallback(() => {
    if (!highlightedOpId) {
      setGateRect(null);
      setCardRect(null);
      setVisible(false);
      return;
    }
    const gateEl = document.querySelector(`[data-op-id="${highlightedOpId}"]`);
    if (!gateEl) {
      setGateRect(null);
      setCardRect(null);
      setVisible(false);
      return;
    }

    const markers = gateEl.querySelectorAll(".gate-marker");
    let gr: Rect;
    if (markers.length > 0) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      markers.forEach((m) => {
        const mr = m.getBoundingClientRect();
        minX = Math.min(minX, mr.left);
        minY = Math.min(minY, mr.top);
        maxX = Math.max(maxX, mr.right);
        maxY = Math.max(maxY, mr.bottom);
      });
      gr = { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
    } else {
      const r = gateEl.getBoundingClientRect();
      gr = { x: r.left, y: r.top, w: r.width, h: r.height };
    }
    setGateRect(gr);

    const pl = pickPlacement(gr);
    setPlacement(pl);

    requestAnimationFrame(() => {
      if (cardRef.current) {
        const cr = cardRef.current.getBoundingClientRect();
        setCardRect({ x: cr.left, y: cr.top, w: cr.width, h: cr.height });
      }
      setVisible(true);
    });
  }, [highlightedOpId]);

  useEffect(() => {
    if (!highlightedOpId) {
      setGateRect(null);
      setCardRect(null);
      setVisible(false);
      return;
    }
    setVisible(false);
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [highlightedOpId, measure]);

  useEffect(() => {
    if (!highlightedOpId) return;
    function onMouseDown(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest(".tutor-step-card") || target.closest(".tutor-clear-highlight") || target.closest(".tutor-callout")) return;
      highlightStep(null);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [highlightedOpId, highlightStep]);

  useEffect(() => {
    if (!highlightedOpId) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") highlightStep(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [highlightedOpId, highlightStep]);

  if (!highlightedOpId || !gateRect || !stepData) return null;

  const pad = 14;
  const gSpot = {
    x: gateRect.x - pad,
    y: gateRect.y - pad,
    w: gateRect.w + pad * 2,
    h: gateRect.h + pad * 2,
  };

  const cPos = cardPosition(gateRect, placement);
  const cardEstRect: Rect = cardRect ?? { x: cPos.left, y: cPos.top, w: CARD_W, h: CARD_H_EST };
  const cSpotPad = 6;
  const cSpot = {
    x: cardEstRect.x - cSpotPad,
    y: cardEstRect.y - cSpotPad,
    w: cardEstRect.w + cSpotPad * 2,
    h: cardEstRect.h + cSpotPad * 2,
  };

  const arrow = connectorPath(gateRect, cardEstRect, placement);

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const hasPrev = stepData.stepIndex > 0;
  const hasNext = stepData.stepIndex < stepData.totalSteps - 1;

  return createPortal(
    <div className="tutor-spotlight-overlay" aria-hidden="true">
      {/* SVG: dim layer + glow ring + short arrow */}
      <svg
        className="tutor-spotlight-svg"
        viewBox={`0 0 ${vw} ${vh}`}
        preserveAspectRatio="none"
        width={vw}
        height={vh}
      >
        <defs>
          <mask id="ts-mask">
            <rect width={vw} height={vh} fill="white" />
            <rect x={gSpot.x} y={gSpot.y} width={gSpot.w} height={gSpot.h} rx="8" fill="black" />
            <rect x={cSpot.x} y={cSpot.y} width={cSpot.w} height={cSpot.h} rx="10" fill="black" />
          </mask>
          <marker id="ts-arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
            <path d="M0,0.5 L9,4 L0,7.5 L2,4 Z" fill="#6ea8fe" />
          </marker>
          <filter id="ts-glow">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={vw} height={vh} fill="rgba(0,0,0,0.55)" mask="url(#ts-mask)" />

        <rect
          x={gSpot.x} y={gSpot.y} width={gSpot.w} height={gSpot.h}
          rx="8" fill="none"
          stroke="#6ea8fe" strokeWidth="2"
          filter="url(#ts-glow)"
          className="tutor-spotlight-ring"
        />

        {visible && (
          <path
            d={arrow}
            fill="none"
            stroke="#6ea8fe"
            strokeWidth="1.5"
            strokeDasharray="6 3"
            markerEnd="url(#ts-arrow)"
            className="tutor-spotlight-arrow"
          />
        )}
      </svg>

      {/* Floating explanation callout */}
      <div
        ref={cardRef}
        className={`tutor-callout${visible ? " is-visible" : ""}`}
        style={{ left: cPos.left, top: cPos.top, width: CARD_W }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tutor-callout-header">
          <span className="tutor-callout-gate">{stepData.gate}</span>
          <span className="tutor-callout-qubits">{stepData.qubits}</span>
          <span className="tutor-callout-badge">AI Tutor</span>
        </div>
        <p className="tutor-callout-action">{stepData.action}</p>
        <div className="tutor-callout-nav">
          <button
            className="tutor-callout-nav-btn"
            onClick={() => navigateStep(-1)}
            disabled={!hasPrev}
            aria-label="Previous step"
          >
            &larr; Prev
          </button>
          <span className="tutor-callout-nav-counter">
            {stepData.stepIndex + 1} / {stepData.totalSteps}
          </span>
          <button
            className="tutor-callout-nav-btn"
            onClick={() => navigateStep(1)}
            disabled={!hasNext}
            aria-label="Next step"
          >
            Next &rarr;
          </button>
        </div>
        <button
          className="tutor-callout-close"
          onClick={() => highlightStep(null)}
          aria-label="Close explanation"
        >
          &times;
        </button>
      </div>
    </div>,
    document.body
  );
}
