---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/attributes/array.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/attributes/array.py
license: Apache-2.0
---

## Module `pennylane/data/attributes/array.py`

Contains DatasetAttribute definition for numpy arrays.

## `DatasetArray`

```python
class DatasetArray(DatasetAttribute[HDF5Array, numpy.ndarray, TensorLike])
```

Attribute type for objects that implement the Array protocol, including numpy arrays
and pennylane.math.tensor.
