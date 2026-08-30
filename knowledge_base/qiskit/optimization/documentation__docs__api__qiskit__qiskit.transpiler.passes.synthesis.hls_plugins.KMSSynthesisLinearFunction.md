---
framework: qiskit
api_version: 1a3b8eb3e102
doc_type: optimization
source_path: docs/api/qiskit/qiskit.transpiler.passes.synthesis.hls_plugins.KMSSynthesisLinearFunction.mdx
source_url: https://github.com/Qiskit/documentation/blob/1a3b8eb3e102668f9612ac64c80f384b28683681/docs/api/qiskit/qiskit.transpiler.passes.synthesis.hls_plugins.KMSSynthesisLinearFunction.mdx
license: CC-BY-SA-4.0
---

# KMSSynthesisLinearFunction

<Class id="qiskit.transpiler.passes.synthesis.hls_plugins.KMSSynthesisLinearFunction" isDedicatedPage={true} github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/passes/synthesis/hls_plugins.py#L740-L779" signature="qiskit.transpiler.passes.synthesis.hls_plugins.KMSSynthesisLinearFunction" modifiers="class">
  Bases: [`HighLevelSynthesisPlugin`](qiskit.transpiler.passes.synthesis.plugin.HighLevelSynthesisPlugin "qiskit.transpiler.passes.synthesis.plugin.HighLevelSynthesisPlugin")

  Linear function synthesis plugin based on the Kutin-Moulton-Smithline method.

  This plugin name is :`linear_function.kms` which can be used as the key on an [`HLSConfig`](qiskit.transpiler.passes.HLSConfig "qiskit.transpiler.passes.HLSConfig") object to use this method with [`HighLevelSynthesis`](qiskit.transpiler.passes.HighLevelSynthesis "qiskit.transpiler.passes.HighLevelSynthesis").

  The plugin supports the following plugin-specific options:

  *   **use\_inverted: Indicates whether to run the algorithm on the inverse matrix**

      and to invert the synthesized circuit. In certain cases this provides a better decomposition than the direct approach.

  *   **use\_transposed: Indicates whether to run the algorithm on the transposed matrix**

      and to invert the order of CX gates in the synthesized circuit. In certain cases this provides a better decomposition than the direct approach.

  ## Methods

  ### run

  <Function id="qiskit.transpiler.passes.synthesis.hls_plugins.KMSSynthesisLinearFunction.run" github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/passes/synthesis/hls_plugins.py#L757-L779" signature="run(high_level_object, coupling_map=None, target=None, qubits=None, **options)">
    Run synthesis for the given LinearFunction.
  </Function>
</Class>
