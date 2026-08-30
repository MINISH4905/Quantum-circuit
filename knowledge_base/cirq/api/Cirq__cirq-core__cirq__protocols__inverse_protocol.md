---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/inverse_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/inverse_protocol.py
license: Apache-2.0
---

## `inverse`

```python
def inverse(val: Any, default: Any=RaiseTypeErrorIfNotProvided) -> Any
```

Returns the inverse `val**-1` of the given value, if defined.

An object can define an inverse by defining a __pow__(self, exponent) method
that returns something besides NotImplemented when given the exponent -1.
The inverse of iterables is by default defined to be the iterable's items,
each inverted, in reverse order.

Args:
    val: The value (or iterable of invertible values) to invert.
    default: Determines the fallback behavior when `val` doesn't have
        an inverse defined. If `default` is not set, a TypeError is raised.
        If `default` is set to a value, that value is returned.

Returns:
    If `val` has a __pow__ method that returns something besides
    NotImplemented when given an exponent of -1, that result is returned.
    Otherwise, if `val` is iterable, the result is a tuple with the same
    items as `val` but in reverse order and with each item inverted.
    Otherwise, if a `default` argument was specified, it is returned.

Raises:
    TypeError: `val` doesn't have a __pow__ method, or that method returned
        NotImplemented when given -1. Furthermore `val` isn't an
        iterable containing invertible items. Also, no `default` argument
        was specified.
