---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/gate_features.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/gate_features.py
license: Apache-2.0
---

## Module `cirq-core/cirq/testing/gate_features.py`

Simple gates used for testing purposes.

## `SingleQubitGate`

```python
class SingleQubitGate(raw_types.Gate)
```

A gate that must be applied to exactly one qubit.

## `TwoQubitGate`

```python
class TwoQubitGate(raw_types.Gate)
```

A gate that must be applied to exactly two qubits.

## `ThreeQubitGate`

```python
class ThreeQubitGate(raw_types.Gate)
```

A gate that must be applied to exactly three qubits.

## `DoesNotSupportSerializationGate`

```python
class DoesNotSupportSerializationGate(raw_types.Gate)
```

A gate that can't be serialized.
