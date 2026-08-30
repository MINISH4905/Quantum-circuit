---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/pauli_sum_exponential.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/pauli_sum_exponential.py
license: Apache-2.0
---

## `PauliSumExponential`

```python
class PauliSumExponential
```

Represents an operator defined by the exponential of a PauliSum.

Given a Hermitian/anti-Hermitian PauliSum PS_1 + PS_2 + ... + PS_N, this
class returns an operation which is equivalent to
exp(j * exponent * (PS_1 + PS_2 + ... + PS_N)).

This class only supports commuting Pauli terms.

### `matrix`

```python
def matrix(self) -> np.ndarray
```

Reconstructs matrix of self from underlying Pauli sum exponentials.

Raises:
    ValueError: if exponent is parameterized.
