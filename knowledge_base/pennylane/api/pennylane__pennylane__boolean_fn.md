---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/boolean_fn.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/boolean_fn.py
license: Apache-2.0
---

## Module `pennylane/boolean_fn.py`

Contains a utility class ``BooleanFn`` that allows logical composition
of functions with boolean output.

## `BooleanFn`

```python
class BooleanFn
```

Wrapper for simple callables with Boolean output that can be
manipulated and combined with bitwise operators.

Args:
    fn (callable): Function to be wrapped. It can accept any number
        of arguments, and must return a Boolean.

**Example**

Consider functions that filter numbers to lie within a certain domain.
We may wrap them using ``BooleanFn``:

.. code-block:: python

    bigger_than_4 = qp.BooleanFn(lambda x: x > 4)
    smaller_than_10 = qp.BooleanFn(lambda x: x < 10)
    is_int = qp.BooleanFn(lambda x: isinstance(x, int))

>>> bigger_than_4(5.2)
True

>>> smaller_than_10(20.1)
False

>>> is_int(2.3)
False

These can then be combined into a single callable using boolean operators,
such as ``&`` (logical and):

>>> between_4_and_10 = bigger_than_4 & smaller_than_10
>>> between_4_and_10(-3.2)
False

>>> between_4_and_10(9.9)
True

>>> between_4_and_10(19.7)
False

Other supported operators are ``|`` (logical or) and ``~`` (logical not):

.. code-block:: python

    smaller_equal_than_4 = ~bigger_than_4
    smaller_than_10_or_int = smaller_than_10 | is_int

.. warning::

    Note that Python conditional expressions are evaluated from left to right.
    As a result, the order of composition may matter, even though logical
    operators such as ``|`` and ``&`` are symmetric.

    For example:

    >>> is_int = qp.BooleanFn(lambda x: isinstance(x, int))
    >>> has_bit_length_3 = qp.BooleanFn(lambda x: x.bit_length()==3)
    >>> (is_int & has_bit_length_3)(4)
    True

    >>> (is_int & has_bit_length_3)(2.3)
    False

    >>> (has_bit_length_3 & is_int)(2.3)
    Traceback (most recent call last):
        ...
    AttributeError: 'float' object has no attribute 'bit_length'

### `bitwise`

```python
def bitwise(self)
```

Determine whether the wrapped callable performs a bitwise operation or not.
This checks for the ``operands`` attribute that should be defined by it.

### `conditional`

```python
def conditional(self)
```

Determine whether the wrapped callable is for a conditional or not.
This checks for the ``condition`` attribute that should be defined by it.

## `And`

```python
class And(BooleanFn)
```

Developer facing class for implemeting bitwise ``AND`` for callables
wrapped up with :class:`BooleanFn <pennylane.BooleanFn>`.

Args:
    left (~.BooleanFn): Left operand in the bitwise expression.
    right (~.BooleanFn): Right operand in the bitwise expression.

## `Or`

```python
class Or(BooleanFn)
```

Developer facing class for implemeting bitwise ``OR`` for callables
wrapped up with :class:`BooleanFn <pennylane.BooleanFn>`.

Args:
    left (~.BooleanFn): Left operand in the bitwise expression.
    right (~.BooleanFn): Right operand in the bitwise expression.

## `Xor`

```python
class Xor(BooleanFn)
```

Developer facing class for implemeting bitwise ``XOR`` for callables
wrapped up with :class:`BooleanFn <pennylane.BooleanFn>`.

Args:
    left (~.BooleanFn): Left operand in the bitwise expression.
    right (~.BooleanFn): Right operand in the bitwise expression.

## `Not`

```python
class Not(BooleanFn)
```

Developer facing class for implemeting bitwise ``NOT`` for callables
wrapped up with :class:`BooleanFn <pennylane.BooleanFn>`.

Args:
    left (~.BooleanFn): Left operand in the bitwise expression.
