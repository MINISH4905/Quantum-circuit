---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/pauli_gates.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/pauli_gates.py
license: Apache-2.0
---

## `Pauli`

```python
class Pauli(raw_types.Gate, metaclass=abc.ABCMeta)
```

Represents the Pauli gates.

This is an abstract class with no public subclasses. The only instances
of private subclasses are the X, Y, or Z Pauli gates defined below.

### `relative_index`

```python
def relative_index(self, second: Pauli) -> int
```

Relative index of self w.r.t. second in the (X, Y, Z) cycle.

### `on`

```python
def on(self, *qubits: cirq.Qid) -> SingleQubitPauliStringGateOperation
```

Returns an application of this gate to the given qubits.

Args:
    *qubits: The collection of qubits to potentially apply the gate to.

Raises:
    ValueError: If more than one qubit is acted upon.
