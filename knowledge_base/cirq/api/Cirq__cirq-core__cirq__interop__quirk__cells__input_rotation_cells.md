---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/interop/quirk/cells/input_rotation_cells.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/interop/quirk/cells/input_rotation_cells.py
license: Apache-2.0
---

## `InputRotationCell`

```python
class InputRotationCell(Cell)
```

Applies an operation that depends on an input gate.

## `QuirkInputRotationOperation`

```python
class QuirkInputRotationOperation(ops.Operation)
```

Operates on target qubits in a way that varies based on an input qureg.
