---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/pow.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/pow.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/pow.py`

This submodule defines the symbolic operation that stands for the power of an operator.

## `pow`

```python
def pow(base, z=1, lazy=True, id=None) -> Operator
```

Raise an Operator to a power.

Args:
    base (~.operation.Operator): the operator to be raised to a power
    z (float): the exponent (default value is 1)

Keyword Args:
    lazy=True (bool): In lazy mode, all operations are wrapped in a ``Pow`` class
        and handled later. If ``lazy=False``, operation-specific simplifications are first attempted.
    id (str): custom label given to an operator instance,
        can be useful for some applications where the instance has to be identified

Returns:
    Operator

.. note::

    This operator supports a batched base, a batched coefficient and a combination of both:

    >>> op = qp.pow(qp.RX([1, 2, 3], wires=0), z=4)
    >>> qp.matrix(op).shape
    (3, 2, 2)
    >>> op = qp.pow(qp.RX(1, wires=0), z=[1, 2, 3])
    >>> qp.matrix(op).shape
    (3, 2, 2)
    >>> op = qp.pow(qp.RX([1, 2, 3], wires=0), z=[4, 5, 6])
    >>> qp.matrix(op).shape
    (3, 2, 2)

    But it doesn't support batching of operators:

    >>> op = qp.pow([qp.RX(1, wires=0), qp.RX(2, wires=0)], z=4)
    Traceback (most recent call last):
        ...
    AttributeError: 'list' object has no attribute 'name'

.. seealso:: :class:`~.Pow`, :meth:`~.Operator.pow`.

**Example**

>>> qp.pow(qp.X(0), 0.5)
X(0)**0.5
>>> qp.pow(qp.X(0), 0.5, lazy=False)
SX(0)
>>> qp.pow(qp.X(0), 0.1, lazy=False)
X(0)**0.1
>>> qp.pow(qp.X(0), 2, lazy=False)
I(0)

Lazy behaviour can also be accessed via ``op ** z``.

## `Pow`

```python
class Pow(ScalarSymbolicOp)
```

Symbolic operator denoting an operator raised to a power.

Args:
    base (~.operation.Operator): the operator to be raised to a power
    z=1 (float): the exponent

**Example**

>>> sqrt_x = Pow(qp.X(0), 0.5)
>>> sqrt_x.decomposition()
[SX(0)]
>>> qp.matrix(sqrt_x)
array([[0.5+0.5j, 0.5-0.5j],
       [0.5-0.5j, 0.5+0.5j]])
>>> qp.matrix(qp.SX(0))
array([[0.5+0.5j, 0.5-0.5j],
       [0.5-0.5j, 0.5+0.5j]])
>>> qp.matrix(Pow(qp.T(0), 1.234))
array([[1.        +0.j        , 0.        +0.j        ],
       [0.        +0.j        , 0.56...+0.8244...j]])

### `__new__`

```python
def __new__(cls, base=None, z=1, id=None)
```

Mixes in parents based on inheritance structure of base.

Though all the types will be named "Pow", their *identity* and location in memory will be
different based on ``base``'s inheritance.  We cache the different types in private class
variables so that:

>>> z = 2
>>> Pow(op, z).__class__ is Pow(op, z).__class__
True
>>> type(Pow(op, z)) == type(Pow(op, z))
True
>>> isinstance(Pow(op, z), type(Pow(op, z)))
True
>>> Pow(qp.RX(1.2, wires=0), 0.5).__class__ is PowOperation
True

### `z`

```python
def z(self)
```

The exponent.

### `data`

```python
def data(self)
```

The trainable parameters

### `diagonalizing_gates`

```python
def diagonalizing_gates(self)
```

Sequence of gates that diagonalize the operator in the computational basis.

Given the eigendecomposition :math:`O = U \Sigma U^{\dagger}` where
:math:`\Sigma` is a diagonal matrix containing the eigenvalues,
the sequence of diagonalizing gates implements the unitary :math:`U^{\dagger}`.

The diagonalizing gates of an operator to a power is the same as the diagonalizing
gates as the original operator. As we can see,

.. math::

    O^2 = U \Sigma U^{\dagger} U \Sigma U^{\dagger} = U \Sigma^2 U^{\dagger}

This formula can be extended to inversion and any rational number.

The diagonalizing gates rotate the state into the eigenbasis
of the operator.

A ``DiagGatesUndefinedError`` is raised if no representation by decomposition is defined.

.. seealso:: :meth:`~.Operator.compute_diagonalizing_gates`.

Returns:
    list[.Operator] or None: a list of operators

### `generator`

```python
def generator(self)
```

Generator of an operator that is in single-parameter-form.

The generator of a power operator is ``z`` times the generator of the
base matrix.

.. math::

    U(\phi)^z = e^{i\phi (z G)}

See also :func:`~.generator`

### `adjoint`

```python
def adjoint(self)
```

Create an operation that is the adjoint of this one.

Adjointed operations are the conjugated and transposed version of the
original operation. Adjointed ops are equivalent to the inverted operation for unitary
gates.

.. warning::

    The adjoint of a fractional power of an operator is not well-defined due to branch cuts in the power function.
    Therefore, an ``AdjointUndefinedError`` is raised when the power ``z`` is not an integer.

    The integer power check is a type check, so that floats like ``2.0`` are not considered to be integers.

Returns:
    The adjointed operation.

Raises:
    AdjointUndefinedError: If the exponent ``z`` is not of type ``int``.

## `PowOperation`

```python
class PowOperation(Pow, Operation)
```

Operation-specific methods and properties for the ``Pow`` class.

Dynamically mixed in based on the provided base operator.  If the base operator is an
Operation, this class will be mixed in.

When we no longer rely on certain functionality through `Operation`, we can get rid of this
class.
