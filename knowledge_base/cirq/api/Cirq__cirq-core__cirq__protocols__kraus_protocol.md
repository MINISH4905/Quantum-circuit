---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/kraus_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/kraus_protocol.py
license: Apache-2.0
---

## Module `cirq-core/cirq/protocols/kraus_protocol.py`

Protocol and methods for obtaining Kraus representation of quantum channels.

## `SupportsKraus`

```python
class SupportsKraus(Protocol)
```

An object that may be describable as a quantum channel.

## `kraus`

```python
def kraus(val: Any, default: Any=RaiseTypeErrorIfNotProvided, atol: float=1e-06) -> tuple[np.ndarray, ...] | TDefault
```

Returns a list of matrices describing the channel for the given value.

These matrices are the terms in the operator sum representation of
a quantum channel. If the returned matrices are ${A_0,A_1,..., A_{r-1}}$,
then this describes the channel:
    $$
    \rho \rightarrow \sum_{k=0}^{r-1} A_k \rho A_k^\dagger
    $$
These matrices are required to satisfy the trace preserving condition
    $$
    \sum_{k=0}^{r-1} A_k^\dagger A_k = I
    $$
where $I$ is the identity matrix. The matrices $A_k$ are sometimes called
Kraus or noise operators.

Args:
    val: The value to describe by a channel.
    default: Determines the fallback behavior when `val` doesn't have
        a channel. If `default` is not set, a TypeError is raised. If
        default is set to a value, that value is returned.
    atol: If calculating Kraus channels from channels, use this tolerance
        for determining whether a super-operator is all zeros.

Returns:
    If `val` has a `_kraus_` method and its result is not NotImplemented,
    that result is returned. Otherwise, if `val` has a `_mixture_` method
    and its results is not NotImplement a tuple made up of channel
    corresponding to that mixture being a probabilistic mixture of unitaries
    is returned.  Otherwise, if `val` has a `_unitary_` method and
    its result is not NotImplemented a tuple made up of that result is
    returned. Otherwise, if a default value was specified, the default
    value is returned.

Raises:
    TypeError: `val` doesn't have a _kraus_ or _unitary_ method (or that
        method returned NotImplemented) and also no default value was
        specified.

## `has_kraus`

```python
def has_kraus(val: Any, *, allow_decompose: bool=True) -> bool
```

Returns whether the value has a Kraus representation.

Args:
    val: The value to check.
    allow_decompose: Used by internal methods to stop redundant
        decompositions from being performed (e.g. there's no need to
        decompose an object to check if it is unitary as part of determining
        if the object is a quantum channel, when the quantum channel check
        will already be doing a more general decomposition check). Defaults
        to True. When False, the decomposition strategy for determining
        the result is skipped.

Returns:
    If `val` has a `_has_kraus_` method and its result is not
    NotImplemented, that result is returned. Otherwise, if `val` has a
    `_has_mixture_` method and its result is not NotImplemented, that
    result is returned. Otherwise if `val` has a `_has_unitary_` method
    and its results is not NotImplemented, that result is returned.
    Otherwise, if the value has a _kraus_ method return if that
    has a non-default value. Returns False if none of these functions
    exists.
