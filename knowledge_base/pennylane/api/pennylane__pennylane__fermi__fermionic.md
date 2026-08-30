---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/fermi/fermionic.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/fermi/fermionic.py
license: Apache-2.0
---

## Module `pennylane/fermi/fermionic.py`

The fermionic representation classes and functions.

## `FermiWord`

```python
class FermiWord(dict)
```

Immutable dictionary used to represent a Fermi word, a product of fermionic creation and
annihilation operators, that can be constructed from a standard dictionary.

The keys of the dictionary are tuples of two integers. The first integer represents the
position of the creation/annihilation operator in the Fermi word and the second integer
represents the orbital it acts on. The values of the dictionary are one of ``'+'`` or ``'-'``
symbols that denote creation and annihilation operators, respectively. The operator
:math:`a^{\dagger}_0 a_1` can then be constructed as

>>> w = qp.FermiWord({(0, 0) : '+', (1, 1) : '-'})
>>> print(w)
a⁺(0) a(1)

### `adjoint`

```python
def adjoint(self)
```

Return the adjoint of FermiWord.

### `items`

```python
def items(self)
```

Returns the dictionary items in sorted order.

### `wires`

```python
def wires(self)
```

Return wires in a FermiWord.

### `__missing__`

```python
def __missing__(self, key)
```

Return empty string for a missing key in FermiWord.

### `update`

```python
def update(self, item)
```

Restrict updating FermiWord after instantiation.

### `__setitem__`

```python
def __setitem__(self, key, item)
```

Restrict setting items after instantiation.

### `__reduce__`

```python
def __reduce__(self)
```

Defines how to pickle and unpickle a FermiWord. Otherwise, un-pickling
would cause __setitem__ to be called, which is forbidden on PauliWord.
For more information, see: https://docs.python.org/3/library/pickle.html#object.__reduce__

### `__copy__`

```python
def __copy__(self)
```

Copy the FermiWord instance.

### `__deepcopy__`

```python
def __deepcopy__(self, memo)
```

Deep copy the FermiWord instance.

### `__hash__`

```python
def __hash__(self)
```

Hash value of a FermiWord.

### `to_string`

```python
def to_string(self)
```

Return a compact string representation of a FermiWord. Each operator in the word is
represented by the number of the wire it operates on, and a `+` or `-` to indicate either
a creation or annihilation operator.

>>> w = qp.FermiWord({(0, 0) : '+', (1, 1) : '-'})
>>> w.to_string()
'a⁺(0) a(1)'

### `__str__`

```python
def __str__(self)
```

String representation of a FermiWord.

### `__repr__`

```python
def __repr__(self)
```

Terminal representation of a FermiWord

### `__add__`

```python
def __add__(self, other)
```

Add a FermiSentence, FermiWord or constant to a FermiWord. Converts both
elements into FermiSentences, and uses the FermiSentence __add__
method

### `__radd__`

```python
def __radd__(self, other)
```

Add a FermiWord to a constant, i.e. `2 + FermiWord({...})`

### `__sub__`

```python
def __sub__(self, other)
```

Subtract a FermiSentence, FermiWord or constant from a FermiWord. Converts both
elements into FermiSentences (with negative coefficient for `other`), and
uses the FermiSentence __add__  method

### `__rsub__`

```python
def __rsub__(self, other)
```

Subtract a FermiWord to a constant, i.e. `2 - FermiWord({...})`

### `__mul__`

```python
def __mul__(self, other)
```

Multiply a FermiWord with another FermiWord, a FermiSentence, or a constant.

>>> w = qp.FermiWord({(0, 0) : '+', (1, 1) : '-'})
>>> print(w * w)
a⁺(0) a(1) a⁺(0) a(1)

### `__rmul__`

```python
def __rmul__(self, other)
```

Reverse multiply a FermiWord

