---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/interop/quirk/cells/qubit_permutation_cells.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/interop/quirk/cells/qubit_permutation_cells.py
license: Apache-2.0
---

## `QuirkQubitPermutationGate`

```python
class QuirkQubitPermutationGate(ops.QubitPermutationGate)
```

A qubit permutation gate specified by a permutation list.

### `__init__`

```python
def __init__(self, identifier: str, name: str, permutation: Sequence[int])
```

Inits QuirkQubitPermutationGate.

Args:
    identifier: Quirk identifier string.
    name: Label to include in circuit diagram info.
    permutation: A shuffled sequence of integers from 0 to
        len(permutation) - 1. The entry at offset `i` is the result
        of permuting `i`.
