---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/scheduling/padding/context_aware_dynamical_decoupling.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/scheduling/padding/context_aware_dynamical_decoupling.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/scheduling/padding/context_aware_dynamical_decoupling.py`

Context-aware dynamical decoupling.

## `ContextAwareDynamicalDecoupling`

```python
class ContextAwareDynamicalDecoupling(TransformationPass)
```

Implement an X-sequence dynamical decoupling considering the gate- and qubit-context.

This pass implements a context-aware dynamical decoupling (DD) [1], which ensures that

    (1) simultaneously occurring DD sequences on device-adjacent qubits are mutually orthogonal, and
    (2) DD sequences on spectator qubits of ECR and CX gates are orthogonal to the echo
        pulses on the neighboring target/control qubits.

The mutually orthogonal DD sequences are currently Walsh-Hadamard sequences, consisting of only
X gates. In some cases it might therefore be beneficial to use :class:`.PadDynamicalDecoupling`
with more generic sequences, such as XY4.

This pass performs best if the two-qubit interactions have the same durations on the
device, as it allows to align delay sequences and take into account potential control and target
operations on neighboring qubits. However, it is still valid if this is not the case.

.. note::

    If this pass is run within a pass manager (as in the example below), it will
    automatically run :class:`.PadDelay` to allocate the delays. If instead it is run as
    standalone (not inside a :class:`.PassManager`), the delays must already be inserted.


Example::

    from qiskit.circuit import QuantumCircuit
    from qiskit.circuit.library import QFTGate
    from qiskit.transpiler import PassManager
    from qiskit.transpiler.passes import ALAPScheduleAnalysis, ContextAwareDynamicalDecoupling
    from qiskit.transpiler.preset_passmanagers import generate_preset_pass_manager
    from qiskit_ibm_runtime.fake_provider import FakeSherbrooke

    num_qubits = 10
    circuit = QuantumCircuit(num_qubits)
    circuit.append(QFTGate(num_qubits), circuit.qubits)
    circuit.measure_all()

    target = FakeSherbrooke().target

    pm = generate_preset_pass_manager(optimization_level=2, target=target)
    dd = PassManager([
        ALAPScheduleAnalysis(target=target),
        ContextAwareDynamicalDecoupling(target=target),
    ])

    transpiled = pm.run(circuit)
    with_dd = dd.run(transpiled)

    print(with_dd.draw(idle_wires=False))

References:

    [1] A. Seif et al. (2024). Suppressing Correlated Noise in Quantum Computers via
        Context-Aware Compiling, `arXiv:2403.06852 <https://arxiv.org/abs/2403.06852>`_.

### `__init__`

```python
def __init__(self, target: Target, *, min_duration: int | None=None, skip_reset_qubits: bool=True, skip_dd_threshold: float=1.0, pulse_alignment: int | None=None, coloring_strategy: rx.ColoringStrategy=rx.ColoringStrategy.Saturation) -> None
```

Args:
    target: The :class:`.Target` of the device to run the circuit.
    min_duration: Minimal delay duration (in ``dt``) to insert a DD sequence. This
        can be useful, e.g. if a big delay block would be interrupted and split into
        smaller blocks due to a very short, adjacent delay. If ``None``, this is set
        to be at least twice the difference of the longest/shortest CX or ECR gate.
    skip_reset_qubits: Skip initial delays and delays after a reset.
    skip_dd_threshold: Skip dynamical decoupling on an idle qubit, if the duration of
        the decoupling sequence exceeds this fraction of the idle window. For example, to
        skip a DD sequence if it would take up more than 95% of the idle time, set this
        value to 0.95. A value of 1. means that the DD sequence is applied if it fits into
        the window.
    pulse_alignment: The hardware constraints (in ``dt``) for gate timing allocation.
        If provided, the inserted gates will only be executed on integer multiples of
        this value. This is usually provided on ``backend.configuration().timing_constraints``.
        If ``None``, this is extracted from the ``target``.
    coloring_strategy: The coloring strategy used for ``rx.greedy_graph_color``.
        Defaults to a saturation strategy, which is optimal on bipartite graphs,
        see Section 1.2.2.8 of [2].

References:

    [2] A. Kosowski, and K. Manuszewski, Classical Coloring of Graphs, Graph Colorings,
        2-19, 2004. ISBN 0-8218-3458-4.

### `get_orthogonal_sequence`

```python
def get_orthogonal_sequence(self, order: int) -> tuple[list[float], list[Gate]]
```

Return a DD sequence of given order, where different orders are orthogonal.

## `EventType`

```python
class EventType(Enum)
```

Delay event type, which is either begin or end.

## `DelayEvent`

```python
class DelayEvent
```

Represent a single-qubit delay event, which is either begin or end of a delay instruction.

### `sort_key`

```python
def sort_key(event: DelayEvent) -> tuple(int, int)
```

Sort events, first by time then by type ('end' events come before 'begin' events).

## `DelayOp`

```python
class DelayOp
```

Represent a delay operation.

### `add_window`

```python
def add_window(self, window: tuple[int, int])
```

Add a time window to the delay op.

This means the delay is active during this window and we add a potential breakpoint.

## `MultiDelayOp`

```python
class MultiDelayOp
```

A multi-qubit delay operation.

## `AdjacentDelayBlock`

```python
class AdjacentDelayBlock
```

Group of circuit delays which are collectively adjacent in time and on device.

For example, here the 3 delay operations on q0, q1 and q2 form an adjacent delay block.

    q0: -██████---------  |  qubits q0,q1,q2 have adjacent delay
    q1: ------███████---  |  operations, since the delay operations
    q2: --█████████-----  |  all overlap
    q3: -----------████-  -> this delay starts when delay on q2 ends, so they have no overlap
    q4: ----████--------  -> this clearly has no overlap with something else

### `validate`

```python
def validate(self, log: bool=True) -> None
```

Validate the list of delay events in the adjacent block.

Args:
    log: If ``True`` log invalid blocks on DEBUG level. Otherwise raise an error if the
        block is invalid.

Raises:
    RuntimeError: If the blocks are not ordered by time and event type.

## `WalshHadamardSequence`

```python
class WalshHadamardSequence
```

Get Walsh-Hadamard sequences for DD up to arbitrary order.

### `__init__`

```python
def __init__(self, max_order: int=5)
```

Args:
    max_order: The maximal order for which the sequences are computed.

### `set_max_order`

```python
def set_max_order(self, max_order: int) -> None
```

Set the maximal available order.

### `get_sequence`

```python
def get_sequence(self, order: int) -> list[float]
```

Get the Walsh-Hadamard sequence of given order (starts at 0).
