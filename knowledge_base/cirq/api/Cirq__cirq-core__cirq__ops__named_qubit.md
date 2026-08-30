---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/named_qubit.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/named_qubit.py
license: Apache-2.0
---

## `NamedQid`

```python
class NamedQid(_BaseNamedQid)
```

A qid identified by name.

By default, `NamedQid` has a lexicographic order. However, numbers within
the name are handled correctly. So, for example, if you print a circuit
containing `cirq.NamedQid('qid22', dimension=3)` and
`cirq.NamedQid('qid3', dimension=3)`, the wire for 'qid3' will
correctly come before 'qid22'.

### `__new__`

```python
def __new__(cls, name: str, dimension: int) -> cirq.NamedQid
```

Initializes a `NamedQid` with a given name and dimension.

Args:
    name: The name.
    dimension: The dimension of the qid's Hilbert space, i.e.
        the number of quantum levels.

### `__getnewargs__`

```python
def __getnewargs__(self)
```

Returns a tuple of args to pass to __new__ when unpickling.

### `range`

```python
def range(*args, prefix: str, dimension: int) -> list[NamedQid]
```

Returns a range of ``NamedQid``s.

The range returned starts with the prefix, and followed by a qid for
each number in the range, e.g.:

    >>> cirq.NamedQid.range(3, prefix='a', dimension=3)
    ... # doctest: +NORMALIZE_WHITESPACE
    [cirq.NamedQid('a0', dimension=3), cirq.NamedQid('a1', dimension=3),
        cirq.NamedQid('a2', dimension=3)]
    >>> cirq.NamedQid.range(2, 4, prefix='a', dimension=3)
    [cirq.NamedQid('a2', dimension=3), cirq.NamedQid('a3', dimension=3)]

Args:
    *args: Args to be passed to Python's standard range function.
    prefix: A prefix for constructed NamedQids.
    dimension: The dimension of the qid's Hilbert space, i.e.
        the number of quantum levels.
Returns:
    A list of ``NamedQid``s.

## `NamedQubit`

```python
class NamedQubit(_BaseNamedQid)
```

A qubit identified by name.

By default, `NamedQubit` has a lexicographic order. However, numbers within
the name are handled correctly. So, for example, if you print a circuit
containing `cirq.NamedQubit('qubit22')` and `cirq.NamedQubit('qubit3')`, the
wire for 'qubit3' will correctly come before 'qubit22'.

### `__new__`

```python
def __new__(cls, name: str) -> cirq.NamedQubit
```

Initializes a `NamedQid` with a given name and dimension.

Args:
    name: The name.
    dimension: The dimension of the qid's Hilbert space, i.e.
        the number of quantum levels.

### `__getnewargs__`

```python
def __getnewargs__(self)
```

Returns a tuple of args to pass to __new__ when unpickling.

### `range`

```python
def range(*args, prefix: str) -> list[NamedQubit]
```

Returns a range of `cirq.NamedQubit`s.

The range returned starts with the prefix, and followed by a qubit for
each number in the range, e.g.:

    >>> cirq.NamedQubit.range(3, prefix='a')
    ... # doctest: +NORMALIZE_WHITESPACE
    [cirq.NamedQubit('a0'), cirq.NamedQubit('a1'),
        cirq.NamedQubit('a2')]
    >>> cirq.NamedQubit.range(2, 4, prefix='a')
    [cirq.NamedQubit('a2'), cirq.NamedQubit('a3')]

Args:
    *args: Args to be passed to Python's standard range function.
    prefix: A prefix for constructed NamedQubits.

Returns:
    A list of ``NamedQubit``\\s.
