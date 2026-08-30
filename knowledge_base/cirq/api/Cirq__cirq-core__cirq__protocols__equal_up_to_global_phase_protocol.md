---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/equal_up_to_global_phase_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/equal_up_to_global_phase_protocol.py
license: Apache-2.0
---

## `SupportsEqualUpToGlobalPhase`

```python
class SupportsEqualUpToGlobalPhase(Protocol)
```

Object which can be compared for equality mod global phase.

## `equal_up_to_global_phase`

```python
def equal_up_to_global_phase(val: Any, other: Any, *, atol: float=1e-08) -> bool
```

Determine whether two objects are equal up to global phase.

If `val` implements a `_equal_up_to_global_phase_` method then it is
invoked and takes precedence over all other checks:
 - For complex primitive type the magnitudes of the values are compared.
 - For `val` and `other` both iterable of the same length, consecutive
   elements are compared recursively. Types of `val` and `other` does not
   necessarily needs to match each other. They just need to be iterable and
   have the same structure.
 - For all other types, fall back to `_approx_eq_`

Args:
    val: Source object for approximate comparison.
    other: Target object for approximate comparison.
    atol: The minimum absolute tolerance. This places an upper bound on
    the differences in *magnitudes* of two compared complex numbers.

Returns:
    True if objects are approximately equal up to phase, False otherwise.
