---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/scalar_op.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/scalar_op.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/scalar_op.py`

ScalarOp class

## `ScalarOp`

```python
class ScalarOp(LinearOp)
```

Scalar identity operator class.

This is a symbolic representation of a scalar identity operator on
multiple subsystems. It may be used to initialize a symbolic scalar
multiplication of an identity and then be implicitly converted to other
kinds of operator subclasses by using the :meth:`compose`, :meth:`dot`,
:meth:`tensor`, :meth:`expand` methods.

### `__init__`

```python
def __init__(self, dims: int | tuple | None=None, coeff: Number=1)
```

Initialize an operator object.

Args:
    dims (int or tuple): subsystem dimensions.
    coeff (Number): scalar coefficient for the identity
                    operator (Default: 1).

Raises:
    QiskitError: If the optional coefficient is invalid.

### `coeff`

```python
def coeff(self)
```

Return the coefficient

### `is_unitary`

```python
def is_unitary(self, atol=None, rtol=None)
```

Return True if operator is a unitary matrix.

### `to_matrix`

```python
def to_matrix(self)
```

Convert to a Numpy matrix.

### `to_operator`

```python
def to_operator(self) -> Operator
```

Convert to an Operator object.

### `power`

```python
def power(self, n: float) -> ScalarOp
```

Return the power of the ScalarOp.

Args:
    n (float): the exponent for the scalar op.

Returns:
    ScalarOp: the ``coeff ** n`` ScalarOp.
