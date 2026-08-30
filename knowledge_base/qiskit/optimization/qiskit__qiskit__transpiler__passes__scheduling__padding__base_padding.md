---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/scheduling/padding/base_padding.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/scheduling/padding/base_padding.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/scheduling/padding/base_padding.py`

Padding pass to fill empty timeslot.

## `BasePadding`

```python
class BasePadding(TransformationPass)
```

The base class of padding pass.

This pass requires one of scheduling passes to be executed before itself.
Since there are multiple scheduling strategies, the selection of scheduling
pass is left in the hands of the pass manager designer.
Once a scheduling analysis pass is run, ``node_start_time`` is generated
in the :attr:`property_set`.  This information is represented by a python dictionary of
the expected instruction execution times keyed on the node instances.
Entries in the dictionary are only created for non-delay nodes.
The padding pass expects all ``DAGOpNode`` in the circuit to be scheduled.

This base class doesn't define any sequence to interleave, but it manages
the location where the sequence is inserted, and provides a set of information necessary
to construct the proper sequence. Thus, a subclass of this pass just needs to implement
:meth:`_pad` method, in which the subclass constructs a circuit block to insert.
This mechanism removes lots of boilerplate logic to manage whole DAG circuits.

Note that padding pass subclasses should define interleaving sequences satisfying:

    - Interleaved sequence does not change start time of other nodes
    - Interleaved sequence should have total duration of the provided ``time_interval``.

Any manipulation violating these constraints may prevent this base pass from correctly
tracking the start time of each instruction,
which may result in violation of hardware alignment constraints.

### `__init__`

```python
def __init__(self, target: Target=None, durations: InstructionDurations=None)
```

BasePadding initializer.

Args:
    target: The :class:`~.Target` representing the target backend.
        If it supplied and it does not support delay instruction on a qubit,
        padding passes do not pad any idle time of the qubit.
    durations: The instruction durations. This is mostly for legacy applications without
        a :class:`.Target`. The ``target`` argument should typically be used instead of
        this and if both are specified ``target`` will supersede this argument.

### `get_duration`

```python
def get_duration(self, node, dag)
```

Get duration of a given node in the circuit.

### `run`

```python
def run(self, dag: DAGCircuit)
```

Run the padding pass on ``dag``.

Args:
    dag: DAG to be checked.

Returns:
    DAGCircuit: DAG with idle time filled with instructions.

Raises:
    TranspilerError: When a particular node is not scheduled, likely some transform pass
        is inserted before this node is called.

### `__delay_supported`

```python
def __delay_supported(self, qarg: int) -> bool
```

Delay operation is supported on the qubit (qarg) or not.
