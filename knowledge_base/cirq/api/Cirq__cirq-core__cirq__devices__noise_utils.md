---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/devices/noise_utils.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/devices/noise_utils.py
license: Apache-2.0
---

## `OpIdentifier`

```python
class OpIdentifier
```

Identifies an operation by gate and (optionally) target qubits.

### `is_proper_subtype_of`

```python
def is_proper_subtype_of(self, op_id: OpIdentifier) -> bool
```

Returns true if this is contained within op_id, but not equal to it.

If this returns true, (x in self) implies (x in op_id), but the reverse
implication does not hold. op_id must be more general than self (either
by accepting any qubits or having a more general gate type) for this
to return true.

## `decay_constant_to_xeb_fidelity`

```python
def decay_constant_to_xeb_fidelity(decay_constant: float, num_qubits: int=2) -> float
```

Calculates the XEB fidelity from the depolarization decay constant.

Args:
    decay_constant: Depolarization decay constant.
    num_qubits: Number of qubits.

Returns:
    Calculated XEB fidelity.

## `decay_constant_to_pauli_error`

```python
def decay_constant_to_pauli_error(decay_constant: float, num_qubits: int=1) -> float
```

Calculates pauli error from the depolarization decay constant.

Args:
    decay_constant: Depolarization decay constant.
    num_qubits: Number of qubits.

Returns:
    Calculated Pauli error.

## `pauli_error_to_decay_constant`

```python
def pauli_error_to_decay_constant(pauli_error: float, num_qubits: int=1) -> float
```

Calculates depolarization decay constant from pauli error.

Args:
    pauli_error: The pauli error.
    num_qubits: Number of qubits.

Returns:
    Calculated depolarization decay constant.

## `xeb_fidelity_to_decay_constant`

```python
def xeb_fidelity_to_decay_constant(xeb_fidelity: float, num_qubits: int=2) -> float
```

Calculates the depolarization decay constant from XEB fidelity.

Args:
    xeb_fidelity: The XEB fidelity.
    num_qubits: Number of qubits.

Returns:
    Calculated depolarization decay constant.

## `pauli_error_from_t1`

```python
def pauli_error_from_t1(t_ns: float, t1_ns: float) -> float
```

Calculates the pauli error from T1 decay constant.

This computes error for a specific duration, `t`.

Args:
    t_ns: The duration of the gate in ns.
    t1_ns: The T1 decay constant in ns.

Returns:
    Calculated Pauli error resulting from T1 decay.

## `average_error`

```python
def average_error(decay_constant: float, num_qubits: int=1) -> float
```

Calculates the average error from the depolarization decay constant.

Args:
    decay_constant: Depolarization decay constant.
    num_qubits: Number of qubits.

Returns:
    Calculated average error.

## `decoherence_pauli_error`

```python
def decoherence_pauli_error(t1_ns: float, tphi_ns: float, gate_time_ns: float) -> float
```

The component of Pauli error caused by decoherence on a single qubit.

Args:
    t1_ns: T1 time in nanoseconds.
    tphi_ns: Tphi time in nanoseconds.
    gate_time_ns: Duration in nanoseconds of the gate affected by this error.

Returns:
    Calculated Pauli error resulting from decoherence.
