---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/qubit/apply_operation.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/qubit/apply_operation.py
license: Apache-2.0
---

## Module `pennylane/devices/qubit/apply_operation.py`

Functions to apply an operation to a state vector.

## `apply_operation_einsum`

```python
def apply_operation_einsum(op: Operator, state, is_state_batched: bool=False)
```

Apply ``Operator`` to ``state`` using ``einsum``. This is more efficent at lower qubit
numbers.

Args:
    op (Operator): Operator to apply to the quantum state
    state (array[complex]): Input quantum state
    is_state_batched (bool): Boolean representing whether the state is batched or not

Returns:
    array[complex]: output_state

## `apply_operation_tensordot`

```python
def apply_operation_tensordot(op: Operator, state, is_state_batched: bool=False)
```

Apply ``Operator`` to ``state`` using ``math.tensordot``. This is more efficent at higher qubit
numbers.

Args:
    op (Operator): Operator to apply to the quantum state
    state (array[complex]): Input quantum state
    is_state_batched (bool): Boolean representing whether the state is batched or not

Returns:
    array[complex]: output_state

## `apply_operation`

```python
def apply_operation(op: Operator, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply and operator to a given state.

Args:
    op (Operator): The operation to apply to ``state``
    state (TensorLike): The starting state.
    is_state_batched (bool): Boolean representing whether the state is batched or not
    debugger (_Debugger): The debugger to use
    **execution_kwargs (Optional[dict]): Optional keyword arguments needed for applying
        some operations described below.

Keyword Arguments:
    mid_measurements (dict, None): Mid-circuit measurement dictionary mutated to record the sampled value
    interface (str): The machine learning interface of the state
    postselect_mode (str): Configuration for handling shots with mid-circuit measurement
        postselection. Use ``"hw-like"`` to discard invalid shots and ``"fill-shots"`` to
        keep the same number of shots. ``None`` by default.
    rng (Optional[numpy.random._generator.Generator]): A NumPy random number generator.
    prng_key (Optional[jax.random.PRNGKey]): An optional ``jax.random.PRNGKey``. This is
        the key to the JAX pseudo random number generator. Only for simulation using JAX.
        If None, a ``numpy.random.default_rng`` will be used for sampling.
    tape_shots (Shots): the shots object of the tape

Returns:
    ndarray: output state

.. warning::

    ``apply_operation`` is an internal function, and thus subject to change without a deprecation cycle.

.. warning::
    ``apply_operation`` applies no validation to its inputs.

    This function assumes that the wires of the operator correspond to indices
    of the state. See :func:`~.map_wires` to convert operations to integer wire labels.

    The shape of state should be ``[2]*num_wires``.

This is a ``functools.singledispatch`` function, so additional specialized kernels
for specific operations can be registered like:

.. code-block:: py

    @apply_operation.register
    def _(op: type_op, state):
        # custom op application method here

**Example:**

>>> state = np.zeros((2,2))
>>> state[0][0] = 1
>>> state
array([[1., 0.],
       [0., 0.]])
>>> apply_operation(qp.X(0), state)
array([[0., 0.],
       [1., 0.]])

## `apply_operation_csr_matrix`

```python
def apply_operation_csr_matrix(op, state, is_state_batched: bool=False)
```

The csr_matrix specialized version apply operation.

## `apply_conditional`

```python
def apply_conditional(op: Conditional, state, is_state_batched: bool=False, debugger=None, **execution_kwargs)
```

Applies a conditional operation.

Args:
    op (Operator): The operation to apply to ``state``
    state (TensorLike): The starting state.
    is_state_batched (bool): Boolean representing whether the state is batched or not
    debugger (_Debugger): The debugger to use
    mid_measurements (dict, None): Mid-circuit measurement dictionary mutated to record the sampled value
    interface (str): The machine learning interface of the state
    rng (Optional[numpy.random._generator.Generator]): A NumPy random number generator.
    prng_key (Optional[jax.random.PRNGKey]): An optional ``jax.random.PRNGKey``. This is
        the key to the JAX pseudo random number generator. Only for simulation using JAX.
        If None, a ``numpy.random.default_rng`` will be used for sampling.

Returns:
    ndarray: output state

## `apply_mid_measure`

```python
def apply_mid_measure(op: MidMeasure, state, is_state_batched: bool=False, debugger=None, **execution_kwargs)
```

Applies a native mid-circuit measurement.

Args:
    op (Operator): The operation to apply to ``state``
    state (TensorLike): The starting state.
    is_state_batched (bool): Boolean representing whether the state is batched or not
    debugger (_Debugger): The debugger to use
    mid_measurements (dict, None): Mid-circuit measurement dictionary mutated to record the sampled value
    postselect_mode (str): Configuration for handling shots with mid-circuit measurement
        postselection. Use ``"hw-like"`` to discard invalid shots and ``"fill-shots"`` to
        keep the same number of shots. ``None`` by default.
    rng (Optional[numpy.random._generator.Generator]): A NumPy random number generator.
    prng_key (Optional[jax.random.PRNGKey]): An optional ``jax.random.PRNGKey``. This is
        the key to the JAX pseudo random number generator. Only for simulation using JAX.
        If None, a ``numpy.random.default_rng`` will be used for sampling.

Returns:
    ndarray: output state

## `apply_identity`

```python
def apply_identity(op: ops.Identity, state, is_state_batched: bool=False, debugger=None, **_)
```

Applies a :class:`~.Identity` operation by just returning the input state.

## `apply_global_phase`

```python
def apply_global_phase(op: ops.GlobalPhase, state, is_state_batched: bool=False, debugger=None, **_)
```

Applies a :class:`~.GlobalPhase` operation by multiplying the
state by ``exp(-1j * op.data[0])``

## `apply_paulix`

```python
def apply_paulix(op: ops.X, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply :class:`pennylane.PauliX` operator to the quantum state

## `apply_pauliz`

```python
def apply_pauliz(op: ops.Z, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply pauliz to state.

## `apply_phaseshift`

```python
def apply_phaseshift(op: ops.PhaseShift, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply PhaseShift to state.

## `apply_T`

```python
def apply_T(op: ops.T, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply T to state.

## `apply_S`

```python
def apply_S(op: ops.S, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply S to state.

## `apply_hadamard`

```python
def apply_hadamard(op: ops.Hadamard, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply Hadamard to state.

## `apply_rz`

```python
def apply_rz(op: ops.RZ, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply RZ to state.

## `apply_rx`

```python
def apply_rx(op: ops.RX, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply RX to state.

## `apply_ry`

```python
def apply_ry(op: ops.RY, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply RY to state.

## `apply_cnot`

```python
def apply_cnot(op: ops.CNOT, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply cnot gate to state.

## `apply_multicontrolledx`

```python
def apply_multicontrolledx(op: ops.MultiControlledX, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply MultiControlledX to a state with the default einsum/tensordot choice
for 8 operation wires or less. Otherwise, apply a custom kernel based on
composing transpositions, rolling of control axes and the CNOT logic above.

## `apply_grover`

```python
def apply_grover(op: qp.GroverOperator, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply GroverOperator either via a custom matrix-free method (more than 8 operation
wires) or via standard matrix based methods (else).

## `apply_snapshot`

```python
def apply_snapshot(op: ops.Snapshot, state, is_state_batched: bool=False, debugger=None, **execution_kwargs)
```

Take a snapshot of the state.

## `apply_parametrized_evolution`

```python
def apply_parametrized_evolution(op: qp.pulse.ParametrizedEvolution, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply ParametrizedEvolution by evolving the state rather than the operator matrix
if we are operating on more than half of the subsystem
