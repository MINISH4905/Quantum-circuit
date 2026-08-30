---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/sprod.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/sprod.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/sprod.py`

This file contains the implementation of the SProd class which contains logic for
computing the scalar product of operations.

## `s_prod`

```python
def s_prod(scalar, operator, lazy=True, id=None)
```

Construct an operator which is the scalar product of the
given scalar and operator provided.

Args:
    scalar (float or complex): the scale factor being multiplied to the operator.
    operator (~.operation.Operator): the operator which will get scaled.

Keyword Args:
    lazy=True (bool): If ``lazy=False`` and the operator is already a scalar product operator, the scalar provided will simply be combined with the existing scaling factor.
    id (str or None): id for the scalar product operator. Default is None.
Returns:
    ~ops.op_math.SProd: The operator representing the scalar product.

.. note::

    This operator supports a batched base, a batched coefficient and a combination of both:

    >>> op = qp.s_prod(scalar=4, operator=qp.RX([1, 2, 3], wires=0))
    >>> qp.matrix(op).shape
    (3, 2, 2)
    >>> op = qp.s_prod(scalar=[1, 2, 3], operator=qp.RX(1, wires=0))
    >>> qp.matrix(op).shape
    (3, 2, 2)
    >>> op = qp.s_prod(scalar=[4, 5, 6], operator=qp.RX([1, 2, 3], wires=0))
    >>> qp.matrix(op).shape
    (3, 2, 2)

    But it doesn't support batching of operators.

.. seealso:: :class:`~.ops.op_math.SProd` and :class:`~.ops.op_math.SymbolicOp`

**Example**

>>> sprod_op = s_prod(2.0, qp.X(0))
>>> sprod_op
2.0 * X(0)
>>> sprod_op.matrix()
array([[0., 2.],
       [2., 0.]])

## `SProd`

```python
class SProd(ScalarSymbolicOp)
```

Arithmetic operator representing the scalar product of an
operator with the given scalar.

Args:
    scalar (float or complex): the scale factor being multiplied to the operator.
    base (~.operation.Operator): the operator which will get scaled.

Keyword Args:
    id (str or None): id for the scalar product operator. Default is None.

.. note::
    Currently this operator can not be queued in a circuit as an operation, only measured terminally.

.. seealso:: :func:`~.ops.op_math.s_prod`

**Example**

>>> sprod_op = SProd(1.23, qp.X(0))
>>> sprod_op
1.23 * X(0)
>>> qp.matrix(sprod_op)
array([[0.  , 1.23],
       [1.23, 0.  ]])
>>> sprod_op.terms()
([1.23], [X(0)])

.. details::
    :title: Usage Details

    The SProd operation can also be measured inside a qnode as an observable.
    If the circuit is parametrized, then we can also differentiate through the observable.

    .. code-block:: python

        dev = qp.device("default.qubit", wires=1)

        @qp.qnode(dev, diff_method="best")
        def circuit(scalar, theta):
            qp.RX(theta, wires=0)
            return qp.expval(qp.s_prod(scalar, qp.Hadamard(wires=0)))

    >>> scalar, theta = (1.2, 3.4)
    >>> qp.grad(circuit, argnums=[0,1])(scalar, theta)
    (array(-0.6836...), array(0.2168...))

### `__repr__`

```python
def __repr__(self)
```

Constructor-call-like representation.

### `label`

```python
def label(self, decimals=None, base_label=None, cache=None)
```

The label produced for the SProd op.

### `num_params`

```python
def num_params(self)
```

Number of trainable parameters that the operator depends on.
Usually 1 + the number of trainable parameters for the base op.

Returns:
    int: number of trainable parameters

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

### `is_verified_hermitian`

```python
def is_verified_hermitian(self)
```

If the base operator is hermitian and the scalar is real,
then the scalar product operator is hermitian.

### `has_diagonalizing_gates`

```python
def has_diagonalizing_gates(self)
```

Bool: Whether the Operator returns defined diagonalizing gates.

### `diagonalizing_gates`

```python
def diagonalizing_gates(self)
```

Sequence of gates that diagonalize the operator in the computational basis.

Given the eigendecomposition :math:`O = U \Sigma U^{\dagger}` where
:math:`\Sigma` is a diagonal matrix containing the eigenvalues,
the sequence of diagonalizing gates implements the unitary :math:`U^{\dagger}`.

The diagonalizing gates rotate the state into the eigenbasis
of the operator.

A ``DiagGatesUndefinedError`` is raised if no representation by decomposition is defined.

.. seealso:: :meth:`~.Operator.compute_diagonalizing_gates`.

Returns:
    list[.Operator] or None: a list of operators

### `eigvals`

```python
def eigvals(self)
```

Return the eigenvalues of the specified operator.

This method uses pre-stored eigenvalues for standard observables where
possible and stores the corresponding eigenvectors from the eigendecomposition.

Returns:
    array: array containing the eigenvalues of the operator.

### `sparse_matrix`

```python
def sparse_matrix(self, wire_order=None, format='csr')
```

Computes, by default, a `scipy.sparse.csr_matrix` representation of this Tensor.

This is useful for larger qubit numbers, where the dense matrix becomes very large, while
consisting mostly of zero entries.

Args:
    wire_order (Iterable): Wire labels that indicate the order of wires according to which the matrix
        is constructed. If not provided, ``self.wires`` is used.

Returns:
    :class:`scipy.sparse._csr.csr_matrix`: sparse matrix representation

### `has_matrix`

```python
def has_matrix(self)
```

Bool: Whether or not the Operator returns a defined matrix.

### `pow`

```python
def pow(self, z)
```

Returns the operator raised to a given power.

### `adjoint`

```python
def adjoint(self)
```

Create an operation that is the adjoint of this one.

Adjointed operations are the conjugated and transposed version of the
original operation. Adjointed ops are equivalent to the inverted operation for unitary
gates.

Returns:
    The adjointed operation.

### `simplify`

```python
def simplify(self) -> Operator
```

Reduce the depth of nested operators to the minimum.

Returns:
    .Operator: simplified operator
