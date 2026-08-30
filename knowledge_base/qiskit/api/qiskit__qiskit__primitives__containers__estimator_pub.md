---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/containers/estimator_pub.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/containers/estimator_pub.py
license: Apache-2.0
---

## Module `qiskit/primitives/containers/estimator_pub.py`

Estimator Pub class

## `EstimatorPub`

```python
class EstimatorPub(ShapedMixin)
```

Primitive Unified Bloc for any Estimator primitive.

An estimator pub is essentially a tuple ``(circuit, observables, parameter_values, precision)``.

If precision is provided this should be used for the target precision of an
estimator, if ``precision=None`` the estimator will determine the target precision.

### `__init__`

```python
def __init__(self, circuit: QuantumCircuit, observables: ObservablesArray, parameter_values: BindingsArray | None=None, precision: float | None=None, validate: bool=True)
```

Initialize an estimator pub.

Args:
    circuit: A quantum circuit.
    observables: An observables array.
    parameter_values: A bindings array, if the circuit is parametric.
    precision: An optional target precision for expectation value estimates.
    validate: Whether to validate arguments during initialization.

Raises:
    ValueError: If the ``observables`` and ``parameter_values`` are not broadcastable, that
        is, if their shapes, when right-aligned, do not agree or equal 1.

### `circuit`

```python
def circuit(self) -> QuantumCircuit
```

A quantum circuit.

### `observables`

```python
def observables(self) -> ObservablesArray
```

An observables array.

### `parameter_values`

```python
def parameter_values(self) -> BindingsArray
```

A bindings array.

### `precision`

```python
def precision(self) -> float | None
```

The target precision for expectation value estimates (optional).

### `coerce`

```python
def coerce(cls, pub: EstimatorPubLike, precision: float | None=None) -> EstimatorPub
```

Coerce :class:`~.EstimatorPubLike` into :class:`~.EstimatorPub`.

Args:
    pub: A compatible object for coercion.
    precision: an optional default precision to use if not
               already specified by the pub-like object.

Returns:
    An estimator pub.

### `validate`

```python
def validate(self)
```

Validate the pub.
