---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/scheduling/alignments/reschedule.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/scheduling/alignments/reschedule.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/scheduling/alignments/reschedule.py`

Rescheduler pass to adjust node start times.

## `ConstrainedReschedule`

```python
class ConstrainedReschedule(AnalysisPass)
```

Rescheduler pass that updates node start times to conform to the hardware alignments.

This pass shifts DAG node start times previously scheduled with one of
the scheduling passes, e.g. :class:`ASAPScheduleAnalysis` or :class:`ALAPScheduleAnalysis`,
so that every instruction start time satisfies alignment constraints.

Examples:

    We assume executing the following circuit on a backend with 16 dt of acquire alignment.

    .. code-block:: text

             ┌───┐┌────────────────┐┌─┐
        q_0: ┤ X ├┤ Delay(100[dt]) ├┤M├
             └───┘└────────────────┘└╥┘
        c: 1/════════════════════════╩═
                                     0

    Note that delay of 100 dt induces a misalignment of 4 dt at the measurement.
    This pass appends an extra 12 dt time shift to the input circuit.

    .. code-block:: text

             ┌───┐┌────────────────┐┌─┐
        q_0: ┤ X ├┤ Delay(112[dt]) ├┤M├
             └───┘└────────────────┘└╥┘
        c: 1/════════════════════════╩═
                                     0

Notes:

    Your backend may execute circuits violating these alignment constraints.
    However, you may obtain erroneous measurement result because of the
    untracked phase originating in the instruction misalignment.

### `__init__`

```python
def __init__(self, acquire_alignment: int=1, pulse_alignment: int=1, target: Target=None)
```

Create new rescheduler pass.

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

Run rescheduler.

This pass should perform rescheduling to satisfy:

    - All DAGOpNode nodes (except for compiler directives) are placed at start time
      satisfying hardware alignment constraints.
    - The end time of a node does not overlap with the start time of successor nodes.

Assumptions:

    - Topological order and absolute time order of DAGOpNode are consistent.
    - All bits in either qargs or cargs associated with node synchronously start.
    - Start time of qargs and cargs may different due to I/O latency.

Based on the configurations above, the rescheduler pass takes the following strategy:

1. The nodes are processed in the topological order, from the beginning of
    the circuit (i.e. from left to right). For every node (including compiler
    directives), the function ``_push_node_back`` performs steps 2 and 3.
2. If the start time of the node violates the alignment constraint,
    the start time is increased to satisfy the constraint.
3. Each immediate successor whose start_time overlaps the node's end_time is
    pushed backwards (towards the end of the wire). Note that at this point
    the shifted successor does not need to satisfy the constraints, but this
    will be taken care of when that successor node itself is processed.
4. After every node is processed, all misalignment constraints will be resolved,
    and there will be no overlap between the nodes.

Args:
    dag: DAG circuit to be rescheduled with constraints.

Raises:
    TranspilerError: If circuit is not scheduled.
