---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/attributes/serialization.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/attributes/serialization.py
license: Apache-2.0
---

## Module `pennylane/data/attributes/serialization.py`

An internal module for serializing and deserializing Pennylane pytrees.

## `pytree_structure_dump`

```python
def pytree_structure_dump(root: PyTreeStructure, *, indent: int | None=None, decode: bool=False) -> bytes | str
```

Convert Pytree structure ``root`` into JSON.

A non-leaf structure is represented as a 3-element list. The first element will
be the type name, the second element metadata, and the third element is
the list of children.

A leaf structure is represented by `null`.

Metadata may contain ``pennylane.Shots`` and ``pennylane.Wires`` objects,
as well as any JSON-serializable data.

>>> from pennylane.pytrees import PyTreeStructure, leaf, flatten
>>> from pennylane.pytrees.serialization import pytree_structure_dump

>>> _, struct = flatten([{"a": 1}, 2])
>>> struct
PyTreeStructure(list, None, [dict, ("a",), [PyTreeStructure()]), PyTreeStructure()])'

>>> pytree_structure_dump(struct)
b'["builtins.list",null,[["builtins.dict",["a"],[null]],null]]'

Args:
    root: Root of a Pytree structure
    indent: If not None, the resulting JSON will be pretty-printed with the
        given indent level. Otherwise, the output will use the most compact
        possible representation
    decode: If True, return a string instead of bytes

Returns:
    bytes: If ``encode`` is True
    str: If ``encode`` is False

## `pytree_structure_load`

```python
def pytree_structure_load(data: str | bytes | bytearray) -> PyTreeStructure
```

Load a previously serialized Pytree structure.

>>> from pennylane.pytrees.serialization import pytree_structure_dump

>>> pytree_structure_load('["builtins.list",null,[["builtins.dict",["a"],[null]],null]')
PyTreeStructure(list, None, [PyTreeStructure(dict, ["a"], [PyTreeStructure()]), PyTreeStructure()])'
