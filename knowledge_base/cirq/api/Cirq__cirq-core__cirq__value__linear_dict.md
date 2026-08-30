---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/value/linear_dict.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/value/linear_dict.py
license: Apache-2.0
---

## Module `cirq-core/cirq/value/linear_dict.py`

Linear combination represented as mapping of things to coefficients.

## `LinearDict`

```python
class LinearDict(Generic[TVector], MutableMapping[TVector, 'cirq.TParamValComplex'])
```

Represents linear combination of things.

LinearDict implements the basic linear algebraic operations of vector
addition and scalar multiplication for linear combinations of abstract
vectors. Keys represent the vectors, values represent their coefficients.
The only requirement on the keys is that they be hashable (i.e. are
immutable and implement __hash__ and __eq__ with equal objects hashing
to equal values).

A consequence of treating keys as opaque is that all relationships between
the keys other than equality are ignored. In particular, keys are allowed
to be linearly dependent.

### `__init__`

```python
def __init__(self, terms: Mapping[TVector, cirq.TParamValComplex] | None=None, validator: Callable[[TVector], bool] | None=None) -> None
```

Initializes linear combination from a collection of terms.

Args:
    terms: Mapping of abstract vectors to coefficients in the linear
        combination being initialized.
    validator: Optional predicate that determines whether a vector is
        valid or not. Dictionary and linear algebra operations that
        would lead to the inclusion of an invalid vector into the
        combination raise ValueError exception. By default all vectors
        are valid.

### `clean`

```python
def clean(self, *, atol: float=1e-09) -> Self
```

Remove terms with coefficients of absolute value atol or less.

### `__eq__`

```python
def __eq__(self, other: Any) -> bool
```

Checks whether two linear combinations are exactly equal.

Presence or absence of terms with coefficients exactly equal to
zero does not affect outcome.

Not appropriate for most practical purposes due to sensitivity to
numerical error in floating point coefficients. Use cirq.approx_eq()
instead.

### `__ne__`

```python
def __ne__(self, other: Any) -> bool
```

Checks whether two linear combinations are not exactly equal.

See __eq__().
