---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/cnotdihedral/cnotdihedral_decompose_full.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/cnotdihedral/cnotdihedral_decompose_full.py
license: Apache-2.0
---

## Module `qiskit/synthesis/cnotdihedral/cnotdihedral_decompose_full.py`

Circuit synthesis for the CNOTDihedral class for all-to-all connectivity.

## `synth_cnotdihedral_full`

```python
def synth_cnotdihedral_full(elem: CNOTDihedral) -> QuantumCircuit
```

Decompose a :class:`.CNOTDihedral` element into a :class:`.QuantumCircuit`.

For :math:`N \leq 2` qubits this is based on optimal CX-cost decomposition from reference [1].
For :math:`N > 2` qubits this is done using the general non-optimal compilation
routine from reference [2].

Args:
    elem: A :class:`.CNOTDihedral` element.

Returns:
    A circuit implementation of the :class:`.CNOTDihedral` element.

References:
    1. Shelly Garion and Andrew W. Cross, *Synthesis of CNOT-Dihedral circuits
       with optimal number of two qubit gates*, `Quantum 4(369), 2020
       <https://quantum-journal.org/papers/q-2020-12-07-369/>`_
    2. Andrew W. Cross, Easwar Magesan, Lev S. Bishop, John A. Smolin and Jay M. Gambetta,
       *Scalable randomized benchmarking of non-Clifford gates*,
       npj Quantum Inf 2, 16012 (2016).
