---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/utils/unroll_forloops.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/utils/unroll_forloops.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/utils/unroll_forloops.py`

UnrollForLoops transpilation pass

## `UnrollForLoops`

```python
class UnrollForLoops(TransformationPass)
```

``UnrollForLoops`` transpilation pass unrolls for-loops when possible.

### `__init__`

```python
def __init__(self, max_target_depth=-1)
```

Things like ``for x in {0, 3, 4} {rx(x) qr[1];}`` will turn into
``rx(0) qr[1]; rx(3) qr[1]; rx(4) qr[1];``.

.. note::
    The ``UnrollForLoops`` unrolls only one level of block depth. No inner loop will
    be considered by ``max_target_depth``.

Args:
    max_target_depth (int): Optional. Checks if the unrolled block is over a particular
        subcircuit depth. To disable the check, use ``-1`` (Default).

### `run`

```python
def run(self, dag)
```

Run the UnrollForLoops pass on ``dag``.

Args:
    dag (DAGCircuit): the directed acyclic graph to run on.

Returns:
    DAGCircuit: Transformed DAG.
