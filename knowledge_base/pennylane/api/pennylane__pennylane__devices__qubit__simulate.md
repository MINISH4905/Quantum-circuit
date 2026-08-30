---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/qubit/simulate.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/qubit/simulate.py
license: Apache-2.0
---

## Module `pennylane/devices/qubit/simulate.py`

Simulate a quantum script.

## `TreeTraversalStack`

```python
class TreeTraversalStack
```

This class is used to record various data used during the
depth-first tree-traversal procedure for simulating dynamic circuits.

### `any_is_empty`

```python
def any_is_empty(self, depth)
```

Return True if any result at ``depth`` is ``None`` and False otherwise.

### `is_full`

```python
def is_full(self, depth)
```

Return True if the results at ``depth`` are both not ``None`` and False otherwise.

### `prune`

```python
def prune(self, depth)
```

Reset all stack entries at ``depth`` to ``None``.

## `get_final_state`

```python
def get_final_state(circuit, debugger=None, **execution_kwargs)
```

Get the final state that results from executing the given quantum script.

This is an internal function that will be called by the successor to ``default.qubit``.

Args:
    circuit (.QuantumScript): The single circuit to simulate. This circuit is assumed to have
        non-negative integer wire labels
    debugger (._Debugger): The debugger to use
    interface (str): The machine learning interface to create the initial state with
    mid_measurements (None, dict): Dictionary of mid-circuit measurements
    rng (Optional[numpy.random._generator.Generator]): A NumPy random number generator.
    prng_key (Optional[jax.random.PRNGKey]): An optional ``jax.random.PRNGKey``. This is
        the key to the JAX pseudo random number generator. Only for simulation using JAX.
        If None, a ``numpy.random.default_rng`` will be used for sampling.
    postselect_mode (str): Configuration for handling shots with mid-circuit measurement
        postselection. Use ``"hw-like"`` to discard invalid shots and ``"fill-shots"`` to
        keep the same number of shots. Default is ``None``.

Returns:
    Tuple[TensorLike, bool]: A tuple containing the final state of the quantum script and
        whether the state has a batch dimension.

## `measure_final_state`

```python
def measure_final_state(circuit, state, is_state_batched, **execution_kwargs) -> Result
```

Perform the measurements required by the circuit on the provided state.

This is an internal function that will be called by the successor to ``default.qubit``.

Args:
    circuit (.QuantumScript): The single circuit to simulate. This circuit is assumed to have
        non-negative integer wire labels
    state (TensorLike): The state to perform measurement on
    is_state_batched (bool): Whether the state has a batch dimension or not.
    rng (Union[None, int, array_like[int], SeedSequence, BitGenerator, Generator]): A
        seed-like parameter matching that of ``seed`` for ``numpy.random.default_rng``.
        If no value is provided, a default RNG will be used.
    prng_key (Optional[jax.random.PRNGKey]): An optional ``jax.random.PRNGKey``. This is
        the key to the JAX pseudo random number generator. Only for simulation using JAX.
        If None, the default ``sample_state`` function and a ``numpy.random.default_rng``
        will be used for sampling.
    mid_measurements (None, dict): Dictionary of mid-circuit measurements

Returns:
    Tuple[TensorLike]: The measurement results

## `simulate`

```python
def simulate(circuit: QuantumScript, debugger=None, state_cache: dict | None=None, **execution_kwargs) -> Result
```

Simulate a single quantum script.

This is an internal function that is used by``default.qubit``.

Args:
    circuit (QuantumTape): The single circuit to simulate
    debugger (_Debugger): The debugger to use
    state_cache=None (Optional[dict]): A dictionary mapping the hash of a circuit to
        the pre-rotated state. Used to pass the state between forward passes and vjp
        calculations.
    rng (Optional[numpy.random._generator.Generator]): A NumPy random number generator.
    prng_key (Optional[jax.random.PRNGKey]): An optional ``jax.random.PRNGKey``. This is
        the key to the JAX pseudo random number generator. If None, a random key will be
        generated. Only for simulation using JAX.
    interface (str): The machine learning interface to create the initial state with
    postselect_mode (str): Configuration for handling shots with mid-circuit measurement
        postselection. Use ``"hw-like"`` to discard invalid shots and ``"fill-shots"`` to
        keep the same number of shots. Default is ``None``.
    mcm_method (str): Strategy to use when executing circuits with mid-circuit measurements.
        ``"deferred"`` is ignored. If mid-circuit measurements are found in the circuit,
        the device will use ``"tree-traversal"`` if specified and the ``"one-shot"`` method
        otherwise. For usage details, please refer to the
        :doc:`dynamic quantum circuits page </introduction/dynamic_quantum_circuits>`.

Returns:
    tuple(TensorLike): The results of the simulation

Note that this function can return measurements for non-commuting observables simultaneously.

This function assumes that all operations provide matrices.

>>> qs = qp.tape.QuantumScript([qp.RX(1.2, wires=0)], [qp.expval(qp.Z(0)), qp.probs(wires=(0,1))])
>>> simulate(qs)
(np.float64(0.36235775447667357), array([0.68117888, 0.        , 0.31882112, 0.        ]))

## `simulate_tree_mcm`

```python
def simulate_tree_mcm(circuit: QuantumScript, debugger=None, **execution_kwargs) -> Result
```

