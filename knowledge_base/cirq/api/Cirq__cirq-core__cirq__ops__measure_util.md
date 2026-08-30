---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/measure_util.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/measure_util.py
license: Apache-2.0
---

## `measure_single_paulistring`

```python
def measure_single_paulistring(pauli_observable: pauli_string.PauliString, key: str | cirq.MeasurementKey | None=None) -> raw_types.Operation
```

Returns a single PauliMeasurementGate which measures the pauli observable

Args:
    pauli_observable: The `cirq.PauliString` observable to measure.
    key: Optional `str` or `cirq.MeasurementKey` that gate should use.
        If none provided, it defaults to a comma-separated list of
        `str(qubit)` for each of the target qubits.

Returns:
    An operation measuring the pauli observable.

Raises:
    ValueError: if the observable is not an instance of PauliString or if the coefficient
        is not +1 or -1.

## `measure_paulistring_terms`

```python
def measure_paulistring_terms(pauli_basis: pauli_string.PauliString, key_func: Callable[[raw_types.Qid], str]=str) -> list[raw_types.Operation]
```

Returns a list of operations individually measuring qubits in the pauli basis.

Args:
    pauli_basis: The `cirq.PauliString` basis in which each qubit should
        be measured.
    key_func: Determines the key of the measurements of each qubit. Takes
        the qubit and returns the key for that qubit. Defaults to str.

Returns:
    A list of operations individually measuring the given qubits in the
    specified pauli basis.

Raises:
    ValueError: if `pauli_basis` is not an instance of `cirq.PauliString`.

## `measure`

```python
def measure(*target, key: str | cirq.MeasurementKey | None=None, invert_mask: tuple[bool, ...]=(), confusion_map: dict[tuple[int, ...], np.ndarray] | None=None) -> gate_operation.GateOperation
```

Returns a single MeasurementGate applied to all the given qubits.

The qubits are measured in the computational basis. This can also be
used with the alias `cirq.M`.

Args:
    *target: The qubits that the measurement gate should measure.
        These can be specified as separate function arguments or
        with a single argument for an iterable of qubits.
    key: Optional `str` or `cirq.MeasurementKey` that gate should use.
        If none provided, it defaults to a comma-separated list of
        `str(qubit)` for each of the target qubits.
    invert_mask: A list of Truthy or Falsey values indicating whether
        the corresponding qubits should be flipped. None indicates no
        inverting should be done.
    confusion_map: A map of qubit index sets (using indices in
        `target`) to the 2D confusion matrix for those qubits. Indices
        not included use the identity. Applied before invert_mask if both
        are provided.

Returns:
    An operation targeting the given qubits with a measurement.

Raises:
    ValueError: If the qubits are not instances of Qid.

## `measure_each`

```python
def measure_each(*qubits, key_func: Callable[[raw_types.Qid], str]=str) -> list[raw_types.Operation]
```

Returns a list of operations individually measuring the given qubits.

The qubits are measured in the computational basis.

Args:
    *qubits: The qubits to measure.  These can be passed as separate
        function arguments or as a one-argument iterable of qubits.
    key_func: Determines the key of the measurements of each qubit. Takes
        the qubit and returns the key for that qubit. Defaults to str.

Returns:
    A list of operations individually measuring the given qubits.
