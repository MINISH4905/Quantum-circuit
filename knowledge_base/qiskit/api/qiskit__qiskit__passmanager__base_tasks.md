---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/passmanager/base_tasks.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/passmanager/base_tasks.py
license: Apache-2.0
---

## Module `qiskit/passmanager/base_tasks.py`

Base classes for the Qiskit passmanager optimization tasks.

## `Task`

```python
class Task(ABC, Generic[IR, IR_OUT])
```

An interface of the pass manager task.

The task takes an IR, and outputs a (possibly different) IR after some operation on it.
A task can rely on the :class:`.PropertySet` to communicate intermediate data among tasks.

### `execute`

```python
def execute(self, passmanager_ir: IR, state: PassManagerState, callback: Callable[[Task, IR_OUT, PropertySet, float, int], None] | None=None) -> tuple[IR_OUT, PassManagerState]
```

Execute optimization task for input Qiskit IR.

Args:
    passmanager_ir: Qiskit IR to optimize.
    state: State associated with workflow execution by the pass manager itself.
    callback: A callback function which is called per execution of optimization task.

Returns:
    Optimized Qiskit IR and state of the workflow.

## `GenericPass`

```python
class GenericPass(Task[IR, IR_OUT], ABC)
```

Base class of a single pass manager task.

A pass instance can read and write to the provided :class:`.PropertySet`,
and may modify the input pass manager IR.

### `name`

```python
def name(self) -> str
```

Name of the pass.

### `update_status`

```python
def update_status(self, state: PassManagerState, run_state: RunState) -> PassManagerState
```

Update workflow status.

Args:
    state: Pass manager state to update.
    run_state: Completion status of current task.

Returns:
    Updated pass manager state.

### `run`

```python
def run(self, passmanager_ir: IR) -> IR_OUT
```

Run optimization task.

Args:
    passmanager_ir: Qiskit IR to optimize.

Returns:
    Optimized Qiskit IR.

## `BaseController`

```python
class BaseController(Task[IR, IR_OUT], ABC)
```

Base class of controller.

A controller is built with a collection of pass manager tasks,
and a subclass provides a custom logic to choose next task to run.
Note a controller can be nested into another controller,
and a controller itself doesn't provide any subroutine to modify the input IR.

### `__init__`

```python
def __init__(self, options: dict[str, Any] | None=None)
```

Create new flow controller.

Args:
    options: Option for this flow controller.

### `iter_tasks`

```python
def iter_tasks(self, state: PassManagerState) -> Generator[Task[Any, Any], PassManagerState, None]
```

A custom logic to choose a next task to run.

Controller subclass can consume the state to build a proper task pipeline.  The updated
state after a task execution will be fed back in as the "return" value of any ``yield``
statements.  This indicates the order of task execution is only determined at running time.
This method is not allowed to mutate the given state object.

Args:
    state: The state of the passmanager workflow at the beginning of this flow controller's
        execution.

Receives:
    state: the state of pass manager after the execution of the last task that was yielded.
        The generator does not need to inspect this if it is irrelevant to its logic, nor
        update it.

Yields:
    Task: Next task to run.
