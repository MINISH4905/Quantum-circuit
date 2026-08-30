---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/state_vector_simulation_state.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/state_vector_simulation_state.py
license: Apache-2.0
---

## Module `cirq-core/cirq/sim/state_vector_simulation_state.py`

Objects and methods for acting efficiently on a state vector.

## `StateVectorSimulationState`

```python
class StateVectorSimulationState(SimulationState[_BufferedStateVector])
```

State and context for an operation acting on a state vector.

There are two common ways to act on this object:

1. Directly edit the `target_tensor` property, which is storing the state
    vector of the quantum system as a numpy array with one axis per qudit.
2. Overwrite the `available_buffer` property with the new state vector, and
    then pass `available_buffer` into `swap_target_tensor_for`.

### `__init__`

```python
def __init__(self, *, available_buffer: np.ndarray | None=None, prng: np.random.RandomState | None=None, qubits: Sequence[cirq.Qid] | None=None, initial_state: np.ndarray | cirq.STATE_VECTOR_LIKE=0, dtype: type[np.complexfloating] | np.dtype[np.complexfloating]=np.complex64, classical_data: cirq.ClassicalDataStore | None=None)
```

Inits StateVectorSimulationState.

Args:
    available_buffer: A workspace with the same shape and dtype as
        `target_tensor`. Used by operations that cannot be applied to
        `target_tensor` inline, in order to avoid unnecessary
        allocations. Passing `available_buffer` into
        `swap_target_tensor_for` will swap it for `target_tensor`.
    qubits: Determines the canonical ordering of the qubits. This
        is often used in specifying the initial state, i.e. the
        ordering of the computational basis states.
    prng: The pseudo random number generator to use for probabilistic
        effects.
    initial_state: The initial state for the simulation in the
        computational basis.
    dtype: The `numpy.dtype` of the inferred state vector. One of
        `numpy.complex64` or `numpy.complex128`. Only used when
        `target_tenson` is None.
    classical_data: The shared classical data container for this
        simulation.