Multiplies a FermiWord "from the left" with an object that can't be modified
to support __mul__ for FermiWord. Will be defaulted in for example
``2 * FermiWord({(0, 0): "+"})``, where the ``__mul__`` operator on an integer
will fail to multiply with a FermiWord

### `__pow__`

```python
def __pow__(self, value)
```

Exponentiate a Fermi word to an integer power.

>>> w = qp.FermiWord({(0, 0) : '+', (1, 1) : '-'})
>>> print(w**3)
a⁺(0) a(1) a⁺(0) a(1) a⁺(0) a(1)

### `to_mat`

```python
def to_mat(self, n_orbitals=None, format='dense', buffer_size=None)
```

Return the matrix representation.

Args:
    n_orbitals (int or None): Number of orbitals. If not provided, it will be inferred from
        the largest orbital index in the Fermi operator.
    format (str): The format of the matrix. It is "dense" by default. Use "csr" for sparse.
    buffer_size (int or None)`: The maximum allowed memory in bytes to store intermediate results
        in the calculation of sparse matrices. It defaults to ``2 ** 30`` bytes that make
        1GB of memory. In general, larger buffers allow faster computations.

Returns:
    NumpyArray: Matrix representation of the :class:`~.FermiWord`.

**Example**

>>> w = qp.FermiWord({(0, 0): '+', (1, 1): '-'})
>>> w.to_mat()
array([[0.+0.j, 0.+0.j, 0.+0.j, 0.+0.j],
       [0.+0.j, 0.+0.j, 0.+0.j, 0.+0.j],
       [0.+0.j, 1.+0.j, 0.+0.j, 0.+0.j],
       [0.+0.j, 0.+0.j, 0.+0.j, 0.+0.j]])

### `shift_operator`

```python
def shift_operator(self, initial_position, final_position)
```

Shifts an operator in the FermiWord from ``initial_position`` to ``final_position`` by applying the fermionic anti-commutation relations.

There are three `anti-commutator relations <https://en.wikipedia.org/wiki/Creation_and_annihilation_operators#Creation_and_annihilation_operators_in_quantum_field_theories>`_:

.. math::
    \left\{ a_i, a_j \right\} = 0, \quad \left\{ a^{\dagger}_i, a^{\dagger}_j \right\} = 0, \quad \left\{ a_i, a^{\dagger}_j \right\} = \delta_{ij},


where

.. math::
    \left\{a_i, a_j \right\} = a_i a_j + a_j a_i,

and

.. math::
    \delta_{ij} = \begin{cases} 1 & i = j \\ 0 & i \neq j \end{cases}.

Args:
    initial_position (int): The position of the operator to be shifted.
    final_position (int): The desired position of the operator.

Returns:
    FermiSentence: The ``FermiSentence`` obtained after applying the anti-commutator relations.

Raises:
    TypeError: if ``initial_position`` or ``final_position`` is not an integer
    ValueError: if ``initial_position`` or ``final_position`` are outside the range ``[0, len(fermiword) - 1]``
                where ``len(fermiword)`` is the number of operators in the FermiWord.


**Example**

>>> w = qp.FermiWord({(0, 0): '+', (1, 1): '-'})
>>> print(w.shift_operator(0, 1))
-1 * a(1) a⁺(0)

## `FermiSentence`

```python
class FermiSentence(dict)
```

Dictionary-based representation of a linear combination of ``FermiWord`` instances.
Each key is a unique ``FermiWord`` and its corresponding value is its coefficient in the sentence.

>>> w1 = qp.FermiWord({(0, 0) : '+', (1, 1) : '-'})
>>> w2 = qp.FermiWord({(0, 1) : '+', (1, 2) : '-'})
>>> s = qp.FermiSentence({w1 : 1.2, w2: 3.1})
>>> print(s)
1.2 * a⁺(0) a(1)
+ 3.1 * a⁺(1) a(2)

### `adjoint`

```python
def adjoint(self)
```

Return the adjoint of FermiSentence.

### `wires`

