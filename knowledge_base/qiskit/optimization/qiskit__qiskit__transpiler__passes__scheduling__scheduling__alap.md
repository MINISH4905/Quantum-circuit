---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/scheduling/scheduling/alap.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/scheduling/scheduling/alap.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/scheduling/scheduling/alap.py`

ALAP Scheduling.

## `ALAPScheduleAnalysis`

```python
class ALAPScheduleAnalysis(BaseScheduler)
```

ALAP Scheduling pass, which schedules the **stop** time of instructions as late as possible.

See the :ref:`transpiler-scheduling-description` section in the :mod:`qiskit.transpiler`
module documentation for a more detailed explanation.

### `run`

```python
def run(self, dag)
```

Run the ALAPSchedule pass on `dag`.

Args:
    dag (DAGCircuit): DAG to schedule.

Returns:
    DAGCircuit: A scheduled DAG.

Raises:
    TranspilerError: if the circuit is not mapped on physical qubits.
    TranspilerError: if conditional bit is added to non-supported instruction.
