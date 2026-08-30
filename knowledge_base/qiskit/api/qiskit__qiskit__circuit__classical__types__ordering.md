---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/classical/types/ordering.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/classical/types/ordering.py
license: Apache-2.0
---

## Module `qiskit/circuit/classical/types/ordering.py`

Tools for working with the partial ordering of the type system.

## `Ordering`

```python
class Ordering(enum.Enum)
```

Enumeration listing the possible relations between two types.  Types only have a partial
ordering, so it's possible for two types to have no sub-typing relationship.

Note that the sub-/supertyping relationship is not the same as whether a type can be explicitly
cast from one to another.

## `order`

```python
def order(left: Type, right: Type, /) -> Ordering
```

Get the ordering relationship between the two types as an enumeration value.

Examples:
    Compare two :class:`Uint` types of different widths::

        >>> from qiskit.circuit.classical import types
        >>> types.order(types.Uint(8), types.Uint(16))
        Ordering.LESS

    Compare two types that have no ordering between them::

        >>> types.order(types.Uint(8), types.Bool())
        Ordering.NONE

## `is_subtype`

```python
def is_subtype(left: Type, right: Type, /, strict: bool=False) -> bool
```

Does the relation :math:`\text{left} \le \text{right}` hold?  If there is no ordering
relation between the two types, then this returns ``False``.  If ``strict``, then the equality
is also forbidden.

Examples:
    Check if one type is a subclass of another::

        >>> from qiskit.circuit.classical import types
        >>> types.is_subtype(types.Uint(8), types.Uint(16))
        True

    Check if one type is a strict subclass of another::

        >>> types.is_subtype(types.Bool(), types.Bool())
        True
        >>> types.is_subtype(types.Bool(), types.Bool(), strict=True)
        False

## `is_supertype`

```python
def is_supertype(left: Type, right: Type, /, strict: bool=False) -> bool
```

Does the relation :math:`\text{left} \ge \text{right}` hold?  If there is no ordering
relation between the two types, then this returns ``False``.  If ``strict``, then the equality
is also forbidden.

Examples:
    Check if one type is a superclass of another::

        >>> from qiskit.circuit.classical import types
        >>> types.is_supertype(types.Uint(8), types.Uint(16))
        False

    Check if one type is a strict superclass of another::

        >>> types.is_supertype(types.Bool(), types.Bool())
        True
        >>> types.is_supertype(types.Bool(), types.Bool(), strict=True)
        False

## `greater`

```python
def greater(left: Type, right: Type, /) -> Type
```

Get the greater of the two types, assuming that there is an ordering relation between them.
Technically, this is a slightly restricted version of the concept of the 'meet' of the two
types in that the return value must be one of the inputs. In practice in the type system there
is no concept of a 'sum' type, so the 'meet' exists if and only if there is an ordering between
the two types, and is equal to the greater of the two types.

Returns:
    The greater of the two types.

Raises:
    TypeError: if there is no ordering relation between the two types.

Examples:
    Find the greater of two :class:`Uint` types::

        >>> from qiskit.circuit.classical import types
        >>> types.greater(types.Uint(8), types.Uint(16))
        types.Uint(16)

## `CastKind`

```python
class CastKind(enum.Enum)
```

A return value indicating the type of cast that can occur from one type to another.

## `cast_kind`

```python
def cast_kind(from_: Type, to_: Type, /) -> CastKind
```

Determine the sort of cast that is required to move from the left type to the right type.

Examples:

    .. plot::
       :include-source:
       :nofigs:


        >>> from qiskit.circuit.classical import types
        >>> types.cast_kind(types.Bool(), types.Bool())
        <CastKind.EQUAL: 1>
        >>> types.cast_kind(types.Uint(8), types.Bool())
        <CastKind.IMPLICIT: 2>
        >>> types.cast_kind(types.Bool(), types.Uint(8))
        <CastKind.LOSSLESS: 3>
        >>> types.cast_kind(types.Uint(16), types.Uint(8))
        <CastKind.DANGEROUS: 4>
