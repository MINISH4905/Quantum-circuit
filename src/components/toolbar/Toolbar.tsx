import { useRef, useState } from "react";
import { useCircuitStore } from "../../state/circuit-store";
import { serializeCircuit, deserializeCircuit } from "../../circuit/model/serialization";

export function Toolbar() {
  const circuit = useCircuitStore((s) => s.circuit);
  const setCircuit = useCircuitStore((s) => s.setCircuit);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleSave = () => {
    const json = serializeCircuit(circuit, { name: "circuit", createdAt: new Date().toISOString() });
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "circuit.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    file.text().then((text) => {
      const { circuit: loaded, errors } = deserializeCircuit(text);
      if (loaded) {
        setCircuit(loaded);
        setLoadError(null);
      } else {
        // Preserve the current circuit; surface the errors instead of discarding state.
        setLoadError(errors.join("; "));
      }
    });
  };

  return (
    <header className="app-toolbar" role="toolbar" aria-label="Circuit toolbar">
      <span className="app-title">Untitled circuit</span>
      <nav className="app-menu" aria-label="Application menu">
        <span className="app-menu-item">File</span>
        <span className="app-menu-item">Edit</span>
        <span className="app-menu-item">Help</span>
      </nav>
      <div className="toolbar-spacer" />
      <div className="toolbar-group">
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
      {loadError && (
        <span className="toolbar-error" role="alert">
          Load failed: {loadError}
        </span>
      )}
    </header>
  );
}
