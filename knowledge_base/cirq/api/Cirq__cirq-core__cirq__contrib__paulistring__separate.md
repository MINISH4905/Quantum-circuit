---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/paulistring/separate.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/paulistring/separate.py
license: Apache-2.0
---

## `convert_and_separate_circuit`

```python
def convert_and_separate_circuit(circuit: circuits.Circuit, leave_cliffords: bool=True, atol: float=1e-08) -> tuple[circuits.Circuit, circuits.Circuit]
```

Converts a circuit into two, one made of PauliStringPhasor and the other Clifford gates.

Args:
    circuit: Any Circuit that cirq.google.optimized_for_xmon() supports.
        All gates should either provide a decomposition or have a known one
        or two qubit unitary matrix.
    leave_cliffords: If set, single qubit rotations in the Clifford group
            are not converted to SingleQubitCliffordGates.
    atol: The absolute tolerance for the conversion.

Returns:
    (circuit_left, circuit_right)

    circuit_left contains only PauliStringPhasor operations.

    circuit_right is a Clifford circuit which contains only
    SingleQubitCliffordGate and PauliInteractionGate gates.
    It also contains MeasurementGates if the
    given circuit contains measurements.

## `regular_half`

```python
def regular_half(circuit: circuits.Circuit) -> circuits.Circuit
```

Return only the Clifford part of a circuit.  See
convert_and_separate_circuit().

Args:
    circuit: A Circuit with the gate set {SingleQubitCliffordGate,
        PauliInteractionGate, PauliStringPhasor}.

Returns:
    A Circuit with SingleQubitCliffordGate and PauliInteractionGate gates.
    It also contains MeasurementGates if the given
    circuit contains measurements.

## `pauli_string_half`

```python
def pauli_string_half(circuit: circuits.Circuit) -> circuits.Circuit
```

Return only the non-Clifford part of a circuit.  See
convert_and_separate_circuit().

Args:
    circuit: A Circuit with the gate set {SingleQubitCliffordGate,
        PauliInteractionGate, PauliStringPhasor}.

Returns:
    A Circuit with only PauliStringPhasor operations.