Simulate a single quantum script with native mid-circuit measurements using the tree-traversal algorithm.

The tree-traversal algorithm recursively explores all combinations of mid-circuit measurement
outcomes using a depth-first approach. The depth-first approach requires ``n_mcm`` copies
of the state vector (``n_mcm + 1`` state vectors in total) and records ``n_mcm`` vectors
of mid-circuit measurement samples. It is generally more efficient than ``one-shot`` because it takes all samples
at a leaf at once and stops exploring more branches when a single shot is allocated to a sub-tree.

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

Returns:
    tuple(TensorLike): The results of the simulation

## `split_circuit_at_mcms`

```python
def split_circuit_at_mcms(circuit)
```

Return a list of circuits segments (one for each mid-circuit measurement in the
original circuit) where the terminal measurements probe the MCM statistics. Only
the last segment retains the original terminal measurements.

Args:
    circuit (QuantumTape): The circuit to simulate

Returns:
    Sequence[QuantumTape]: Circuit segments.

## `prepend_state_prep`

```python
def prepend_state_prep(circuit, state, interface, wires)
```

Prepend a ``StatePrep`` operation with the prescribed ``wires`` to the circuit.

``get_final_state`` executes a circuit on a subset of wires found in operations
or measurements. This function makes sure that an initial state with the correct size is created
on the first invocation of ``simulate_tree_mcm``. ``wires`` should be the wires attribute
of the original circuit (which included all wires).

## `insert_mcms`

```python
def insert_mcms(circuit, results, mid_measurements)
```

Inserts terminal measurements of MCMs if the circuit is evaluated in analytic mode.

## `get_measurement_dicts`

```python
def get_measurement_dicts(measurements, stack, depth)
```

Combine a probs dictionary and two tuples of measurements into a
tuple of dictionaries storing the probs and measurements of both branches.

## `branch_state`

```python
def branch_state(state, branch, mcm)
```

Collapse the state on a given branch.

Args:
    state (TensorLike): The initial state
    branch (int): The branch on which the state is collapsed
    mcm (MidMeasure): Mid-circuit measurement object used to obtain the wires and ``reset``

Returns:
    TensorLike: The collapsed state

## `samples_to_counts`

```python
def samples_to_counts(samples)
```

Converts samples to counts.

This function forces integer keys and values which are required by ``simulate_tree_mcm``.

## `counts_to_probs`

```python
def counts_to_probs(counts)
```

Converts counts to probs.

## `prune_mcm_samples`

```python
def prune_mcm_samples(mcm_samples)
```

Removes invalid mid-measurement samples.

Post-selection on a given mid-circuit measurement leads to ignoring certain branches
of the tree and samples. The corresponding samples in all other mid-circuit measurement
must be deleted accordingly. We need to find which samples are
corresponding to the current branch by looking at all parent nodes.

## `update_mcm_samples`

```python
def update_mcm_samples(samples, mcm_samples, depth, cumcounts)
```

Updates the depth-th mid-measurement samples.

To illustrate how the function works, let's take an example. Suppose there are
``2**20`` shots in total and the computation is midway through the circuit at the
7th MCM, the active branch is ``[0,1,1,0,0,1]``, and at each MCM everything happened to
split the counts 50/50, so there are ``2**14`` samples to update.
These samples are correlated with the parent
branches, so where do they go? They must update the ``2**14`` elements whose parent
sequence corresponds to ``[0,1,1,0,0,1]``. ``cumcounts`` is used for this job and
increased by the size of ``samples`` each time this function is called.

## `variance_transform`

```python
def variance_transform(circuit)
```

Replace variance measurements by expectation value measurements of both the observable and the observable square.

This is necessary since computing the variance requires the global expectation value which is not available from measurements on subtrees.

## `measurement_with_no_shots`

```python
def measurement_with_no_shots(measurement)
```

Returns a NaN scalar or array of the correct size when executing an all-invalid-shot circuit.

## `combine_measurements`

```python
def combine_measurements(terminal_measurements, results, mcm_samples)
```

Returns combined measurement values of various types.

## `combine_measurements_core`

```python
def combine_measurements_core(original_measurement, measures)
```

Returns the combined measurement value of a given type.

## `simulate_one_shot_native_mcm`

```python
def simulate_one_shot_native_mcm(circuit: QuantumScript, debugger=None, **execution_kwargs) -> Result
```

Simulate a single shot of a single quantum script with native mid-circuit measurements.

Assumes that the circuit has been transformed by `dynamic_one_shot`.

Args:
    circuit (QuantumTape): The single circuit to simulate
    debugger (_Debugger): The debugger to use
    rng (Optional[numpy.random._generator.Generator]): A NumPy random number generator.
    prng_key (Optional[jax.random.PRNGKey]): An optional ``jax.random.PRNGKey``. This is
        the key to the JAX pseudo random number generator. If None, a random key will be
        generated. Only for simulation using JAX.
    interface (str): The machine learning interface to create the initial state with
    postselect_mode (str): Configuration for handling shots with mid-circuit measurement
        postselection. Use ``"hw-like"`` to discard invalid shots and ``"fill-shots"`` to
        keep the same number of shots. Default is ``None``.

Returns:
    Result: The results of the simulation
