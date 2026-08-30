---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/interop/quirk/cells/control_cells.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/interop/quirk/cells/control_cells.py
license: Apache-2.0
---

## `ControlCell`

```python
class ControlCell(Cell)
```

A modifier that adds controls to other cells in the column.

## `ParityControlCell`

```python
class ParityControlCell(Cell)
```

A modifier that adds a group parity control to other cells in the column.

The parity controls in a column are satisfied *as a group* if an odd number
of them are individually satisfied.
