---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/mixins/tolerances.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/mixins/tolerances.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/mixins/tolerances.py`

Tolerances mixin class.

## `TolerancesMeta`

```python
class TolerancesMeta(ABCMeta)
```

Metaclass to handle tolerances

### `atol`

```python
def atol(cls)
```

Default absolute tolerance parameter for float comparisons.

### `atol`

```python
def atol(cls, value)
```

Set default absolute tolerance parameter for float comparisons.

### `rtol`

```python
def rtol(cls)
```

Default relative tolerance parameter for float comparisons.

### `rtol`

```python
def rtol(cls, value)
```

Set default relative tolerance parameter for float comparisons.

## `TolerancesMixin`

```python
class TolerancesMixin(metaclass=TolerancesMeta)
```

Mixin Class for tolerances

### `atol`

```python
def atol(self)
```

Default absolute tolerance parameter for float comparisons.

### `rtol`

```python
def rtol(self)
```

Default relative tolerance parameter for float comparisons.
