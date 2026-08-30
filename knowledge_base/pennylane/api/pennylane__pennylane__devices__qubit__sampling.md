---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/qubit/sampling.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/qubit/sampling.py
license: Apache-2.0
---

## Module `pennylane/devices/qubit/sampling.py`

Functions to sample a state.

## `jax_random_split`

```python
def jax_random_split(prng_key, num: int=2)
```

Get a new key with ``jax.random.split``.

## `get_num_shots_and_executions`

```python
def get_num_shots_and_executions(tape: qp.tape.QuantumScript) -> tuple[int, int]
```

Get the total number of qpu executions and shots.

Args:
    tape (qp.tape.QuantumTape): the tape we want to get the number of executions and shots for

Returns:
    int, int: the total number of QPU executions and the total number of shots

## `measure_with_samples`

```python
def measure_with_samples(measurements: list[SampleMeasurement | ClassicalShadowMP | ShadowExpvalMP], state: np.ndarray, shots: Shots, is_state_batched: bool=False, rng=None, prng_key=None, mid_measurements: dict=None) -> list[TensorLike]
```

Returns the samples of the measurement process performed on the given state.
This function assumes that the user-defined wire labels in the measurement process
have already been mapped to integer wires used in the device.

Args:
    measurements (List[Union[SampleMeasurement, ClassicalShadowMP, ShadowExpvalMP]]):
        The sample measurements to perform
    state (np.ndarray[complex]): The state vector to sample from
    shots (Shots): The number of samples to take
    is_state_batched (bool): whether the state is batched or not
    rng (Union[None, int, array_like[int], SeedSequence, BitGenerator, Generator]): A
        seed-like parameter matching that of ``seed`` for ``numpy.random.default_rng``.
        If no value is provided, a default RNG will be used.
    prng_key (Optional[jax.random.PRNGKey]): An optional ``jax.random.PRNGKey``. This is
        the key to the JAX pseudo random number generator. Only for simulation using JAX.
    mid_measurements (None, dict): Dictionary of mid-circuit measurements

Returns:
    List[TensorLike[Any]]: Sample measurement results

## `sample_state`

```python
def sample_state(state, shots: int, is_state_batched: bool=False, wires=None, rng=None, prng_key=None) -> np.ndarray
```

Returns a series of samples of a state.

Args:
    state (array[complex]): A state vector to be sampled
    shots (int): The number of samples to take
    is_state_batched (bool): whether the state is batched or not
    wires (Sequence[int]): The wires to sample
    rng (Union[None, int, array_like[int], SeedSequence, BitGenerator, Generator]):
        A seed-like parameter matching that of ``seed`` for ``numpy.random.default_rng``.
        If no value is provided, a default RNG will be used
    prng_key (Optional[jax.random.PRNGKey]): An optional ``jax.random.PRNGKey``. This is
        the key to the JAX pseudo random number generator. Only for simulation using JAX.

Returns:
    ndarray[int]: Sample values of the shape (shots, num_wires)

## `sample_probs`

```python
def sample_probs(probs, shots, num_wires, is_state_batched, rng, prng_key=None)
```

Sample from given probabilities, dispatching between JAX and NumPy implementations.

Args:
    probs (array): The probabilities to sample from
    shots (int): The number of samples to take
    num_wires (int): The number of wires to sample
    is_state_batched (bool): whether the state is batched or not
    rng (Union[None, int, array_like[int], SeedSequence, BitGenerator, Generator]):
        A seed-like parameter matching that of ``seed`` for ``numpy.random.default_rng``.
        If no value is provided, a default RNG will be used
    prng_key (Optional[jax.random.PRNGKey]): An optional ``jax.random.PRNGKey``. This is
        the key to the JAX pseudo random number generator. Only for simulation using JAX.
