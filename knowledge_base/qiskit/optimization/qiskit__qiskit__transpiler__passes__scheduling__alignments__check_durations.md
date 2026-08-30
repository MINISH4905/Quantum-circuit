---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/scheduling/alignments/check_durations.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/scheduling/alignments/check_durations.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/scheduling/alignments/check_durations.py`

A pass to check if input circuit requires reschedule.

## `InstructionDurationCheck`

```python
class InstructionDurationCheck(AnalysisPass)
```

Duration validation pass for reschedule.

This pass investigates the input quantum circuit and checks if the circuit requires
rescheduling for execution. Note that this pass can be triggered without scheduling.
This pass only checks the duration of delay instructions,
which report duration values without pre-scheduling.

This pass assumes backend supported instructions, i.e. basis gates, have no violation
of the hardware alignment constraints, which is true in general.

### `__init__`

```python
def __init__(self, acquire_alignment: int=1, pulse_alignment: int=1, target: Target=None)
```

Create new duration validation pass.

The alignment values depend on the control electronics of your quantum processor.

Args:
    acquire_alignment: Integer number representing the minimum time resolution to
        trigger acquisition instruction in units of ``dt``.
    pulse_alignment: Integer number representing the minimum time resolution to
        trigger gate instruction in units of ``dt``.
    target: The :class:`~.Target` representing the target backend, if
        ``target`` is specified then this argument will take
        precedence and ``acquire_alignment`` and ``pulse_alignment`` will be ignored.

### `run`

```python
def run(self, dag: DAGCircuit)
```

Run duration validation passes.

Args:
    dag: DAG circuit to check instruction durations.
