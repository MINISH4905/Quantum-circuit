---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/attributes/sparse_array.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/attributes/sparse_array.py
license: Apache-2.0
---

## Module `pennylane/data/attributes/sparse_array.py`

Contains DatasetAttribute definition for ``scipy.sparse.csr_array``.

## `DatasetSparseArray`

```python
class DatasetSparseArray(Generic[SparseT], DatasetAttribute[HDF5Group, SparseT, SparseT])
```

Attribute type for Scipy sparse arrays. Can accept values of any type in
``scipy.sparse``. Arrays are serialized using the CSR format.

### `sparse_array_class`

```python
def sparse_array_class(self) -> type[SparseT]
```

Returns the class of sparse array that will be returned by the ``get_value()``
method.

### `py_type`

```python
def py_type(cls, value_type: type[SparseArray]) -> str
```

The module path of sparse array types is private, e.g ``scipy.sparse._csr.csr_array``.
This method returns the public path e.g ``scipy.sparse.csr_array`` instead.
