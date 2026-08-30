---
framework: qiskit
api_version: 1a3b8eb3e102
doc_type: optimization
source_path: docs/api/qiskit/qiskit.transpiler.passes.synthesis.hls_plugins.MCXSynthesis2DirtyKG24.mdx
source_url: https://github.com/Qiskit/documentation/blob/1a3b8eb3e102668f9612ac64c80f384b28683681/docs/api/qiskit/qiskit.transpiler.passes.synthesis.hls_plugins.MCXSynthesis2DirtyKG24.mdx
license: CC-BY-SA-4.0
---

# MCXSynthesis2DirtyKG24

<Class id="qiskit.transpiler.passes.synthesis.hls_plugins.MCXSynthesis2DirtyKG24" isDedicatedPage={true} github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/passes/synthesis/hls_plugins.py#L1255-L1296" signature="qiskit.transpiler.passes.synthesis.hls_plugins.MCXSynthesis2DirtyKG24" modifiers="class">
  Bases: [`HighLevelSynthesisPlugin`](qiskit.transpiler.passes.synthesis.plugin.HighLevelSynthesisPlugin "qiskit.transpiler.passes.synthesis.plugin.HighLevelSynthesisPlugin")

  Synthesis plugin for a multi-controlled X gate based on the paper by Khattar and Gidney (2024).

  See \[1] for details.

  The plugin name is :`mcx.2_dirty_kg24` which can be used as the key on an [`HLSConfig`](qiskit.transpiler.passes.HLSConfig "qiskit.transpiler.passes.HLSConfig") object to use this method with [`HighLevelSynthesis`](qiskit.transpiler.passes.HighLevelSynthesis "qiskit.transpiler.passes.HighLevelSynthesis").

  For a multi-controlled X gate with $k\ge 3$ control qubits this synthesis method requires $2$ additional dirty ancillary qubits. The synthesized circuit consists of $k + 3$ qubits and at most $12 * k - 18$ CX gates.

  The plugin supports the following plugin-specific options:

  *   num\_clean\_ancillas: The number of clean ancillary qubits available.

  **References**

  1\. Khattar and Gidney, Rise of conditionally clean ancillae for optimizing quantum circuits [arXiv:2407.17966](https://arxiv.org/abs/2407.17966)

  ## Methods

  ### run

  <Function id="qiskit.transpiler.passes.synthesis.hls_plugins.MCXSynthesis2DirtyKG24.run" github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/passes/synthesis/hls_plugins.py#L1277-L1296" signature="run(high_level_object, coupling_map=None, target=None, qubits=None, **options)">
    Run synthesis for the given MCX gate.
  </Function>
</Class>
