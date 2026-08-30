---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/qubit_mixed/sampling.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/qubit_mixed/sampling.py
license: Apache-2.0
---

## Module `pennylane/devices/qubit_mixed/sampling.py`

Submodule for sampling a qubit mixed state.

## `process_state_with_shots`

```python
def process_state_with_shots(mp, state, wire_order, shots, rng=None)
```

Sample 'shots' classical shadow snapshots from the given density matrix `state`.

Args:
    mp (ClassicalShadowMP or ShadowExpvalMP): The classical shadow measurement to perform
    state (np.ndarray): A (2^N, 2^N) density matrix for N qubits
    wire_order (qp.wires.Wires): The global wire ordering
    shots (int): Number of classical-shadow snapshots
    rng (None or int or Generator): Random seed for measurement bits

Returns:
    np.ndarray[int]: shape (2, shots, num_shadow_qubits).
        First row: measurement outcomes (0 or 1).
        Second row: Pauli basis recipe (0=X, 1=Y, 2=Z).

## `sample_state`

```python
def sample_state(state, shots: int, is_state_batched: bool=False, wires=None, rng=None, prng_key=None, readout_errors: list[Callable]=None) -> np.ndarray
```

Returns a series of computational basis samples of a state.

Args:
    state (array[complex]): A density matrix to be sampled
    shots (int): The number of samples to take
    is_state_batched (bool): whether the state is batched or not
    wires (Sequence[int]): The wires to sample
    rng (Union[None, int, array_like[int], SeedSequence, BitGenerator, Generator]):
        A seed-like parameter matching that of ``seed`` for ``numpy.random.default_rng``.
        If no value is provided, a default RNG will be used
    prng_key (Optional[jax.random.PRNGKey]): An optional ``jax.random.PRNGKey``. This is
        the key to the JAX pseudo random number generator. Only for simulation using JAX.
    readout_errors (List[Callable]): List of channels to apply to each wire being measured
    to simulate readout errors.

Returns:
    ndarray[int]: Sample values of the shape (shots, num_wires)

## `measure_with_samples`

```python
def measure_with_samples(measurements: list[SampleMeasurement | ClassicalShadowMP | ShadowExpvalMP], state: np.ndarray, shots: Shots, is_state_batched: bool=False, rng=None, prng_key=None, readout_errors: list[Callable]=None) -> TensorLike
```

Returns the samples of the measurement process performed on the given state.
This function assumes that the user-defined wire labels in the measurement process
have already been mapped to integer wires used in the device.

Args:
    mp (SampleMeasurement): The sample measurement to perform
    state (np.ndarray[complex]): The density matrix to sample from
    shots (Shots): The number of samples to take
    is_state_batched (bool): whether the state is batched or not
    rng (Union[None, int, array_like[int], SeedSequence, BitGenerator, Generator]): A
        seed-like parameter matching that of ``seed`` for ``numpy.random.default_rng``.
        If no value is provided, a default RNG will be used.
    prng_key (Optional[jax.random.PRNGKey]): An optional ``jax.random.PRNGKey``. This is
        the key to the JAX pseudo random number generator. Only for simulation using JAX.
    readout_errors (List[Callable]): List of channels to apply to each wire being measured
    to simulate readout errors.

Returns:
    TensorLike[Any]: Sample measurement results
