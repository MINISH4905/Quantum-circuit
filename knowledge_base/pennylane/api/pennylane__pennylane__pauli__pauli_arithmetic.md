---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/pauli/pauli_arithmetic.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/pauli/pauli_arithmetic.py
license: Apache-2.0
---

## Module `pennylane/pauli/pauli_arithmetic.py`

The Pauli arithmetic abstract reduced representation classes

## `PauliWord`

```python
class PauliWord(dict)
```

Immutable dictionary used to represent a Pauli Word,
associating wires with their respective operators.
Can be constructed from a standard dictionary.

.. note::

    An empty :class:`~.PauliWord` will be treated as the multiplicative
    identity (i.e identity on all wires). Its matrix is the identity matrix
    (trivially the :math:`1\times 1` one matrix when no ``wire_order`` is passed to
    ``PauliWord({}).to_mat()``).

**Examples**

Initializing a Pauli word:

>>> w = PauliWord({"a": 'X', 2: 'Y', 3: 'Z'})
>>> w
X(a) @ Y(2) @ Z(3)

When multiplying Pauli words together, we obtain a :class:`~PauliSentence` with the resulting ``PauliWord`` as a key and the corresponding coefficient as its value.

>>> w1 = PauliWord({0:"X", 1:"Y"})
>>> w2 = PauliWord({1:"X", 2:"Z"})
>>> w1 @ w2
-1j * X(0) @ Z(1) @ Z(2)

We can multiply scalars to Pauli words or add/subtract them, resulting in a :class:`~PauliSentence` instance.

>>> 0.5 * w1 - 1.5 * w2 + 2
0.5 * X(0) @ Y(1)
+ -1.5 * X(1) @ Z(2)
+ 2 * I

### `__missing__`

```python
def __missing__(self, key)
```

If the wire is not in the Pauli word,
then no operator acts on it, so return the Identity.

### `__init__`

```python
def __init__(self, mapping, _skip_filter=False)
```

Strip identities from PauliWord on init!

### `pauli_rep`

```python
def pauli_rep(self)
```

Trivial pauli_rep

### `__reduce__`

```python
def __reduce__(self)
```

Defines how to pickle and unpickle a PauliWord. Otherwise, un-pickling
would cause __setitem__ to be called, which is forbidden on PauliWord.
For more information, see: https://docs.python.org/3/library/pickle.html#object.__reduce__

### `__copy__`

```python
def __copy__(self)
```

Copy the PauliWord instance.

### `__setitem__`

```python
def __setitem__(self, key, item)
```

Restrict setting items after instantiation.

### `update`

```python
def update(self, __m, **kwargs) -> None
```

Restrict updating PW after instantiation.

### `__matmul__`

```python
def __matmul__(self, other)
```

Multiply two Pauli words together using the matrix product if wires overlap
and the tensor product otherwise.

Empty Pauli words are treated as the Identity operator on all wires.

Args:
    other (PauliWord): The Pauli word to multiply with

Returns:
    PauliSentence: coeff * new_word

### `__mul__`

```python
def __mul__(self, other)
```

Multiply a PauliWord by a scalar

Args:
    other (Scalar): The scalar to multiply the PauliWord with

Returns:
    PauliSentence

### `__add__`

```python
def __add__(self, other)
```

Add PauliWord instances and scalars to PauliWord.
Returns a PauliSentence.

### `__iadd__`

```python
def __iadd__(self, other)
```

Inplace addition

### `__sub__`

```python
def __sub__(self, other)
```

Subtract other PauliSentence, PauliWord, or scalar

### `__rsub__`

```python
def __rsub__(self, other)
```

Subtract other PauliSentence, PauliWord, or scalar

### `__truediv__`

```python
def __truediv__(self, other)
```

Divide a PauliWord by a scalar

### `commutes_with`

```python
def commutes_with(self, other)
```

Fast check if two PauliWords commute with each other

### `commutator`

```python
def commutator(self, other)
```

Compute commutator between a ``PauliWord`` :math:`P` and other operator :math:`O`

.. math:: [P, O] = P O - O P

When the other operator is a :class:`~PauliWord` or :class:`~PauliSentence`,
this method is faster than computing ``P @ O - O @ P``. It is what is being used
in :func:`~commutator` when setting ``pauli=True``.

Args:
    other (Union[Operator, PauliWord, PauliSentence]): Second operator

Returns:
    ~PauliSentence: The commutator result in form of a :class:`~PauliSentence` instances.

