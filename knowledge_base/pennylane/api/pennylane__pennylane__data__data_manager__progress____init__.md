---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/data_manager/progress/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/data_manager/progress/__init__.py
license: Apache-2.0
---

## Module `pennylane/data/data_manager/progress/__init__.py`

A library for showing loading progress, using ``rich`` or basic stdout.

## `Task`

```python
class Task
```

Represents progress display for a single dataset download.

### `__init__`

```python
def __init__(self, _task_id: Any, _progress: Any)
```

Private constructor.

### `update`

```python
def update(self, *, completed: float | None=None, advance: float | None=None, total: float | None=None)
```

Update download state.

Args:
    advance: Adds to number of bytes downloaded so far
    completed: Sets the number of bytes downloaded so far
    total: Sets the total number of bytes for the download

## `Progress`

```python
class Progress
```

Displays dataset download progress on the terminal. Will use
``rich.progress.Progress`` if available, otherwise it will fall back to the
default implementation.

Must be used as a context manager to ensure correct output.

### `__init__`

```python
def __init__(self) -> None
```

Initialize progress.

### `__enter__`

```python
def __enter__(self) -> 'Progress'
```

Enter progress context.

### `__exit__`

```python
def __exit__(self, *args)
```

Exit progress context.

### `add_task`

```python
def add_task(self, description: str, total: float | None=None) -> Task
```

Add a task.

Args:
    description: Description for the task
    total: Total size of the dataset download in bytes, if available.
