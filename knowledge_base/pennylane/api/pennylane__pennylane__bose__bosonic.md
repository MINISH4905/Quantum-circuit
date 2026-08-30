---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/bose/bosonic.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/bose/bosonic.py
license: Apache-2.0
---

## Module `pennylane/bose/bosonic.py`

The bosonic representation classes and functions.

## `BoseWord`

```python
class BoseWord(dict)
```

Dictionary used to represent a Bose word, a product of bosonic creation and
annihilation operators, that can be constructed from a standard dictionary.

The keys of the dictionary are tuples of two integers. The first integer represents the
position of the creation/annihilation operator in the Bose word and the second integer
represents the mode it acts on. The values of the dictionary are one of ``'+'`` or ``'-'``
symbols that denote creation and annihilation operators, respectively. The operator
:math:`b^{\dagger}_0 b_1` can then be constructed as

>>> w = qp.BoseWord({(0, 0) : '+', (1, 1) : '-'})
>>> print(w)
b⁺(0) b(1)

### `adjoint`

```python
def adjoint(self)
```

Return the adjoint of BoseWord.

### `items`

```python
def items(self)
```

Returns the dictionary items in sorted order.

### `wires`

```python
def wires(self)
```

Return wires in a BoseWord.

### `__missing__`

```python
def __missing__(self, key)
```

Return empty string for a missing key in BoseWord.

### `update`

```python
def update(self, item)
```

Restrict updating BoseWord after instantiation.

### `__setitem__`

```python
def __setitem__(self, key, item)
```

Restrict setting items after instantiation.

### `__reduce__`

```python
def __reduce__(self)
```

Defines how to pickle and unpickle a BoseWord. Otherwise, un-pickling
would cause __setitem__ to be called, which is forbidden on PauliWord.
For more information, see: https://docs.python.org/3/library/pickle.html#object.__reduce__

### `__copy__`

```python
def __copy__(self)
```

Copy the BoseWord instance.

### `__deepcopy__`

```python
def __deepcopy__(self, memo)
```

Deep copy the BoseWord instance.

### `__hash__`

```python
def __hash__(self)
```

Hash value of a BoseWord.

### `to_string`

```python
def to_string(self)
```

Return a compact string representation of a BoseWord. Each operator in the word is
represented by the number of the wire it operates on, and a `+` or `-` to indicate either
a creation or annihilation operator.

>>> w = qp.BoseWord({(0, 0) : '+', (1, 1) : '-'})
>>> w.to_string()
'b⁺(0) b(1)'

### `__str__`

```python
def __str__(self)
```

String representation of a BoseWord.

### `__repr__`

```python
def __repr__(self)
```

Terminal representation of a BoseWord

### `__add__`

```python
def __add__(self, other)
```

Add a BoseSentence, BoseWord or constant to a BoseWord. Converts both
elements into BoseSentences, and uses the BoseSentence __add__
method

### `__radd__`

```python
def __radd__(self, other)
```

Add a BoseWord to a constant, i.e. `2 + BoseWord({...})`

### `__sub__`

```python
def __sub__(self, other)
```

Subtract a BoseSentence, BoseWord or constant from a BoseWord. Converts both
elements into BoseSentences (with negative coefficient for `other`), and
uses the BoseSentence __add__  method

### `__rsub__`

```python
def __rsub__(self, other)
```

Subtract a BoseWord to a constant, i.e. `2 - BoseWord({...})`

### `__mul__`

```python
def __mul__(self, other)
```

Multiply a BoseWord with another BoseWord, a BoseSentence, or a constant.

>>> w = qp.BoseWord({(0, 0) : '+', (1, 1) : '-'})
>>> print(w * w)
b⁺(0) b(1) b⁺(0) b(1)

### `__rmul__`

```python
def __rmul__(self, other)
```

Reverse multiply a BoseWord

Multiplies a BoseWord "from the left" with an object that can't be modified
to support __mul__ for BoseWord. Will be defaulted in for example
``2 * BoseWord({(0, 0): "+"})``, where the ``__mul__`` operator on an integer
will fail to multiply with a BoseWord

### `__pow__`

```python
def __pow__(self, value)
```

Exponentiate a Bose word to an integer power.

