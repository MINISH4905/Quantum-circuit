---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/density_matrix_simulation_state.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/density_matrix_simulation_state.py
license: Apache-2.0
---

## Module `cirq-core/cirq/sim/density_matrix_simulation_state.py`

Objects and methods for acting efficiently on a density matrix.

## `DensityMatrixSimulationState`

```python
class DensityMatrixSimulationState(SimulationState[_BufferedDensityMatrix])
```

State and context for an operation acting on a density matrix.

To act on this object, directly edit the `target_tensor` property, which is
storing the density matrix of the quantum system with one axis per qubit.

### `__init__`

```python
def __init__(self, *, available_buffer: list[np.ndarray] | None=None, prng: np.random.RandomState | None=None, qubits: Sequence[cirq.Qid] | None=None, initial_state: np.ndarray | cirq.STATE_VECTOR_LIKE=0, dtype: type[np.complexfloating]=np.complex64, classical_data: cirq.ClassicalDataStore | None=None)
```

Inits DensityMatrixSimulationState.

Args:
    available_buffer: A workspace with the same shape and dtype as
        `target_tensor`. Used by operations that cannot be applied to
        `target_tensor` inline, in order to avoid unnecessary
        allocations.
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

Raises:
    ValueError: If `initial_state` is provided as integer, but `qubits`
        is not provided.
