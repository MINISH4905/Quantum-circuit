---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/capture/autograph/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/capture/autograph/__init__.py
license: Apache-2.0
---

## Module `pennylane/capture/autograph/__init__.py`

Public/internal API for the AutoGraph module.

## `wraps`

```python
def wraps(target)
```

Wrap another function using functools.wraps. For use with AutoGraph, the __module__ attribute
should be preserved in order for the AutoGraph conversion allow/block listing to work properly.
