---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/qutrit_mixed/apply_operation.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/qutrit_mixed/apply_operation.py
license: Apache-2.0
---

## Module `pennylane/devices/qutrit_mixed/apply_operation.py`

Functions to apply operations to a qutrit mixed state.

## `apply_operation_einsum`

```python
def apply_operation_einsum(op: qp.operation.Operator, state, is_state_batched: bool=False)
```

Apply a quantum channel specified by a list of Kraus operators to subsystems of the
quantum state. For a unitary gate, there is a single Kraus operator.

Args:
    op (Operator): Operator to apply to the quantum state
    state (array[complex]): Input quantum state
    is_state_batched (bool): Boolean representing whether the state is batched or not

Returns:
    array[complex]: output_state

## `apply_operation`

```python
def apply_operation(op: qp.operation.Operator, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply an operation to a given state.

Args:
    op (Operator): The operation to apply to ``state``
    state (TensorLike): The starting state.
    is_state_batched (bool): Boolean representing whether the state is batched or not
    debugger (_Debugger): The debugger to use

Keyword Arguments:
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

    The shape of state should be ``[QUDIT_DIM]*(num_wires * 2)``, where ``QUDIT_DIM`` is
    the dimension of the system.

This is a ``functools.singledispatch`` function, so additional specialized kernels
for specific operations can be registered like:

.. code-block:: py

    @apply_operation.register
    def _(op: type_op, state):
        # custom op application method here

**Example:**

>>> state = np.zeros((3,3))
>>> state[0][0] = 1
>>> state
tensor([[1., 0., 0.],
        [0., 0., 0.],
        [0., 0., 0.]], requires_grad=True)
>>> apply_operation(qp.TShift(0), state)
tensor([[0.+0.j, 0.+0.j, 0.+0.j],
        [0.+0.j, 1.+0.j, 0.+0.j],
        [0.+0.j, 0.+0.j, 0.+0.j]], requires_grad=True)

## `apply_snapshot`

```python
def apply_snapshot(op: qp.Snapshot, state, is_state_batched: bool=False, debugger=None, **execution_kwargs)
```

Take a snapshot of the mixed state

## `apply_identity`

```python
def apply_identity(op: qp.Identity, state, is_state_batched: bool=False, debugger=None, **_)
```

Applies a :class:`~.Identity` operation by just returning the input state.
