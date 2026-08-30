---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/commutative_optimization.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/commutative_optimization.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/commutative_optimization.py`

Commutative Optimization transpiler pass.

## `CommutativeOptimization`

```python
class CommutativeOptimization(TransformationPass)
```

Cancel/merge gates exploiting commutativity relations.

Specifically, the pass:

* Cancels pairs of inverse gates, including pairs that are
  inverse up to a global phase (adjusting the global phase
  if necessary).
* Attempts to merge consecutive gates when possible, for example
  sequences of RZ-gates, RX-gates, Pauli rotations, and so on.

This pass unifies and extends the functionality of both
:class:`.CommutativeCancellation` and
:class:`.CommutativeInverseCancellation`.

### `__init__`

```python
def __init__(self, approximation_degree: float=1.0, matrix_max_num_qubits: int=0)
```

Args:
    approximation_degree: the threshold used in the average gate fidelity
        computation to decide whether pairs of gates can be considered as
        canceling or commuting.
    matrix_max_num_qubits: Upper-bound on the number of qubits for the matrix-based
        commutativity and inverse checks.

### `run`

```python
def run(self, dag)
```

Run the CommutativeOptimization pass on `dag`.

Args:
    dag (DAGCircuit): the DAG to be optimized.

Returns:
    DAGCircuit: the optimized DAG.