```python
def wires(self)
```

Return wires of the FermiSentence.

### `__str__`

```python
def __str__(self)
```

String representation of a FermiSentence.

### `__repr__`

```python
def __repr__(self)
```

Terminal representation for FermiSentence.

### `__missing__`

```python
def __missing__(self, key)
```

If the FermiSentence does not contain a FermiWord then the associated value will be 0.

### `__add__`

```python
def __add__(self, other)
```

Add a FermiSentence, FermiWord or constant to a FermiSentence by iterating over the
smaller one and adding its terms to the larger one.

### `__radd__`

```python
def __radd__(self, other)
```

Add a FermiSentence to a constant, i.e. `2 + FermiSentence({...})`

### `__sub__`

```python
def __sub__(self, other)
```

Subtract a FermiSentence, FermiWord or constant from a FermiSentence

### `__rsub__`

```python
def __rsub__(self, other)
```

Subtract a FermiSentence to a constant, i.e.

>>> 2 - FermiSentence({...}) # doctest: +SKIP

### `__mul__`

```python
def __mul__(self, other)
```

Multiply two Fermi sentences by iterating over each sentence and multiplying the Fermi
words pair-wise

### `__rmul__`

```python
def __rmul__(self, other)
```

Reverse multiply a FermiSentence

Multiplies a FermiSentence "from the left" with an object that can't be modified
to support __mul__ for FermiSentence. Will be defaulted in for example when
multiplying ``2 * fermi_sentence``, since the ``__mul__`` operator on an integer
will fail to multiply with a FermiSentence

### `__pow__`

```python
def __pow__(self, value)
```

Exponentiate a Fermi sentence to an integer power.

### `prune`

```python
def prune(self, tol=1e-08) -> None
```

Remove any FermiWord with coefficients less than the threshold tolerance.

**Examples**

>>> w1 = qp.FermiWord({(0, 0) : '+', (1, 1) : '-'})
>>> w2 = qp.FermiWord({(0, 1) : '+', (1, 2) : '-'})
>>> s = qp.FermiSentence({w1 : 0, w2: 3.1})
>>> s
FermiSentence({FermiWord({(0, 0): '+', (1, 1): '-'}): 0, FermiWord({(0, 1): '+', (1, 2): '-'}): 3.1})
>>> s.prune()
>>> s
FermiSentence({FermiWord({(0, 1): '+', (1, 2): '-'}): 3.1})

### `simplify`

```python
def simplify(self, tol=1e-08) -> None
```

Remove any FermiWord with coefficients less than the threshold tolerance.

This method mutates the ``FermiSentence`` in place, and does not return anything.

.. seealso:: :meth:`~.prune`

### `to_mat`

```python
def to_mat(self, n_orbitals=None, format='dense', buffer_size=None)
```

Return the matrix representation.

