---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/concurrency/executors/base.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/concurrency/executors/base.py
license: Apache-2.0
---

## Module `pennylane/concurrency/executors/base.py`

Contains concurrent executor abstractions for task-based workloads.

All of the base abstractions for building an executor follow a simplified `concurrent.futures.Executor <https://docs.python.org/3/library/concurrent.futures.html#executor-objects>`_ interface. Given the differences observed in support for ``*args`` and ``**kwargs`` in various modes of execution, the abstractions provide a fixed API to interface with each backend, performing function and argument transformations, where necessary.

To build a new executor backend, the following classes provide scaffolding to simplify abstracting the function call signatures between each backend interface layer.

.. currentmodule:: pennylane.concurrency.executors.base

.. autosummary::
    :toctree: api

    ExecBackendConfig
    RemoteExec
    IntExec
    ExtExec

## `ExecBackendConfig`

```python
class ExecBackendConfig
```

Executor backend configuration data-class.

To allow for differences in each executor backend implementation, this class dynamically defines overloads to the main API functions. For explicitly-defined executors, this class is optional, and is provided for convenience with hierarchical inheritance class structures, where subtle differences are best resolved dynamically, rather than with API modifications. All initial values default to ``None``.

Args:
    submit_fn (str, None): The backend function that best matches the ``submit`` API call.
    map_fn (str): The backend function that best matches the ``map`` API call.
    starmap_fn (str, None): The backend function that best matches the ``starmap`` API call.
    shutdown_fn (str, None): The backend function that best matches the ``shutdown`` API call.
    submit_unpack (bool, None): Whether the arguments to ``submit`` are to be unpacked (``*args``) or directly passed (``args``) to ``submit_fn``.
    map_unpack (bool): Whether the arguments to ``map`` are to be unpacked (``*args``) or directly passed (``args``) to ``map_unpack``.
    blocking (bool, None): Whether the return values from ``submit``, ``map`` and ``starmap`` are blocking (synchronous) or non-blocking (asynchronous).

## `RemoteExec`

```python
class RemoteExec(abc.ABC)
```

Abstract base class for defining a task-based parallel executor backend.

This ABC is intended to provide the highest-layer abstraction in the inheritance tree.

Args:
    max_workers (int): The size of the worker pool. This value will directly control (given backend support)
        the number of concurrent executions that the backend can avail of. Generally, this value should match
        the number of physical cores on the executing system, or with the executing remote environment. Defaults
        to ``None``, which defers to support provided by the child class.
    persist (bool): Indicates to the executor backend that the state should persist between
        calls. If supported, this allows a pre-configured device to be reused for several
        computations but removing the need to automatically shutdown. The pool may require
        manual shutdown upon completion of the work, even if the executor goes out-of-scope.
    *args: Non keyword arguments to pass through to executor backend.
    **kwargs: Keyword arguments to pass through to executor backend.

### `__call__`

```python
def __call__(self, dispatch: str, fn: Callable, *args, **kwargs)
```

dispatch:   the named method to pass the function parameters
fn:         the callable function to run on the executor backend
args:       the arguments to pass to ``fn``
kwargs:     the keyword arguments to pass to ``fn``

### `size`

```python
def size(self)
```

The size of the worker pool for the given executor.

### `persist`

```python
def persist(self)
```

Indicates whether the executor will maintain its configured state between calls.

### `__enter__`

```python
def __enter__(self)
```

Context-manager entry point for executor.

Returns:
    RemoteExec: this instance

### `__exit__`

```python
def __exit__(self, exception_type, exception_value, traceback)
```

Context-manager clean-up for executor.

### `submit`

```python
def submit(self, fn: Callable, *args, **kwargs)
```

Single function submission for remote execution with provided args.

### `map`

```python
def map(self, fn: Callable, *args, **kwargs)
```

Single iterable map for batching execution of fn over data entries.
Length of every entry in ``*args`` must be consistent.
kwargs are assumed as broadcastable to each function call.

### `starmap`

```python
def starmap(self, fn: Callable, args: Sequence, **kwargs)
```

Single iterable map for batching execution of fn over data entries, with each entry being a tuple of arguments to fn.

### `shutdown`

```python
def shutdown(self)
```

Disconnect from executor backend and release acquired resources.

## `IntExec`

```python
class IntExec(RemoteExec, abc.ABC)
```

Executor class for native Python library concurrency support.

This class is intended to be used as the parent-class for building Python-native executors, allowing an ease of distinction from the external-based classes implemented using :class:`~.ExtExec`.

Args:
    max_workers (int): The size of the worker pool. This value will directly control (given backend support)
        the number of concurrent executions that the backend can avail of. Generally, this value should match
        the number of physical cores on the executing system, or with the executing remote environment. Defaults
        to ``None``, leaving interpretation to the child class.
    persist (bool): Indicates to the executor backend that the state should persist between
        calls. If supported, this allows a pre-configured device to be reused for several
        computations but removing the need to automatically shutdown. The pool may require
        manual shutdown upon completion of the work, even if the executor goes out-of-scope.
    *args: Non keyword arguments to pass through to executor backend.
    **kwargs: Keyword arguments to pass through to executor backend.

## `ExtExec`

```python
class ExtExec(RemoteExec, abc.ABC)
```

Executor class for external packages providing concurrency support.

This class is intended to be used as the parent-class for building external package-based executors, allowing an ease of distinction from the Python-native classes implemented using :class:`~.IntExec`.

Args:
    max_workers (int): The size of the worker pool. This value will directly control (given backend support)
        the number of concurrent executions that the backend can avail of. Generally, this value should match
        the number of physical cores on the executing system, or with the executing remote environment. Defaults
        to ``None``, leaving interpretation to the child class.
    persist (bool): Indicates to the executor backend that the state should persist between
        calls. If supported, this allows a pre-configured device to be reused for several
        computations but removing the need to automatically shutdown. The pool may require
        manual shutdown upon completion of the work, even if the executor goes out-of-scope.
    *args: Non keyword arguments to pass through to executor backend.
    **kwargs: Keyword arguments to pass through to executor backend.
