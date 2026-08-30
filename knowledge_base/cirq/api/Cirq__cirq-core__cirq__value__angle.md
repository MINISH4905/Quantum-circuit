---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/value/angle.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/value/angle.py
license: Apache-2.0
---

## `chosen_angle_to_half_turns`

```python
def chosen_angle_to_half_turns(half_turns: type_alias.TParamVal | None=None, rads: float | None=None, degs: float | None=None, default: float=1.0) -> type_alias.TParamVal
```

Returns a half_turns value based on the given arguments.

At most one of half_turns, rads, degs must be specified. If none are
specified, the output defaults to half_turns=1.

Args:
    half_turns: The number of half turns to rotate by.
    rads: The number of radians to rotate by.
    degs: The number of degrees to rotate by
    default: The half turns angle to use if nothing else is specified.

Returns:
    A number of half turns.

Raises:
    ValueError: If more than one of `half_turn`, `rads`, or `degs` is given.

## `chosen_angle_to_canonical_half_turns`

```python
def chosen_angle_to_canonical_half_turns(half_turns: type_alias.TParamVal | None=None, rads: float | None=None, degs: float | None=None, default: float=1.0) -> type_alias.TParamVal
```

Returns a canonicalized half_turns based on the given arguments.

At most one of half_turns, rads, degs must be specified. If none are
specified, the output defaults to half_turns=1.

Args:
    half_turns: The number of half turns to rotate by.
    rads: The number of radians to rotate by.
    degs: The number of degrees to rotate by
    default: The half turns angle to use if nothing else is specified.

Returns:
    A number of half turns.

## `canonicalize_half_turns`

```python
def canonicalize_half_turns(half_turns: type_alias.TParamVal) -> type_alias.TParamVal
```

Wraps the input into the range (-1, +1].
