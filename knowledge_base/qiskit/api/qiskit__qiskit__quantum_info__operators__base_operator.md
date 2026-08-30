---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/base_operator.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/base_operator.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/base_operator.py`

Abstract BaseOperator class.

## `BaseOperator`

```python
class BaseOperator(GroupMixin, ABC)
```

Abstract operator base class.

### `__init__`

```python
def __init__(self, input_dims: tuple | int | None=None, output_dims: tuple | int | None=None, num_qubits: int | None=None, shape: tuple | None=None, op_shape: OpShape | None=None)
```

Initialize a BaseOperator shape

Args:
    input_dims (tuple or int or None):  input dimensions.
    output_dims (tuple or int or None):  output dimensions.
    num_qubits (int):  the number of qubits of the operator.
    shape (tuple):  matrix shape for automatically determining
                   qubit dimensions.
    op_shape (OpShape):  an OpShape object for operator dimensions.

.. note::

    If ``op_shape`` is specified it will take precedence over other
    kwargs.

### `__call__`

```python
def __call__(self, *qargs)
```

Return a shallow copy with qargs attribute set

### `qargs`

```python
def qargs(self)
```

Return the qargs for the operator.

### `dim`

```python
def dim(self)
```

Return tuple (input_shape, output_shape).

### `num_qubits`

```python
def num_qubits(self)
```

Return the number of qubits if a N-qubit operator or None otherwise.

### `reshape`

```python
def reshape(self, input_dims: None | tuple | int=None, output_dims: None | tuple | int=None, num_qubits: None | int=None) -> BaseOperator
```

Return a shallow copy with reshaped input and output subsystem dimensions.

Args:
    input_dims (None or tuple): new subsystem input dimensions.
        If None the original input dims will be preserved [Default: None].
    output_dims (None or tuple): new subsystem output dimensions.
        If None the original output dims will be preserved [Default: None].
    num_qubits (None or int): reshape to an N-qubit operator [Default: None].

Returns:
    BaseOperator: returns self with reshaped input and output dimensions.

Raises:
    QiskitError: if combined size of all subsystem input dimension or
                 subsystem output dimensions is not constant.

### `input_dims`

```python
def input_dims(self, qargs=None)
```

Return tuple of input dimension for specified subsystems.

### `output_dims`

```python
def output_dims(self, qargs=None)
```

Return tuple of output dimension for specified subsystems.

### `copy`

```python
def copy(self)
```

Make a deep copy of current operator.
