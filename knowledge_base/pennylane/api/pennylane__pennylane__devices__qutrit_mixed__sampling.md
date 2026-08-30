---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/qutrit_mixed/sampling.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/qutrit_mixed/sampling.py
license: Apache-2.0
---

## Module `pennylane/devices/qutrit_mixed/sampling.py`

Code relevant for sampling a qutrit mixed state.

## `sample_state`

```python
def sample_state(state, shots: int, is_state_batched: bool=False, wires=None, rng=None, prng_key=None, readout_errors: list[Callable]=None) -> np.ndarray
```

Returns a series of computational basis samples of a state.

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
    readout_errors (List[Callable]): List of channels to apply to each wire being measured
    to simulate readout errors.

Returns:
    ndarray[int]: Sample values of the shape (shots, num_wires)

## `sample_probs`

```python
def sample_probs(probs, shots, num_wires, is_state_batched, rng)
```

Sample from a probability distribution for a qutrit system.

This function generates samples based on the given probability distribution
for a qutrit system with a specified number of wires. It can handle both
batched and non-batched probability distributions.

Args:
    probs (ndarray): Probability distribution to sample from. For non-batched
        input, this should be a 1D array of length QUDIT_DIM**num_wires. For
        batched input, this should be a 2D array where each row is a separate
        probability distribution.
    shots (int): Number of samples to generate.
    num_wires (int): Number of wires in the qutrit system.
    is_state_batched (bool): Whether the input probabilities are batched.
    rng (Optional[Generator]): Random number generator to use. If None, a new
        generator will be created.

Returns:
    ndarray: An array of samples. For non-batched input, the shape is
    (shots, num_wires). For batched input, the shape is
    (batch_size, shots, num_wires).

Example:
    >>> probs = np.array([0.2, 0.3, 0.5])  # For a single-wire qutrit system
    >>> shots = 1000
    >>> num_wires = 1
    >>> is_state_batched = False
    >>> rng = np.random.default_rng(42)
    >>> samples = sample_probs(probs, shots, num_wires, is_state_batched, rng)
    >>> samples.shape
    (1000, 1)

## `measure_with_samples`

```python
def measure_with_samples(mp: SampleMeasurement, state: np.ndarray, shots: Shots, is_state_batched: bool=False, rng=None, prng_key=None, readout_errors: list[Callable]=None) -> TensorLike
```

Returns the samples of the measurement process performed on the given state.
This function assumes that the user-defined wire labels in the measurement process
have already been mapped to integer wires used in the device.

Args:
    mp (SampleMeasurement): The sample measurement to perform
    state (np.ndarray[complex]): The state vector to sample from
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
