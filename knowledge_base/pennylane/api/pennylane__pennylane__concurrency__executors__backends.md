---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/concurrency/executors/backends.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/concurrency/executors/backends.py
license: Apache-2.0
---

## Module `pennylane/concurrency/executors/backends.py`

Contains concurrent executor abstractions for task-based workloads.

## `ExecBackends`

```python
class ExecBackends(Enum)
```

Supported executor backends.

The enumerated options provide a mapping to the implementation-defined classes for task-based executor backends.

.. note::
    Not all backends are guaranteed to be instantiable without additional package installations.

## `get_supported_backends`

```python
def get_supported_backends()
```

Return the list of backends with implementation support.

.. note::
    Not all backends are guaranteed to be instantiable without additional package installations.

## `get_executor`

```python
def get_executor(backend: ExecBackends | str=ExecBackends.MP_Pool)
```

Return the associated class type from the provided enumerated backends.

## `create_executor`

```python
def create_executor(backend: ExecBackends | str=ExecBackends.MP_Pool, **kwargs)
```

Create an instance of the specified executor backend with forwarded keyword arguments
