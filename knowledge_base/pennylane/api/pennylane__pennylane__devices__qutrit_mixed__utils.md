---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/qutrit_mixed/utils.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/qutrit_mixed/utils.py
license: Apache-2.0
---

## Module `pennylane/devices/qutrit_mixed/utils.py`

Functions and variables to be utilized by qutrit mixed state simulator.

## `get_einsum_mapping`

```python
def get_einsum_mapping(op: qp.operation.Operator, state, map_indices, is_state_batched: bool=False)
```

Finds the indices for einsum to apply kraus operators to a mixed state

Args:
    op (Operator): Operator to apply to the quantum state
    state (array[complex]): Input quantum state
    map_indices (function): Maps the calculated indices to an einsum indices string
    is_state_batched (bool): Boolean representing whether the state is batched or not

Returns:
    str: Indices mapping that defines the einsum

## `reshape_state_as_matrix`

```python
def reshape_state_as_matrix(state, num_wires)
```

Given a non-flat, potentially batched state, flatten it to square matrix or matrices if batched.

Args:
    state (TensorLike): A state that needs to be reshaped to a square matrix or matrices if batched
    num_wires (int): The number of wires the state represents

Returns:
    Tensorlike: A reshaped, square state, with an extra batch dimension if necessary

## `get_num_wires`

```python
def get_num_wires(state, is_state_batched: bool=False)
```

Finds the number of wires associated with a state

Args:
    state (TensorLike): A device compatible state that may or may not be batched
    is_state_batched (int): Boolean representing whether the state is batched or not

Returns:
    int: Number of wires associated with state

## `get_new_state_einsum_indices`

```python
def get_new_state_einsum_indices(old_indices, new_indices, state_indices)
```

Retrieves the einsum indices string for the new state

Args:
    old_indices (str): indices that are summed
    new_indices (str): indices that must be replaced with sums
    state_indices (str): indices of the original state

Returns:
    str: The einsum indices of the new state
