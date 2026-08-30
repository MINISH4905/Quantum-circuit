---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/math/fidelity.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/math/fidelity.py
license: Apache-2.0
---

## Module `pennylane/math/fidelity.py`

Contains the implementation of quantum fidelity.

Note: care needs to be taken to make it fully differentiable. An explanation can
be found in pennylane/math/fidelity_gradient.md

## `fidelity_statevector`

```python
def fidelity_statevector(state0, state1, check_state=False, c_dtype='complex128')
```

Compute the fidelity for two states (given as state vectors) acting on quantum
systems with the same size.

The fidelity for two pure states given by state vectors :math:`\ket{\psi}` and :math:`\ket{\phi}`
is defined as

.. math::
    F( \ket{\psi} , \ket{\phi}) = \left|\braket{\psi, \phi}\right|^2

This is faster than calling :func:`pennylane.math.fidelity` on the density matrix
representation of pure states.

.. note::
    It supports all interfaces (NumPy, Autograd, Torch, TensorFlow and Jax). The second state is coerced
    to the type and dtype of the first state. The fidelity is returned in the type of the interface of the
    first state.

Args:
    state0 (tensor_like): ``(2**N)`` or ``(batch_dim, 2**N)`` state vector.
    state1 (tensor_like): ``(2**N)`` or ``(batch_dim, 2**N)`` state vector.
    check_state (bool): If True, the function will check the validity of both states; that is,
        the shape and the norm
    c_dtype (str): Complex floating point precision type.

Returns:
    float: Fidelity between the two quantum states.

**Example**

Two state vectors can be used as arguments and the fidelity (overlap) is returned, e.g.:

>>> state0 = [0.98753537-0.14925137j, 0.00746879-0.04941796j]
>>> state1 = [0.99500417+0.j, 0.09983342+0.j]
>>> qp.math.fidelity_statevector(state0, state1)
0.9905158135644924

.. seealso:: :func:`pennylane.math.fidelity`

## `fidelity`

```python
def fidelity(state0, state1, check_state=False, c_dtype='complex128')
```

Compute the fidelity for two states (given as density matrices) acting on quantum
systems with the same size.

The fidelity for two mixed states given by density matrices :math:`\rho` and :math:`\sigma`
is defined as

.. math::
    F( \rho , \sigma ) = \text{Tr}( \sqrt{\sqrt{\rho} \sigma \sqrt{\rho}})^2

.. note::
    It supports all interfaces (NumPy, Autograd, Torch, TensorFlow and Jax). The second state is coerced
    to the type and dtype of the first state. The fidelity is returned in the type of the interface of the
    first state.

Args:
    state0 (tensor_like): ``(2**N, 2**N)`` or ``(batch_dim, 2**N, 2**N)`` density matrix.
    state1 (tensor_like): ``(2**N, 2**N)`` or ``(batch_dim, 2**N, 2**N)`` density matrix.
    check_state (bool): If True, the function will check the validity of both states; that is,
        (shape, trace, positive-definitiveness) for density matrices.
    c_dtype (str): Complex floating point precision type.

Returns:
    float: Fidelity between the two quantum states.

**Example**

To find the fidelity between two state vectors, call :func:`~.math.dm_from_state_vector` on the
inputs first, e.g.:

>>> state0 = qp.math.dm_from_state_vector([0.98753537-0.14925137j, 0.00746879-0.04941796j])
>>> state1 = qp.math.dm_from_state_vector([0.99500417+0.j, 0.09983342+0.j])
>>> qp.math.fidelity(state0, state1)
0.9905158135644924

To find the fidelity between two density matrices, they can be passed directly:

>>> state0 = [[1, 0], [0, 0]]
>>> state1 = [[0, 0], [0, 1]]
>>> qp.math.fidelity(state0, state1)
0.0

.. seealso:: :func:`pennylane.math.fidelity_statevector`
