---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/commutative_cancellation.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/commutative_cancellation.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/commutative_cancellation.py`

Cancel the redundant (self-adjoint) gates through commutation relations.

## `CommutativeCancellation`

```python
class CommutativeCancellation(TransformationPass)
```

Cancel the redundant (self-adjoint) gates through commutation relations.

Pass for cancelling self-inverse gates/rotations. The cancellation utilizes
the commutation relations in the circuit. Gates considered include::

    H, X, Y, Z, CX, CY, CZ


This pass is multithreaded and will potentially launch a thread pool
with threads equal to the number of CPUs by default. You can tune the
number of threads with the ``RAYON_NUM_THREADS`` environment variable.
For example, setting ``RAYON_NUM_THREADS=4`` would limit the thread pool
to 4 threads.

### `__init__`

```python
def __init__(self, basis_gates=None, target=None)
```

CommutativeCancellation initializer.

Args:
    basis_gates (list[str]): Basis gates to consider, e.g.
        ``['u3', 'cx']``. For the effects of this pass, the basis is
        the set intersection between the ``basis_gates`` parameter
        and the gates in the dag.
    target (Target): The :class:`~.Target` representing the target backend, if both
        ``basis_gates`` and ``target`` are specified then this argument will take
        precedence and ``basis_gates`` will be ignored.

### `run`

```python
def run(self, dag)
```

Run the CommutativeCancellation pass on `dag`.

Args:
    dag (DAGCircuit): the DAG to be optimized.

Returns:
    DAGCircuit: the optimized DAG.
