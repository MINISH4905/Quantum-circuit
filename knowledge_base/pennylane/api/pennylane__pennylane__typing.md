---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/typing.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/typing.py
license: Apache-2.0
---

## Module `pennylane/typing.py`

This file contains different PennyLane types.

## `InterfaceTensorMeta`

```python
class InterfaceTensorMeta(type)
```

defines dunder methods for the ``isinstance`` and ``issubclass`` checks.

.. note:: These special dunder methods can only be defined inside a metaclass.

### `__instancecheck__`

```python
def __instancecheck__(cls, other)
```

Dunder method used to check if an object is a `InterfaceTensor` instance.

### `__subclasscheck__`

```python
def __subclasscheck__(cls, other)
```

Dunder method that checks if a class is a subclass of ``InterfaceTensor``.

## `InterfaceTensor`

```python
class InterfaceTensor(metaclass=InterfaceTensorMeta)
```

Adds support for runtime instance checking of interface-specific tensor-like data
