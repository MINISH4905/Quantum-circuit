---
framework: qiskit
api_version: 2.5.2
doc_type: error
source_path: qiskit/primitives/base/validation_v1.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/base/validation_v1.py
license: Apache-2.0
---

## Error surface of `qiskit/primitives/base/validation_v1.py`

### Validation

## `_validate_estimator_args`

```python
def _validate_estimator_args(circuits: Sequence[QuantumCircuit] | QuantumCircuit, observables: Sequence[BaseOperator | str] | BaseOperator | str, parameter_values: Sequence[Sequence[float]] | Sequence[float] | float | None=None) -> tuple[tuple[QuantumCircuit], tuple[BaseOperator], tuple[tuple[float]]]
```

Validate run arguments for BaseEstimatorV1.

Args:
    circuits: one or more circuit objects.
    observables: one or more observable objects.
    parameter_values: concrete parameters to be bound.

Returns:
    The formatted arguments ``(circuits, observables, parameter_values)``.

Raises:
    TypeError: If input arguments are invalid types.
    ValueError: if input arguments are invalid values.

## `_validate_sampler_args`

```python
def _validate_sampler_args(circuits: Sequence[QuantumCircuit] | QuantumCircuit, parameter_values: Sequence[Sequence[float]] | Sequence[float] | float | None=None) -> tuple[tuple[QuantumCircuit], tuple[BaseOperator], tuple[tuple[float]]]
```

Validate run arguments for BaseSamplerV1.

Args:
    circuits: one or more circuit objects.
    parameter_values: concrete parameters to be bound.

Returns:
    The formatted arguments ``(circuits, parameter_values)``.

Raises:
    TypeError: If input arguments are invalid types.
    ValueError: if input arguments are invalid values.
