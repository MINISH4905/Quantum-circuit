---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/op_shape.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/op_shape.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/op_shape.py`

Multi-partite matrix and vector shape class

## `OpShape`

```python
class OpShape
```

Multipartite matrix and vector shape class.

### `__init__`

```python
def __init__(self, dims_l=None, dims_r=None, num_qargs_l=None, num_qargs_r=None)
```

Initialize an operator object.

### `settings`

```python
def settings(self)
```

Return the settings of the ``OpShape`` as dictionary.

### `__eq__`

```python
def __eq__(self, other)
```

Check types and subsystem dimensions are equal

### `copy`

```python
def copy(self)
```

Make a deep copy of current operator.

### `size`

```python
def size(self)
```

Return the combined dimensions of the object

### `num_qubits`

```python
def num_qubits(self)
```

Return number of qubits if shape is N-qubit.

If Shape is not N-qubit return None

### `num_qargs`

```python
def num_qargs(self)
```

Return a tuple of the number of left and right wires

### `shape`

```python
def shape(self)
```

Return a tuple of the matrix shape

### `tensor_shape`

```python
def tensor_shape(self)
```

Return a tuple of the tensor shape

### `is_square`

```python
def is_square(self)
```

Return True if the left and right dimensions are equal.

### `dims_r`

```python
def dims_r(self, qargs=None)
```

Return tuple of input dimension for specified subsystems.

### `dims_l`

```python
def dims_l(self, qargs=None)
```

Return tuple of output dimension for specified subsystems.

### `validate_shape`

```python
def validate_shape(self, shape)
```

Raise an exception if shape is not valid for the OpShape

### `auto`

```python
def auto(cls, shape=None, dims_l=None, dims_r=None, dims=None, num_qubits_l=None, num_qubits_r=None, num_qubits=None)
```

Construct TensorShape with automatic checking of qubit dimensions

### `subset`

```python
def subset(self, qargs=None, qargs_l=None, qargs_r=None)
```

Return the reduced OpShape of the specified qargs

### `remove`

```python
def remove(self, qargs=None, qargs_l=None, qargs_r=None)
```

Return a new :class:`OpShape` with the specified qargs removed

### `reverse`

```python
def reverse(self)
```

Reverse order of left and right qargs

### `transpose`

```python
def transpose(self)
```

Return the transposed OpShape.

### `tensor`

```python
def tensor(self, other)
```

Return the tensor product OpShape

### `expand`

```python
def expand(self, other)
```

Return the expand product OpShape

### `compose`

```python
def compose(self, other, qargs=None, front=False)
```

Return composed OpShape.

### `dot`

```python
def dot(self, other, qargs=None)
```

Return the dot product operator OpShape