**Examples**

You can compute commutators between :class:`~PauliWord` instances.

>>> pw = PauliWord({0:"X"})
>>> pw.commutator(PauliWord({0:"Y"}))
2j * Z(0)

You can also compute the commutator with other operator types if they have a Pauli representation.

>>> pw.commutator(qp.Y(0))
2j * Z(0)

### `__str__`

```python
def __str__(self)
```

String representation of a PauliWord.

### `__repr__`

```python
def __repr__(self)
```

Terminal representation for PauliWord

### `wires`

```python
def wires(self)
```

Track wires in a PauliWord.

### `to_mat`

```python
def to_mat(self, wire_order=None, format='dense', coeff=1.0)
```

Returns the matrix representation.

Keyword Args:
    wire_order (iterable or None): The order of qubits in the tensor product.
    format (str): The format of the matrix. It is "dense" by default. Use "csr" for sparse.
    coeff (float): Coefficient multiplying the resulting matrix.

Returns:
    (Union[NumpyArray, ScipySparseArray]): Matrix representation of the Pauli word.

Raises:
    ValueError: Can't get the matrix of an empty PauliWord.

### `operation`

```python
def operation(self, wire_order: WiresLike=())
```

Returns a native PennyLane :class:`~pennylane.operation.Operation` representing the PauliWord.

### `map_wires`

```python
def map_wires(self, wire_map: dict) -> 'PauliWord'
```

Return a new PauliWord with the wires mapped.

## `PauliSentence`

```python
class PauliSentence(dict)
```

Dictionary representing a linear combination of Pauli words, with the keys
as :class:`~pennylane.pauli.PauliWord` instances and the values correspond to coefficients.

.. note::

    An empty :class:`~.PauliSentence` will be treated as the additive
    identity (i.e ``0 * Identity()``). Its matrix is the all-zero matrix
    (trivially the :math:`1\times 1` zero matrix when no ``wire_order`` is passed to
    ``PauliSentence({}).to_mat()``).

**Examples**

>>> ps = PauliSentence({
...     PauliWord({0:'X', 1:'Y'}): 1.23,
...     PauliWord({2:'Z', 0:'Y'}): -0.45j
... })
>>> ps
1.23 * X(0) @ Y(1)
+ (-0-0.45j) * Z(2) @ Y(0)

Combining Pauli words automatically results in Pauli sentences that can be used to construct more complicated operators.

>>> w1 = PauliWord({0:"X", 1:"Y"})
>>> w2 = PauliWord({1:"X", 2:"Z"})
>>> ps = 0.5 * w1 - 1.5 * w2 + 2
>>> ps + PauliWord({3:"Z"}) - 1
0.5 * X(0) @ Y(1)
+ -1.5 * X(1) @ Z(2)
+ 1 * I
+ 1.0 * Z(3)

Note that while the empty :class:`~PauliWord` ``PauliWord({})`` respresents the identity, the empty ``PauliSentence`` represents 0

>>> PauliSentence({})
0 * I

We can compute commutators using the ``PauliSentence.commutator()`` method

>>> op1 = PauliWord({0:"X", 1:"X"})
>>> op2 = PauliWord({0:"Y"}) + PauliWord({1:"Y"})
>>> op1.commutator(op2)
2j * Z(0) @ X(1)
+ 2j * X(0) @ Z(1)

Or, alternatively, use :func:`~commutator`.

>>> qp.commutator(op1, op2, pauli=True)
2j * Z(0) @ X(1)
+ 2j * X(0) @ Z(1)

Note that we need to specify ``pauli=True`` as :func:`~.commutator` returns PennyLane operators by default.

### `pauli_rep`

```python
def pauli_rep(self)
```

Trivial pauli_rep

### `__missing__`

```python
def __missing__(self, key)
```

If the PauliWord is not in the sentence then the coefficient
associated with it should be 0.

### `trace`

```python
def trace(self)
```

Return the normalized trace of the ``PauliSentence`` instance

.. math:: \frac{1}{2^n} \text{tr}\left( P \right).

The normalized trace does not scale with the number of qubits :math:`n`.

>>> PauliSentence({PauliWord({0:"I", 1:"I"}): 0.5}).trace()
0.5
>>> PauliSentence({PauliWord({}): 0.5}).trace()
0.5

### `__add__`

```python
def __add__(self, other)
```

Add a PauliWord, scalar or other PauliSentence to a PauliSentence.

