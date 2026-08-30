---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/commutation_analysis.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/commutation_analysis.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/commutation_analysis.py`

Analysis pass to find commutation relations between DAG nodes.

## `CommutationAnalysis`

```python
class CommutationAnalysis(AnalysisPass)
```

Analysis pass to find commutation relations between DAG nodes.

This sets ``property_set['commutation_set']`` to a dictionary that describes
the commutation relations on a given wire: all the gates on a wire
are grouped into a set of gates that commute.

This pass is multithreaded and will potentially launch a thread pool
with threads equal to the number of CPUs by default. You can tune the
number of threads with the ``RAYON_NUM_THREADS`` environment variable.
For example, setting ``RAYON_NUM_THREADS=4`` would limit the thread pool
to 4 threads.

### `run`

```python
def run(self, dag)
```

Run the CommutationAnalysis pass on `dag`.

Run the pass on the DAG, and write the discovered commutation relations
into the ``property_set``.
