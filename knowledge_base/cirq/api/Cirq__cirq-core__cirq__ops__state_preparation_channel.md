---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/state_preparation_channel.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/state_preparation_channel.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/state_preparation_channel.py`

Quantum gates to prepare a given target state.

## `StatePreparationChannel`

```python
class StatePreparationChannel(raw_types.Gate)
```

A channel which prepares any state provided as the state vector on it's target qubits.

### `__init__`

```python
def __init__(self, target_state: np.ndarray, *, name: str='StatePreparation') -> None
```

Initializes a State Preparation channel.

Args:
    target_state: The state vector that this gate should prepare.
    name: the name of the gate, used when printing it in the circuit diagram

Raises:
    ValueError: if the array is not 1D, or does not have 2**n elements for some integer n.
