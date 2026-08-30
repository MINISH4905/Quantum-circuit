---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/optimize_1q_decomposition.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/optimize_1q_decomposition.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/optimize_1q_decomposition.py`

Optimize chains of single-qubit gates using Euler 1q decomposer

## `Optimize1qGatesDecomposition`

```python
class Optimize1qGatesDecomposition(TransformationPass)
```

Optimize chains of single-qubit gates by combining them into a single gate.

The decision to replace the original chain with a new re-synthesis depends on:
 - whether the original chain was out of basis: replace
 - whether the original chain was in basis but re-synthesis is lower error: replace
 - whether the original chain amounts to identity: replace with null

 Error is computed as a multiplication of the errors of individual gates on that qubit.

This class is multithreaded and will potentially launch a thread pool
with threads equal to the number of CPUs by default. You can tune the
number of threads with the ``RAYON_NUM_THREADS`` environment variable.
For example, setting ``RAYON_NUM_THREADS=4`` would limit the thread pool
to 4 threads.

### `__init__`

```python
def __init__(self, basis=None, target=None)
```

Optimize1qGatesDecomposition initializer.

Args:
    basis (list[str]): Basis gates to consider, e.g. `['u3', 'cx']`. For the effects
        of this pass, the basis is the set intersection between the `basis` parameter
        and the Euler basis. Ignored if ``target`` is also specified.
    target (Optional[Target]): The :class:`~.Target` object corresponding to the compilation
        target. When specified, any argument specified for ``basis_gates`` is ignored.

### `run`

```python
def run(self, dag)
```

Run the Optimize1qGatesDecomposition pass on `dag`.

Args:
    dag (DAGCircuit): the DAG to be optimized.

Returns:
    DAGCircuit: the optimized DAG.
