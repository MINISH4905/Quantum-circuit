---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/prod.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/prod.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/prod.py`

This file contains the implementation of the Prod class which contains logic for
computing the product between operations.

## `prod`

```python
def prod(*ops, id=None, lazy=True)
```

Construct an operator which represents the generalized product of the
operators provided.

The generalized product operation represents both the tensor product as
well as matrix composition. This can be resolved naturally from the wires
that the given operators act on.

Args:
    *ops (Union[tuple[~.operation.Operator], Callable]): The operators we would like to multiply.
        Alternatively, a single qfunc that queues operators can be passed to this function.

Keyword Args:
    id (str or None): id for the product operator. Default is None.
    lazy=True (bool): If ``lazy=False``, a simplification will be performed such that when any
        of the operators is already a product operator, its operands will be used instead.

Returns:
    ~ops.op_math.Prod: the operator representing the product.

.. note::

    This operator supports batched operands:

    >>> op = qp.prod(qp.RX(np.array([1, 2, 3]), wires=0), qp.X(1))
    >>> op.matrix().shape
    (3, 4, 4)

    But it doesn't support batching of operators:

    >>> qp.prod(np.array([qp.RX(0.5, 0), qp.RZ(0.3, 0)]), qp.Z(0))
    Traceback (most recent call last):
        ...
    AttributeError: 'numpy.ndarray' object has no attribute 'wires'

.. seealso:: :class:`~.ops.op_math.Prod`

**Example**

>>> prod_op = prod(qp.X(0), qp.Z(0))
>>> prod_op
X(0) @ Z(0)
>>> prod_op.matrix()
array([[ 0.+0.j, -1.+0.j],
       [ 1.+0.j,  0.+0.j]])
>>> prod_op.simplify()
-1j * Y(0)
>>> prod_op.terms()
([-1j], [Y(0)])


You can also create a prod operator by passing a qfunc to prod, like the following:

>>> def qfunc(x):
...     qp.RX(x, 0)
...     qp.CNOT([0, 1])
>>> prod_op = prod(qfunc)(1.1)
>>> prod_op
(CNOT(wires=[0, 1])) @ RX(1.1, wires=[0])


Notice how the order in the output appears reversed. However, this is correct because the operators are applied from right to left.

## `Prod`

```python
class Prod(CompositeOp)
```

Symbolic operator representing the product of operators.

Args:
    *factors (tuple[~.operation.Operator]): a tuple of operators which will be multiplied
        together.

Keyword Args:
    id (str or None): id for the product operator. Default is None.

.. seealso:: :func:`~.ops.op_math.prod`

**Example**

>>> prod_op = Prod(qp.X(0), qp.PauliZ(1))
>>> prod_op
X(0) @ Z(1)
>>> qp.matrix(prod_op, wire_order=prod_op.wires)
array([[ 0.+0.j,  0.+0.j,  1.+0.j,  0.+0.j],
       [ 0.+0.j,  0.+0.j,  0.+0.j, -1.+0.j],
       [ 1.+0.j,  0.+0.j,  0.+0.j,  0.+0.j],
       [ 0.+0.j, -1.+0.j,  0.+0.j,  0.+0.j]])
>>> prod_op.terms()
([1.0], [X(0) @ Z(1)])

.. note::
    When a Prod operator is applied in a circuit, its factors are applied in the reverse order.
    (i.e ``Prod(op1, op2)`` corresponds to :math:`\hat{op}_{1}\cdot\hat{op}_{2}` which indicates
    first applying :math:`\hat{op}_{2}` then :math:`\hat{op}_{1}` in the circuit). We can see this
    in the decomposition of the operator.

>>> op = Prod(qp.X(0), qp.Z(1))
>>> op.decomposition()
[Z(1), X(0)]

.. details::
    :title: Usage Details

    The Prod operator represents both matrix composition and tensor products
    between operators.

    >>> prod_op = Prod(qp.RZ(1.23, wires=0), qp.X(0), qp.Z(1))
    >>> prod_op.matrix()
    array([[ 0.        +0.j        ,  0.        +0.j        ,
             0.816...-0.57...j,  0.        +0.j        ],
           [ 0.        +0.j        , -0.        +0.j        ,
             0.        +0.j        , -0.816...+0.57...j],
           [ 0.816...+0.57...j,  0.        +0.j        ,
             0.        +0.j        ,  0.        +0.j        ],
           [ 0.        +0.j        , -0.816...-0.57...j,
             0.        +0.j        , -0.        +0.j        ]])

    The Prod operation can be used inside a `qnode` as an operation which,
    if parametrized, can be differentiated.

    .. code-block:: python

        dev = qp.device("default.qubit", wires=3)

        @qp.qnode(dev)
        def circuit(theta):
            qp.prod(qp.Z(0), qp.RX(theta, 1))
            return qp.expval(qp.Z(1))

    >>> par = qp.numpy.array(1.23, requires_grad=True)
    >>> circuit(par)
    tensor(0.334..., requires_grad=True)
    >>> qp.grad(circuit)(par)
    tensor(-0.942..., requires_grad=True)

    The Prod operation can also be measured as an observable.
    If the circuit is parametrized, then we can also differentiate through the
    product observable.

    .. code-block:: python

        prod_op = Prod(qp.Z(0), qp.Hadamard(wires=1))
        dev = qp.device("default.qubit", wires=2)

        @qp.qnode(dev)
        def circuit(weights):
            qp.RX(weights[0], wires=0)
            return qp.expval(prod_op)

    >>> weights = qp.numpy.array([0.1], requires_grad=True)
    >>> qp.grad(circuit)(weights)
    array([-0.070...])

    Note that the :meth:`~Prod.terms` method always simplifies and flattens the operands.

    >>> op = qp.ops.Prod(qp.X(0), qp.sum(qp.Y(0), qp.Z(1)))
    >>> op.terms()
    ([1j, 1.0], [Z(0), X(0) @ Z(1)])

### `is_verified_hermitian`

```python
def is_verified_hermitian(self)
```

Check if the product operator is hermitian.

Note, this check is not exhaustive. There can be hermitian operators for which this check
yields false, which ARE hermitian. So a false result only implies a more explicit check
must be performed.

### `decomposition`

```python
def decomposition(self)
```

Decomposition of the product operator is given by each factor applied in succession.

Note that the decomposition is the list of factors returned in reversed order. This is
to support the intuition that when we write :math:`\hat{O} = \hat{A} \cdot \hat{B}` it is implied
that :math:`\hat{B}` is applied to the state before :math:`\hat{A}` in the quantum circuit.

### `matrix`

```python
def matrix(self, wire_order=None)
```

Representation of the operator as a matrix in the computational basis.

### `simplify`

```python
def simplify(self) -> Union['Prod', Sum]
```

Transforms any nested Prod instance into the form :math:`\sum c_i O_i` where
:math:`c_i` is a scalar coefficient and :math:`O_i` is a single PL operator
or pure product of single PL operators.

### `terms`

```python
def terms(self)
```

Representation of the operator as a linear combination of other operators.

.. math:: O = \sum_i c_i O_i

A ``TermsUndefinedError`` is raised if no representation by terms is defined.

Returns:
    tuple[list[tensor_like or float], list[.Operation]]: list of coefficients :math:`c_i`
    and list of operations :math:`O_i`

**Example**

>>> op = qp.X(0) @ (0.5 * qp.X(1) + qp.X(2))
>>> op.terms()
([np.float64(0.5), 1.0], [X(0) @ X(1), X(0) @ X(2)])
