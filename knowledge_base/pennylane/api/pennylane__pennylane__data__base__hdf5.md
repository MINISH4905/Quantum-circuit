---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/base/hdf5.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/base/hdf5.py
license: Apache-2.0
---

## Module `pennylane/data/base/hdf5.py`

Contains H5Py lazy module and convenience functions for HDF5.

## `open_group`

```python
def open_group(path: Path | str, mode: Literal['r', 'w', 'w-', 'a']='r') -> HDF5Group
```

Creates or opens an HDF5 file at ``path`` and returns the root HDF5 group.

Args:
    path: File system path for HDF5 File
    mode:  File handling mode. Possible values are "w-" (create, fail if file
        exists), "w" (create, overwrite existing), "a" (append existing,
        create if doesn't exist), "r" (read existing, must exist). Default is "r".

## `create_group`

```python
def create_group() -> HDF5Group
```

Creates a new HDF5 group in memory.

## `copy`

```python
def copy(source: HDF5Any, dest: HDF5Group, key: str, on_conflict: Literal['raise', 'overwrite', 'ignore']='raise') -> None
```

Copy HDF5 array or group ``source`` into group ``dest``.

Args:
    source: HDF5 group or array to copy
    dest: Target HDF5 group
    keys: Name to save source into, under dest
    on_conflict: How to handle conflicts if ``key`` already exists in
        ``dest``. ``"raise"`` will raise an exception, ``overwrite``
        will overwrite the existing object in ``dest``, ``"ignore"`` will
        do nothing

## `copy_all`

```python
def copy_all(source: HDF5Group, dest: HDF5Group, *keys: str, on_conflict: Literal['raise', 'overwrite', 'ignore']='ignore', without_attrs: bool=False) -> None
```

Copies all the elements of ``source`` named ``keys`` into ``dest``. If no keys
are provided, all elements of ``source`` will be copied.

## `open_hdf5_s3`

```python
def open_hdf5_s3(s3_url: str, *, block_size: int=8388608) -> HDF5Group
```

Uses ``fsspec`` module to open the HDF5 file at ``s3_url``.

This requires both ``fsspec`` and ``aiohttp`` to be installed.

Args:
    s3_url: URL of dataset file in S3
    block_size: Number of bytes to fetch per read operation. Larger values
        may improve performance for large datasets
