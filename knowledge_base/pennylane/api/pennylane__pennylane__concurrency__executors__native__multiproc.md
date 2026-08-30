---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/concurrency/executors/native/multiproc.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/concurrency/executors/native/multiproc.py
license: Apache-2.0
---

## Module `pennylane/concurrency/executors/native/multiproc.py`

.. currentmodule:: pennylane.concurrency.executors.native.multiproc

This module provides abstractions around the Python ``multiprocessing`` library, with support for function execution using multiple processes.

## `MPPoolExec`

```python
class MPPoolExec(PyNativeExec)
```

Python standard library executor class backed by ``multiprocessing.Pool``.

This executor wraps Python standard library `multiprocessing.Pool <https://docs.python.org/3/library/multiprocessing.html#module-multiprocessing.pool>`_ interface, and provides support for execution using multiple processes.

Args:
    max_workers: the maximum number of concurrent units (processes) to use
    persist: allow the executor backend to persist between executions. True avoids
                potentially costly set-up and tear-down, where supported.
                Explicit calls to ``shutdown`` will set this to False.
    **kwargs: Keyword arguments to pass-through to the executor backend.
