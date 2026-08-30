---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/data_manager/foldermap.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/data_manager/foldermap.py
license: Apache-2.0
---

## Module `pennylane/data/data_manager/foldermap.py`

Contains ``FolderMapView`` for reading the ``foldermap.json`` file in the
datasets bucket.

## `DataPath`

```python
class DataPath(PurePosixPath)
```

Type for Dataset Path, relative to the foldermap.json file.

## `FolderMapView`

```python
class FolderMapView(Mapping[str, Union['FolderMapView', DataPath]])
```

Provides a read-only view of the ``foldermap.json`` file in
the datasets bucket. The folder map is a nested mapping of
dataset parameters to their path, relative to the ``foldermap.json``
file.

A dictionary in the folder map can optionally specify a default
parameter using the '__default' key. This view hides that
key, and allows the default parameter to be accessed.

For example, the underlying foldermap data will look like
this:

    {
        "__params": {
            "qchem": ["molname", "basis", "bondlength"]
        },
        "qchem": {
            "O2": {
                "__default": "STO-3G",
                "STO-3G": {
                    "__default": "0.5",
                    "0.5": "qchem/O2/STO-3G/0.5.h5",
                    "0.6": "qchem/O2/STO-3G/0.6.h5"
                }
            },
            "H2": {
                "__default": "STO-3G",
                "STO-3G": {
                    "__default": "0.7",
                    "0.7": "qchem/H2/STO-3G/0.7.h5"
                }
            }
        },
    }

When accessed through ``FolderMapView``, the '__default' and '__params'
keys will be hidden.

### `__init__`

```python
def __init__(self, __curr_level: Mapping[str, Any]) -> None
```

Initialize the mapping.

Args:
    __data_struct: The top level foldermap

### `get_default_key`

```python
def get_default_key(self) -> str | None
```

Get the default key for this level of the foldermap.
Raises a ValueError if it does not have a default.

### `find`

```python
def find(self, data_name: str, missing_default: ParamArg | None=ParamArg.DEFAULT, **params: Iterable[ParamVal] | ParamArg) -> list[tuple[Description, DataPath]]
```

Returns a 2-tuple of dataset description and paths, for each dataset that
matches ``params``.

### `__getitem__`

```python
def __getitem__(self, __key: str | Literal[ParamArg.DEFAULT]) -> Union['FolderMapView', DataPath]
```

Gets the item with key. If key is ``ParamArg.DEFAULT``, return the
item under the default parameter, or raise a ``ValueError`` if no
default exists.

### `keys`

```python
def keys(self) -> frozenset[str]
```

Keys of the folder view
