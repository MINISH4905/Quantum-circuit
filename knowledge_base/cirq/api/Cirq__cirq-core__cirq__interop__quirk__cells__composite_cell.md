---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/interop/quirk/cells/composite_cell.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/interop/quirk/cells/composite_cell.py
license: Apache-2.0
---

## `CompositeCell`

```python
class CompositeCell(Cell)
```

A cell made up of a grid of sub-cells.

This is used for custom circuit gates.

### `__init__`

```python
def __init__(self, height: int, sub_cell_cols_generator: Iterable[list[Cell | None]], *, gate_count: int)
```

Inits CompositeCell.

Args:
    height: The number of qubits spanned by this composite cell. Note
        that the height may be larger than the number of affected
        qubits (e.g. the custom gate X⊗I⊗X has a height of 3 despite
        only operating on two qubits)..
    sub_cell_cols_generator: The columns making up the contents of this
        composite cell. These columns may only be generated when
        iterating this iterable for the first time.

        CAUTION: Iterating this value may be exponentially expensive in
        adversarial conditions, due to billion laugh attacks. The caller
        is responsible for providing an accurate `gate_count` value that
        allows us to check for high costs before paying them.
    gate_count: An upper bound on the number of operations in the
        circuit produced by this cell.

        CAUTION: If this value is set to 0, the
        `sub_cell_cols_generator` argument is replaced by the empty
        list. This behavior is required for efficient handling of
        billion laugh attacks that use exponentially large number of
        gate modifiers (such as controls or inputs) but no actual
        gates.
