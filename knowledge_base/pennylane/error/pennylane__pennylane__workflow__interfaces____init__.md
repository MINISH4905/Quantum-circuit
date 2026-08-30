---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/workflow/interfaces/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/interfaces/__init__.py
license: Apache-2.0
---

## Module `pennylane/workflow/interfaces/__init__.py`

This subpackage defines functions for interfacing devices' execution
capabilities with different machine learning libraries.

## `InterfaceUnsupportedError`

```python
class InterfaceUnsupportedError(NotImplementedError)
```

Exception raised when features not supported by an interface are
attempted to be used.
