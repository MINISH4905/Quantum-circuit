import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useCircuitStore } from "./state/circuit-store";
import { useUiStore } from "./state/ui-store";
import { useSimulationStore } from "./state/simulation-store";
import { getGate } from "./circuit/gate-registry/registry";
import { buildDefaultOperation } from "./circuit/model/placement";
import { findFreeTimeStep } from "./circuit/model/timing";
import { Toolbar } from "./components/toolbar/Toolbar";
import { GateToolbox } from "./components/gates/GateToolbox";
import { CanvasToolbar } from "./components/circuit/CanvasToolbar";
import { CircuitCanvas } from "./components/circuit/CircuitCanvas";
import { CodeEditorPanel } from "./components/code-editor/CodeEditorPanel";
import { GateInspector } from "./components/panels/GateInspector";
import { ProbabilitiesPanel } from "./components/simulation/ProbabilitiesPanel";
import { QSpherePanel } from "./components/simulation/QSpherePanel";
import { BlochSpheresPanel } from "./components/simulation/BlochSpheresPanel";
import { BackendSimulationController } from "./components/simulation/BackendSimulationController";
import { ComparisonController } from "./components/comparison/ComparisonController";
import { ComparisonDashboard } from "./components/comparison/ComparisonDashboard";
import { TutorController } from "./components/tutor/TutorController";
import { TutorPanel } from "./components/tutor/TutorPanel";
import { PageWalkthrough } from "./components/walkthrough/PageWalkthrough";
import "./App.css";

interface NewGateDragData {
  type: "new-gate";
  gateId: string;
}
interface MoveGateDragData {
  type: "move-gate";
  operationId: string;
}

function handleDragEnd(event: DragEndEvent) {
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

function handleAddGateClick(gateId: string) {
  const gate = getGate(gateId);
  if (!gate) return;
  const store = useCircuitStore.getState();
  const baseQubit = useUiStore.getState().lastFocusedQubit;
  const newOp = buildDefaultOperation(gate, baseQubit, store.circuit);
  const id = store.addOperation(newOp);
  useUiStore.getState().select(id);
}

function handleGlobalKeyDown(e: KeyboardEvent) {
  const target = e.target as HTMLElement | null;
  if (target?.closest(".monaco-editor")) return;

  const isMod = e.ctrlKey || e.metaKey;
  if (isMod && e.key.toLowerCase() === "z" && !e.shiftKey) {
    e.preventDefault();
    useCircuitStore.getState().undo();
  } else if (isMod && (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey))) {
    e.preventDefault();
    useCircuitStore.getState().redo();
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("keydown", handleGlobalKeyDown);
}

const sensorOptions = { activationConstraint: { distance: 4 } };

function App() {
  const sensors = useSensors(useSensor(PointerSensor, sensorOptions));
  const simMode = useSimulationStore((s) => s.mode);

  return (
    <div className="app-shell">
      <BackendSimulationController />
      <ComparisonController />
      <TutorController />
      <Toolbar />
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="app-body">
          <div className="app-left-col">
            <GateToolbox onAddGate={handleAddGateClick} />
            <GateInspector />
          </div>
          <div className="app-center-col" id="wt-circuit-editor">
            <CanvasToolbar />
            <CircuitCanvas />
            {simMode === "compare" ? (
              <ComparisonDashboard />
            ) : (
              <div className="app-bottom-row" id="wt-visualization">
                <ProbabilitiesPanel />
                <BlochSpheresPanel />
                <QSpherePanel />
              </div>
            )}
          </div>
          <div className="app-right-col">
            <CodeEditorPanel />
            <TutorPanel />
          </div>
        </div>
      </DndContext>
      <PageWalkthrough />
    </div>
  );
}

export default App;
