---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/attributes/dictionary.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/attributes/dictionary.py
license: Apache-2.0
---

## Module `pennylane/data/attributes/dictionary.py`

Contains an DatasetAttribute that allows for heterogenous dictionaries
of Dataset attributes.

## `DatasetDict`

```python
class DatasetDict(Generic[T], DatasetAttribute[HDF5Group, Mapping[str, T], Mapping[str, T]], MutableMapping[str, T], MapperMixin)
```

Provides a dict-like collection for Dataset attribute types. Keys must
be strings.

### `copy`

```python
def copy(self) -> dict[str, T]
```

Returns a copy of this mapping as a builtin ``dict``, with all
elements copied.
