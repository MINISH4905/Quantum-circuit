---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/data_manager/progress/_default/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/data_manager/progress/_default/__init__.py
license: Apache-2.0
---

## Module `pennylane/data/data_manager/progress/_default/__init__.py`

Fallback implementation of a progress bar, used when ``rich`` is not available.

## `Task`

```python
class Task
```

Data class for progress bar state.

### `update`

```python
def update(self, *, advance: float | None=None, completed: float | None=None, total: float | None=None) -> None
```

Update the state of the progress bar and set the display
string.

## `TerminalInfo`

```python
class TerminalInfo
```

Contains information on  the dimensions of
the terminal.

## `DefaultProgress`

```python
class DefaultProgress
```

Implements a progress bar.

### `add_task`

```python
def add_task(self, description: str, total: float | None=None) -> int
```

Add a task.

### `refresh`

```python
def refresh(self, task_id: int | None=None)
```

Refresh display liens for one or all tasks.

### `update`

```python
def update(self, task_id: int, *, completed: float | None=None, total: float | None=None, advance: float | None=None, refresh: bool=False)
```

Update task with given ``task_id`` and refresh its progress.

Args:
    task_id: ID of task
    completed: Set the completed state of the task
    total: Set the total for the task
    advance: Advance the completion state of the task
    refresh: Included for compatability with ``rich.Progress``, has no effect

## `make_progress`

```python
def make_progress() -> DefaultProgress
```

Factory function for a progress instance.
