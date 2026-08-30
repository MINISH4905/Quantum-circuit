---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/qubit_mixed/apply_operation.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/qubit_mixed/apply_operation.py
license: Apache-2.0
---

## Module `pennylane/devices/qubit_mixed/apply_operation.py`

Functions to apply operations to a qubit mixed state.

## `apply_operation_einsum`

```python
def apply_operation_einsum(op: qp.operation.Operator, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply a quantum channel specified by a list of Kraus operators to subsystems of the
quantum state. For a unitary gate, there is a single Kraus operator.

Args:
    op (Operator): Operator to apply to the quantum state
    state (array[complex]): Input quantum state
    is_state_batched (bool): Boolean representing whether the state is batched or not

Returns:
    array[complex]: output_state

## `apply_operation_tensordot`

```python
def apply_operation_tensordot(op: qp.operation.Operator, state, is_state_batched: bool=False, debugger=None, **_)
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
def apply_operation(op: qp.operation.Operator, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply an operation to a given state.

Args:
    op (Operator): The operation to apply to ``state``
    state (TensorLike): The starting state.
    is_state_batched (bool): Boolean representing whether the state is batched or not.
    debugger (_Debugger): The debugger to use.

Keyword Arguments:
    rng (Optional[numpy.random._generator.Generator]): A NumPy random number generator.
    prng_key (Optional[jax.random.PRNGKey]): An optional ``jax.random.PRNGKey``.
        This is the key to the JAX pseudo random number generator. Only for simulation using JAX.
        If None, a ``numpy.random.default_rng`` will be used for sampling.
    tape_shots (Shots): The shots object of the tape.

Returns:
    ndarray: The output state.

.. warning::

    ``apply_operation`` is an internal function, and thus subject to change without a deprecation cycle.

.. warning::

    ``apply_operation`` applies no validation to its inputs.

    This function assumes that the wires of the operator correspond to indices
    of the state. See :func:`~.map_wires` to convert operations to integer wire labels.

    The shape of the state should be ``[2] * (num_wires * 2)`` (the original tensor form) or
    ``[2**num_wires, 2**num_wires]`` (the expanded matrix form), where ``2`` is
    the dimension of the system.

This is a ``functools.singledispatch`` function, so additional specialized kernels
for specific operations can be registered like:

.. code-block:: py

    @apply_operation.register
    def _(op: type_op, state, is_state_batched=False, **kwargs):
        # custom op application method here

**Example:**

>>> state = np.zeros((2, 2, 2, 2))
>>> state[0][0][0][0] = 1
>>> state
array([[[[1., 0.],
         [0., 0.]],
        [[0., 0.],
         [0., 0.]]],
       [[[0., 0.],
         [0., 0.]],
        [[0., 0.],
         [0., 0.]]]])
>>> apply_operation(qp.PauliX(0), state)
array([[[[0., 0.],
         [0., 0.]],
        [[0., 0.],
         [0., 0.]]],
       [[[0., 0.],
         [1., 0.]],
        [[0., 0.],
         [0., 0.]]]])

## `apply_identity`

```python
def apply_identity(op: qp.Identity, state, is_state_batched: bool=False, debugger=None, **_)
```

Applies a :class:`~.Identity` operation by just returning the input state.

## `apply_global_phase`

```python
def apply_global_phase(op: qp.GlobalPhase, state, is_state_batched: bool=False, debugger=None, **_)
```

Applies a :class:`~.GlobalPhase` operation by multiplying the state by ``exp(1j * op.data[0])``

## `apply_paulix`

```python
def apply_paulix(op: qp.X, state, is_state_batched: bool=False, debugger=None, **_)
```

Applies a :class:`~.PauliX` operation by multiplying the state by the Pauli-X matrix.

## `apply_pauliz`

```python
def apply_pauliz(op: qp.Z, state, is_state_batched: bool=False, debugger=None, **_)
```

Applies a :class:`~.PauliZ` operation by multiplying the state by the Pauli-Z matrix.

## `apply_T`

```python
def apply_T(op: qp.T, state, is_state_batched: bool=False, debugger=None, **_)
```

Applies a :class:`~.T` operation by multiplying the state by the T matrix.

## `apply_S`

```python
def apply_S(op: qp.S, state, is_state_batched: bool=False, debugger=None, **_)
```

Applies a :class:`~.S` operation by multiplying the state by the S matrix.

## `apply_phaseshift`

```python
def apply_phaseshift(op: qp.PhaseShift, state, is_state_batched: bool=False, debugger=None, **_)
```

Applies a :class:`~.Phaseshift` operation by multiplying the state by the Phaseshift matrix.

## `apply_symmetric_real_op`

```python
def apply_symmetric_real_op(op: qp.CNOT | qp.MultiControlledX | qp.Toffoli | qp.SWAP | qp.CSWAP | qp.CZ | qp.CH, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply real, symmetric operator (e.g. X, CX and related controlled-X variants) to a density matrix state.

This function handles CZ, CH, CNOT, CSWAP, SWAP, Toffoli, and general MultiControlledX operations using the same underlying
implementation, as they share the properties of being real and symmetric. For operations with 8 or fewer wires,
it uses the default einsum contraction. For larger operations, it leverages a custom kernel that
exploits the fact that for real, symmetric operators, the adjoint operation can be implemented
by shifting wires by `num_wires`.

Args:
    op (.Operation): CZ, CH, CNOT, CSWAP, SWAP, Toffoli, and general MultiControlledX operation
    state (tensor_like): The density matrix state to apply the operation to
    is_state_batched (bool): Whether the state has a batch dimension. Rather than checking
        matrix dimensions, we use op.batch_size for efficiency
    debugger (optional): A debugger instance for operation validation

Returns:
    tensor_like: The transformed density matrix state

Note:
    This is not a final version. Two possible improvements are:
    1. More existing real, symmetric ops to include in this dispatch
    2. A more general approach to handle other types of ops but following
    similar logic as in this function.

## `apply_grover`

```python
def apply_grover(op: qp.GroverOperator, state, is_state_batched: bool=False, debugger=None, **_)
```

Apply GroverOperator either via a custom matrix-free method (more than 8 operation
wires) or via standard matrix based methods (else).

## `apply_diagonal_unitary`

```python
def apply_diagonal_unitary(op: Operator, state: TensorLike, is_state_batched: bool=False, **_)
```

Apply a diagonal unitary operation to the density matrix state using its eigenvalues.

Args:
    op (qp.Operation): The diagonal unitary operation to apply.
    state (TensorLike): The density matrix state to apply the operation to.
    is_state_batched (bool, optional): Whether the state has a batch dimension. Defaults to False.

Returns:
    TensorLike: The transformed density matrix state.

## `apply_snapshot`

```python
def apply_snapshot(op: qp.Snapshot, state, is_state_batched: bool=False, debugger=None, **execution_kwargs)
```

Take a snapshot of the mixed state

Args:
    op (qp.Snapshot): the snapshot operation
    state (array): current quantum state
    is_state_batched (bool): whether the state is batched
    debugger: the debugger instance for storing snapshots
Returns:
    array: the unchanged quantum state

## `apply_density_matrix`

```python
def apply_density_matrix(op: qp.QubitDensityMatrix, state, is_state_batched: bool=False, debugger=None, **execution_kwargs)
```

Applies a QubitDensityMatrix operation by initializing or replacing
the quantum state with the provided density matrix.

- If the QubitDensityMatrix covers all wires, we directly return the provided density matrix as the new state.
- If only a subset of the wires is covered, we:
  1. Partial trace out those wires from the current state to get the density matrix of the complement wires.
  2. Take the tensor product of the complement density matrix and the provided density_matrix.
  3. Reshape to the correct final shape and return.

Args:
    op (qp.QubitDensityMatrix): The QubitDensityMatrix operation.
    state (array-like): The current quantum state.
    is_state_batched (bool): Whether the state is batched.
    debugger: A debugger instance for diagnostics.
    **execution_kwargs: Additional kwargs.

Returns:
    array-like: The updated quantum state.

Raises:
    ValueError: If the density matrix is invalid.

## `reorder_after_kron`

```python
def reorder_after_kron(rho, complement_wires, op_wires, is_state_batched)
```

Reorder the wires of `rho` from [complement_wires + op_wires] back to [0,1,...,N-1].

Args:
    rho (tensor): The density matrix after kron(sigma, density_matrix).
    complement_wires (list[int]): The wires not affected by the QubitDensityMatrix update.
    op_wires (Wires): The wires affected by the QubitDensityMatrix.
    is_state_batched (bool): Whether the state is batched.

Returns:
    tensor: The density matrix with wires in the original order.
