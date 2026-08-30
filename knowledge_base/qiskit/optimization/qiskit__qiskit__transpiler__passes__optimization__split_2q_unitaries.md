---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/split_2q_unitaries.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/split_2q_unitaries.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/split_2q_unitaries.py`

Splits each two-qubit gate in the `dag` into two single-qubit gates, if possible without error.

## `Split2QUnitaries`

```python
class Split2QUnitaries(TransformationPass)
```

Attempt to split two-qubit unitaries in a :class:`.DAGCircuit` into two single-qubit gates.

This pass will analyze all :class:`.UnitaryGate` instances and determine whether the
matrix is actually a product of 2 single qubit gates. In these cases the 2q gate can be
simplified into two single qubit gates and this pass will perform this optimization and will
replace the two qubit gate with two single qubit :class:`.UnitaryGate`.

If some of the gates can be viewed as a swap joined by the product of 2 single qubit gates,
the pass will recreate the DAG, permuting the swapped qubits similar
to how it's done in :class:`ElidePermutations`.

### `__init__`

```python
def __init__(self, fidelity: float=1.0 - 1e-16, split_swap: bool=False)
```

Args:
    fidelity: Allowed tolerance for splitting two-qubit unitaries and gate decompositions.
    split_swap: Whether to attempt to split swap gates, resulting in a permutation of the qubits.

### `run`

```python
def run(self, dag: DAGCircuit) -> DAGCircuit
```

Run the Split2QUnitaries pass on `dag`.
