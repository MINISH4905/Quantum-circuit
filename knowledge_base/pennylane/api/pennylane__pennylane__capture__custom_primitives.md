---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/capture/custom_primitives.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/capture/custom_primitives.py
license: Apache-2.0
---

## Module `pennylane/capture/custom_primitives.py`

This submodule offers custom primitives for the PennyLane capture module.

## `PrimitiveType`

```python
class PrimitiveType(Enum)
```

Enum to define valid set of primitive classes

## `QpPrimitive`

```python
class QpPrimitive(Primitive)
```

A subclass for JAX's Primitive that differentiates between different
classes of primitives and automatically makes parameters hashable for JAX 0.7.0+.

### `prim_type`

```python
def prim_type(self)
```

Value of Enum representing the primitive type to differentiate between various
sets of PennyLane primitives.

### `prim_type`

```python
def prim_type(self, value: str | PrimitiveType)
```

Setter for QpPrimitive.prim_type.

### `bind`

```python
def bind(self, *args, **params)
```

Bind with automatic parameter hashability conversion for JAX 0.7.0+.

Overrides the parent bind method to automatically convert unhashable parameters
(like lists, dicts, and slices) to hashable tuples, which is required by JAX 0.7.0+.