>>> w = qp.BoseWord({(0, 0) : '+', (1, 1) : '-'})
>>> print(w**3)
b⁺(0) b(1) b⁺(0) b(1) b⁺(0) b(1)

### `normal_order`

```python
def normal_order(self)
```

Convert a BoseWord to its normal-ordered form.

>>> bw = qp.BoseWord({(0, 0): "-", (1, 0): "-", (2, 0): "+", (3, 0): "+"})
>>> print(bw.normal_order())
2.0 * I
+ 4.0 * b⁺(0) b(0)
+ 1.0 * b⁺(0) b⁺(0) b(0) b(0)

### `shift_operator`

```python
def shift_operator(self, initial_position, final_position)
```

Shifts an operator in the BoseWord from ``initial_position`` to ``final_position`` by applying the bosonic commutation relations.

Args:
    initial_position (int): the position of the operator to be shifted
    final_position (int): the desired position of the operator

Returns:
    BoseSentence: The ``BoseSentence`` obtained after applying the commutator relations.

Raises:
    TypeError: if ``initial_position`` or ``final_position`` is not an integer
    ValueError: if ``initial_position`` or ``final_position`` are outside the range ``[0, len(BoseWord) - 1]``
                where ``len(BoseWord)`` is the number of operators in the BoseWord.

## `BoseSentence`

```python
class BoseSentence(dict)
```

Dictionary used to represent a Bose sentence, a linear combination of Bose words,
with the keys as BoseWord instances and the values correspond to coefficients.

>>> w1 = qp.BoseWord({(0, 0) : '+', (1, 1) : '-'})
>>> w2 = qp.BoseWord({(0, 1) : '+', (1, 2) : '-'})
>>> s = qp.BoseSentence({w1 : 1.2, w2: 3.1})
>>> print(s)
1.2 * b⁺(0) b(1)
+ 3.1 * b⁺(1) b(2)

### `adjoint`

```python
def adjoint(self)
```

Return the adjoint of BoseSentence.

### `wires`

```python
def wires(self)
```

Return wires of the BoseSentence.

### `__str__`

```python
def __str__(self)
```

String representation of a BoseSentence.

### `__repr__`

```python
def __repr__(self)
```

Terminal representation for BoseSentence.

### `__missing__`

```python
def __missing__(self, key)
```

If the BoseSentence does not contain a BoseWord then the associated value will be 0.

### `__add__`

```python
def __add__(self, other)
```

Add a BoseSentence, BoseWord or constant to a BoseSentence by iterating over the
smaller one and adding its terms to the larger one.

### `__radd__`

```python
def __radd__(self, other)
```

Add a BoseSentence to a constant, i.e. `2 + BoseSentence({...})`

### `__sub__`

```python
def __sub__(self, other)
```

Subtract a BoseSentence, BoseWord or constant from a BoseSentence

### `__rsub__`

```python
def __rsub__(self, other)
```

Subtract a BoseSentence to a constant, i.e. 2 - BoseSentence({...})

### `__mul__`

```python
def __mul__(self, other)
```

Multiply two Bose sentences by iterating over each sentence and multiplying the Bose
words pair-wise

### `__rmul__`

```python
def __rmul__(self, other)
```

Reverse multiply a BoseSentence

Multiplies a BoseSentence "from the left" with an object that can't be modified
to support __mul__ for BoseSentence. Will be defaulted in for example when
multiplying ``2 * bose_sentence``, since the ``__mul__`` operator on an integer
will fail to multiply with a BoseSentence

### `__pow__`

```python
def __pow__(self, value)
```

Exponentiate a Bose sentence to an integer power.

### `simplify`

```python
def simplify(self, tol=1e-08)
```

Remove any BoseWords in the BoseSentence with coefficients less than the threshold
tolerance.

### `normal_order`

```python
def normal_order(self)
```

Convert a BoseSentence to its normal-ordered form.

>>> bw = qp.BoseWord({(0, 0): "-", (1, 0): "-", (2, 0): "+", (3, 0): "+"})
>>> bs = qp.BoseSentence({bw: 1})
>>> print(bs.normal_order())
2.0 * I
+ 4.0 * b⁺(0) b(0)
+ 1.0 * b⁺(0) b⁺(0) b(0) b(0)
