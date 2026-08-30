---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/pauli_interaction_gate.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/pauli_interaction_gate.py
license: Apache-2.0
---

## `PauliInteractionGate`

```python
class PauliInteractionGate(gate_features.InterchangeableQubitsGate, eigen_gate.EigenGate)
```

A CZ conjugated by arbitrary single qubit Cliffords.

### `__init__`

```python
def __init__(self, pauli0: pauli_gates.Pauli, invert0: bool, pauli1: pauli_gates.Pauli, invert1: bool, *, exponent: value.TParamVal=1.0) -> None
```

Inits PauliInteractionGate.

Args:
    pauli0: The interaction axis for the first qubit.
    invert0: Whether to condition on the +1 or -1 eigenvector of the
        first qubit's interaction axis.
    pauli1: The interaction axis for the second qubit.
    invert1: Whether to condition on the +1 or -1 eigenvector of the
        second qubit's interaction axis.
    exponent: Determines the amount of phasing to apply to the vector
        equal to the tensor product of the two conditions.
