import { useEffect, useRef, useState, useCallback } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditorNs } from "monaco-editor";
import { useCircuitStore } from "../../state/circuit-store";
import { useExpandable } from "../../state/expand-store";
import { generateQiskitCode } from "../../circuit/generator/qiskit-generator";
import { parseQiskitCode, type ParseError } from "../../circuit/parser/qiskit-parser";
import { ExpandableModule } from "../shared/ExpandableModule";
import { ExpandToggleButton } from "../shared/ExpandToggleButton";

const DEBOUNCE_MS = 400;

export function CodeEditorPanel() {
  const circuit = useCircuitStore((s) => s.circuit);
  const setCircuit = useCircuitStore((s) => s.setCircuit);

  const [codeText, setCodeText] = useState(() => generateQiskitCode(circuit));
  const [parseErrors, setParseErrors] = useState<ParseError[]>([]);

  const isApplyingFromCodeRef = useRef(false);
  const debounceRef = useRef<number | undefined>(undefined);
  const editorRef = useRef<MonacoEditorNs.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const { expanded, toggle, collapse } = useExpandable("qiskit-code");

  // Visual -> Code: regenerate editor text whenever the IR changes for a reason
  // other than our own successful parse (drag/drop, undo/redo, load, param edits, ...).
  useEffect(() => {
    if (isApplyingFromCodeRef.current) {
      isApplyingFromCodeRef.current = false;
      return;
    }
    setCodeText(generateQiskitCode(circuit));
    setParseErrors([]);
  }, [circuit]);

  // Push error markers into Monaco whenever parseErrors changes.
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;
    const markers: MonacoEditorNs.IMarkerData[] = parseErrors.map((err) => ({
      startLineNumber: err.line,
      endLineNumber: err.line,
      startColumn: 1,
      endColumn: model.getLineMaxColumn(Math.min(err.line, model.getLineCount())),
      message: err.message,
      severity: monacoRef.current!.MarkerSeverity.Error,
    }));
    monacoRef.current.editor.setModelMarkers(model, "qiskit-parser", markers);
  }, [parseErrors]);

  const scheduleParse = useCallback(
    (text: string) => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => {
        const { circuit: parsed, errors } = parseQiskitCode(text);
        if (parsed && errors.length === 0) {
          setParseErrors([]);
          isApplyingFromCodeRef.current = true;
          setCircuit(parsed);
        } else {
          // Preserve the last valid circuit: do not call setCircuit.
          setParseErrors(errors);
        }
      }, DEBOUNCE_MS);
    },
    [setCircuit]
  );

  const handleChange = useCallback(
    (value: string | undefined) => {
      const text = value ?? "";
      setCodeText(text);
      scheduleParse(text);
    },
    [scheduleParse]
  );

  const handleMount: OnMount = (editorInstance, monacoInstance) => {
    editorRef.current = editorInstance;
    monacoRef.current = monacoInstance;
  };

  return (
    <ExpandableModule
      as="div"
      className="code-editor-panel"
      ariaLabel="Qiskit code"
      title="Qiskit Code"
      expanded={expanded}
      onCollapse={collapse}
    >
      <div className="code-editor-header">
        <span className="panel-title" style={{ margin: 0 }}>
          Qiskit Code
        </span>
        <div className="module-header-actions">
          {parseErrors.length > 0 && (
            <span className="code-editor-status is-error" role="status">
              {parseErrors.length} error{parseErrors.length > 1 ? "s" : ""} — showing last valid circuit
            </span>
          )}
          {parseErrors.length === 0 && (
            <span className="code-editor-status is-ok" role="status">
              Synced
            </span>
          )}
          <ExpandToggleButton expanded={expanded} onClick={toggle} label="Qiskit code" />
        </div>
      </div>
      <div className="code-editor-monaco">
        <Editor
          language="python"
          theme="vs-dark"
          value={codeText}
          onChange={handleChange}
          onMount={handleMount}
          loading={<div className="code-editor-loading">Loading editor…</div>}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
      {parseErrors.length > 0 && (
        <ul className="code-editor-errors" aria-label="Code errors">
          {parseErrors.map((err, i) => (
            <li key={i}>
              <strong>Line {err.line}:</strong> {err.message}
            </li>
          ))}
        </ul>
      )}
    </ExpandableModule>
  );
}
