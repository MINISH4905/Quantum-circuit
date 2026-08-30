---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/passmanager/compilation_status.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/passmanager/compilation_status.py
license: Apache-2.0
---

## Module `qiskit/passmanager/compilation_status.py`

A property set dictionary that is shared among optimization passes.

## `PropertySet`

```python
class PropertySet(dict)
```

A default dictionary-like object.

## `RunState`

```python
class RunState(Enum)
```

Allowed values for the result of a pass execution.

## `WorkflowStatus`

```python
class WorkflowStatus
```

Collection of compilation status of workflow, i.e. pass manager run.

This data structure is initialized when the pass manager is run,
and recursively handed over to underlying tasks.
Each pass will update this status once after being executed, and the lifetime of the
workflow status object is the time during which the pass manager is running.

## `PassManagerState`

```python
class PassManagerState
```

A portable container object that pass manager tasks communicate through generator.

This object can contain all information about the running pass manager workflow,
except for the IR object being optimized.
The data structure consists of two elements; one for the status of the
workflow itself, and another one for the additional information about the IR
analyzed through pass executions. This container aims at just providing
a robust interface for the :meth:`.Task.execute`, and no logic that modifies
the container elements must be implemented.

This object is mutable, and might be mutated by pass executions.
