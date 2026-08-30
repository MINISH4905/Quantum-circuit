---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/interop/quirk/cells/all_cells.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/interop/quirk/cells/all_cells.py
license: Apache-2.0
---

## `generate_all_quirk_cell_makers`

```python
def generate_all_quirk_cell_makers() -> Iterator[CellMaker]
```

Yields a `CellMaker` for every known Quirk gate, display, etc.
