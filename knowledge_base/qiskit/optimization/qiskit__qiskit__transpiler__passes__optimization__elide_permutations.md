---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/elide_permutations.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/elide_permutations.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/elide_permutations.py`

Remove any swap gates in the circuit by pushing it through into a qubit permutation.

## `ElidePermutations`

```python
class ElidePermutations(TransformationPass)
```

Remove permutation operations from a pre-layout circuit

This pass is intended to be run before a layout (mapping virtual qubits
to physical qubits) is set during the transpilation pipeline. This
pass iterates over the :class:`~.DAGCircuit` and when a :class:`~.SwapGate`
or :class:`~.PermutationGate` are encountered it permutes the virtual qubits in
the circuit and removes the swap gate. This will effectively remove any
:class:`~SwapGate`\s or :class:`~PermutationGate` in the circuit prior to running
layout. If this pass is run after a layout has been set it will become a no-op
(and log a warning) as this optimization is not sound after physical qubits are
selected and there are connectivity constraints to adhere to.

For tracking purposes this pass sets 3 values in the property set if there
are any :class:`~.SwapGate` or :class:`~.PermutationGate` objects in the circuit
and the pass isn't a no-op.

* ``original_layout``: The trivial :class:`~.Layout` for the input to this pass being run
* ``original_qubit_indices``: The mapping of qubit objects to positional indices for the state
    of the circuit as input to this pass.
* ``virtual_permutation_layout``: A :class:`~.Layout` object mapping input qubits to the output
    state after eliding permutations.

These three properties are needed for the transpiler to track the permutations in the out
:attr:`.QuantumCircuit.layout` attribute. The elision of permutations is equivalent to a
``final_layout`` set by routing and all three of these attributes are needed in the case

### `run`

```python
def run(self, dag)
```

Run the ElidePermutations pass on ``dag``.

Args:
    dag (DAGCircuit): the DAG to be optimized.

Returns:
    DAGCircuit: the optimized DAG.
