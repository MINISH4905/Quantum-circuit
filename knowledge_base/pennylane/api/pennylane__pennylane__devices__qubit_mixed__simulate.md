---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/qubit_mixed/simulate.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/qubit_mixed/simulate.py
license: Apache-2.0
---

## Module `pennylane/devices/qubit_mixed/simulate.py`

Simulate a quantum script for a qubit mixed state device.

## `get_final_state`

```python
def get_final_state(circuit, debugger=None, **execution_kwargs)
```

Get the final state resulting from executing the given quantum script.

This is an internal function used by ``default.mixed`` to simulate
the evolution of a quantum circuit.

Args:
    circuit (.QuantumScript): The quantum script containing operations and measurements
        that define the quantum computation.
    debugger (._Debugger): Debugger instance used for tracking execution and debugging
        circuit operations.

Keyword Args:
    interface (str): The machine learning interface used to create the initial state.
    rng (Optional[numpy.random._generator.Generator]): A NumPy random number generator.
    prng_key (Optional[jax.random.PRNGKey]): A key for the JAX pseudo-random number
        generator. Used only for simulations with JAX. If None, a ``numpy.random.default_rng``
        is used for sampling.

Returns:
    tuple[TensorLike, bool]: A tuple containing the final state of the quantum script and
        whether the state has a batch dimension.

## `measure_final_state`

```python
def measure_final_state(circuit, state, is_state_batched, **execution_kwargs) -> Result
```

Perform the measurements specified in the circuit on the provided state.

This is an internal function called by the ``default.mixed`` device to simulate
measurement processes in a quantum circuit.

Args:
    circuit (.QuantumScript): The quantum script containing operations and measurements
        to be simulated.
    state (TensorLike): The quantum state on which measurements are performed.
    is_state_batched (bool): Indicates whether the quantum state has a batch dimension.

Keyword Args:
    rng (Union[None, int, array_like[int], SeedSequence, BitGenerator, Generator]):
        A seed-like parameter for ``numpy.random.default_rng``. If no value is provided,
        a default random number generator is used.
    prng_key (Optional[jax.random.PRNGKey]): A key for the JAX pseudo-random number generator,
        used for sampling during JAX-based simulations. If None, a default NumPy RNG is used.
    readout_errors (List[Callable]): A list of quantum channels (callable functions) applied
        to each wire during measurement to simulate readout errors.

Returns:
    Tuple[TensorLike]: The measurement results. If the circuit specifies only one measurement,
    the result is a single tensor-like object. If multiple measurements are specified, a tuple
    of results is returned.

Raises:
    ValueError: If the circuit contains invalid or unsupported measurements.

.. seealso::
    :func:`~.measure`, :func:`~.measure_with_samples`

**Example**

Simulate a circuit measurement process on a given state:

.. code-block:: python

    from pennylane.devices.qubit_mixed import measure_final_state
    from pennylane.tape import QuantumScript

    # Define a circuit with a PauliZ measurement
    circuit = QuantumScript(
        ops=[qp.RX(0.5, wires=0), qp.CNOT(wires=[0, 1])],
        measurements=[qp.expval(qp.PauliZ(wires=0))]
    )

    # Simulate measurement
    state = np.ones((2,2,2,2)) * 0.25  # Initialize or compute the state
    results = measure_final_state(circuit, state, is_state_batched=False)
    print(results)

.. details::
    :title: Usage Details

    The function supports both analytic and finite-shot measurement processes.
    - In the analytic case (no shots specified), the exact expectation values
      are computed for each measurement in the circuit.
    - In the finite-shot case (with shots specified), random samples are drawn
      according to the specified measurement process, using the provided RNG
      or PRNG key. Readout errors, if provided, are applied during the simulation.

## `simulate`

```python
def simulate(circuit: qp.tape.QuantumScript, debugger=None, state_cache: dict | None=None, **execution_kwargs) -> Result
```

Simulate the execution of a single quantum script.

This internal function is used by the ``default.mixed`` device to simulate quantum circuits
and return the results of specified measurements. It supports both analytic and finite-shot
simulations and can handle advanced features such as readout errors and batched states.

Args:
    circuit (QuantumScript): The quantum script containing the operations and measurements
        to be simulated.
    debugger (_Debugger): An optional debugger instance used to track and debug circuit
        execution.
    state_cache (dict): An optional cache to store the final state of the circuit,
        keyed by the circuit hash.

Keyword Args:
    rng (Optional[Union[None, int, array_like[int], SeedSequence, BitGenerator, Generator]]):
        A seed-like parameter for ``numpy.random.default_rng``. If no value is provided,
        a default random number generator is used.
    prng_key (Optional[jax.random.PRNGKey]): A key for the JAX pseudo-random number generator.
        If None, a random key is generated. Only relevant for JAX-based simulations.
    interface (str): The machine learning interface used to create the initial state.
    readout_errors (List[Callable]): A list of quantum channels (callable functions) applied
        to each wire during measurement to simulate readout errors.

Returns:
    tuple(TensorLike): The results of the simulation. Measurement results are returned as a
    tuple, with each entry corresponding to a specified measurement in the circuit.

Notes:
    - This function assumes that all operations in the circuit provide matrices.
    - Non-commuting observables can be measured simultaneously, with the results returned
      in the same tuple.

**Example**

Simulate a quantum circuit with both expectation values and probability measurements:

.. code-block:: python

    from pennylane.devices.qubit_mixed import simulate
    from pennylane.tape import QuantumScript

    # Define a quantum script
    circuit = QuantumScript(
        ops=[qp.RX(1.2, wires=0)],
        measurements=[qp.expval(qp.PauliX(0)), qp.probs(wires=(0, 1))]
    )

>>> print(simulate(circuit))
(np.float64(0.0), array([0.68117888, 0.        , 0.31882112, 0.        ]))

.. details::
    :title: Usage Details

    - Analytic simulations (without shots) compute exact expectation values and probabilities.
    - Finite-shot simulations sample from the distribution defined by the quantum state,
      using the specified RNG or PRNG key. Readout errors, if provided, are applied
      during the measurement step.
    - The `state_cache` parameter can be used to cache the final state for reuse
      in subsequent calculations.

.. seealso::
    :func:`~.get_final_state`, :func:`~.measure_final_state`
