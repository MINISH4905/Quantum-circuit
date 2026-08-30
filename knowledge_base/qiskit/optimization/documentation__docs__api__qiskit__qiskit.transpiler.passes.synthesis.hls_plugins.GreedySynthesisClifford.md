---
framework: qiskit
api_version: 1a3b8eb3e102
doc_type: optimization
source_path: docs/api/qiskit/qiskit.transpiler.passes.synthesis.hls_plugins.GreedySynthesisClifford.mdx
source_url: https://github.com/Qiskit/documentation/blob/1a3b8eb3e102668f9612ac64c80f384b28683681/docs/api/qiskit/qiskit.transpiler.passes.synthesis.hls_plugins.GreedySynthesisClifford.mdx
license: CC-BY-SA-4.0
---

# GreedySynthesisClifford

<Class id="qiskit.transpiler.passes.synthesis.hls_plugins.GreedySynthesisClifford" isDedicatedPage={true} github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/passes/synthesis/hls_plugins.py#L672-L686" signature="qiskit.transpiler.passes.synthesis.hls_plugins.GreedySynthesisClifford" modifiers="class">
  Bases: [`HighLevelSynthesisPlugin`](qiskit.transpiler.passes.synthesis.plugin.HighLevelSynthesisPlugin "qiskit.transpiler.passes.synthesis.plugin.HighLevelSynthesisPlugin")

  Clifford synthesis plugin based on the greedy synthesis Bravyi-Hu-Maslov-Shaydulin method.

  This plugin name is :`clifford.greedy` which can be used as the key on an [`HLSConfig`](qiskit.transpiler.passes.HLSConfig "qiskit.transpiler.passes.HLSConfig") object to use this method with [`HighLevelSynthesis`](qiskit.transpiler.passes.HighLevelSynthesis "qiskit.transpiler.passes.HighLevelSynthesis").

  ## Methods

  ### run

  <Function id="qiskit.transpiler.passes.synthesis.hls_plugins.GreedySynthesisClifford.run" github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/passes/synthesis/hls_plugins.py#L680-L686" signature="run(high_level_object, coupling_map=None, target=None, qubits=None, **options)">
    Run synthesis for the given Clifford.
  </Function>
</Class>
