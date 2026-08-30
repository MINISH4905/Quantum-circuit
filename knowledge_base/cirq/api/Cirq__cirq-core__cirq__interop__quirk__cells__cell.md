---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/interop/quirk/cells/cell.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/interop/quirk/cells/cell.py
license: Apache-2.0
---

## `Cell`

```python
class Cell(metaclass=abc.ABCMeta)
```

A gate, operation, display, operation modifier, etc from Quirk.

Represents something that can go into a column in Quirk, and supports the
operations ultimately necessary to transform a grid of these cells into a
`cirq.Circuit`.

### `with_line_qubits_mapped_to`

```python
def with_line_qubits_mapped_to(self, qubits: list[cirq.Qid]) -> Cell
```

Returns the same cell, but targeting different qubits.

It is assumed that the cell is currently targeting `LineQubit`
instances, where the x coordinate indicates the qubit to take from the
list.

Args:
    qubits: The new qubits. The qubit at offset `x` will replace
        `cirq.LineQubit(x)`.

Returns:
    The same cell, but with new qubits.

### `gate_count`

```python
def gate_count(self) -> int
```

Cheaply determines an upper bound on the resulting circuit size.

The upper bound may be larger than the actual count. For example, a
small circuit may nevertheless have involved a huge amount of rewriting
work to create. In such cases the `gate_count` is permitted to be large
to indicate the danger, despite the output being small.

This method exists in order to defend against billion laugh type
attacks. It is important that counting is fast and efficient even in
extremely adversarial conditions.

### `with_input`

```python
def with_input(self, letter: str, register: Sequence[cirq.Qid] | int) -> Cell
```

The same cell, but linked to an explicit input register or constant.

If the cell doesn't need the input, it is returned unchanged.

Args:
    letter: The input variable name ('a', 'b', or 'r').
    register: The list of qubits to use as the input, or else a
        classical constant to use as the input.

Returns:
    The same cell, but with the specified input made explicit.

### `controlled_by`

```python
def controlled_by(self, qubit: cirq.Qid) -> Cell
```

The same cell, but with an explicit control on its main operations.

Cells with effects that do not need to be controlled are permitted to
return themselves unmodified.

Args:
    qubit: The control qubit.

Returns:
    A modified cell with an additional control.

### `operations`

```python
def operations(self) -> cirq.OP_TREE
```

Returns operations that implement the cell's main action.

Returns:
    A `cirq.OP_TREE` of operations implementing the cell.

Raises:
    ValueError:
        The cell is not ready for conversion into operations, e.g. it
        may still have unspecified inputs.

### `basis_change`

```python
def basis_change(self) -> cirq.OP_TREE
```

Operations to conjugate a column with.

The main distinctions between operations performed during the body of a
column and operations performed during the basis change are:

1. Basis change operations are not affected by operation modifiers in
    the column. For example, adding a control into the same column will
    not affect the basis change.
2. Basis change operations happen twice, once when starting a column and
    a second time (but inverted) when ending a column.

Returns:
    A `cirq.OP_TREE` of basis change operations.

### `modify_column`

```python
def modify_column(self, column: list[Cell | None]) -> None
```

Applies this cell's modification to its column.

For example, a control cell will add a control qubit to other operations
in the column.

Args:
    column: A mutable list of cells in the column, including empty
        cells (with value `None`). This method is permitted to change
        the items in the list, but must not change the length of the
        list.

Returns:
    Nothing. The `column` argument is mutated in place.

### `persistent_modifiers`

```python
def persistent_modifiers(self) -> dict[str, Callable[[Cell], Cell]]
```

Overridable modifications to apply to the rest of the circuit.

Persistent modifiers apply to all cells in the same column and also to
all cells in future columns (until a column overrides the modifier with
another one using the same key).

Returns:
    A dictionary of keyed modifications. Each modifier lasts until a
    later cell specifies a new modifier with the same key.

## `ExplicitOperationsCell`

```python
class ExplicitOperationsCell(Cell)
```

A quirk cell with known body operations and basis change operations.
