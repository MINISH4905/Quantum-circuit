---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/simulation_state.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/simulation_state.py
license: Apache-2.0
---

## Module `cirq-core/cirq/sim/simulation_state.py`

Objects and methods for acting efficiently on a state tensor.

## `SimulationState`

```python
class SimulationState(SimulationStateBase, Generic[TState], metaclass=abc.ABCMeta)
```

State and context for an operation acting on a state tensor.

### `__init__`

```python
def __init__(self, *, state: TState, prng: np.random.RandomState | None=None, qubits: Sequence[cirq.Qid] | None=None, classical_data: cirq.ClassicalDataStore | None=None)
```

Inits SimulationState.

Args:
    prng: The pseudo random number generator to use for probabilistic
        effects.
    qubits: Determines the canonical ordering of the qubits. This
        is often used in specifying the initial state, i.e. the
        ordering of the computational basis states.
    classical_data: The shared classical data container for this
        simulation.
    state: The underlying quantum state of the simulation.

### `measure`

```python
def measure(self, qubits: Sequence[cirq.Qid], key: str, invert_mask: Sequence[bool], confusion_map: dict[tuple[int, ...], np.ndarray]) -> None
```

Measures the qubits and records to `log_of_measurement_results`.

Any bitmasks will be applied to the measurement record.

Args:
    qubits: The qubits to measure.
    key: The key the measurement result should be logged under. Note
        that operations should only store results under keys they have
        declared in a `_measurement_key_names_` method.
    invert_mask: The invert mask for the measurement.
    confusion_map: The confusion matrices for the measurement.

Raises:
    ValueError: If a measurement key has already been logged to a key.

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

### `create_merged_state`

```python
def create_merged_state(self) -> Self
```

Creates a final merged state.

### `add_qubits`

```python
def add_qubits(self: Self, qubits: Sequence[cirq.Qid]) -> Self
```

Add `qubits` in the `|0>` state to a new state space and take the kron product.

Args:
    qubits: Sequence of qubits to be added.

Returns:
    NotImplemented: If the subclass does not implement this method.
    Self: A `cirq.SimulationState` with qubits added or `self` if there are no qubits to
        add.

### `remove_qubits`

```python
def remove_qubits(self: Self, qubits: Sequence[cirq.Qid]) -> Self
```

Remove `qubits` from the state space.

The qubits to be removed should be untangled from rest of the system and in the |0> state.

Args:
    qubits: Sequence of qubits to be removed.

Returns:
    NotImplemented: If the subclass does not implement this method.
    Self: A `cirq.SimulationState` with qubits removed or `self` if there are no qubits to
        remove.

### `kronecker_product`

```python
def kronecker_product(self, other: Self, *, inplace=False) -> Self
```

Joins two state spaces together.

### `factor`

```python
def factor(self, qubits: Sequence[cirq.Qid], *, validate=True, atol=1e-07, inplace=False) -> tuple[Self, Self]
```

Splits two state spaces after a measurement or reset.

### `allows_factoring`

```python
def allows_factoring(self) -> bool
```

Subclasses that allow factorization should override this.

### `transpose_to_qubit_order`

```python
def transpose_to_qubit_order(self, qubits: Sequence[cirq.Qid], *, inplace=False) -> Self
```

Physically reindexes the state by the new basis.

Args:
    qubits: The desired qubit order.
    inplace: True to perform this operation inplace.

Returns:
    The state with qubit order transposed and underlying representation
    updated.

Raises:
    ValueError: If the provided qubits do not match the existing ones.

### `swap`

```python
def swap(self, q1: cirq.Qid, q2: cirq.Qid, *, inplace=False) -> Self
```

Swaps two qubits.

This only affects the index, and does not modify the underlying
state.

Args:
    q1: The first qubit to swap.
    q2: The second qubit to swap.
    inplace: True to swap the qubits in the current object, False to
        create a copy with the qubits swapped.

Returns:
    The original object with the qubits swapped if inplace is
    requested, or a copy of the original object with the qubits swapped
    otherwise.

Raises:
    ValueError: If the qubits are of different dimensionality.

### `rename`

```python
def rename(self, q1: cirq.Qid, q2: cirq.Qid, *, inplace=False) -> Self
```

Renames `q1` to `q2`.

Args:
    q1: The qubit to rename.
    q2: The new name.
    inplace: True to rename the qubit in the current object, False to
        create a copy with the qubit renamed.

Returns:
    The original object with the qubits renamed if inplace is
    requested, or a copy of the original object with the qubits renamed
    otherwise.

Raises:
    ValueError: If the qubits are of different dimensionality.
