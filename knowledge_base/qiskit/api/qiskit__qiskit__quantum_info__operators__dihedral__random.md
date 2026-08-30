---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/dihedral/random.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/dihedral/random.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/dihedral/random.py`

Random CNOTDihedral operator functions

## `random_cnotdihedral`

```python
def random_cnotdihedral(num_qubits, seed=None)
```

Return a random CNOTDihedral element.

Args:
    num_qubits (int): the number of qubits for the CNOTDihedral object.
    seed (int or RandomState): Optional. Set a fixed seed or
                               generator for RNG.
Returns:
    CNOTDihedral: a random CNOTDihedral element.
