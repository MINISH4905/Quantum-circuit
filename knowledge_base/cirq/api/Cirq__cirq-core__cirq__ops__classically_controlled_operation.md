---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/classically_controlled_operation.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/classically_controlled_operation.py
license: Apache-2.0
---

## `ClassicallyControlledOperation`

```python
class ClassicallyControlledOperation(raw_types.Operation)
```

Augments existing operations to be conditionally executed.

An operation that is classically controlled is executed iff all conditions
evaluate to True. Currently the only condition type is a measurement key.
A measurement key evaluates to True iff any qubit in the corresponding
measurement operation evaluated to a non-zero value.

This object is typically created via
 `operation.with_classical_controls(*conditions)`.

Examples:

>>> import cirq
>>> a, b, c = cirq.LineQubit.range(3)
>>> circuit1 = cirq.Circuit(
...     cirq.measure(a, key='control_key'),
...     cirq.X(b).with_classical_controls('control_key'))
>>> print(circuit1)
0: ─────────────M───────
                ║
1: ─────────────╫───X───
                ║   ║
control_key: ═══@═══^═══
>>> circuit2 = cirq.Circuit([
...     cirq.measure(a, key='control_key1'),
...     cirq.measure(b, key='control_key2'),
...     cirq.X(c).with_classical_controls('control_key1', 'control_key2')])
>>> print(circuit2)
                 ┌──┐
0: ───────────────M─────────
                  ║
1: ───────────────╫M────────
                  ║║
2: ───────────────╫╫────X───
                  ║║    ║
control_key1: ════@╬════^═══
                   ║    ║
control_key2: ═════@════^═══
                 └──┘

### `__init__`

```python
def __init__(self, sub_operation: cirq.Operation, conditions: Sequence[str | cirq.MeasurementKey | cirq.Condition | sympy.Basic])
```

Initializes a `ClassicallyControlledOperation`.

Multiple consecutive `ClassicallyControlledOperation` layers are
squashed when possible, so one should not depend on a specific number
of layers.

Args:
    sub_operation: The operation to gate with a classical control
        condition.
    conditions: A sequence of measurement keys, or strings that can be
        parsed into measurement keys.

Raises:
    ValueError: If an unsupported gate is being classically
        controlled.
