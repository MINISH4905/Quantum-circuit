---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/pauli_string_phasor.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/pauli_string_phasor.py
license: Apache-2.0
---

## `PauliStringPhasor`

```python
class PauliStringPhasor(gate_operation.GateOperation)
```

An operation that phases the eigenstates of a Pauli string.

This class takes `PauliString`, which is a sequence of non-identity
Pauli operators, potentially with a $\pm 1$ valued coefficient,
acting on qubits.

The -1 eigenstates of the Pauli string will have their amplitude multiplied
by e^(i pi exponent_neg) while +1 eigenstates of the Pauli string will have
their amplitude multiplied by e^(i pi exponent_pos).

The class also takes a list of qubits, which can be a superset of those
acted on by the provided `PauliString`.  Those extra qubits are assumed to be
acted upon via identity.

### `__init__`

```python
def __init__(self, pauli_string: ps.PauliString, qubits: Sequence[cirq.Qid] | None=None, *, exponent_neg: cirq.TParamVal=1, exponent_pos: cirq.TParamVal=0) -> None
```

Initializes the operation.

Args:
    pauli_string: The PauliString defining the positive and negative
        eigenspaces that will be independently phased.
    qubits: The qubits upon which the PauliStringPhasor acts. This
        must be a superset of the qubits of `pauli_string`.
        If None, it will use the qubits from `pauli_string`
        The `pauli_string` contains only the non-identity component
        of the phasor, while the qubits supplied here and not in
        `pauli_string` are acted upon by identity. The order of
        these qubits must match the order in `pauli_string`.
    exponent_neg: How much to phase vectors in the negative eigenspace,
        in the form of the t in ``(-1)**t = exp(i*pi*t)``.
    exponent_pos: How much to phase vectors in the positive eigenspace,
        in the form of the t in ``(-1)**t = exp(i*pi*t)``.

Raises:
    ValueError: If coefficient is not 1 or -1 or the qubits of
        `pauli_string` are not a subset of `qubits`.

### `gate`

```python
def gate(self) -> cirq.PauliStringPhasorGate
```

The gate applied by the operation.

### `exponent_neg`

```python
def exponent_neg(self) -> cirq.TParamVal
```

The negative exponent.

### `exponent_pos`

```python
def exponent_pos(self) -> cirq.TParamVal
```

The positive exponent.

### `pauli_string`

```python
def pauli_string(self) -> cirq.PauliString
```

The underlying pauli string.

### `exponent_relative`

```python
def exponent_relative(self) -> cirq.TParamVal
```

The relative exponent between negative and positive exponents.

### `equal_up_to_global_phase`

```python
def equal_up_to_global_phase(self, other: PauliStringPhasor) -> bool
```

Checks equality of two PauliStringPhasors, up to global phase.

### `map_qubits`

```python
def map_qubits(self, qubit_map: dict[raw_types.Qid, raw_types.Qid]) -> PauliStringPhasor
```

Maps the qubits inside the PauliStringPhasor.

Args:
    qubit_map: A map from the qubits in the phasor to new qubits.

Returns:
    A new PauliStringPhasor with remapped qubits.

Raises:
    ValueError: If the map does not contain an entry for all
        the qubits in the phasor.

### `can_merge_with`

```python
def can_merge_with(self, op: PauliStringPhasor) -> bool
```

Checks whether the underlying PauliStrings can be merged.

### `merged_with`

```python
def merged_with(self, op: PauliStringPhasor) -> PauliStringPhasor
```

Merges two PauliStringPhasors.

### `conjugated_by`

```python
def conjugated_by(self, clifford: cirq.OP_TREE) -> PauliStringPhasor
```

Returns the Pauli string conjugated by a clifford operation.

The PauliStringPhasor $P$ conjugated by the Clifford operation $C$ is
  $C^\dagger P C$.

### `pass_operations_over`

```python
def pass_operations_over(self, ops: Iterable[raw_types.Operation], after_to_before: bool=False) -> PauliStringPhasor
```

Determines how the Pauli phasor changes when conjugated by Cliffords.

The output and input pauli phasors are related by a circuit equivalence.
In particular, this circuit:

    ───ops───INPUT_PAULI_PHASOR───

will be equivalent to this circuit:

    ───OUTPUT_PAULI_PHASOR───ops───

up to global phase (assuming `after_to_before` is not set).

If ops together have matrix C, the Pauli string has matrix P, and the
output Pauli string has matrix P', then P' == C^-1 P C up to
global phase.

Setting `after_to_before` inverts the relationship, so that the output
is the input and the input is the output. Equivalently, it inverts C.

Args:
    ops: The operations to move over the string.
    after_to_before: Determines whether the operations start after the
        pauli string, instead of before (and so are moving in the
        opposite direction).

## `PauliStringPhasorGate`

```python
class PauliStringPhasorGate(raw_types.Gate)
```

A gate that phases the eigenstates of a Pauli string.

The -1 eigenstates of the Pauli string will have their amplitude multiplied
by e^(i pi exponent_neg) while +1 eigenstates of the Pauli string will have
their amplitude multiplied by e^(i pi exponent_pos).

### `__init__`

```python
def __init__(self, dense_pauli_string: dps.DensePauliString, *, exponent_neg: cirq.TParamVal=1, exponent_pos: cirq.TParamVal=0) -> None
```

Initializes the PauliStringPhasorGate.

Args:
    dense_pauli_string: The DensePauliString defining the positive and
        negative eigenspaces that will be independently phased.
    exponent_neg: How much to phase vectors in the negative eigenspace,
        in the form of the t in (-1)**t = exp(i pi t).
    exponent_pos: How much to phase vectors in the positive eigenspace,
        in the form of the t in (-1)**t = exp(i pi t).

Raises:
    ValueError: If coefficient is not 1 or -1.

### `exponent_relative`

```python
def exponent_relative(self) -> cirq.TParamVal
```

The relative exponent between negative and positive exponents.

### `exponent_neg`

```python
def exponent_neg(self) -> cirq.TParamVal
```

The negative exponent.

### `exponent_pos`

```python
def exponent_pos(self) -> cirq.TParamVal
```

The positive exponent.

### `dense_pauli_string`

```python
def dense_pauli_string(self) -> cirq.DensePauliString
```

The underlying DensePauliString.

### `equal_up_to_global_phase`

```python
def equal_up_to_global_phase(self, other: cirq.PauliStringPhasorGate) -> bool
```

Checks equality of two PauliStringPhasors, up to global phase.

### `num_qubits`

```python
def num_qubits(self) -> int
```

The number of qubits for the gate.

### `on`

```python
def on(self, *qubits: cirq.Qid) -> cirq.PauliStringPhasor
```

Creates a PauliStringPhasor on the qubits.

## `xor_nonlocal_decompose`

```python
def xor_nonlocal_decompose(qubits: Iterable[raw_types.Qid], onto_qubit: cirq.Qid) -> Iterable[raw_types.Operation]
```

Decomposition ignores connectivity.
