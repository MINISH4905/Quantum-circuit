---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/concurrency/executors/external/dask.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/concurrency/executors/external/dask.py
license: Apache-2.0
---

## Module `pennylane/concurrency/executors/external/dask.py`

.. currentmodule:: pennylane.concurrency.executors.external.dask

Contains concurrent executor abstractions for task-based workloads based on support provided by Dask's distributed backend.

## `DaskExec`

```python
class DaskExec(ExtExec)
```

Dask distributed executor wrapper.

This executor relies on `Dask's distributed interface <https://distributed.dask.org/en/stable/>`_ to offload task execution to either a local or configured remote cluster backend.

Args:
    max_workers:    the maximum number of concurrent units (threads, processes) to use. The serial backend defaults to 1 and will return a ``RuntimeError`` if more are requested.
    persist:        allow the executor backend to persist between executions. This is ignored for the serial backend.
    client_provider (str, dask.distributed.deploy.Cluster): provide an existing dask distributed cluster via a URL (str) or object to be used for job submission. When ``None``, creates an internal ``LocalCluster`` object using processes for job submission. Defaults to ``None``. Cluster backend documentation available at `Dask Distrubuted - Deploy Dask Clusters <https://docs.dask.org/en/stable/deploying.html>`_.
    **kwargs:   Keyword arguments to pass-through to the executor backend. This is ignored for the serial backend.
