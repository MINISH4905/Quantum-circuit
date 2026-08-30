---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/parametertable.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/parametertable.py
license: Apache-2.0
---

## Module `qiskit/circuit/parametertable.py`

Look-up table for variable parameters in QuantumCircuit.

## `ParameterView`

```python
class ParameterView(MappingView)
```

Temporary class to transition from a set return-type to list.

Derives from a list but implements all set methods, but all set-methods emit deprecation
warnings.

### `copy`

```python
def copy(self)
```

Copy the ParameterView.

### `isdisjoint`

```python
def isdisjoint(self, x)
```

Check whether self and the input are disjoint.

### `remove`

```python
def remove(self, x)
```

Remove an existing element from the view.

### `__repr__`

```python
def __repr__(self)
```

Format the class as string.

### `__getitem__`

```python
def __getitem__(self, index)
```

Get items.

### `__and__`

```python
def __and__(self, x)
```

Get the intersection between self and the input.

### `__rand__`

```python
def __rand__(self, x)
```

Get the intersection between self and the input.

### `__iand__`

```python
def __iand__(self, x)
```

Get the intersection between self and the input in-place.

### `__len__`

```python
def __len__(self)
```

Get the length.

### `__or__`

```python
def __or__(self, x)
```

Get the union of self and the input.

### `__sub__`

```python
def __sub__(self, x)
```

Get the difference between self and the input.

### `__xor__`

```python
def __xor__(self, x)
```

Get the symmetric difference between self and the input.