Empty Pauli sentences are treated as the additive identity
(i.e 0 * Identity on all wires). The non-empty Pauli sentence is returned.

### `__iadd__`

```python
def __iadd__(self, other)
```

Inplace addition of two Pauli sentence together by adding terms of other to self

### `__sub__`

```python
def __sub__(self, other)
```

Subtract other PauliSentence, PauliWord, or scalar

### `__rsub__`

```python
def __rsub__(self, other)
```

Subtract other PauliSentence, PauliWord, or scalar

### `__copy__`

```python
def __copy__(self)
```

Copy the PauliSentence instance.

### `__matmul__`

```python
def __matmul__(self, other)
```

Matrix / tensor product between two PauliSentences by iterating over each sentence and multiplying
the Pauli words pair-wise

### `__mul__`

```python
def __mul__(self, other)
```

Multiply a PauliWord by a scalar

Args:
    other (Scalar): The scalar to multiply the PauliWord with

Returns:
    PauliSentence

### `__truediv__`

```python
def __truediv__(self, other)
```

Divide a PauliSentence by a scalar

### `commutator`

```python
def commutator(self, other)
```

Compute commutator between a ``PauliSentence`` :math:`P` and other operator :math:`O`

.. math:: [P, O] = P O - O P

When the other operator is a :class:`~PauliWord` or :class:`~PauliSentence`,
this method is faster than computing ``P @ O - O @ P``. It is what is being used
in :func:`~commutator` when setting ``pauli=True``.

Args:
    other (Union[Operator, PauliWord, PauliSentence]): Second operator

Returns:
    ~PauliSentence: The commutator result in form of a :class:`~PauliSentence` instances.

**Examples**

You can compute commutators between :class:`~PauliSentence` instances.

>>> pw1 = PauliWord({0:"X"})
>>> pw2 = PauliWord({1:"X"})
>>> ps1 = PauliSentence({pw1: 1., pw2: 2.})
>>> ps2 = PauliSentence({pw1: 0.5j, pw2: 1j})
>>> ps1.commutator(ps2)
0 * I

You can also compute the commutator with other operator types if they have a Pauli representation.

>>> ps1.commutator(qp.Y(0))
2j * Z(0)

### `__str__`

```python
def __str__(self)
```

String representation of the PauliSentence.

### `__repr__`

```python
def __repr__(self)
```

Terminal representation for PauliSentence

### `wires`

```python
def wires(self)
```

Track wires of the PauliSentence.

### `to_mat`

```python
def to_mat(self, wire_order=None, format='dense', buffer_size=None)
```

Returns the matrix representation.

Keyword Args:
    wire_order (iterable or None): The order of qubits in the tensor product.
    format (str): The format of the matrix. It is "dense" by default. Use "csr" for sparse.
    buffer_size (int or None): The maximum allowed memory in bytes to store intermediate results
        in the calculation of sparse matrices. It defaults to ``2 ** 30`` bytes that make
        1GB of memory. In general, larger buffers allow faster computations.

Returns:
    (Union[NumpyArray, ScipySparseArray]): Matrix representation of the Pauli sentence.

Raises:
    ValueError: Can't get the matrix of an empty PauliSentence.

### `dot`

```python
def dot(self, vector, wire_order=None)
```

Computes the matrix-vector product of the Pauli sentence with a state vector.
See pauli_sparse_matrices.md for the technical details.

### `operation`

```python
def operation(self, wire_order: WiresLike=())
```

Returns a native PennyLane :class:`~pennylane.operation.Operation` representing the PauliSentence.

### `prune`

```python
def prune(self, tol=1e-08)
```

Remove any ``PauliWord`` with coefficients less than the threshold tolerance.

**Examples**

>>> ps = PauliSentence({
...     PauliWord({0:'X', 1:'Y'}): 0,
...     PauliWord({2:'Z', 0:'Y'}): -0.45j
... })
>>> ps
0 * X(0) @ Y(1)
+ (-0-0.45j) * Z(2) @ Y(0)
>>> ps.prune()
>>> ps
(-0-0.45j) * Z(2) @ Y(0)

### `simplify`

```python
def simplify(self, tol=1e-08) -> None
```

Remove any ``PauliWord`` with coefficients less than the threshold tolerance.

This method mutates the ``PauliSentence`` in place, and does not return anything.

.. seealso:: :meth:`~.prune`

### `map_wires`

```python
def map_wires(self, wire_map: dict) -> 'PauliSentence'
```

Return a new PauliSentence with the wires mapped.
