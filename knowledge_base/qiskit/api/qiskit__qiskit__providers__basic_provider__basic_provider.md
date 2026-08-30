---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/providers/basic_provider/basic_provider.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/providers/basic_provider/basic_provider.py
license: Apache-2.0
---

## Module `qiskit/providers/basic_provider/basic_provider.py`

Provider for basic simulator backends, formerly known as `BasicAer`.

## `BasicProvider`

```python
class BasicProvider
```

Provider for test simulators.

### `get_backend`

```python
def get_backend(self, name=None, **kwargs)
```

Return a single backend matching the specified filtering.
Args:
    name (str): name of the backend.
    **kwargs: dict used for filtering.
Returns:
    Backend: a backend matching the filtering.
Raises:
    QiskitBackendNotFoundError: if no backend could be found or
        more than one backend matches the filtering criteria.

### `backends`

```python
def backends(self, name: str | None=None, filters: Callable | None=None) -> list[Backend]
```

Return a list of backends matching the specified filtering.
Args:
    name: name of the backend.
    filters: callable for filtering.
Returns:
    list[Backend]: a list of Backends that match the filtering
        criteria.
