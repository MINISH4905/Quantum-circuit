// Shared drag/add-gate interaction handlers for any page that embeds a
// GateToolbox + CircuitCanvas inside its own DndContext (the main dashboard,
// and the Learner page's embedded mini-editor). Pure functions operating on
// store getters — no React state of their own, so there is nothing page
// specific to duplicate.
import type { DragEndEvent } from "@dnd-kit/core";
import { useCircuitStore } from "../state/circuit-store";
import { useUiStore } from "../state/ui-store";
import { getGate } from "./gate-registry/registry";
import { buildDefaultOperation } from "./model/placement";
import { findFreeTimeStep } from "./model/timing";

interface NewGateDragData {
  type: "new-gate";
  gateId: string;
}
interface MoveGateDragData {
  type: "move-gate";
  operationId: string;
}

export function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;
  if (!over) return;

  const overData = over.data.current as { qubit: number; timeStep: number } | undefined;
  if (!overData) return;

  const activeData = active.data.current as NewGateDragData | MoveGateDragData | undefined;
  if (!activeData) return;

  const store = useCircuitStore.getState();
  const circuit = store.circuit;

  if (activeData.type === "new-gate") {
    const gate = getGate(activeData.gateId);
    if (!gate) return;
    const newOp = buildDefaultOperation(gate, overData.qubit, circuit, overData.timeStep);
    const id = store.addOperation(newOp);
    useUiStore.getState().select(id);
    return;
  }

  const op = circuit.operations.find((o) => o.id === activeData.operationId);
  if (!op) return;

  const controls = op.controls ?? [];
  const targets = op.targets;
  const anchor = controls[0] ?? targets[0];
  const delta = overData.qubit - anchor;
  const clamp = (q: number) => Math.min(Math.max(q, 0), circuit.qubits - 1);

  const newControls = controls.map((q) => clamp(q + delta));
  const newTargets = targets.map((q) => clamp(q + delta));
  const involved = [...newControls, ...newTargets];
  const circuitWithoutSelf = { ...circuit, operations: circuit.operations.filter((o) => o.id !== op.id) };
  const newTimeStep = findFreeTimeStep(circuitWithoutSelf, involved, overData.timeStep);

  store.updateOperation(op.id, {
    controls: newControls.length ? newControls : undefined,
    targets: newTargets,
    timeStep: newTimeStep,
  });
}

export function handleAddGateClick(gateId: string) {
  const gate = getGate(gateId);
  if (!gate) return;
  const store = useCircuitStore.getState();
  const baseQubit = useUiStore.getState().lastFocusedQubit;
  const newOp = buildDefaultOperation(gate, baseQubit, store.circuit);
  const id = store.addOperation(newOp);
  useUiStore.getState().select(id);
}
