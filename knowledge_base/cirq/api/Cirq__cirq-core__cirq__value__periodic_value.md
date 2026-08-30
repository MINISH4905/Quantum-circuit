---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/value/periodic_value.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/value/periodic_value.py
license: Apache-2.0
---

## `PeriodicValue`

```python
class PeriodicValue
```

Wrapper for periodic numerical values.

Wrapper for periodic numerical types which implements `__eq__`, `__ne__`,
`__hash__` and `_approx_eq_` so that values which are in the same
equivalence class are treated as equal.

Internally the `value` passed to `__init__` is normalized to the interval
[0, `period`) and stored as that. Specialized version of `_approx_eq_` is
provided to cover values which end up at the opposite edges of this
interval.

### `__init__`

```python
def __init__(self, value: cirq.TParamVal, period: cirq.TParamVal)
```

Initializes the equivalence class.

Args:
    value: numerical value to wrap.
    period: periodicity of the numerical value.
