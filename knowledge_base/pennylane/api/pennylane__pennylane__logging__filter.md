---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/logging/filter.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/logging/filter.py
license: Apache-2.0
---

## Module `pennylane/logging/filter.py`

This file provides support for logging framework filters. For more information please see the
official Python documentation on filters at https://docs.python.org/3/library/logging.html#filter

## `LocalProcessFilter`

```python
class LocalProcessFilter(Filter)
```

Filters logs not originating from the current executing Python process ID.

## `DebugOnlyFilter`

```python
class DebugOnlyFilter(Filter)
```

Filters logs that are less verbose than the DEBUG level (CRITICAL, ERROR, WARN & INFO).
