---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/concurrency/executors/native/conc_futures.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/concurrency/executors/native/conc_futures.py
license: Apache-2.0
---

## Module `pennylane/concurrency/executors/native/conc_futures.py`

.. currentmodule:: pennylane.concurrency.executors.native.conc_futures

This module provides abstractions around the Python ``concurrent.futures`` library and interface. This module directly offloads to the in-built executors for both multithreaded and multiprocess function execution.

## `ProcPoolExec`

```python
class ProcPoolExec(PyNativeExec)
```

concurrent.futures.ProcessPoolExecutor class executor.

This executor wraps Python standard library `concurrent.futures.ProcessPoolExecutor <https://docs.python.org/3/library/concurrent.futures.html#processpoolexecutor>`_ interface, and provides support for execution using multiple processes.

.. note::
    All calls to the executor are synchronous, and do not currently support the use of futures as a return object.

Args:
    max_workers: the maximum number of concurrent units (processes) to use
    persist: allow the executor backend to persist between executions. True avoids
                potentially costly set-up and tear-down, where supported.
                Explicit calls to ``shutdown`` will set this to False.
    **kwargs: Keyword arguments to pass-through to the executor backend.

## `ThreadPoolExec`

```python
class ThreadPoolExec(PyNativeExec)
```

concurrent.futures.ThreadPoolExecutor class executor.

This executor wraps Python standard library `concurrent.futures.ThreadPoolExecutor <https://docs.python.org/3/library/concurrent.futures.html#threadpoolexecutor>`_ interface, and provides support for execution using multiple threads.
The threading executor may not provide execution speed-ups for tasks when using a GIL-enabled Python.

.. note::
    All calls to the executor are synchronous, and do not currently support the use of futures as a return object.

Args:
    max_workers: the maximum number of concurrent units (threads) to use
    persist: allow the executor backend to persist between executions. True avoids
                potentially costly set-up and tear-down, where supported.
                Explicit calls to ``shutdown`` will set this to False.
    **kwargs: Keyword arguments to pass-through to the executor backend.
