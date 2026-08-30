---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/permutation_gate.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/permutation_gate.py
license: Apache-2.0
---

## `QubitPermutationGate`

```python
class QubitPermutationGate(raw_types.Gate)
```

A qubit permutation gate specified by a permutation list.

For a permutation list $[p_0, p_1,\dots,p_{n-1}]$ this gate has the unitary

$$
\sum_{x_0,x_1,\dots,x_{n-1} \in \{0, 1\}} |x_{p_0}, x_{p_1}, \dots, x_{p_{n-1}}\rangle
                                          \langle x_0, x_1, \dots, x_{n-1}|
$$

### `__init__`

```python
def __init__(self, permutation: Sequence[int])
```

Create a `cirq.QubitPermutationGate`.

Args:
    permutation: A shuffled sequence of integers from 0 to
        len(permutation) - 1. The entry at offset `i` is the result
        of permuting `i`.

Raises:
    ValueError: If the supplied permutation is not valid (empty, repeated indices, indices
        out of range).
