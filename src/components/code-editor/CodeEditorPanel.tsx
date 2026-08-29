import { useEffect, useRef, useState, useCallback } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditorNs } from "monaco-editor";
import { useCircuitStore } from "../../state/circuit-store";
import { useUiStore } from "../../state/ui-store";
import { generateCode, parseCode, FRAMEWORK_LABELS, type Framework } from "../../circuit/framework";
import type { ParseError } from "../../circuit/parser/qiskit-parser";

const DEBOUNCE_MS = 400;

const FRAMEWORKS: Framework[] = ["qiskit", "cirq", "pennylane"];

export function CodeEditorPanel() {
  const circuit = useCircuitStore((s) => s.circuit);
  const setCircuit = useCircuitStore((s) => s.setCircuit);
  const framework = useUiStore((s) => s.activeFramework);
  const setFramework = useUiStore((s) => s.setActiveFramework);

  const [codeText, setCodeText] = useState(() => generateCode(framework, circuit));
  const [parseErrors, setParseErrors] = useState<ParseError[]>([]);

  const isApplyingFromCodeRef = useRef(false);
  const debounceRef = useRef<number | undefined>(undefined);
  const editorRef = useRef<MonacoEditorNs.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const prevFrameworkRef = useRef(framework);

  useEffect(() => {
    if (isApplyingFromCodeRef.current) {
      isApplyingFromCodeRef.current = false;
      return;
    }
    setCodeText(generateCode(framework, circuit));
    setParseErrors([]);
  }, [circuit, framework]);

  useEffect(() => {
    if (prevFrameworkRef.current !== framework) {
      prevFrameworkRef.current = framework;
      setCodeText(generateCode(framework, circuit));
      setParseErrors([]);
    }
  }, [framework, circuit]);

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
    monacoRef.current.editor.setModelMarkers(model, `${framework}-parser`, markers);
  }, [parseErrors, framework]);

  const scheduleParse = useCallback(
    (text: string) => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => {
        const { circuit: parsed, errors } = parseCode(framework, text);
        if (parsed && errors.length === 0) {
          setParseErrors([]);
          isApplyingFromCodeRef.current = true;
          setCircuit(parsed);
        } else {
          setParseErrors(errors);
        }
      }, DEBOUNCE_MS);
    },
    [setCircuit, framework],
  );

  const handleChange = useCallback(
    (value: string | undefined) => {
      const text = value ?? "";
      setCodeText(text);
      scheduleParse(text);
    },
    [scheduleParse],
  );

  const handleMount: OnMount = (editorInstance, monacoInstance) => {
    editorRef.current = editorInstance;
    monacoRef.current = monacoInstance;
  };

  return (
    <div className="code-editor-panel">
      <div className="code-editor-header">
        <select
          className="framework-selector"
          value={framework}
          onChange={(e) => setFramework(e.target.value as Framework)}
          aria-label="Code framework"
        >
          {FRAMEWORKS.map((fw) => (
            <option key={fw} value={fw}>
              {FRAMEWORK_LABELS[fw]}
            </option>
          ))}
        </select>
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
    </div>
  );
}
