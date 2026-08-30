---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/unitary/aqc/cnot_structures.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/unitary/aqc/cnot_structures.py
license: Apache-2.0
---

## Module `qiskit/synthesis/unitary/aqc/cnot_structures.py`

These are the CNOT structure methods: anything that you need for creating CNOT structures.

## `make_cnot_network`

```python
def make_cnot_network(num_qubits: int, network_layout: str='spin', connectivity_type: str='full', depth: int=0) -> np.ndarray
```

Generates a network consisting of building blocks each containing a CNOT gate and possibly some
single-qubit ones. This network models a quantum operator in question. Note, each building
block has 2 input and outputs corresponding to a pair of qubits. What we actually return here
is a chain of indices of qubit pairs shared by every building block in a row.

Args:
    num_qubits: number of qubits.
    network_layout: type of network geometry, ``{"sequ", "spin", "cart", "cyclic_spin",
        "cyclic_line"}``.
    connectivity_type: type of inter-qubit connectivity, ``{"full", "line", "star"}``.
    depth: depth of the CNOT-network, i.e. the number of layers, where each layer consists of
        a single CNOT-block; default value will be selected, if ``L <= 0``.

Returns:
    A matrix of size ``(2, N)`` matrix that defines layers in cnot-network, where ``N``
        is either equal ``L``, or defined by a concrete type of the network.

Raises:
     ValueError: if unsupported type of CNOT-network layout or number of qubits or combination
        of parameters are passed.
