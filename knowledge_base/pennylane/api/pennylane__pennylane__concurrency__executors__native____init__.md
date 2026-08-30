---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/concurrency/executors/native/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/concurrency/executors/native/__init__.py
license: Apache-2.0
---

## Module `pennylane/concurrency/executors/native/__init__.py`

Submodule for concurrent executors relying on the Python standard library.

.. currentmodule:: pennylane.concurrency.executor

All executor functionality in this module is implemented directly using native Python abstractions.

.. currentmodule:: pennylane.concurrency.executors.native

.. autosummary::
    :toctree: api

    ~api.PyNativeExec
    ~conc_futures.ProcPoolExec
    ~conc_futures.ThreadPoolExec
    ~multiproc.MPPoolExec
    ~serial.SerialExec
