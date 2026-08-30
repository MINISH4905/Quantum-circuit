---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/concurrency/executors/external/mpi.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/concurrency/executors/external/mpi.py
license: Apache-2.0
---

## Module `pennylane/concurrency/executors/external/mpi.py`

.. currentmodule:: pennylane.concurrency.executors.external.mpi

Contains concurrent executor abstractions for task-based workloads backed by mpi4py.

## `MPIPoolExec`

```python
class MPIPoolExec(ExtExec)
```

MPIPoolExecutor abstraction class executor.

This executor wraps the `mpi4py.futures.MPIPoolExecutor <https://mpi4py.readthedocs.io/en/stable/mpi4py.futures.html#mpipoolexecutor>`_ class, and provides support for execution using multiple processes launched using MPI.
For an example script ``my_script.py``, and an installed mpi4py library with the active MPI environment, the executor can be used as follows:

.. code-block:: console

    $ mpirun -n 4 -m mpi4py.futures my_script.py

See `mpi4py.futures - Command line <https://mpi4py.readthedocs.io/en/stable/mpi4py.futures.html#command-line>`_ for additional details on launching jobs.

.. note::
    All calls to the executor are synchronous, and do not currently support the use of futures as a return object.

Args:
    *args: non keyword arguments to pass through to the executor backend.
    **kwargs: keyword arguments to pass through to the executor backend.

### `__call__`

```python
def __call__(self, dispatch: str, fn: Callable, *args, **kwargs)
```

dispatch:   the named method to pass the function parameters
fn:         the callable function to run on the executor backend
args:       the arguments to pass to ``fn``
kwargs:     the keyword arguments to pass to ``fn``

### `shutdown`

```python
def shutdown(self)
```

Shutdown the executor backend, if valid.

## `MPICommExec`

```python
class MPICommExec(ExtExec)
```

MPICommExecutor abstraction class functor. To be used if dynamic process spawning
required by MPIPoolExec is unsupported by the MPI implementation.

This executor wraps the `mpi4py.futures.MPICommExecutor <https://mpi4py.readthedocs.io/en/stable/mpi4py.futures.html#mpicommexecutor>`_ class, and provides support for execution using multiple processes launched using MPI.
For an example script ``my_script.py``, and an installed mpi4py library with the active MPI environment, the executor can be used as follows:

.. code-block:: console

    $ mpirun -n 4 -m mpi4py.futures my_script.py

See `mpi4py.futures - Command line <https://mpi4py.readthedocs.io/en/stable/mpi4py.futures.html#command-line>`_ for additional details on launching jobs.

.. note::
    All calls to the executor are synchronous, and do not currently support the use of futures as a return object.

### `__call__`

```python
def __call__(self, dispatch: str, fn: Callable, *args, **kwargs)
```

dispatch:   the named method to pass the function parameters
fn:         the callable function to run on the executor backend
args:       the arguments to pass to ``fn``
kwargs:     the keyword arguments to pass to ``fn``

### `shutdown`

```python
def shutdown(self)
```

Shutdown the executor backend, if valid.
