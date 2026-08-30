---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/linalg/tolerance.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/linalg/tolerance.py
license: Apache-2.0
---

## Module `cirq-core/cirq/linalg/tolerance.py`

Utility for testing approximate equality of matrices and scalars within
tolerances.

## `all_near_zero`

```python
def all_near_zero(a: ArrayLike, *, atol: float=1e-08) -> bool
```

Checks if the tensor's elements are all near zero.

Args:
    a: Tensor of elements that could all be near zero.
    atol: Absolute tolerance.

## `all_near_zero_mod`

```python
def all_near_zero_mod(a: float | Iterable[float] | np.ndarray, period: float, *, atol: float=1e-08) -> bool
```

Checks if the tensor's elements are all near multiples of the period.

Args:
    a: Tensor of elements that could all be near multiples of the period.
    period: The period, e.g. 2 pi when working in radians.
    atol: Absolute tolerance.
