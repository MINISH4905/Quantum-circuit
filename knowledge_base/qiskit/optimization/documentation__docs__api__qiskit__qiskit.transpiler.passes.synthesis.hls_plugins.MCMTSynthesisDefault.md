---
framework: qiskit
api_version: 1a3b8eb3e102
doc_type: optimization
source_path: docs/api/qiskit/qiskit.transpiler.passes.synthesis.hls_plugins.MCMTSynthesisDefault.mdx
source_url: https://github.com/Qiskit/documentation/blob/1a3b8eb3e102668f9612ac64c80f384b28683681/docs/api/qiskit/qiskit.transpiler.passes.synthesis.hls_plugins.MCMTSynthesisDefault.mdx
license: CC-BY-SA-4.0
---

# MCMTSynthesisDefault

<Class id="qiskit.transpiler.passes.synthesis.hls_plugins.MCMTSynthesisDefault" isDedicatedPage={true} github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/passes/synthesis/hls_plugins.py#L1559-L1577" signature="qiskit.transpiler.passes.synthesis.hls_plugins.MCMTSynthesisDefault" modifiers="class">
  Bases: [`HighLevelSynthesisPlugin`](qiskit.transpiler.passes.synthesis.plugin.HighLevelSynthesisPlugin "qiskit.transpiler.passes.synthesis.plugin.HighLevelSynthesisPlugin")

  A default decomposition for MCMT gates.

  ## Methods

  ### run

  <Function id="qiskit.transpiler.passes.synthesis.hls_plugins.MCMTSynthesisDefault.run" github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/passes/synthesis/hls_plugins.py#L1562-L1577" signature="run(high_level_object, coupling_map=None, target=None, qubits=None, **options)">
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
