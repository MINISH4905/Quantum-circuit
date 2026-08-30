---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/passmanager/flow_controllers.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/passmanager/flow_controllers.py
license: Apache-2.0
---

## Module `qiskit/passmanager/flow_controllers.py`

Built-in pass flow controllers.

## `FlowControllerLinear`

```python
class FlowControllerLinear(BaseController[IR, IR_OUT])
```

A standard flow controller that runs tasks one after the other.

This controller guarantees that the input IR and output IR are correctly typed, but makes
no guarantees on what IRs are used intermediately.

### `passes`

```python
def passes(self) -> list[Task[Any, Any]]
```

Alias of tasks for backward compatibility.

## `DoWhileController`

```python
class DoWhileController(BaseController[IR, IR])
```

Run the given tasks in a loop until the ``do_while`` condition on the property set becomes
``False``.

The given tasks will always run at least once, and on iteration of the loop, all the
tasks will be run (with the exception of a failure state being set). This controller
has the same input and output IR.

### `passes`

```python
def passes(self) -> list[Task[Any, Any]]
```

Alias of tasks for backward compatibility.

## `ConditionalController`

```python
class ConditionalController(BaseController[IR, IR])
```

A flow controller runs the pipeline once if the condition is true, or does nothing if the
condition is false.

This controller has the same input and output IR.

### `passes`

```python
def passes(self) -> list[Task[Any, Any]]
```

Alias of tasks for backward compatibility.
