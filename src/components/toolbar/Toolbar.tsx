import { useEffect, useRef, useState, useCallback } from "react";
import { useCircuitStore } from "../../state/circuit-store";
import { useUiStore } from "../../state/ui-store";
import { useSavedCircuitsStore } from "../../state/saved-circuits-store";
import { useWalkthroughStore } from "../../state/walkthrough-store";
import { useAuthStore } from "../../state/auth-store";
import { createEmptyCircuit } from "../../circuit/model/types";
import { serializeCircuit, deserializeCircuit } from "../../circuit/model/serialization";
import { ConfirmModal } from "../shared/ConfirmModal";
import { LabPicker } from "./LabPicker";
import { TutorialPicker } from "./TutorialPicker";
import { useTutorialStore } from "../../state/tutorial-store";
import { UserMenu } from "../auth/UserMenu";
import type { WorkedExample } from "../../circuit/examples/worked-examples";
import type { TutorialDef } from "../../circuit/examples/tutorials";

type MenuId = "file" | "edit" | "help";

const SHORTCUTS: Array<{ label: string; keys: string }> = [
  { label: "Undo", keys: "Ctrl+Z" },
  { label: "Redo", keys: "Ctrl+Shift+Z" },
  { label: "Delete selected gate", keys: "Delete" },
  { label: "Copy selected gate", keys: "Ctrl+C" },
  { label: "Paste gate", keys: "Ctrl+V" },
  { label: "Move selected gate", keys: "Arrow keys" },
  { label: "Deselect", keys: "Esc" },
];

