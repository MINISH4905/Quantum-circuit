---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/qutrit_mixed/simulate.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/qutrit_mixed/simulate.py
license: Apache-2.0
---

## Module `pennylane/devices/qutrit_mixed/simulate.py`

Simulate a quantum script for a qutrit mixed state device.

## `get_final_state`

```python
def get_final_state(circuit, debugger=None, interface=None, **kwargs)
```

Get the final state that results from executing the given quantum script.

This is an internal function that will be called by ``default.qutrit.mixed``.

Args:
    circuit (.QuantumScript): The single circuit to simulate
    debugger (._Debugger): The debugger to use
    interface (str): The machine learning interface to create the initial state with

Returns:
    Tuple[TensorLike, bool]: A tuple containing the final state of the quantum script and
        whether the state has a batch dimension.

## `measure_final_state`

```python
def measure_final_state(circuit, state, is_state_batched, rng=None, prng_key=None, readout_errors=None) -> Result
```

Perform the measurements required by the circuit on the provided state.

This is an internal function that will be called by ``default.qutrit.mixed``.

Args:
    circuit (.QuantumScript): The single circuit to simulate
    state (TensorLike): The state to perform measurement on
    is_state_batched (bool): Whether the state has a batch dimension or not.
    rng (Union[None, int, array_like[int], SeedSequence, BitGenerator, Generator]): A
        seed-like parameter matching that of ``seed`` for ``numpy.random.default_rng``.
        If no value is provided, a default RNG will be used.
    prng_key (Optional[jax.random.PRNGKey]): An optional ``jax.random.PRNGKey``. This is
        the key to the JAX pseudo random number generator. Only for simulation using JAX.
        If None, the default ``sample_state`` function and a ``numpy.random.default_rng``
        will be for sampling.
    readout_errors (List[Callable]): List of channels to apply to each wire being measured
    to simulate readout errors.

Returns:
    Tuple[TensorLike]: The measurement results

## `simulate`

```python
def simulate(circuit: qp.tape.QuantumScript, rng=None, prng_key=None, debugger=None, interface=None, readout_errors=None) -> Result
```

Simulate a single quantum script.

This is an internal function that will be called by ``default.qutrit.mixed``.

Args:
    circuit (QuantumTape): The single circuit to simulate
    rng (Union[None, int, array_like[int], SeedSequence, BitGenerator, Generator]): A
        seed-like parameter matching that of ``seed`` for ``numpy.random.default_rng``.
        If no value is provided, a default RNG will be used.
    prng_key (Optional[jax.random.PRNGKey]): An optional ``jax.random.PRNGKey``. This is
        the key to the JAX pseudo random number generator. If None, a random key will be
        generated. Only for simulation using JAX.
    debugger (_Debugger): The debugger to use
    interface (str): The machine learning interface to create the initial state with
    readout_errors (List[Callable]): List of channels to apply to each wire being measured
    to simulate readout errors.

Returns:
    tuple(TensorLike): The results of the simulation

Note that this function can return measurements for non-commuting observables simultaneously.

This function assumes that all operations provide matrices.

>>> qs = qp.tape.QuantumScript([qp.TRX(1.2, wires=0)], [qp.expval(qp.GellMann(0, 3)), qp.probs(wires=(0,1))])
>>> simulate(qs)
(np.float64(0.36235775447667357), array([0.68117888, 0.        , 0.        , 0.31882112, 0.        ,
       0.        , 0.        , 0.        , 0.        ]))
