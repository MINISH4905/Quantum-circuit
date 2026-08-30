---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/sum.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/sum.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/sum.py`

This file contains the implementation of the Sum class which contains logic for
computing the sum of operations.

## `sum`

```python
def sum(*summands, grouping_type=None, method='lf', id=None, lazy=True)
```

Construct an operator which is the sum of the given operators.

Args:
    *summands (tuple[~.operation.Operator]): the operators we want to sum together.

Keyword Args:
    id (str or None): id for the Sum operator. Default is None.
    lazy=True (bool): If ``lazy=False``, a simplification will be performed such that when any
        of the operators is already a sum operator, its operands (summands) will be used instead.
    grouping_type (str): The type of binary relation between Pauli words used to compute
        the grouping. Can be ``'qwc'``, ``'commuting'``, or ``'anticommuting'``.
    method (str): The graph colouring heuristic to use in solving minimum clique cover for
        grouping. It can be ``'lf'`` (Largest First), ``'rlf'`` (Recursive Largest First), ``'dsatur'`` (Degree of Saturation),
        or ``'gis'`` (Greedy Independent Set). This keyword argument is ignored if ``grouping_type`` is ``None``.

Returns:
    ~ops.op_math.Sum: The operator representing the sum of summands.

.. note::

    This operator supports batched operands:

    >>> op = qp.sum(qp.RX(np.array([1, 2, 3]), wires=0), qp.X(1))
    >>> op.matrix().shape
    (3, 4, 4)

    But it doesn't support batching of operators:

    >>> op = qp.sum(np.array([qp.RX(0.4, 0), qp.RZ(0.3, 0)]), qp.Z(0))
    Traceback (most recent call last):
        ...
    AttributeError: 'numpy.ndarray' object has no attribute 'wires'

.. note::

    If grouping is requested, the computed groupings are stored as a list of list of indices
    in ``Sum.grouping_indices``. The indices refer to the operators and coefficients returned
    by ``Sum.terms()``, not ``Sum.operands``, as these are not guaranteed to be equivalent.

.. seealso:: :class:`~.ops.op_math.Sum`

**Example**

>>> summed_op = qp.sum(qp.X(0), qp.Z(0))
>>> summed_op
X(0) + Z(0)
>>> summed_op.matrix()
array([[ 1.+0.j,  1.+0.j],
       [ 1.+0.j, -1.+0.j]])

.. details::
    :title: Grouping

    Grouping information can be collected during construction using the ``grouping_type`` and ``method``
    keyword arguments. For example:

    .. code-block:: python

        import pennylane as qp

        a = qp.s_prod(1.0, qp.X(0))
        b = qp.s_prod(2.0, qp.prod(qp.X(0), qp.X(1)))
        c = qp.s_prod(3.0, qp.Z(0))

        op = qp.sum(a, b, c, grouping_type="qwc")

    >>> op.grouping_indices
    ((0, 1), (2,))

    ``grouping_type`` can be ``"qwc"`` (qubit-wise commuting), ``"commuting"``, or ``"anticommuting"``, and
    ``method`` can be ``'lf'`` (Largest First), ``'rlf'`` (Recursive Largest First), ``'dsatur'`` (Degree of Saturation),
    or ``'gis'`` (Greedy Independent Set). To see more details about how these affect grouping, see
    :ref:`Pauli Graph Colouring<graph_colouring>` and :func:`~pennylane.pauli.compute_partition_indices`.

## `Sum`

```python
class Sum(CompositeOp)
```

Symbolic operator representing the sum of operators.

Args:
    *summands (tuple[~.operation.Operator]): a tuple of operators which will be summed together.

Keyword Args:
    grouping_type (str): The type of binary relation between Pauli words used to compute
        the grouping. Can be ``'qwc'``, ``'commuting'``, or ``'anticommuting'``.
    method (str): The graph colouring heuristic to use in solving minimum clique cover for
        grouping, which can be ``'lf'`` (Largest First), ``'rlf'`` (Recursive Largest First), ``'dsatur'`` (Degree of Saturation),
        or ``'gis'`` (Greedy Independent Set). This keyword argument is ignored if ``grouping_type`` is ``None``.
    id (str or None): id for the sum operator. Default is None.

.. note::
    Currently this operator can not be queued in a circuit as an operation, only measured terminally.

.. note::

    This operator supports batched operands:

    >>> op = qp.sum(qp.RX(np.array([1, 2, 3]), wires=0), qp.X(1))
    >>> op.matrix().shape
    (3, 4, 4)

    But it doesn't support batching of operators:

    >>> op = qp.sum(np.array([qp.RX(0.4, 0), qp.RZ(0.3, 0)]), qp.Z(0))
    Traceback (most recent call last):
        ...
    AttributeError: 'numpy.ndarray' object has no attribute 'wires'

.. note::

    If grouping is requested, the computed groupings are stored as a list of list of indices
    in ``Sum.grouping_indices``. The indices refer to the operators and coefficients returned
    by ``Sum.terms()``, not ``Sum.operands``, as these are not guaranteed to be equivalent.

.. seealso:: :func:`~.ops.op_math.sum`

**Example**

>>> summed_op = Sum(qp.X(0), qp.Z(0))
>>> summed_op
X(0) + Z(0)
>>> qp.matrix(summed_op)
array([[ 1.+0.j,  1.+0.j],
       [ 1.+0.j, -1.+0.j]])
>>> summed_op.terms()
([1.0, 1.0], [X(0), Z(0)])

.. details::
    :title: Usage Details

    We can combine parametrized operators, and support sums between operators acting on
    different wires.

    >>> summed_op = Sum(qp.RZ(1.23, wires=0), qp.I(wires=1))
    >>> summed_op.matrix()
    array([[1.816...-0.57...j, 0.        +0.j        ,
            0.        +0.j        , 0.        +0.j        ],
           [0.        +0.j        , 1.816...-0.57...j,
            0.        +0.j        , 0.        +0.j        ],
           [0.        +0.j        , 0.        +0.j        ,
            1.816...+0.57...j, 0.        +0.j        ],
           [0.        +0.j        , 0.        +0.j        ,
            0.        +0.j        , 1.816...+0.57...j]])

    The Sum operation can also be measured inside a qnode as an observable.
    If the circuit is parametrized, then we can also differentiate through the
    sum observable.

    .. code-block:: python

        sum_op = Sum(qp.X(0), qp.Z(1))
        dev = qp.device("default.qubit", wires=2)

        @qp.qnode(dev, diff_method="best")
        def circuit(weights):
            qp.RX(weights[0], wires=0)
            qp.RY(weights[1], wires=1)
            qp.CNOT(wires=[0, 1])
            qp.RX(weights[2], wires=1)
            return qp.expval(sum_op)

    >>> import pennylane.numpy as pnp
    >>> weights = pnp.array([0.1, 0.2, 0.3], requires_grad=True)
    >>> qp.grad(circuit)(weights)
    array([-0.093..., -0.188..., -0.288...])

### `grouping_indices`

```python
def grouping_indices(self)
```

Return the grouping indices attribute.

Returns:
    list[list[int]]: indices needed to form groups of commuting observables

### `grouping_indices`

```python
def grouping_indices(self, value)
```

Set the grouping indices, if known without explicit computation, or if
computation was done externally. The groups are not verified.

Args:
    value (list[list[int]]): List of lists of indexes of the observables in ``self.ops``. Each sublist
        represents a group of commuting observables.

### `__str__`

```python
def __str__(self)
```

String representation of the Sum.

### `__repr__`

```python
def __repr__(self)
```

Terminal representation for Sum

### `is_verified_hermitian`

```python
def is_verified_hermitian(self)
```

If all of the terms in the sum are hermitian, then the Sum is hermitian.

### `matrix`

```python
def matrix(self, wire_order=None)
```

Representation of the operator as a matrix in the computational basis.

If ``wire_order`` is provided, the numerical representation considers the position of the
operator's wires in the global wire order. Otherwise, the wire order defaults to the
operator's wires.

If the matrix depends on trainable parameters, the result
will be cast in the same autodifferentiation framework as the parameters.

A ``MatrixUndefinedError`` is raised if the matrix representation has not been defined.

.. seealso:: :meth:`~.Operator.compute_matrix`

Args:
    wire_order (Iterable): global wire order, must contain all wire labels from the
    operator's wires

Returns:
    tensor_like: matrix representation

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

>>> op = 0.5 * qp.X(0) + 0.7 * qp.X(1) + 1.5 * qp.Y(0) @ qp.Y(1)
>>> op.terms()
([np.float64(0.5), np.float64(0.7), np.float64(1.5)], [X(0), X(1), Y(0) @ Y(1)])

Note that this method disentangles nested structures of ``Sum`` instances like so.

>>> op = 0.5 * qp.X(0) + (2. * (qp.X(1) + 3. * qp.X(2)))
>>> print(op)
0.5 * X(0) + 2.0 * (X(1) + 3.0 * X(2))
>>> print(op.terms())
([np.float64(0.5), np.float64(2.0), np.float64(6.0)], [X(0), X(1), X(2)])

### `compute_grouping`

```python
def compute_grouping(self, grouping_type='qwc', method='lf')
```

Compute groups of operators and coefficients corresponding to commuting
observables of this Sum.

.. note::

    If grouping is requested, the computed groupings are stored as a list of list of indices
    in ``Sum.grouping_indices``. The indices refer to operators and coefficients returned
    by ``Sum.terms()``, not ``Sum.operands``, as these are not guaranteed to be equivalent.

Args:
    grouping_type (str): The type of binary relation between Pauli words used to compute
        the grouping. Can be ``'qwc'``, ``'commuting'``, or ``'anticommuting'``.
    method (str): The graph colouring heuristic to use in solving minimum clique cover for
        grouping, which can be ``'lf'`` (Largest First), ```'rlf'`` (Recursive Largest First),
        `'dsatur'`` (Degree of Saturation), or ``'gis'`` (Greedy Independent Set).

**Example**

.. code-block:: python

    import pennylane as qp

    a = qp.X(0)
    b = qp.prod(qp.X(0), qp.X(1))
    c = qp.Z(0)
    obs = [a, b, c]
    coeffs = [1.0, 2.0, 3.0]

    op = qp.dot(coeffs, obs)

>>> op.grouping_indices is None
True
>>> op.compute_grouping(grouping_type="qwc")
>>> op.grouping_indices
((0, 1), (2,))
