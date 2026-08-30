---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/uniform_superposition_gate.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/uniform_superposition_gate.py
license: Apache-2.0
---

## `UniformSuperpositionGate`

```python
class UniformSuperpositionGate(raw_types.Gate)
```

Creates a uniform superposition state on the states $[0, M)$
The gate creates the state $\frac{1}{\sqrt{M}}\sum_{j=0}^{M-1}\ket{j}$
(where $1\leq M \leq 2^n$), using n qubits, according to the Shukla-Vedula algorithm [SV24].
References:
    [SV24]
    [An efficient quantum algorithm for preparation of uniform quantum superposition
    states](https://arxiv.org/abs/2306.11747)

### `__init__`

```python
def __init__(self, m_value: int, num_qubits: int) -> None
```

Initializes UniformSuperpositionGate.

Args:
    m_value: The number of computational basis states.
    num_qubits: The number of qubits used.

Raises:
    ValueError: If `m_value` is not a positive integer, or
        if `num_qubits` is not an integer greater than or equal to log2(m_value).
