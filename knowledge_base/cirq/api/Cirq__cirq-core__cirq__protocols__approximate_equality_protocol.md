---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/approximate_equality_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/approximate_equality_protocol.py
license: Apache-2.0
---

## `SupportsApproximateEquality`

```python
class SupportsApproximateEquality(Protocol)
```

Object which can be compared approximately.

## `approx_eq`

```python
def approx_eq(val: Any, other: Any, *, atol: float=1e-08) -> bool
```

Approximately compares two objects.

If `val` implements SupportsApproxEquality protocol then it is invoked and
takes precedence over all other checks:
 - For primitive numeric types `int` and `float` approximate equality is
   delegated to math.isclose().
 - For complex primitive type the real and imaginary parts are treated
   independently and compared using math.isclose().
 - For `val` and `other` both iterable of the same length, consecutive
   elements are compared recursively. Types of `val` and `other` does not
   necessarily needs to match each other. They just need to be iterable and
   have the same structure.

Args:
    val: Source object for approximate comparison.
    other: Target object for approximate comparison.
    atol: The minimum absolute tolerance. See np.isclose() documentation for
          details. Defaults to 1e-8 which matches np.isclose() default
          absolute tolerance.

Returns:
    True if objects are approximately equal, False otherwise.

Raises:
    AttributeError: If there is insufficient information to determine whether
        the objects are approximately equal.
