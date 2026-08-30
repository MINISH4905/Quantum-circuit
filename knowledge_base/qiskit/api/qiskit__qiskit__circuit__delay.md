---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/delay.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/delay.py
license: Apache-2.0
---

## Module `qiskit/circuit/delay.py`

Delay instruction (for circuit module).

## `Delay`

```python
class Delay(Instruction)
```

Do nothing and just delay/wait/idle for a specified duration.

### `__init__`

```python
def __init__(self, duration, unit=None)
```

Args:
    duration: the length of time of the duration. If this is an
        :class:`~.expr.Expr`, it must be a constant expression of type
        :class:`~.types.Duration` and the ``unit`` parameter should be
        omitted (or MUST be "expr" if it is specified).
    unit: the unit of the duration, if ``duration`` is a numeric
        value. Must be ``"dt"``, an SI-prefixed seconds unit, or "expr".

Raises:
    CircuitError: A ``duration`` expression was specified with a resolved
        type that is not timing-based, or the ``unit`` was improperly specified.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Special case. Return self.

### `unit`

```python
def unit(self)
```

The unit for the duration of the delay in :attr:`.params`

### `duration`

```python
def duration(self)
```

Get the duration of this delay.

### `duration`

```python
def duration(self, duration)
```

Set the duration of this delay.

### `to_matrix`

```python
def to_matrix(self) -> np.ndarray
```

Return a Numpy.array for the unitary matrix. This has been
added to enable simulation without making delay a full Gate type.

Returns:
    np.ndarray: matrix representation.

### `__repr__`

```python
def __repr__(self)
```

Return the official string representing the delay.

### `validate_parameter`

```python
def validate_parameter(self, parameter)
```

Delay parameter (i.e. duration) must be Expr, int, float or ParameterExpression.
