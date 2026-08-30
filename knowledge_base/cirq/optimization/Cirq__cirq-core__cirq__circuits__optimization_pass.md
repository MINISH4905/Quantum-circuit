---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/circuits/optimization_pass.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/circuits/optimization_pass.py
license: Apache-2.0
---

## Module `cirq-core/cirq/circuits/optimization_pass.py`

Defines the OptimizationPass type.

## `PointOptimizationSummary`

```python
class PointOptimizationSummary
```

A description of a local optimization to perform.

### `__init__`

```python
def __init__(self, clear_span: int, clear_qubits: Iterable[cirq.Qid], new_operations: cirq.OP_TREE, preserve_moments: bool=False) -> None
```

Inits PointOptimizationSummary.

Args:
    clear_span: Defines the range of moments to affect. Specifically,
        refers to the indices in range(start, start+clear_span) where
        start is an index known from surrounding context.
    clear_qubits: Defines the set of qubits that should be cleared
        with each affected moment.
    new_operations: The operations to replace the cleared out
        operations with.
    preserve_moments: If set, `cirq.Moment` instances within
        `new_operations` will be preserved exactly. Normally the
        operations would be repacked to fit better into the
        target space, which may move them between moments.
        Please be advised that a PointOptimizer consuming this
        summary will flatten operations no matter what,
        see https://github.com/quantumlib/Cirq/issues/2406.

## `PointOptimizer`

```python
class PointOptimizer
```

Makes circuit improvements focused on a specific location.

### `__init__`

```python
def __init__(self, post_clean_up: Callable[[Sequence[cirq.Operation]], cirq.OP_TREE]=lambda op_list: op_list) -> None
```

Inits PointOptimizer.

Args:
    post_clean_up: This function is called on each set of optimized
        operations before they are put into the circuit to replace the
        old operations.

### `optimization_at`

```python
def optimization_at(self, circuit: cirq.Circuit, index: int, op: cirq.Operation) -> cirq.PointOptimizationSummary | None
```

Describes how to change operations near the given location.

For example, this method could realize that the given operation is an
X gate and that in the very next moment there is a Z gate. It would
indicate that they should be combined into a Y gate by returning
PointOptimizationSummary(clear_span=2,
                         clear_qubits=op.qubits,
                         new_operations=cirq.Y(op.qubits[0]))

Args:
    circuit: The circuit to improve.
    index: The index of the moment with the operation to focus on.
    op: The operation to focus improvements upon.

Returns:
    A description of the optimization to perform, or else None if no
    change should be made.
