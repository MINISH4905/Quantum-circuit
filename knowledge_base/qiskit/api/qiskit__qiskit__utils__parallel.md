---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/utils/parallel.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/utils/parallel.py
license: Apache-2.0
---

## Module `qiskit/utils/parallel.py`

Routines for running Python functions in parallel using process pools
from the multiprocessing library.

## `default_num_processes`

```python
def default_num_processes() -> int
```

Get the number of processes that a multiprocessing parallel call will use by default.

Such functions typically also accept a ``num_processes`` keyword argument that will supersede
the value returned from this function.

In order of priority (highest to lowest), the return value will be:

1. The ``QISKIT_NUM_PROCS`` environment variable, if set.
2. The ``num_processes`` key of the Qiskit user configuration file, if set.
3. Half of the logical CPUs available to this process, if this can be determined.  This is a
   proxy for the number of physical CPUs, assuming two-fold simultaneous multithreading (SMT);
   empirically, multiprocessing performance of Qiskit seems to be worse when attempting to use
   SMT cores.
4. 1, if all else fails.

If a user-configured value is set to a number less than 1, it is treated as if it were 1.

## `local_hardware_info`

```python
def local_hardware_info()
```

Basic hardware information about the local machine.

Attempts to estimate the number of physical CPUs in the machine, even when hyperthreading is
turned on. CPU count defaults to 1 when true count can't be determined.

Returns:
    dict: The hardware information.

## `is_main_process`

```python
def is_main_process() -> bool
```

Checks whether the current process is the main one.

Since Python 3.8, this is identical to the standard Python way of calculating this::

    >>> import multiprocessing
    >>> multiprocessing.parent_process() is None

This function is left for backwards compatibility, but there is little reason not to use the
built-in tooling of Python.

## `should_run_in_parallel`

```python
def should_run_in_parallel(num_processes: int | None=None) -> bool
```

Decide whether a multiprocessing function should spawn subprocesses for parallelization.

In particular, this is how :func:`parallel_map` decides whether to use multiprocessing or not.
The ``num_processes`` argument alone does not enforce parallelism; by default, Qiskit will only
use process-based parallelism when a ``fork``-like process spawning start method is in effect.
You can override this decision either by setting the :mod:`multiprocessing` start method you
use, setting the ``QISKIT_PARALLEL`` environment variable to ``"TRUE"``, or setting
``parallel = true`` in your user settings file.

This function includes two context managers that can be used to temporarily modify the return
value of this function:

.. autofunction:: qiskit.utils::should_run_in_parallel.override
.. autofunction:: qiskit.utils::should_run_in_parallel.ignore_user_settings

Args:
    num_processes: the maximum number of processes requested for use (``None`` implies the
        default).

Examples:
    Temporarily override the configured settings to disable parallelism::

        >>> with should_run_in_parallel.override(True):
        ...     assert should_run_in_parallel(8)
        >>> with should_run_in_parallel.override(False):
        ...     assert not should_run_in_parallel(8)

## `parallel_map`

```python
def parallel_map(task, values, task_args=(), task_kwargs=None, num_processes=None)
```

Parallel execution of a mapping of `values` to the function `task`. This
is functionally equivalent to::

    result = [task(value, *task_args, **task_kwargs) for value in values]

This will parallelise the results if the number of ``values`` is greater than one and
:func:`should_run_in_parallel` returns ``True``.  If not, it will run in serial.

Args:
    task (func): Function that is to be called for each value in ``values``.
    values (array_like): List or array of values for which the ``task`` function is to be
        evaluated.
    task_args (list): Optional additional arguments to the ``task`` function.
    task_kwargs (dict): Optional additional keyword argument to the ``task`` function.
    num_processes (int): Number of processes to spawn.  If not given, the return value of
        :func:`default_num_processes` is used.

Returns:
    result: The result list contains the value of ``task(value, *task_args, **task_kwargs)`` for
    each value in ``values``.

Examples:

    .. plot::
       :include-source:
       :nofigs:

        import time
        from qiskit.utils import parallel_map
        def func(_):
                time.sleep(0.1)
                return 0
        parallel_map(func, list(range(10)));
