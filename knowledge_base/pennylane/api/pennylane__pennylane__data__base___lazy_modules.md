---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/base/_lazy_modules.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/base/_lazy_modules.py
license: Apache-2.0
---

## Module `pennylane/data/base/_lazy_modules.py`

Contains a lazy-loaded interface to the HDF5 module. For internal use only.

## `lazy_module`

```python
class lazy_module
```

Provides a lazy-loaded interface to a Python module, and its submodules. The module will not
be imported until an attribute is accessed.

### `__init__`

```python
def __init__(self, module_name_or_module: str | ModuleType, import_exc: Exception | None=None, post_import_cb: Callable[[ModuleType], None] | None=None)
```

Creates a new top-level lazy module or initializes a nested one.

Args:
    module_name_or_module: Name of module to lazily import, or a module object
        for a nested lazy module.
    import_exc: Custom Exception to raise when an ``ImportError`` occurs. Will only
        be used by the top-level ``lazy_module`` instance, not nested modules
