import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useCircuitStore } from "./state/circuit-store";
import { useExpandable } from "./state/expand-store";
import { useEscapeToCollapse } from "./components/shared/useEscapeToCollapse";
import { handleDragEnd, handleAddGateClick } from "./circuit/interactions";
import { Toolbar } from "./components/toolbar/Toolbar";
import { GateToolbox } from "./components/gates/GateToolbox";
import { CanvasToolbar } from "./components/circuit/CanvasToolbar";
import { CircuitCanvas } from "./components/circuit/CircuitCanvas";
import { CodeEditorPanel } from "./components/code-editor/CodeEditorPanel";
import { GateInspector } from "./components/panels/GateInspector";
import { ProbabilitiesPanel } from "./components/simulation/ProbabilitiesPanel";
import { QSpherePanel } from "./components/simulation/QSpherePanel";
import { BlochSpheresPanel } from "./components/simulation/BlochSpheresPanel";
import { TutorPanel } from "./components/tutor/TutorPanel";
import "./App.css";

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
  const { expanded: circuitEditorExpanded, collapse: collapseCircuitEditor } = useExpandable("circuit-editor");
  useEscapeToCollapse(circuitEditorExpanded, collapseCircuitEditor);

  return (
    <div className="app-shell">
      <Toolbar />
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="app-body">
          <div className="app-left-col">
            <GateToolbox onAddGate={handleAddGateClick} />
            <GateInspector />
          </div>
          <div className={`app-center-col${circuitEditorExpanded ? " circuit-editor-expanded" : ""}`}>
            <CanvasToolbar />
            <CircuitCanvas />
            <div className={`app-bottom-row${circuitEditorExpanded ? " is-hidden-for-expand" : ""}`}>
              <ProbabilitiesPanel />
              <BlochSpheresPanel />
              <QSpherePanel />
            </div>
          </div>
          <div className={`app-right-col${circuitEditorExpanded ? " is-hidden-for-expand" : ""}`}>
            <CodeEditorPanel />
            <TutorPanel />
          </div>
        </div>
      </DndContext>
    </div>
  );
}

export default App;
