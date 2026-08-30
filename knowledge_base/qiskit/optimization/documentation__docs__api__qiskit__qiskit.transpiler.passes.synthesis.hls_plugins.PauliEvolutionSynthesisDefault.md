---
framework: qiskit
api_version: 1a3b8eb3e102
doc_type: optimization
source_path: docs/api/qiskit/qiskit.transpiler.passes.synthesis.hls_plugins.PauliEvolutionSynthesisDefault.mdx
source_url: https://github.com/Qiskit/documentation/blob/1a3b8eb3e102668f9612ac64c80f384b28683681/docs/api/qiskit/qiskit.transpiler.passes.synthesis.hls_plugins.PauliEvolutionSynthesisDefault.mdx
license: CC-BY-SA-4.0
---

# PauliEvolutionSynthesisDefault

<Class id="qiskit.transpiler.passes.synthesis.hls_plugins.PauliEvolutionSynthesisDefault" isDedicatedPage={true} github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/passes/synthesis/hls_plugins.py#L2066-L2092" signature="qiskit.transpiler.passes.synthesis.hls_plugins.PauliEvolutionSynthesisDefault" modifiers="class">
  Bases: [`HighLevelSynthesisPlugin`](qiskit.transpiler.passes.synthesis.plugin.HighLevelSynthesisPlugin "qiskit.transpiler.passes.synthesis.plugin.HighLevelSynthesisPlugin")

  Synthesize a [`PauliEvolutionGate`](qiskit.circuit.library.PauliEvolutionGate "qiskit.circuit.library.PauliEvolutionGate") using the default synthesis algorithm.

  This plugin name is:`PauliEvolution.default` which can be used as the key on an [`HLSConfig`](qiskit.transpiler.passes.HLSConfig "qiskit.transpiler.passes.HLSConfig") object to use this method with [`HighLevelSynthesis`](qiskit.transpiler.passes.HighLevelSynthesis "qiskit.transpiler.passes.HighLevelSynthesis").

  The following plugin option can be set:

  *   **preserve\_order: If `False`, allow re-ordering the Pauli terms in the Hamiltonian to**

      reduce the circuit depth of the decomposition.

  ## Methods

  ### run

  <Function id="qiskit.transpiler.passes.synthesis.hls_plugins.PauliEvolutionSynthesisDefault.run" github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/passes/synthesis/hls_plugins.py#L2079-L2092" signature="run(high_level_object, coupling_map=None, target=None, qubits=None, **options)">
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
