---
framework: cirq
api_version: v1.7.0
doc_type: error
source_path: cirq-core/cirq/contrib/paulistring/pauli_string_measurement_with_readout_mitigation.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/paulistring/pauli_string_measurement_with_readout_mitigation.py
license: Apache-2.0
---

## Error surface of `cirq-core/cirq/contrib/paulistring/pauli_string_measurement_with_readout_mitigation.py`

### Validation

## `_validate_group_paulis_qwc`

```python
def _validate_group_paulis_qwc(pauli_strs: Sequence[ops.PauliString], all_qubits: list[ops.Qid] | frozenset[ops.Qid])
```

Checks if a group of Pauli strings are Qubit-Wise Commuting.

Args:
    pauli_strings: A list of cirq.PauliString objects.
    all_qubits: A list of all qubits to consider for the QWC check.
                The check is performed for each qubit in this list.

Returns:
    True if the group is QWC, False otherwise.

## `_validate_circuit_to_pauli_strings_parameters`

```python
def _validate_circuit_to_pauli_strings_parameters(circuits_to_pauli: list[CircuitToPauliStringsParameters])
```

Validates the input parameters for measuring Pauli strings.

Args:
    circuits_to_pauli: A list of CircuitToPauliStringsParameters objects.

Raises:
    ValueError: If any of the input parameters are invalid.
    TypeError: If the types of the input parameters are incorrect.

## `_validate_and_normalize_unformatted_input`

```python
def _validate_and_normalize_unformatted_input(circuits_input: Mapping[circuits.FrozenCircuit, Sequence[ops.PauliString] | Sequence[Sequence[ops.PauliString]]] | list[CircuitToPauliStringsParameters]) -> list[CircuitToPauliStringsParameters]
```

Converts any valid input format into a standardized list of parameters
where pauli_strings is always Sequence[Sequence[PauliString]].
