---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/basis/unroll_custom_definitions.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/basis/unroll_custom_definitions.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/basis/unroll_custom_definitions.py`

Unrolls instructions with custom definitions.

## `UnrollCustomDefinitions`

```python
class UnrollCustomDefinitions(TransformationPass)
```

Unrolls instructions with custom definitions.

### `__init__`

```python
def __init__(self, equivalence_library, basis_gates=None, target=None, min_qubits=0)
```

Unrolls instructions with custom definitions.

Args:
    equivalence_library (EquivalenceLibrary): The equivalence library
        which will be used by the BasisTranslator pass. (Instructions in
        this library will not be unrolled by this pass.)
    basis_gates (Optional[list[str]]): Target basis names to unroll to, e.g. ``['u3', 'cx']``.
        Ignored if ``target`` is also specified.
    target (Optional[Target]): The :class:`~.Target` object corresponding to the compilation
        target. When specified, any argument specified for ``basis_gates`` is ignored.
    min_qubits (int): The minimum number of qubits for operations in the input
        dag to translate.

### `run`

```python
def run(self, dag)
```

Run the UnrollCustomDefinitions pass on `dag`.

Args:
    dag (DAGCircuit): input dag

Raises:
    QiskitError: if unable to unroll given the basis due to undefined
    decomposition rules (such as a bad basis) or excessive recursion.

Returns:
    DAGCircuit: output unrolled dag
