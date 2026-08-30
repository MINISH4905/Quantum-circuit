---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/global_phase_op.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/global_phase_op.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/global_phase_op.py`

A no-qubit global phase operation.

## `global_phase_operation`

```python
def global_phase_operation(coefficient: cirq.TParamValComplex, atol: float=1e-08) -> cirq.GateOperation
```

Creates an operation that represents a global phase on the state.

## `from_phase_and_exponent`

```python
def from_phase_and_exponent(half_turns: cirq.TParamVal, exponent: cirq.TParamVal) -> cirq.GlobalPhaseGate
```

Creates a GlobalPhaseGate from the global phase and exponent.

Args:
    half_turns: The number of half turns to rotate by.
    exponent: The power to raise the phase to.

Returns: A `GlobalPhaseGate` with the corresponding coefficient.
