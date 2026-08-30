---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/providers/providerutils.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/providers/providerutils.py
license: Apache-2.0
---

## Module `qiskit/providers/providerutils.py`

Utilities for providers.

## `filter_backends`

```python
def filter_backends(backends: list[Backend], filters: Callable[[Backend], bool] | None=None, **kwargs) -> list[Backend]
```

Return the backends matching the specified filtering.

Filter the `backends` list by their `configuration` or `status`
attributes, or from a boolean callable. The criteria for filtering can
be specified via `**kwargs` or as a callable via `filters`, and the
backends must fulfill all specified conditions.

Args:
    backends (list[Backend]): list of backends.
    filters (callable): filtering conditions as a callable.
    **kwargs: dict of criteria.

Returns:
    list[Backend]: a list of backend instances matching the
        conditions.

## `resolve_backend_name`

```python
def resolve_backend_name(name: str, backends: list[Backend], deprecated: dict[str, str], aliased: dict[str, list[str]]) -> str
```

Resolve backend name from a deprecated name or an alias.

A group will be resolved in order of member priorities, depending on
availability.

Args:
    name (str): name of backend to resolve
    backends (list[Backend]): list of available backends.
    deprecated (dict[str: str]): dict of deprecated names.
    aliased (dict[str: list[str]]): dict of aliased names.

Returns:
    str: resolved name (name of an available backend)

Raises:
    LookupError: if name cannot be resolved through regular available
        names, nor deprecated, nor alias names.
