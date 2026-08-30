---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/devices/line_qubit.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/devices/line_qubit.py
license: Apache-2.0
---

## `LineQid`

```python
class LineQid(_BaseLineQid)
```

A qid on a 1d lattice with nearest-neighbor connectivity.

`LineQid`s have a single attribute, and integer coordinate 'x', which
identifies the qids location on the line. `LineQid`s are ordered by
this integer.

One can construct new `cirq.LineQid`s by adding or subtracting integers:

>>> cirq.LineQid(1, dimension=2) + 3
cirq.LineQid(4, dimension=2)

>>> cirq.LineQid(2, dimension=3) - 1
cirq.LineQid(1, dimension=3)

### `__new__`

```python
def __new__(cls, x: int, dimension: int) -> cirq.LineQid
```

Initializes a line qid at the given x coordinate.

Args:
    x: The x coordinate.
    dimension: The dimension of the qid's Hilbert space, i.e.
        the number of quantum levels.

### `__getnewargs__`

```python
def __getnewargs__(self)
```

Returns a tuple of args to pass to __new__ when unpickling.

### `range`

```python
def range(*range_args, dimension: int) -> list[LineQid]
```

Returns a range of line qids.

Args:
    *range_args: Same arguments as python's built-in range method.
    dimension: The dimension of the qid's Hilbert space, i.e.
        the number of quantum levels.

Returns:
    A list of line qids.

### `for_qid_shape`

```python
def for_qid_shape(qid_shape: Sequence[int], start: int=0, step: int=1) -> list[LineQid]
```

Returns a range of line qids for each entry in `qid_shape` with
matching dimension.

Args:
    qid_shape: A sequence of dimensions for each `LineQid` to create.
    start: The x coordinate of the first `LineQid`.
    step: The amount to increment each x coordinate.

### `for_gate`

```python
def for_gate(val: Any, start: int=0, step: int=1) -> list[LineQid]
```

Returns a range of line qids with the same qid shape as the gate.

Args:
    val: Any value that supports the `cirq.qid_shape` protocol.  Usually
        a gate.
    start: The x coordinate of the first `LineQid`.
    step: The amount to increment each x coordinate.

## `LineQubit`

```python
class LineQubit(_BaseLineQid)
```

A qubit on a 1d lattice with nearest-neighbor connectivity.

LineQubits have a single attribute, and integer coordinate 'x', which
identifies the qubits location on the line. LineQubits are ordered by
this integer.

One can construct new `cirq.LineQubit`s by adding or subtracting integers:

>>> cirq.LineQubit(1) + 3
cirq.LineQubit(4)

>>> cirq.LineQubit(2) - 1
cirq.LineQubit(1)

### `__new__`

```python
def __new__(cls, x: int) -> cirq.LineQubit
```

Initializes a line qid at the given x coordinate.

Args:
    x: The x coordinate.

### `__getnewargs__`

```python
def __getnewargs__(self)
```

Returns a tuple of args to pass to __new__ when unpickling.

### `range`

```python
def range(*range_args) -> list[LineQubit]
```

Returns a range of line qubits.

Args:
    *range_args: Same arguments as python's built-in range method.

Returns:
    A list of line qubits.
