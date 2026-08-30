---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/trace_distance_bound.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/trace_distance_bound.py
license: Apache-2.0
---

## `SupportsTraceDistanceBound`

```python
class SupportsTraceDistanceBound(Protocol)
```

An effect with known bounds on how easy it is to detect.

Used when deciding whether or not an operation is negligible. For example,
the trace distance between the states before and after a Z**0.00000001
operation is very close to 0, so it would typically be considered
negligible.

## `trace_distance_bound`

```python
def trace_distance_bound(val: Any) -> float
```

Returns a maximum on the trace distance between this effect's input
and output.

This method attempts a number of strategies to calculate this value.

Strategy 1:
    Use the effect's `_trace_distance_bound_` method.

Strategy 2:
    If the effect is unitary, calculate the trace distance bound from the
    eigenvalues of the unitary matrix.

Args:
    val: The effect of which the bound should be calculated

Returns:
    If any of the strategies return a result that is not Notimplemented and
    not None, that result is returned. Otherwise, 1.0 is returned.
    Result is capped at a maximum of 1.0, even if the underlying function
    produces a result greater than 1.0

## `trace_distance_from_angle_list`

```python
def trace_distance_from_angle_list(angle_list: Sequence[float] | np.ndarray) -> float
```

Given a list of arguments of the eigenvalues of a unitary matrix,
calculates the trace distance bound of the unitary effect.

The maximum provided angle should not exceed the minimum provided angle
by more than 2π.
