---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/exp.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/exp.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/exp.py`

This submodule defines the symbolic operation that stands for an exponential of an operator.

## `exp`

```python
def exp(op, coeff: float=1.0, id: str | None=None)
```

Take the exponential of an Operator times a coefficient.

Args:
    base (~.operation.Operator): The Operator to be exponentiated
    coeff (float): a scalar coefficient of the operator
    id (str): id for the Exp operator. Default is None.

Returns:
   :class:`Exp`: An :class:`~.operation.Operator` representing an operator exponential.


.. note::

    This operator supports a batched base, a batched coefficient and a combination of both:

    >>> op = qp.exp(qp.RX([1, 2, 3], wires=0), coeff=4)
    >>> qp.matrix(op).shape
    (3, 2, 2)
    >>> op = qp.exp(qp.RX(1, wires=0), coeff=[1, 2, 3])
    >>> qp.matrix(op).shape
    (3, 2, 2)
    >>> op = qp.exp(qp.RX([1, 2, 3], wires=0), coeff=[4, 5, 6])
    >>> qp.matrix(op).shape
    (3, 2, 2)

    But it doesn't support batching of operators:

    >>> qp.exp([qp.RX(1, wires=0), qp.RX(2, wires=0)], coeff=4)
    Traceback (most recent call last):
        ...
    TypeError: base is expected to be of type Operator, but received <class 'list'>

**Example**

This symbolic operator can be used to make general rotation operators:

>>> x = np.array(1.23)
>>> op = qp.exp(qp.X(0), -0.5j * x)
>>> qp.math.allclose(op.matrix(), qp.RX(x, wires=0).matrix())
True

This can even be used for more complicated generators:

>>> t = qp.X(0) @ qp.X(1) + qp.Y(0) @ qp.Y(1)
>>> isingxy = qp.exp(t, 0.25j * x)
>>> qp.math.allclose(isingxy.matrix(), qp.IsingXY(x, wires=(0,1)).matrix())
True

If the coefficient is purely imaginary and the base operator is Hermitian, then
the gate can be used in a circuit, though it may not be supported by the device and
may not be differentiable.

>>> @qp.qnode(qp.device('default.qubit', wires=1))
... def circuit(x):
...     qp.exp(qp.X(0), -0.5j * x)
...     return qp.expval(qp.Z(0))
>>> print(qp.draw(circuit)(1.23))
0: ──Exp(0.00-0.61j X)─┤  <Z>

If the base operator is Hermitian and the coefficient is real, then the ``Exp`` operator
can be measured as an observable:

>>> obs = qp.exp(qp.Z(0), 3)
>>> @qp.qnode(qp.device('default.qubit', wires=1))
... def circuit():
...     return qp.expval(obs)
>>> print(circuit())
20.085...

## `Exp`

```python
class Exp(ScalarSymbolicOp, Operation)
```

A symbolic operator representing the exponential of a operator.

Args:
    base (~.operation.Operator): The Operator to be exponentiated
    coeff=1 (Number): A scalar coefficient of the operator.
    id (str): id for the Exp operator. Default is None.

**Example**

This symbolic operator can be used to make general rotation operators:

>>> x = np.array(1.23)
>>> op = Exp( qp.X(0), -0.5j * x)
>>> qp.math.allclose(op.matrix(), qp.RX(x, wires=0).matrix())
True

This can even be used for more complicated generators:

>>> t = qp.X(0) @ qp.X(1) + qp.Y(0) @ qp.Y(1)
>>> isingxy = Exp(t, 0.25j * x)
>>> qp.math.allclose(isingxy.matrix(), qp.IsingXY(x, wires=(0,1)).matrix())
True

If the coefficient is purely imaginary and the base operator is Hermitian, then
the gate can be used in a circuit, though it may not be supported by the device and
may not be differentiable.

>>> @qp.qnode(qp.device('default.qubit', wires=1))
... def circuit(x):
...     Exp(qp.X(0), -0.5j * x)
...     return qp.expval(qp.Z(0))
>>> print(qp.draw(circuit)(1.23))
0: ──Exp(0.00-0.61j X)─┤  <Z>

If the base operator is Hermitian and the coefficient is real, then the ``Exp`` operator
can be measured as an observable:

>>> obs = Exp(qp.Z(0), 3)
>>> @qp.qnode(qp.device('default.qubit', wires=1))
... def circuit():
...     return qp.expval(obs)
>>> print(circuit())
20.085...

### `coeff`

```python
def coeff(self)
```

The numerical coefficient of the operator in the exponent.

### `decomposition`

```python
def decomposition(self)
```

Representation of the operator as a product of other operators. Decomposes into
:class:`~.PauliRot` if the coefficient is imaginary and the base is a Pauli Word.

.. math:: O = O_1 O_2 \dots O_n

A ``DecompositionUndefinedError`` is raised if the coefficient is not imaginary or the base
is not a Pauli Word.

Returns:
    list[PauliRot]: decomposition of the operator

### `eigvals`

```python
def eigvals(self)
```

Eigenvalues of the operator in the computational basis.

.. math::

    c \mathbf{M} \mathbf{v} = c \lambda \mathbf{v}
    \quad \Longrightarrow \quad
    e^{c \mathbf{M}} \mathbf{v} = e^{c \lambda} \mathbf{v}

>>> obs = Exp(qp.X(0), 3)
>>> qp.eigvals(obs)
array([20.08...,  0.049...])
>>> np.exp(3 * qp.eigvals(qp.X(0)))
array([20.08...,  0.049...])

### `generator`

```python
def generator(self)
```

Generator of an operator that is in single-parameter-form.

For example, for operator

.. math::

    U(\phi) = e^{i\phi (0.5 Y + Z\otimes X)}

we get the generator

>>> U = qp.ops.op_math.Evolution(0.5 * qp.Y(0) + qp.Z(0) @ qp.X(1), 1)
>>> print(U)
Evolution(-1j 0.5 * Y(0) + Z(0) @ X(1))
>>> U.generator()
-1 * (0.5 * Y(0) + Z(0) @ X(1))

## `pauli_rot_decomp`

```python
def pauli_rot_decomp(*params, wires, base, **_)
```

Decompose the operator into a single PauliRot operator.
