import { useEffect, useRef } from "react";
import { useCircuitStore } from "../../state/circuit-store";
import { useTutorialStore } from "../../state/tutorial-store";
import type { TutorialStepDef } from "../../circuit/examples/tutorials";
import type { QuantumOperation } from "../../circuit/model/types";

function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

function validatePlacement(op: QuantumOperation, step: TutorialStepDef): boolean {
  if (op.gate !== step.gateId) return false;
  if (!arraysEqual(op.targets, step.targets)) return false;
  const opControls = op.controls ?? [];
  const expectedControls = step.controls ?? [];
  if (!arraysEqual(opControls, expectedControls)) return false;
  return true;
}

export function TutorialEngine() {
  const status = useTutorialStore((s) => s.status);
  const prevOpCountRef = useRef(0);

  useEffect(() => {
    const isActive = status === "active" || status === "step-success";
    if (!isActive) {
      prevOpCountRef.current = useCircuitStore.getState().circuit.operations.length;
      return;
    }

    const unsub = useCircuitStore.subscribe((state) => {
      const ops = state.circuit.operations;
      if (ops.length <= prevOpCountRef.current) {
        prevOpCountRef.current = ops.length;
        return;
      }

      const tutState = useTutorialStore.getState();
      if (tutState.status !== "active") {
        prevOpCountRef.current = ops.length;
        return;
      }

      const step = tutState.currentStep();
      if (!step) {
        prevOpCountRef.current = ops.length;
        return;
      }

      const newOp = ops[ops.length - 1];
      prevOpCountRef.current = ops.length;

      if (validatePlacement(newOp, step)) {
        tutState.markStepSuccess();
        setTimeout(() => {
          useTutorialStore.getState().advanceStep();
        }, 800);
      } else {
        tutState.markStepError(step.hint);
        setTimeout(() => {
          useCircuitStore.getState().undo();
          useTutorialStore.getState().clearError();
        }, 1200);
      }
    });

    return unsub;
  }, [status]);

  return null;
}
