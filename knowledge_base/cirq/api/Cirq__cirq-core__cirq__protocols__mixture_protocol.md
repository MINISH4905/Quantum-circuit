---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/mixture_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/mixture_protocol.py
license: Apache-2.0
---

## Module `cirq-core/cirq/protocols/mixture_protocol.py`

Protocol for objects that are mixtures (probabilistic combinations).

## `SupportsMixture`

```python
class SupportsMixture(Protocol)
```

An object that decomposes into a probability distribution of unitaries.

## `mixture`

```python
def mixture(val: Any, default: Any=RaiseTypeErrorIfNotProvided) -> Sequence[tuple[float, np.ndarray]]
```

Return a sequence of tuples representing a probabilistic unitary.

A mixture is described by an iterable of tuples of the form

    (probability of unitary, unitary as numpy array)

The probability components of the tuples must sum to 1.0 and be
non-negative.

Args:
    val: The value to decompose into a mixture of unitaries.
    default: A default value if val does not support mixture.

Returns:
    An iterable of tuples of size 2. The first element of the tuple is a
    probability (between 0 and 1) and the second is the object that occurs
    with that probability in the mixture. The probabilities will sum to 1.0.

Raises:
    TypeError: If `val` has no `_mixture_` or `_unitary_` method, or if it
        does and this method returned `NotImplemented`.

## `has_mixture`

```python
def has_mixture(val: Any, *, allow_decompose: bool=True) -> bool
```

Returns whether the value has a mixture representation.

Args:
    val: The value to check.
    allow_decompose: Used by internal methods to stop redundant
        decompositions from being performed (e.g. there's no need to
        decompose an object to check if it is unitary as part of determining
        if the object is a quantum channel, when the quantum channel check
        will already be doing a more general decomposition check). Defaults
        to True. When false, the decomposition strategy for determining
        the result is skipped.

Returns:
    If `val` has a `_has_mixture_` method and its result is not
    NotImplemented, that result is returned. Otherwise, if the value
    has a `_mixture_` method return True if that has a non-default value.
    Returns False if neither function exists.

## `validate_mixture`

```python
def validate_mixture(supports_mixture: SupportsMixture) -> None
```

Validates that the mixture's tuple are valid probabilities.
