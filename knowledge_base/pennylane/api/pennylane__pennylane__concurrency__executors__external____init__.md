---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/concurrency/executors/external/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/concurrency/executors/external/__init__.py
license: Apache-2.0
---

## Module `pennylane/concurrency/executors/external/__init__.py`

Submodule for concurrent executors relying on 3rd-party packages.

.. currentmodule:: pennylane.concurrency.executor

All executor functionality in this module is implemented using external packages to handle execution and orchestration.

.. currentmodule:: pennylane.concurrency.executors.external

.. autosummary::
    :toctree: api

    ~dask.DaskExec
    ~mpi.MPICommExec
    ~mpi.MPIPoolExec
