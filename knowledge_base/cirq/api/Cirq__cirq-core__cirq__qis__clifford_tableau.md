---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/qis/clifford_tableau.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/qis/clifford_tableau.py
license: Apache-2.0
---

## `StabilizerState`

```python
class StabilizerState(quantum_state_representation.QuantumStateRepresentation, metaclass=abc.ABCMeta)
```

Interface for quantum stabilizer state representations.

This interface is used for CliffordTableau and StabilizerChForm quantum
state representations, allowing simulators to act on them abstractly.

### `apply_x`

```python
def apply_x(self, axis: int, exponent: float=1, global_shift: float=0) -> None
```

Apply an X operation to the state.

Args:
    axis: The axis to which the operation should be applied.
    exponent: The exponent of the X operation, must be a half-integer.
    global_shift: The global phase shift of the raw operation, prior to
        exponentiation. Typically the value in `gate.global_shift`.
Raises:
    ValueError: If the exponent is not half-integer.

### `apply_y`

```python
def apply_y(self, axis: int, exponent: float=1, global_shift: float=0) -> None
```

Apply an Y operation to the state.

Args:
    axis: The axis to which the operation should be applied.
    exponent: The exponent of the Y operation, must be a half-integer.
    global_shift: The global phase shift of the raw operation, prior to
        exponentiation. Typically the value in `gate.global_shift`.
Raises:
    ValueError: If the exponent is not half-integer.

### `apply_z`

```python
def apply_z(self, axis: int, exponent: float=1, global_shift: float=0) -> None
```

Apply a Z operation to the state.

Args:
    axis: The axis to which the operation should be applied.
    exponent: The exponent of the Z operation, must be a half-integer.
    global_shift: The global phase shift of the raw operation, prior to
        exponentiation. Typically the value in `gate.global_shift`.
Raises:
    ValueError: If the exponent is not half-integer.

### `apply_h`

```python
def apply_h(self, axis: int, exponent: float=1, global_shift: float=0) -> None
```

Apply an H operation to the state.

Args:
    axis: The axis to which the operation should be applied.
    exponent: The exponent of the H operation, must be an integer.
    global_shift: The global phase shift of the raw operation, prior to
        exponentiation. Typically the value in `gate.global_shift`.
Raises:
    ValueError: If the exponent is not an integer.

### `apply_cz`

```python
def apply_cz(self, control_axis: int, target_axis: int, exponent: float=1, global_shift: float=0) -> None
```

Apply a CZ operation to the state.

Args:
    control_axis: The control axis of the operation.
    target_axis: The axis to which the operation should be applied.
    exponent: The exponent of the CZ operation, must be an integer.
    global_shift: The global phase shift of the raw operation, prior to
        exponentiation. Typically the value in `gate.global_shift`.
Raises:
    ValueError: If the exponent is not an integer.

### `apply_cx`

```python
def apply_cx(self, control_axis: int, target_axis: int, exponent: float=1, global_shift: float=0) -> None
```

Apply a CX operation to the state.

Args:
    control_axis: The control axis of the operation.
    target_axis: The axis to which the operation should be applied.
    exponent: The exponent of the CX operation, must be an integer.
    global_shift: The global phase shift of the raw operation, prior to
        exponentiation. Typically the value in `gate.global_shift`.
Raises:
    ValueError: If the exponent is not an integer.

### `apply_global_phase`

```python
def apply_global_phase(self, coefficient: linear_dict.Scalar) -> None
```

Apply a global phase to the state.

Args:
    coefficient: The global phase to apply.

## `CliffordTableau`

```python
class CliffordTableau(StabilizerState)
```

Tableau representation of a stabilizer state

References:
    - [Aaronson and Gottesman](https://arxiv.org/abs/quant-ph/0406196)

The tableau stores the stabilizer generators of
the state using three binary arrays: xs, zs, and rs.

Each row of the arrays represents a Pauli string, P, that is
an eigenoperator of the state vector with eigenvalue one: P|psi> = |psi>.

### `__init__`

```python
def __init__(self, num_qubits, initial_state: int=0, rs: np.ndarray | None=None, xs: np.ndarray | None=None, zs: np.ndarray | None=None)
```

Initializes CliffordTableau
Args:
    num_qubits: The number of qubits in the system.
    initial_state: The computational basis representation of the
        state as a big endian int.

### `matrix`

```python
def matrix(self) -> np.ndarray
```

Returns the 2n * 2n matrix representation of the Clifford tableau.

### `then`

```python
def then(self, second: CliffordTableau) -> CliffordTableau
```

Returns a composed CliffordTableau of this tableau and the second tableau.

Then composed tableau is equal to (up to global phase) the composed
unitary operation of the two tableaux, i.e. equivalent to applying the unitary
operation of this CliffordTableau then applying the second one.

Args:
    second: The second CliffordTableau to compose with.

Returns:
    The composed CliffordTableau.

Raises:
    TypeError: If the type of second is not CliffordTableau.
    ValueError: If the number of qubits in the second tableau mismatch with
        this tableau.

### `inverse`

```python
def inverse(self) -> CliffordTableau
```

Returns the inverse Clifford tableau of this tableau.

### `stabilizers`

```python
def stabilizers(self) -> list[cirq.DensePauliString]
```

Returns the stabilizer generators of the state. These
are n operators {S_1,S_2,...,S_n} such that S_i |psi> = |psi>

### `destabilizers`

```python
def destabilizers(self) -> list[cirq.DensePauliString]
```

Returns the destabilizer generators of the state. These
are n operators {S_1,S_2,...,S_n} such that along with the stabilizer
generators above generate the full Pauli group on n qubits.
