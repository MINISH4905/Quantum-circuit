---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/common_gate_families.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/common_gate_families.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/common_gate_families.py`

Common Gate Families used in cirq-core

## `AnyUnitaryGateFamily`

```python
class AnyUnitaryGateFamily(gateset.GateFamily)
```

GateFamily which accepts any N-Qubit unitary gate.

### `__init__`

```python
def __init__(self, num_qubits: int | None=None) -> None
```

Init AnyUnitaryGateFamily

Args:
    num_qubits: The GateFamily will accept any unitary gate acting on `num_qubits`.
                If left `None`, the GateFamily will accept every unitary gate.
Raises:
    ValueError: If `num_qubits` <= 0.

## `AnyIntegerPowerGateFamily`

```python
class AnyIntegerPowerGateFamily(gateset.GateFamily)
```

GateFamily which accepts instances of a given `cirq.EigenGate`, raised to integer power.

### `__init__`

```python
def __init__(self, gate: type[eigen_gate.EigenGate]) -> None
```

Init AnyIntegerPowerGateFamily

Args:
    gate: A subclass of `cirq.EigenGate` s.t. an instance `g` of `gate` will be
        accepted if `g.exponent` is an integer.

Raises:
    ValueError: If `gate` is not a subclass of `cirq.EigenGate`.

## `ParallelGateFamily`

```python
class ParallelGateFamily(gateset.GateFamily)
```

GateFamily which accepts instances of `cirq.ParallelGate` and its sub_gate.

ParallelGateFamily is useful for description and validation of scenarios where multiple
copies of a unitary gate can act in parallel. `cirq.ParallelGate` is used to express
such a gate with a corresponding unitary `sub_gate` that acts in parallel.

ParallelGateFamily supports initialization via:

*    Gate Instances that can be applied in parallel.
*    Gate Types whose instances can be applied in parallel.

In both the cases, the users can specify an additional parameter `max_parallel_allowed` which
is used to verify the maximum number of qubits on which any given gate instance can act on.

To verify containment of a given `cirq.Gate` instance `g`, the gate family verfies that:

*    `cirq.num_qubits(g)` <= `max_parallel_allowed` if `max_parallel_allowed` is not None.
*    `g` or `g.sub_gate` (if `g` is an instance of `cirq.ParallelGate`) is an accepted gate
        based on type or instance checks depending on the initialization gate type.

### `__init__`

```python
def __init__(self, gate: type[raw_types.Gate] | raw_types.Gate, *, name: str | None=None, description: str | None=None, max_parallel_allowed: int | None=None) -> None
```

Inits ParallelGateFamily

Args:
    gate: The gate which can act in parallel. It can be a python `type` inheriting from
        `cirq.Gate` or a non-parameterized instance of a `cirq.Gate`. If an instance of
        `cirq.ParallelGate` is passed, then the corresponding `gate.sub_gate` is used.
    name: The name of the gate family.
    description: Human readable description of the gate family.
    max_parallel_allowed: The maximum number of qubits on which a given gate `g`
    can act on. If None, then any number of qubits are allowed.
