---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/consistent_controlled_gate_op.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/consistent_controlled_gate_op.py
license: Apache-2.0
---

## `assert_controlled_and_controlled_by_identical`

```python
def assert_controlled_and_controlled_by_identical(gate: ops.Gate, *, num_controls: Sequence[int]=(2, 1, 3, 10), control_values: Sequence[Sequence[int | Collection[int]] | None] | None=None) -> None
```

Checks that gate.on().controlled_by() == gate.controlled().on()

## `assert_controlled_unitary_consistent`

```python
def assert_controlled_unitary_consistent(gate: ops.Gate) -> None
```

Checks that unitary of ControlledGate(gate) is consistent with gate.controlled().
