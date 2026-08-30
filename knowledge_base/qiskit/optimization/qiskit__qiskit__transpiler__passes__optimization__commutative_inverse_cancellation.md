---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/commutative_inverse_cancellation.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/commutative_inverse_cancellation.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/commutative_inverse_cancellation.py`

Cancel pairs of inverse gates exploiting commutation relations.

## `CommutativeInverseCancellation`

```python
class CommutativeInverseCancellation(TransformationPass)
```

Cancel pairs of inverse gates exploiting commutation relations.

### `__init__`

```python
def __init__(self, matrix_based: bool=False, max_qubits: int=4)
```

Args:
    matrix_based: If ``True``, uses matrix representations to check whether two
        operations are inverse of each other. This makes the checks more powerful,
        and, in addition, allows canceling pairs of operations that are inverse up to a
        phase, while updating the global phase of the circuit accordingly.
        Generally this leads to more reductions at the expense of increased runtime.
    max_qubits: Limits the number of qubits in matrix-based commutativity and
        inverse checks.

### `run`

```python
def run(self, dag: DAGCircuit)
```

Run the CommutativeInverseCancellation pass on `dag`.

Args:
    dag: the directed acyclic graph to run on.

Returns:
    DAGCircuit: Transformed DAG.
