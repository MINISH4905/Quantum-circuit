---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/attributes/pytree.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/attributes/pytree.py
license: Apache-2.0
---

## Module `pennylane/data/attributes/pytree.py`

Contains DatasetAttribute definition for PyTree types.

## `DatasetPyTree`

```python
class DatasetPyTree(DatasetAttribute[HDF5Group, T, T])
```

Attribute type for an object that can be converted to
a Pytree. This is the default serialization method for
all PennyLane Pytrees, including subclasses of ``Operator``.
