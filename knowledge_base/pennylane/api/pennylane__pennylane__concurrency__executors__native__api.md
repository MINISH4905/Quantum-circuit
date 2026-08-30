---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/concurrency/executors/native/api.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/concurrency/executors/native/api.py
license: Apache-2.0
---

## Module `pennylane/concurrency/executors/native/api.py`

.. currentmodule:: pennylane.concurrency.executors.native.api

Base API for defining an executor relying on native Python standard library implementations.

## `PyNativeExec`

```python
class PyNativeExec(IntExec, abc.ABC)
```

Python standard library backed ABC for executor API.

This class abstracts single-machine environments and unifies the standard-library backed executor backend to support the same API call structure.

Args:
    max_workers: the maximum number of concurrent units (threads, processes) to use
    persist: allow the executor backend to persist between executions. True avoids
                potentially costly set-up and tear-down, where supported.
                Explicit calls to ``shutdown`` will set this to False.
    **kwargs: Keyword arguments to pass-through to the executor backend.

### `shutdown`

```python
def shutdown(self)
```

Shutdown the executor backend, if valid.
