---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/attributes/none.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/attributes/none.py
license: Apache-2.0
---

## Module `pennylane/data/attributes/none.py`

Contains DatasetAttribute definition for None

## `DatasetNone`

```python
class DatasetNone(DatasetAttribute[HDF5Array, type(None), type(None)])
```

Datasets type for 'None' values.

### `hdf5_to_value`

```python
def hdf5_to_value(self, bind) -> None
```

Returns None.

### `value_to_hdf5`

```python
def value_to_hdf5(self, bind_parent: HDF5Group, key: str, value: None) -> HDF5Array
```

Creates an empty HDF5 array under 'key'.
