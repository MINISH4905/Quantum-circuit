---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/basis/unroll_3q_or_more.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/basis/unroll_3q_or_more.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/basis/unroll_3q_or_more.py`

Recursively expands 3q+ gates until the circuit only contains 2q or 1q gates.

## `Unroll3qOrMore`

```python
class Unroll3qOrMore(TransformationPass)
```

Recursively expands 3q+ gates until the circuit only contains 2q or 1q gates.

### `__init__`

```python
def __init__(self, target=None, basis_gates=None)
```

Initialize the Unroll3qOrMore pass

Args:
    target (Target): The target object representing the compilation
        target. If specified any multi-qubit instructions in the
        circuit when the pass is run that are supported by the target
        device will be left in place. If both this and ``basis_gates``
        are specified only the target will be checked.
    basis_gates (list): A list of basis gate names that the target
        device supports. If specified any gate names in the circuit
        which are present in this list will not be unrolled. If both
        this and ``target`` are specified only the target will be used
        for checking which gates are supported.

### `run`

```python
def run(self, dag)
```

Run the Unroll3qOrMore pass on `dag`.

Args:
    dag(DAGCircuit): input dag
Returns:
    DAGCircuit: output dag with maximum node degrees of 2
Raises:
    QiskitError: if a 3q+ gate is not decomposable