export function Toolbar() {
  const user = useAuthStore((s) => s.user);
  const circuit = useCircuitStore((s) => s.circuit);
  const setCircuit = useCircuitStore((s) => s.setCircuit);
  const circuitName = useCircuitStore((s) => s.name);
  const setCircuitName = useCircuitStore((s) => s.setName);
  const undo = useCircuitStore((s) => s.undo);
  const redo = useCircuitStore((s) => s.redo);
  const canUndo = useCircuitStore((s) => s.canUndo());
  const canRedo = useCircuitStore((s) => s.canRedo());
  const removeOperation = useCircuitStore((s) => s.removeOperation);
  const saveCircuit = useSavedCircuitsStore((s) => s.saveCircuit);
  const selectedOperationId = useUiStore((s) => s.selectedOperationId);
  const select = useUiStore((s) => s.select);
  const startWalkthrough = useWalkthroughStore((s) => s.start);

  const startTutorial = useTutorialStore((s) => s.startTutorial);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | undefined>(undefined);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(circuitName);
  const [showLabPicker, setShowLabPicker] = useState(false);
  const [showTutorialPicker, setShowTutorialPicker] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    | null
    | { type: "new" }
    | { type: "load"; example: WorkedExample }
    | { type: "tutorial"; tutorial: TutorialDef }
  >(null);

  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const startEditingTitle = () => {
    setTitleDraft(circuitName);
    setIsEditingTitle(true);
  };
  const commitTitle = () => {
    setCircuitName(titleDraft);
    setIsEditingTitle(false);
  };
  const cancelTitle = () => setIsEditingTitle(false);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2500);
  };

  const handleSave = () => {
    const name = window.prompt("Name this circuit", `Circuit ${new Date().toLocaleString()}`);
    if (!name) return; // cancelled

    const json = serializeCircuit(circuit, { name, createdAt: new Date().toISOString() });
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.trim() || "circuit"}.json`;
    a.click();
    URL.revokeObjectURL(url);

    saveCircuit(name, circuit);
    setCircuitName(name);
    showToast(`Saved "${name}" to Folders`);
  };

  const handleLoadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    file.text().then((text) => {
      const { circuit: loaded, errors, metadata } = deserializeCircuit(text);
      if (loaded) {
        setCircuit(loaded);
        setLoadError(null);
        const loadedName = metadata?.name || file.name.replace(/\.json$/i, "");
        setCircuitName(loadedName);
        showToast(`Loaded "${loadedName}"`);
      } else {
        // Preserve the current circuit; surface the errors instead of discarding state.
        setLoadError(errors.join("; "));
      }
    });
  };

  const handleNewCircuit = useCallback(() => {
    if (circuit.operations.length > 0) {
      setConfirmAction({ type: "new" });
      return;
    }
    setCircuit(createEmptyCircuit(2, 2));
    setCircuitName("Untitled circuit");
    select(null);
    showToast("Started a new circuit");
  }, [circuit.operations.length, setCircuit, setCircuitName, select]);

  const handleLabSelect = useCallback(
    (example: WorkedExample) => {
      setShowLabPicker(false);
      if (circuit.operations.length > 0) {
        setConfirmAction({ type: "load", example });
        return;
      }
      setCircuit(example.build());
      setCircuitName(example.label);
      select(null);
      showToast(`Loaded "${example.label}"`);
    },
    [circuit.operations.length, setCircuit, setCircuitName, select]
  );

  const handleTutorialSelect = useCallback(
    (tutorial: TutorialDef) => {
      setShowTutorialPicker(false);
      if (circuit.operations.length > 0) {
        setConfirmAction({ type: "tutorial", tutorial });
        return;
      }
      setCircuit(createEmptyCircuit(tutorial.qubits, tutorial.classicalBits));
      setCircuitName(`${tutorial.title} (Tutorial)`);
      select(null);
      startTutorial(tutorial);
    },
    [circuit.operations.length, setCircuit, setCircuitName, select, startTutorial]
  );

  const executeConfirmAction = useCallback(() => {
    if (!confirmAction) return;
    if (confirmAction.type === "new") {
      setCircuit(createEmptyCircuit(2, 2));
      setCircuitName("Untitled circuit");
      select(null);
      showToast("Started a new circuit");
    } else if (confirmAction.type === "load") {
      const { example } = confirmAction;
      setCircuit(example.build());
      setCircuitName(example.label);
      select(null);
      showToast(`Loaded "${example.label}"`);
    } else if (confirmAction.type === "tutorial") {
      const { tutorial } = confirmAction;
      setCircuit(createEmptyCircuit(tutorial.qubits, tutorial.classicalBits));
      setCircuitName(`${tutorial.title} (Tutorial)`);
      select(null);
      startTutorial(tutorial);
    }
    setConfirmAction(null);
  }, [confirmAction, setCircuit, setCircuitName, select, startTutorial]);

  const runMenuAction = (action: () => void) => {
    action();
    setOpenMenu(null);
  };

  const toggleMenu = (id: MenuId) => setOpenMenu((cur) => (cur === id ? null : id));

  return (
    <header className="app-toolbar" role="toolbar" aria-label="Circuit toolbar">
      {isEditingTitle ? (
        <input
          ref={titleInputRef}
          className="app-title-input"
          value={titleDraft}
          onChange={(e) => setTitleDraft(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitTitle();
            else if (e.key === "Escape") cancelTitle();
          }}
          aria-label="Circuit name"
        />
      ) : (
        <button
          type="button"
          className="app-title"
          onClick={startEditingTitle}
          title="Click to rename this circuit"
        >
          {circuitName}
        </button>
      )}
      <nav className="app-menu" aria-label="Application menu" ref={menuRef}>
        <div className={`app-menu-item${openMenu === "file" ? " is-open" : ""}`}>
          <button type="button" className="app-menu-btn" onClick={() => toggleMenu("file")} aria-expanded={openMenu === "file"}>
            File
          </button>
          {openMenu === "file" && (
            <div className="app-menu-dropdown" role="menu">
              <button type="button" className="app-menu-dropdown-item" role="menuitem" onClick={() => runMenuAction(handleNewCircuit)}>
                New circuit
              </button>
              <button type="button" className="app-menu-dropdown-item" role="menuitem" onClick={() => runMenuAction(handleSave)}>
                Save file…
              </button>
              <button type="button" className="app-menu-dropdown-item" role="menuitem" onClick={() => runMenuAction(handleLoadClick)}>
                Load file…
              </button>
            </div>
          )}
        </div>

        <div className={`app-menu-item${openMenu === "edit" ? " is-open" : ""}`}>
          <button type="button" className="app-menu-btn" onClick={() => toggleMenu("edit")} aria-expanded={openMenu === "edit"}>
            Edit
          </button>
          {openMenu === "edit" && (
            <div className="app-menu-dropdown" role="menu">
              <button
                type="button"
                className="app-menu-dropdown-item"
                role="menuitem"
                disabled={!canUndo}
                onClick={() => runMenuAction(undo)}
              >
                <span>Undo</span>
                <span className="app-menu-shortcut">Ctrl+Z</span>
              </button>
              <button
                type="button"
                className="app-menu-dropdown-item"
                role="menuitem"
                disabled={!canRedo}
                onClick={() => runMenuAction(redo)}
              >
                <span>Redo</span>
                <span className="app-menu-shortcut">Ctrl+Shift+Z</span>
              </button>
              <div className="app-menu-divider" />
              <button
                type="button"
                className="app-menu-dropdown-item"
                role="menuitem"
                disabled={!selectedOperationId}
                onClick={() =>
                  runMenuAction(() => {
                    if (selectedOperationId) removeOperation(selectedOperationId);
                    select(null);
                  })
                }
              >
                <span>Delete selected gate</span>
                <span className="app-menu-shortcut">Del</span>
              </button>
            </div>
          )}
        </div>

        <div className={`app-menu-item${openMenu === "help" ? " is-open" : ""}`}>
          <button
            type="button"
            id="wt-help-menu-btn"
            className="app-menu-btn"
            onClick={() => toggleMenu("help")}
            aria-expanded={openMenu === "help"}
          >
            Help
          </button>
          {openMenu === "help" && (
            <div className="app-menu-dropdown app-menu-dropdown-wide" role="menu">
              <button
                type="button"
                className="app-menu-dropdown-item"
                role="menuitem"
                onClick={() => runMenuAction(startWalkthrough)}
              >
                Take a Tour
              </button>
              <div className="app-menu-divider" />
              <p className="app-menu-help-title">Keyboard shortcuts</p>
              {SHORTCUTS.map((s) => (
                <div className="app-menu-shortcut-row" key={s.label}>
                  <span>{s.label}</span>
                  <span className="app-menu-shortcut">{s.keys}</span>
                </div>
              ))}
              <div className="app-menu-divider" />
              <p className="app-menu-help-text">
                Quantum Circuit Lab — build circuits visually, simulate them locally or on Qiskit Aer, and inspect
                the result on the probability chart, Bloch spheres, and Q-sphere.
              </p>
            </div>
          )}
        </div>
      </nav>
      <div className="toolbar-spacer" />
      {toast && (
        <span className="toolbar-toast" role="status">
          {toast}
        </span>
      )}
      <div className="toolbar-group">
        <button type="button" onClick={handleNewCircuit} aria-label="New circuit">
          + New
        </button>
        <button type="button" onClick={() => setShowLabPicker(true)} aria-label="Load a preset lab">
          Load Lab
        </button>
        <button type="button" onClick={() => setShowTutorialPicker(true)} aria-label="Start a tutorial">
          Tutorial
        </button>
        <button type="button" onClick={handleSave} aria-label="Save circuit as JSON">
          Save file
        </button>
        <button type="button" onClick={handleLoadClick} aria-label="Load circuit from JSON">
          Load
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleFileChange}
          style={{ display: "none" }}
          aria-hidden="true"
        />
      </div>
      {user && <UserMenu user={user} />}
      {loadError && (
        <span className="toolbar-error" role="alert">
          Load failed: {loadError}
        </span>
      )}

      <ConfirmModal
        open={confirmAction !== null}
        title="Unsaved changes"
        message="Your current circuit will be lost. Continue?"
        confirmLabel="Continue"
        onConfirm={executeConfirmAction}
        onCancel={() => setConfirmAction(null)}
      />

      <ConfirmModal
        open={showLabPicker}
        title="Load a Lab"
        onCancel={() => setShowLabPicker(false)}
        width={520}
      >
        <LabPicker onSelect={handleLabSelect} />
      </ConfirmModal>

      <ConfirmModal
        open={showTutorialPicker}
        title="Start a Tutorial"
        onCancel={() => setShowTutorialPicker(false)}
        width={520}
      >
        <TutorialPicker onSelect={handleTutorialSelect} />
      </ConfirmModal>
    </header>
  );
}
