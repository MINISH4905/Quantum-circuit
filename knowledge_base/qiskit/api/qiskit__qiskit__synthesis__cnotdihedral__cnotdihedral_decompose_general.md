---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/cnotdihedral/cnotdihedral_decompose_general.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/cnotdihedral/cnotdihedral_decompose_general.py
license: Apache-2.0
---

## Module `qiskit/synthesis/cnotdihedral/cnotdihedral_decompose_general.py`

Circuit synthesis for the CNOTDihedral class.

## `synth_cnotdihedral_general`

```python
def synth_cnotdihedral_general(elem: CNOTDihedral) -> QuantumCircuit
```

Decompose a :class:`.CNOTDihedral` element into a :class:`.QuantumCircuit`.

Decompose a general :class:`.CNOTDihedral` elements.
The number of CX gates is not necessarily optimal.
For a decomposition of a 1-qubit or 2-qubit element, call
:func:`.synth_cnotdihedral_two_qubits`.

Args:
    elem: A :class:`.CNOTDihedral` element.

Returns:
    A circuit implementation of the :class:`.CNOTDihedral` element.

Raises:
    QiskitError: if the element could not be decomposed into a circuit.

References:
    1. Andrew W. Cross, Easwar Magesan, Lev S. Bishop, John A. Smolin and Jay M. Gambetta,
       *Scalable randomized benchmarking of non-Clifford gates*,
       npj Quantum Inf 2, 16012 (2016).
