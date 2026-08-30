---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/ghz/ghz_1d.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/ghz/ghz_1d.py
license: Apache-2.0
---

## `generate_1d_ghz_circuit`

```python
def generate_1d_ghz_circuit(qubits: Sequence[ops.Qid], add_dd: bool=True, dd_sequence: tuple[ops.Gate, ...]=(ops.X, ops.Y, ops.X, ops.Y), from_one_end: bool=False) -> circuits.Circuit
```

Circuit to create a GHZ state on qubits with 1D connectivity.

Args:
    qubits: A list of qubits such that CZ gates are possible between qubits[i] and qubits[i+1].
    add_dd: Whether to add dynamical decoupling to the circuit, done by adding gates.
    dd_sequence: The sequence of gates to insert for dynamical decoupling.
    from_one_end: Whether to grow the GHZ state from one end instead of the center.

Returns:
    A circuit to prepare the GHZ state.
