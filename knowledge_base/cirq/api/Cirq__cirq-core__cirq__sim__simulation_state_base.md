---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/simulation_state_base.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/simulation_state_base.py
license: Apache-2.0
---

## Module `cirq-core/cirq/sim/simulation_state_base.py`

An interface for quantum states as targets for operations.

## `SimulationStateBase`

```python
class SimulationStateBase(Generic[TSimulationState], metaclass=abc.ABCMeta)
```

An interface for quantum states as targets for operations.

### `__init__`

```python
def __init__(self, *, qubits: Sequence[cirq.Qid], classical_data: cirq.ClassicalDataStore | None=None)
```

Initializes the class.

Args:
    qubits: The canonical ordering of qubits.
    classical_data: The shared classical data container for this
        simulation.

### `create_merged_state`

```python
def create_merged_state(self) -> TSimulationState
```

Creates a final merged state.

### `copy`

```python
def copy(self, deep_copy_buffers: bool=True) -> Self
```

Creates a copy of the object.

Args:
    deep_copy_buffers: If True, buffers will also be deep-copied.
    Otherwise the copy will share a reference to the original object's
    buffers.

Returns:
    A copied instance.

### `log_of_measurement_results`

```python
def log_of_measurement_results(self) -> dict[str, list[int]]
```

Gets the log of measurement results.

### `sample`

```python
def sample(self, qubits: list[cirq.Qid], repetitions: int=1, seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> np.ndarray
```

Samples the state value.

### `__getitem__`

```python
def __getitem__(self, item: cirq.Qid | None) -> TSimulationState
```

Gets the item associated with the qubit.

### `__len__`

```python
def __len__(self) -> int
```

Gets the number of items in the mapping.

### `__iter__`

```python
def __iter__(self) -> Iterator[cirq.Qid | None]
```

Iterates the keys of the mapping.
