---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/base/mapper.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/base/mapper.py
license: Apache-2.0
---

## Module `pennylane/data/base/mapper.py`

Contains a class for mapping HDF5 groups to Dataset Attributes, and a mixin
class that provides the mapper class.

## `DatasetNotWriteableError`

```python
class DatasetNotWriteableError(RuntimeError)
```

Exception raised when attempting to set an attribute
on a dataset whose underlying file is not writeable.

## `AttributeTypeMapper`

```python
class AttributeTypeMapper(MutableMapping)
```

This class performs the mapping between the objects contained
in a HDF5 group and Dataset attributes.

### `info`

```python
def info(self) -> AttributeInfo
```

Return ``AttributeInfo`` for ``self.bind``.

### `set_item`

```python
def set_item(self, key: str, value: Any, info: AttributeInfo | None, require_type: type[DatasetAttribute] | None=None) -> None
```

Creates or replaces attribute ``key`` with ``value``, optionally
including ``info``.

Args:
    key: Name of attribute in HDF5 group
    value: Attribute value, either a compatible object or an already
        initialized ``DatasetAttribute``.
    info: Extra info to attach to attribute
    require_type: Force the ``value`` to be serialized as this type.
        If ``value`` is an ``DatasetAttribute``, it must be an instance of ``require_type``.
        Otherwise, ``value`` must be serializable by ``require_type``.

### `move`

```python
def move(self, src: str, dest: str) -> None
```

Moves the attribute stored at ``src`` in ``bind`` to ``dest``.

### `view`

```python
def view(self) -> Mapping[str, DatasetAttribute]
```

Returns a read-only mapping of the attributes in ``bind``.

## `MapperMixin`

```python
class MapperMixin
```

Mixin class for Dataset types that provide an interface
to a HDF5 group, e.g `DatasetList`, `DatasetDict`. Provides
a `_mapper` property over the type's ``bind`` attribute.
