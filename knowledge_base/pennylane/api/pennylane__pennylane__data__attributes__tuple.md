---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/attributes/tuple.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/attributes/tuple.py
license: Apache-2.0
---

## Module `pennylane/data/attributes/tuple.py`

Contains an DatasetAttribute that allows for heterogeneous tuples of dataset
types.

## `DatasetTuple`

```python
class DatasetTuple(Generic[T], DatasetAttribute[HDF5Group, tuple[T], tuple[T]])
```

Type for tuples.
