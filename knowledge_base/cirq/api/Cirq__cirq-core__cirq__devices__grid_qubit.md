---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/devices/grid_qubit.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/devices/grid_qubit.py
license: Apache-2.0
---

## `GridQid`

```python
class GridQid(_BaseGridQid)
```

A qid on a 2d square lattice

GridQid uses row-major ordering:

    GridQid(0, 0, dimension=2) < GridQid(0, 1, dimension=2)
    < GridQid(1, 0, dimension=2) < GridQid(1, 1, dimension=2)

New GridQid can be constructed by adding or subtracting tuples or numpy
arrays

>>> cirq.GridQid(2, 3, dimension=2) + (3, 1)
cirq.GridQid(5, 4, dimension=2)
>>> cirq.GridQid(2, 3, dimension=2) - (1, 2)
cirq.GridQid(1, 1, dimension=2)
>>> cirq.GridQid(2, 3, dimension=2) + np.array([3, 1], dtype=int)
cirq.GridQid(5, 4, dimension=2)

### `__new__`

```python
def __new__(cls, row: int, col: int, *, dimension: int) -> cirq.GridQid
```

Creates a grid qid at the given row, col coordinate

Args:
    row: the row coordinate
    col: the column coordinate
    dimension: The dimension of the qid's Hilbert space, i.e.
        the number of quantum levels.

### `__getnewargs_ex__`

```python
def __getnewargs_ex__(self)
```

Returns a tuple of (args, kwargs) to pass to __new__ when unpickling.

### `square`

```python
def square(diameter: int, top: int=0, left: int=0, *, dimension: int) -> list[GridQid]
```

Returns a square of GridQid.

Args:
    diameter: Length of a side of the square
    top: Row number of the topmost row
    left: Column number of the leftmost row
    dimension: The dimension of the qid's Hilbert space, i.e.
        the number of quantum levels.

Returns:
    A list of GridQid filling in a square grid

### `rect`

```python
def rect(rows: int, cols: int, top: int=0, left: int=0, *, dimension: int) -> list[GridQid]
```

Returns a rectangle of GridQid.

Args:
    rows: Number of rows in the rectangle
    cols: Number of columns in the rectangle
    top: Row number of the topmost row
    left: Column number of the leftmost row
    dimension: The dimension of the qid's Hilbert space, i.e.
        the number of quantum levels.

Returns:
    A list of GridQid filling in a rectangular grid

### `from_diagram`

```python
def from_diagram(diagram: str, dimension: int) -> list[GridQid]
```

Parse ASCII art device layout into a device.

As an example, the below diagram will create a list of GridQid in a
pyramid structure.


```
---A---
--AAA--
-AAAAA-
AAAAAAA
```

You can use any character other than a hyphen, period or space to mark a
qid. As an example, the qids for a Bristlecone device could be
represented by the below diagram. This produces a diamond-shaped grid of
qids, and qids with the same letter correspond to the same readout line.

```
.....AB.....
....ABCD....
...ABCDEF...
..ABCDEFGH..
.ABCDEFGHIJ.
ABCDEFGHIJKL
.CDEFGHIJKL.
..EFGHIJKL..
...GHIJKL...
....IJKL....
.....KL.....
```

Args:
    diagram: String representing the qid layout. Each line represents
        a row. Alphanumeric characters are assigned as qid.
        Dots ('.'), dashes ('-'), and spaces (' ') are treated as
        empty locations in the grid. If diagram has characters other
        than alphanumerics, spacers, and newlines ('\n'), an error will
        be thrown. The top-left corner of the diagram will be have
        coordinate (0, 0).

    dimension: The dimension of the qubits in the `cirq.GridQid`s used
        in this construction.

Returns:
    A list of `cirq.GridQid`s corresponding to qids in the provided diagram

Raises:
    ValueError: If the input string contains an invalid character.

## `GridQubit`

```python
class GridQubit(_BaseGridQid)
```

A qubit on a 2d square lattice.

GridQubits use row-major ordering:

    GridQubit(0, 0) < GridQubit(0, 1) < GridQubit(1, 0) < GridQubit(1, 1)

New GridQubits can be constructed by adding or subtracting tuples

>>> cirq.GridQubit(2, 3) + (3, 1)
cirq.GridQubit(5, 4)
>>> cirq.GridQubit(2, 3) - (1, 2)
cirq.GridQubit(1, 1)
>>> cirq.GridQubit(2, 3,) + np.array([3, 1], dtype=int)
cirq.GridQubit(5, 4)

### `__new__`

```python
def __new__(cls, row: int, col: int) -> cirq.GridQubit
```

Creates a grid qubit at the given row, col coordinate

Args:
    row: the row coordinate
    col: the column coordinate

### `__getnewargs__`

```python
def __getnewargs__(self)
```

Returns a tuple of args to pass to __new__ when unpickling.

### `square`

```python
def square(diameter: int, top: int=0, left: int=0) -> list[GridQubit]
```

Returns a square of GridQubits.

Args:
    diameter: Length of a side of the square
    top: Row number of the topmost row
    left: Column number of the leftmost row

Returns:
    A list of GridQubits filling in a square grid

### `rect`

```python
def rect(rows: int, cols: int, top: int=0, left: int=0) -> list[GridQubit]
```

Returns a rectangle of GridQubits.

Args:
    rows: Number of rows in the rectangle
    cols: Number of columns in the rectangle
    top: Row number of the topmost row
    left: Column number of the leftmost row

Returns:
    A list of GridQubits filling in a rectangular grid

### `from_diagram`

```python
def from_diagram(diagram: str) -> list[GridQubit]
```

Parse ASCII art into device layout info.

As an example, the below diagram will create a list of
GridQubit in a pyramid structure.

```
---A---
--AAA--
-AAAAA-
AAAAAAA
```

You can use any character other than a hyphen, period or space to mark
a qubit. As an example, the qubits for a Bristlecone device could be
represented by the below diagram. This produces a diamond-shaped grid
of qids, and qids with the same letter correspond to the same readout
line.

```
.....AB.....
....ABCD....
...ABCDEF...
..ABCDEFGH..
.ABCDEFGHIJ.
ABCDEFGHIJKL
.CDEFGHIJKL.
..EFGHIJKL..
...GHIJKL...
....IJKL....
.....KL.....
```

Args:
    diagram: String representing the qubit layout. Each line represents
        a row. Alphanumeric characters are assigned as qid.
        Dots ('.'), dashes ('-'), and spaces (' ') are treated as
        empty locations in the grid. If diagram has characters other
        than alphanumerics, spacers, and newlines ('\n'), an error will
        be thrown. The top-left corner of the diagram will be have
        coordinate (0,0).

Returns:
    A list of GridQubit corresponding to qubits in the provided diagram

Raises:
    ValueError: If the input string contains an invalid character.
