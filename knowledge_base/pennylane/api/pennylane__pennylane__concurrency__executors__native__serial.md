---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/concurrency/executors/native/serial.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/concurrency/executors/native/serial.py
license: Apache-2.0
---

## Module `pennylane/concurrency/executors/native/serial.py`

.. currentmodule:: pennylane.concurrency.executors.native.serial

This module provides single-threaded, local executor support for function execution. All operations are directed to built-ins, and use direct function execution.

## `StdLibBackend`

```python
class StdLibBackend
```

Internal utility class for use with the executor API.
All execution is local within the calling Python process.

Args:
    *args: non-keyword arguments for passthrough to the executor backend. All values here will be ignored.
    **kwargs: keyword-arguments for passthrough to the executor backend. All values here will be ignored.

### `submit`

```python
def submit(cls, fn: Callable, *args, **kwargs)
```

Directly execute the function as fn(*args, **kwargs)

### `map`

```python
def map(cls, fn: Callable, *args: Sequence[Any], **kwargs)
```

Offload execution of the function to map and return the results as a list.

### `starmap`

```python
def starmap(cls, fn: Callable, data: Sequence[tuple], **kwargs)
```

Offload to itertools.starmap for execution, and return results as a list.

### `shutdown`

```python
def shutdown(self)
```

No-op close shutdown

## `SerialExec`

```python
class SerialExec(PyNativeExec)
```

Serial Python standard library executor class.

This executor wraps Python standard library calls without support for multithreaded or multiprocess execution. Any calls to external libraries that utilize threads, such as BLAS through numpy, can still use multithreaded calls at that layer.

Args:
    max_workers:    the maximum number of concurrent units (threads, processes) to use. The serial backend defaults to 1 and will return a ``RuntimeError`` if more are requested.
    persist:        allow the executor backend to persist between executions. This is ignored for the serial backend.
    **kwargs:   Keyword arguments to pass-through to the executor backend. This is ignored for the serial backend.
