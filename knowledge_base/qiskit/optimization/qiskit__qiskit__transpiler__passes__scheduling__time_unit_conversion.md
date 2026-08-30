---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/scheduling/time_unit_conversion.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/scheduling/time_unit_conversion.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/scheduling/time_unit_conversion.py`

Unify time unit in circuit for scheduling and following passes.

## `TimeUnitConversion`

```python
class TimeUnitConversion(TransformationPass)
```

Choose a time unit to be used in the following time-aware passes,
and make all circuit time units consistent with that.

This pass will add a :attr:`.Instruction.duration` metadata to each op whose duration is known
which will be used by subsequent scheduling passes for scheduling.

If ``dt`` (in seconds) is known to transpiler, the unit ``'dt'`` is chosen. Otherwise,
the unit to be selected depends on what units are used in delays and instruction durations:

* ``'s'``: if they are all in SI units.
* ``'dt'``: if they are all in the unit ``'dt'``.
* raise error: if they are a mix of SI units and ``'dt'``.

### `__init__`

```python
def __init__(self, inst_durations: InstructionDurations=None, target: Target=None)
```

TimeUnitAnalysis initializer.

Args:
    inst_durations (InstructionDurations): A dictionary of durations of instructions.
    target: The :class:`~.Target` representing the target backend, if both
          ``inst_durations`` and ``target`` are specified then this argument will take
          precedence and ``inst_durations`` will be ignored.

### `run`

```python
def run(self, dag: DAGCircuit)
```

Run the TimeUnitAnalysis pass on `dag`.

Args:
    dag (DAGCircuit): DAG to be checked.

Returns:
    DAGCircuit: DAG with consistent timing and op nodes annotated with duration.

Raises:
    TranspilerError: if the units are not unifiable
