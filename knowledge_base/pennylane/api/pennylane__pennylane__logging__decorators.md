---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/logging/decorators.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/logging/decorators.py
license: Apache-2.0
---

## Module `pennylane/logging/decorators.py`

This file expands the PennyLane logging functionality to allow additions for function entry and exit logging via decorators.

## `log_string_debug_func`

```python
def log_string_debug_func(func, log_level, use_entry, override=None)
```

This decorator utility generates a string containing the called function, the passed arguments, and the source of the function call.
