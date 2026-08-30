---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/attributes/list.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/attributes/list.py
license: Apache-2.0
---

## Module `pennylane/data/attributes/list.py`

Contains an DatasetAttribute that allows for heterogeneous lists of dataset
types.

## `DatasetList`

```python
class DatasetList(Generic[T], DatasetAttribute[HDF5Group, Sequence[T], Iterable[T]], MutableSequence[T], MapperMixin)
```

Provides a list-like collection type for Dataset Attributes.

### `copy`

```python
def copy(self) -> list[T]
```

Returns a copy of this list as a builtin ``list``, with all
elements copied..

### `insert`

```python
def insert(self, index: int, value: T | DatasetAttribute[HDF5Any, T, T])
```

Implements the insert() method.
