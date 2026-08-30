---
framework: qiskit
api_version: 1a3b8eb3e102
doc_type: optimization
source_path: docs/api/qiskit/qiskit.transpiler.passes.synthesis.hls_plugins.MCXSynthesisGrayCode.mdx
source_url: https://github.com/Qiskit/documentation/blob/1a3b8eb3e102668f9612ac64c80f384b28683681/docs/api/qiskit/qiskit.transpiler.passes.synthesis.hls_plugins.MCXSynthesisGrayCode.mdx
license: CC-BY-SA-4.0
---

# MCXSynthesisGrayCode

<Class id="qiskit.transpiler.passes.synthesis.hls_plugins.MCXSynthesisGrayCode" isDedicatedPage={true} github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/passes/synthesis/hls_plugins.py#L1385-L1411" signature="qiskit.transpiler.passes.synthesis.hls_plugins.MCXSynthesisGrayCode" modifiers="class">
  Bases: [`HighLevelSynthesisPlugin`](qiskit.transpiler.passes.synthesis.plugin.HighLevelSynthesisPlugin "qiskit.transpiler.passes.synthesis.plugin.HighLevelSynthesisPlugin")

  Synthesis plugin for a multi-controlled X gate based on the Gray code.

  This plugin name is :`mcx.gray_code` which can be used as the key on an [`HLSConfig`](qiskit.transpiler.passes.HLSConfig "qiskit.transpiler.passes.HLSConfig") object to use this method with [`HighLevelSynthesis`](qiskit.transpiler.passes.HighLevelSynthesis "qiskit.transpiler.passes.HighLevelSynthesis").

  For a multi-controlled X gate with $k$ control qubits this synthesis method requires no additional clean auxiliary qubits. The synthesized circuit consists of $k + 1$ qubits.

  It is not recommended to use this method for large values of $k + 1$ as it produces exponentially many gates.

  ## Methods

  ### run

  <Function id="qiskit.transpiler.passes.synthesis.hls_plugins.MCXSynthesisGrayCode.run" github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/passes/synthesis/hls_plugins.py#L1399-L1411" signature="run(high_level_object, coupling_map=None, target=None, qubits=None, **options)">
    Run synthesis for the given MCX gate.
  </Function>
</Class>