Args:
    n_orbitals (int or None): Number of orbitals. If not provided, it will be inferred from
        the largest orbital index in the Fermi operator
    format (str): The format of the matrix. It is "dense" by default. Use "csr" for sparse.
    buffer_size (int or None)`: The maximum allowed memory in bytes to store intermediate results
        in the calculation of sparse matrices. It defaults to ``2 ** 30`` bytes that make
        1GB of memory. In general, larger buffers allow faster computations.

Returns:
    NumpyArray: Matrix representation of the :class:`~.FermiSentence`.

**Example**

>>> fw1 = qp.FermiWord({(0, 0): "+", (1, 1): "-"})
>>> fw2 = qp.FermiWord({(0, 0): "+", (1, 0): "-"})
>>> fs = qp.FermiSentence({fw1: 1.2, fw2: 3.1})
>>> fs.to_mat()
array([[0. +0.j, 0. +0.j, 0. +0.j, 0. +0.j],
       [0. +0.j, 0. +0.j, 0. +0.j, 0. +0.j],
       [0. +0.j, 1.2+0.j, 3.1+0.j, 0. +0.j],
       [0. +0.j, 0. +0.j, 0. +0.j, 3.1+0.j]])

## `from_string`

```python
def from_string(fermi_string)
```

Return a fermionic operator object from its string representation.

The string representation is a compact format that uses the orbital index and ``'+'`` or ``'-'``
symbols to indicate creation and annihilation operators, respectively. For instance, the string
representation for the operator :math:`a^{\dagger}_0 a_1 a^{\dagger}_0 a_1` is
``'0+ 1- 0+ 1-'``. The ``'-'`` symbols can be optionally dropped such that ``'0+ 1 0+ 1'``
represents the same operator. The format commonly used in OpenFermion to represent the same
operator, ``'0^ 1 0^ 1'`` , is also supported.

Args:
    fermi_string (str): string representation of the fermionic object

Returns:
    FermiWord: the fermionic operator object

**Example**

>>> from pennylane.fermi import from_string
>>> print(from_string('0+ 1- 0+ 1-'))
a⁺(0) a(1) a⁺(0) a(1)

>>> print(from_string('0+ 1 0+ 1'))
a⁺(0) a(1) a⁺(0) a(1)

>>> print(from_string('0^ 1 0^ 1'))
a⁺(0) a(1) a⁺(0) a(1)

>>> op1 = qp.FermiC(0) * qp.FermiA(1) * qp.FermiC(2) * qp.FermiA(3)
>>> op2 = from_string('0+ 1- 2+ 3-')
>>> op1 == op2
True

## `FermiC`

```python
class FermiC(FermiWord)
```

FermiC(orbital)
The fermionic creation operator :math:`a^{\dagger}`

For instance, the operator ``qp.FermiC(2)`` denotes :math:`a^{\dagger}_2`. This operator applied
to :math:`\ket{0000}` gives :math:`\ket{0010}`.

Args:
    orbital(int): the non-negative integer indicating the orbital the operator acts on.

.. note:: While the ``FermiC`` class represents a mathematical operator, it is not a PennyLane qubit :class:`~.Operator`.

.. seealso:: :class:`~pennylane.FermiA`

**Example**

To construct the operator :math:`a^{\dagger}_0`:

>>> w = qp.FermiC(0)
>>> print(w)
a⁺(0)

This can be combined with the annihilation operator :class:`~pennylane.FermiA`. For example,
:math:`a^{\dagger}_0 a_1 a^{\dagger}_2 a_3` can be constructed as:

>>> w = qp.FermiC(0) * qp.FermiA(1) * qp.FermiC(2) * qp.FermiA(3)
>>> print(w)
a⁺(0) a(1) a⁺(2) a(3)

### `adjoint`

```python
def adjoint(self)
```

Return the adjoint of FermiC.

## `FermiA`

```python
class FermiA(FermiWord)
```

FermiA(orbital)
The fermionic annihilation operator :math:`a`

For instance, the operator ``qp.FermiA(2)`` denotes :math:`a_2`. This operator applied
to :math:`\ket{0010}` gives :math:`\ket{0000}`.

Args:
    orbital(int): the non-negative integer indicating the orbital the operator acts on.

.. note:: While the ``FermiA`` class represents a mathematical operator, it is not a PennyLane qubit :class:`~.Operator`.

.. seealso:: :class:`~pennylane.FermiC`

**Example**

To construct the operator :math:`a_0`:

>>> w = qp.FermiA(0)
>>> print(w)
a(0)

This can be combined with the creation operator :class:`~pennylane.FermiC`. For example,
:math:`a^{\dagger}_0 a_1 a^{\dagger}_2 a_3` can be constructed as:

>>> w = qp.FermiC(0) * qp.FermiA(1) * qp.FermiC(2) * qp.FermiA(3)
>>> print(w)
a⁺(0) a(1) a⁺(2) a(3)

### `adjoint`

```python
def adjoint(self)
```

Return the adjoint of FermiA.
