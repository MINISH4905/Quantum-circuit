---
framework: qiskit
api_version: 1a3b8eb3e102
doc_type: optimization
source_path: docs/api/qiskit/qiskit.transpiler.passes.synthesis.hls_plugins.ModularAdderSynthesisV17.mdx
source_url: https://github.com/Qiskit/documentation/blob/1a3b8eb3e102668f9612ac64c80f384b28683681/docs/api/qiskit/qiskit.transpiler.passes.synthesis.hls_plugins.ModularAdderSynthesisV17.mdx
license: CC-BY-SA-4.0
---

# ModularAdderSynthesisV17

<Class id="qiskit.transpiler.passes.synthesis.hls_plugins.ModularAdderSynthesisV17" isDedicatedPage={true} github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/passes/synthesis/hls_plugins.py#L1731-L1747" signature="qiskit.transpiler.passes.synthesis.hls_plugins.ModularAdderSynthesisV17" modifiers="class">
  Bases: [`HighLevelSynthesisPlugin`](qiskit.transpiler.passes.synthesis.plugin.HighLevelSynthesisPlugin "qiskit.transpiler.passes.synthesis.plugin.HighLevelSynthesisPlugin")

  A modular adder (modulo $2^n$) without any ancillary qubits.

  The plugin name is :`ModularAdder.v17` which can be used as the key on an [`HLSConfig`](qiskit.transpiler.passes.HLSConfig "qiskit.transpiler.passes.HLSConfig") object to use this method with [`HighLevelSynthesis`](qiskit.transpiler.passes.HighLevelSynthesis "qiskit.transpiler.passes.HighLevelSynthesis").

  This plugin requires no auxiliary qubits.

  ## Methods

  ### run

  <Function id="qiskit.transpiler.passes.synthesis.hls_plugins.ModularAdderSynthesisV17.run" github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/passes/synthesis/hls_plugins.py#L1741-L1747" signature="run(high_level_object, coupling_map=None, target=None, qubits=None, **options)">
    Run synthesis for the given Operation.

    **Parameters**

    *   **high\_level\_object** ([*Operation*](qiskit.circuit.Operation "qiskit.circuit.Operation")) – The Operation to synthesize to a [`DAGCircuit`](qiskit.dagcircuit.DAGCircuit "qiskit.dagcircuit.DAGCircuit") object.
    *   **coupling\_map** ([*CouplingMap*](qiskit.transpiler.CouplingMap "qiskit.transpiler.CouplingMap")) – The coupling map of the backend in case synthesis is done on a physical circuit.
    *   **target** ([*Target*](qiskit.transpiler.Target "qiskit.transpiler.Target")) – A target representing the target backend.
    *   **qubits** ([*list*](https://docs.python.org/3/library/stdtypes.html#list)) – List of qubits over which the operation is defined in case synthesis is done on a physical circuit.
    *   **options** – Additional method-specific optional kwargs.

    **Returns**

    **The quantum circuit representation of the Operation**

    when successful, and `None` otherwise.

    **Return type**

    [QuantumCircuit](/docs/api/qiskit/qiskit.circuit.QuantumCircuit "qiskit.circuit.QuantumCircuit")
  </Function>
</Class>
