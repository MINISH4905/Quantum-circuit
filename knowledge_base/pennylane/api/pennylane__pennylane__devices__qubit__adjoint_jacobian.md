---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/qubit/adjoint_jacobian.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/qubit/adjoint_jacobian.py
license: Apache-2.0
---

## Module `pennylane/devices/qubit/adjoint_jacobian.py`

Functions to apply adjoint jacobian differentiation

## `adjoint_jacobian`

```python
def adjoint_jacobian(tape: QuantumScript, state=None)
```

Implements the adjoint method outlined in
`Jones and Gacon <https://arxiv.org/abs/2009.02823>`__ to differentiate an input tape.

After a forward pass, the circuit is reversed by iteratively applying adjoint
gates to scan backwards through the circuit.

.. note::

    The adjoint differentiation method has the following restrictions:

    * Cannot differentiate with respect to observables.

    * Cannot differentiate with respect to state-prep operations.

    * Observable being measured must have a matrix.

Args:
    tape (QuantumTape): circuit that the function takes the gradient of
    state (TensorLike): the final state of the circuit; if not provided,
        the final state will be computed by executing the tape

Returns:
    array or tuple[array]: the derivative of the tape with respect to trainable parameters.
    Dimensions are ``(len(observables), len(trainable_params))``.

## `adjoint_jvp`

```python
def adjoint_jvp(tape: QuantumScript, tangents: tuple[Number], state=None)
```

The jacobian vector product used in forward mode calculation of derivatives.

Implements the adjoint method outlined in
`Jones and Gacon <https://arxiv.org/abs/2009.02823>`__ to differentiate an input tape.

After a forward pass, the circuit is reversed by iteratively applying adjoint
gates to scan backwards through the circuit.

.. note::

    The adjoint differentiation method has the following restrictions:

    * Cannot differentiate with respect to observables.

    * Observable being measured must have a matrix.

Args:
    tape (QuantumTape): circuit that the function takes the gradient of
    tangents (Tuple[Number]): gradient vector for input parameters.
    state (TensorLike): the final state of the circuit; if not provided,
        the final state will be computed by executing the tape

Returns:
    Tuple[Number]: gradient vector for output parameters

## `adjoint_vjp`

```python
def adjoint_vjp(tape: QuantumScript, cotangents: tuple[Number, ...], state=None)
```

The vector jacobian product used in reverse-mode differentiation.

Implements the adjoint method outlined in
`Jones and Gacon <https://arxiv.org/abs/2009.02823>`__ to differentiate an input tape.

After a forward pass, the circuit is reversed by iteratively applying adjoint
gates to scan backwards through the circuit.

.. note::

    The adjoint differentiation method has the following restrictions:

    * Cannot differentiate with respect to observables.

    * Observable being measured must have a matrix.

Args:
    tape (QuantumTape): circuit that the function takes the gradient of
    cotangents (Tuple[Number]): gradient vector for output parameters. For computing
        the full Jacobian, the cotangents can be batched to vectorize the computation.
        In this case, the cotangents can have the following shapes. ``batch_size``
        below refers to the number of entries in the Jacobian:

        * For a state measurement, cotangents must have shape ``(batch_size, 2 ** n_wires)``.
        * For ``n`` expectation values, the cotangents must have shape ``(n, batch_size)``.
          If ``n = 1``, then the shape must be ``(batch_size,)``.

    state (TensorLike): the final state of the circuit; if not provided,
        the final state will be computed by executing the tape

Returns:
    Tuple[Number]: gradient vector for input parameters
