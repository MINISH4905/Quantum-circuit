---
framework: qiskit
api_version: 1a3b8eb3e102
doc_type: optimization
source_path: docs/api/qiskit/qiskit.transpiler.passes.synthesis.hls_plugins.AGSynthesisClifford.mdx
source_url: https://github.com/Qiskit/documentation/blob/1a3b8eb3e102668f9612ac64c80f384b28683681/docs/api/qiskit/qiskit.transpiler.passes.synthesis.hls_plugins.AGSynthesisClifford.mdx
license: CC-BY-SA-4.0
---

# AGSynthesisClifford

<Class id="qiskit.transpiler.passes.synthesis.hls_plugins.AGSynthesisClifford" isDedicatedPage={true} github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/passes/synthesis/hls_plugins.py#L633-L646" signature="qiskit.transpiler.passes.synthesis.hls_plugins.AGSynthesisClifford" modifiers="class">
  Bases: [`HighLevelSynthesisPlugin`](qiskit.transpiler.passes.synthesis.plugin.HighLevelSynthesisPlugin "qiskit.transpiler.passes.synthesis.plugin.HighLevelSynthesisPlugin")

  Clifford synthesis plugin based on the Aaronson-Gottesman method.

  This plugin name is :`clifford.ag` which can be used as the key on an [`HLSConfig`](qiskit.transpiler.passes.HLSConfig "qiskit.transpiler.passes.HLSConfig") object to use this method with [`HighLevelSynthesis`](qiskit.transpiler.passes.HighLevelSynthesis "qiskit.transpiler.passes.HighLevelSynthesis").

  ## Methods

  ### run

  <Function id="qiskit.transpiler.passes.synthesis.hls_plugins.AGSynthesisClifford.run" github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/passes/synthesis/hls_plugins.py#L640-L646" signature="run(high_level_object, coupling_map=None, target=None, qubits=None, **options)">
    Run synthesis for the given Clifford.
  </Function>
</Class>
