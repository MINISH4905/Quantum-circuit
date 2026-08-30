---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/functions/matrix.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/functions/matrix.py
license: Apache-2.0
---

## Module `pennylane/ops/functions/matrix.py`

This module contains the qp.matrix function.

## `catalyst_qjit`

```python
def catalyst_qjit(qnode)
```

A method checking whether a qnode is compiled by catalyst.qjit

## `matrix`

```python
def matrix(op: Operator | PauliWord | PauliSentence | Sequence[Operator], wire_order=None) -> TensorLike
```

The dense matrix representation of an operation or quantum circuit.

.. note::
    This method always returns a dense matrix. For workflows with sparse objects, consider using :func:`~pennylane.operation.Operator.sparse_matrix`.

Args:
    op (Operator or QNode or QuantumTape or Callable or PauliWord or PauliSentence): A quantum operator or quantum circuit.
    wire_order (Sequence[Any], optional): Order of the wires in the quantum circuit.
        The default wire order depends on the type of ``op``:

        - If ``op`` is a :class:`~.QNode`, then the wire order is determined by the
          associated device's wires, if provided.

        - Otherwise, the wire order is determined by the order in which wires
          appear in the circuit.

        - See the usage details for more information.

Returns:
    TensorLike or qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]:

    If an operator, :class:`~PauliWord` or :class:`~PauliSentence` is provided as input, the matrix is returned directly in the form of a tensor.
    Otherwise, the transformed circuit is returned as described in :func:`qp.transform <pennylane.transform>`.
    Executing this circuit will provide its matrix representation.

**Example**

Given an instantiated operator, ``qp.matrix`` returns the matrix representation:

>>> op = qp.RX(0.54, wires=0)
>>> qp.matrix(op)
array([[0.9637709+0.j        , 0.       -0.26673144j],
       [0.       -0.26673144j, 0.9637709+0.j        ]])

It can also be used in a functional form:

>>> x = torch.tensor(0.6, requires_grad=True)
>>> matrix_fn = qp.matrix(qp.RX)
>>> matrix_fn(x, wires=0)
tensor([[0.9553+0.0000j, 0.0000-0.2955j],
        [0.0000-0.2955j, 0.9553+0.0000j]], grad_fn=<StackBackward0>)

In its functional form, it is fully differentiable with respect to gate arguments:

>>> loss = torch.real(torch.trace(matrix_fn(x, wires=0)))
>>> loss.backward()
>>> x.grad
tensor(-0.2955)

This operator transform can also be applied to QNodes, tapes, and quantum functions
that contain multiple operations; see Usage Details below for more details.

.. details::
    :title: Usage Details

    ``qp.matrix`` can also be used with :class:`~PauliWord` and :class:`~PauliSentence` instances.
    Internally, we are using their ``to_mat()`` methods.

    >>> X0 = PauliWord({0:"X"})
    >>> np.allclose(qp.matrix(X0), X0.to_mat())
    True

    ``qp.matrix`` can also be used with QNodes, tapes, or quantum functions that
    contain multiple operations.

    Consider the following quantum function:

    .. code-block:: python

        def circuit(theta):
            qp.RX(theta, wires=1)
            qp.Z(0)

    We can use ``qp.matrix`` to generate a new function that returns the unitary matrix
    corresponding to the function ``circuit``:

    >>> matrix_fn = qp.matrix(circuit, wire_order=[1, 0])
    >>> theta = np.pi / 4
    >>> matrix_fn(theta)
    array([[ 0.92387953+0.j        ,  0.        +0.j        ,
         0.        -0.38268343j,  0.        +0.j        ],
       [ 0.        +0.j        , -0.92387953+0.j        ,
         0.        +0.j        ,  0.        +0.38268343j],
       [ 0.        -0.38268343j,  0.        +0.j        ,
         0.92387953+0.j        ,  0.        +0.j        ],
       [ 0.        +0.j        ,  0.        +0.38268343j,
         0.        +0.j        , -0.92387953+0.j        ]])

    You can also get the unitary matrix for operations on a subspace of a larger Hilbert space. For
    example, with the same function ``circuit`` and ``wire_order=["a", 0, "b", 1]`` you obtain the
    :math:`16\times 16` matrix for the operation :math:`I\otimes Z\otimes I\otimes  R_X(\theta)`.

    This unitary matrix can also be used in differentiable calculations. For example, consider the
    following cost function:

    .. code-block:: python

        def circuit(theta):
            qp.RY(theta, wires=0)

        def cost(theta):
            matrix = qp.matrix(circuit, wire_order=[0])(theta)
            return pnp.real(pnp.trace(matrix))

    Since this cost function returns a real scalar as a function of ``theta``, we can differentiate it:

    >>> theta = pnp.array(0.3, requires_grad=True)
    >>> # Expected value is 2 * cos(0.3 / 2)
    >>> cost(theta)
    np.float64(1.97...)
    >>> # The gradient is -sin(0.3 / 2)
    >>> qp.grad(cost, argnums=0)(theta)
    tensor(-0.14943813, requires_grad=True)
