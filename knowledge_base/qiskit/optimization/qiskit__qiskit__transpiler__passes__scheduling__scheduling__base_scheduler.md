---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/scheduling/scheduling/base_scheduler.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/scheduling/scheduling/base_scheduler.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/scheduling/scheduling/base_scheduler.py`

Base circuit scheduling pass.

## `BaseScheduler`

```python
class BaseScheduler(AnalysisPass)
```

Base scheduler pass.

### `__init__`

```python
def __init__(self, durations: InstructionDurations=None, target: Target=None)
```

Scheduler initializer.

Args:
    durations: Durations of instructions to be used in scheduling
    target: The :class:`~.Target` representing the target backend, if both
          ``durations`` and this are specified then this argument will take
          precedence and ``durations`` will be ignored.
