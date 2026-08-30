---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/passmanager/passmanager.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/passmanager/passmanager.py
license: Apache-2.0
---

## Module `qiskit/passmanager/passmanager.py`

Manager for a set of Passes and their scheduling during transpilation.

## `BasePassManager`

```python
class BasePassManager(Generic[IR], ABC)
```

Pass manager base class.

### `__init__`

```python
def __init__(self, tasks: Task[IR, IR] | list[Task[IR, IR]]=(), max_iteration: int=1000)
```

Initialize an empty pass manager object.

Args:
    tasks: A pass set to be added to the pass manager schedule.
    max_iteration: The maximum number of iterations the schedule will be looped if the
        condition is not met.

### `append`

```python
def append(self, tasks: Task[IR, IR] | list[Task[IR, IR]]) -> None
```

Append tasks to the schedule of passes.

Args:
    tasks: A set of pass manager tasks to be added to schedule.

Raises:
    TypeError: When any element of tasks is not a subclass of passmanager Task.

### `replace`

```python
def replace(self, index: int, tasks: Task[IR, IR] | list[Task[IR, IR]]) -> None
```

Replace a particular pass in the scheduler.

Args:
    index: Task index to replace, based on the position in :meth:`tasks`
    tasks: A set of pass manager tasks to be added to schedule.

Raises:
    TypeError: When any element of tasks is not a subclass of passmanager Task.
    PassManagerError: If the index is not found.

### `remove`

```python
def remove(self, index: int) -> None
```

Removes a particular pass in the scheduler.

Args:
    index: Pass index to remove, based on the position in :meth:`passes`.

Raises:
    PassManagerError: If the index is not found.

### `run`

```python
def run(self, in_programs: Any | list[Any], callback: Callback[IR] | None=None, num_processes: int | None=None, *, property_set: dict[str, object] | None=None, **kwargs) -> Any
```

Run all the passes on the specified ``in_programs``.

Args:
    in_programs: Input programs to transform via all the registered passes.
        A single input object cannot be a Python builtin list object.
        A list object is considered as multiple input objects to optimize.
    callback: A callback function that will be called after each pass execution. The
        function will be called with 5 keyword arguments::

            task (GenericPass): the pass being run
            passmanager_ir (Any): depending on pass manager subclass
            property_set (PropertySet): the property set
            running_time (float): the time to execute the pass
            count (int): the index for the pass execution

        The exact arguments passed expose the internals of the pass
        manager and are subject to change as the pass manager internals
        change. If you intend to reuse a callback function over
        multiple releases be sure to check that the arguments being
        passed are the same.

        To use the callback feature you define a function that will
        take in kwargs dict and access the variables. For example::

            def callback_func(**kwargs):
                task = kwargs['task']
                passmanager_ir = kwargs['passmanager_ir']
                property_set = kwargs['property_set']
                running_time = kwargs['running_time']
                count = kwargs['count']
                ...
    num_processes: The maximum number of parallel processes to launch if parallel
        execution is enabled. This argument overrides ``num_processes`` in the user
        configuration file, and the ``QISKIT_NUM_PROCS`` environment variable. If set
        to ``None`` the system default or local user configuration will be used.
    property_set: If given, the initial value to use as the :class:`.PropertySet` for the
        pass manager pipeline.  This can be used to persist analysis from one run to
        another, in cases where you know the analysis is safe to share.  Beware that some
        analysis will be specific to the input circuit and the particular :class:`.Target`,
        so you should take a lot of care when using this argument.
    kwargs: Arbitrary arguments passed to the compiler frontend and backend.

Returns:
    The transformed program(s).

### `to_flow_controller`

```python
def to_flow_controller(self) -> FlowControllerLinear[IR, IR]
```

Linearize this manager into a single :class:`.FlowControllerLinear`,
so that it can be nested inside another pass manager.

Returns:
    A linearized pass manager.
