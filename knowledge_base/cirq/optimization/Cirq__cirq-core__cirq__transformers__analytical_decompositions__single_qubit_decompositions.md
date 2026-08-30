---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/analytical_decompositions/single_qubit_decompositions.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/analytical_decompositions/single_qubit_decompositions.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/analytical_decompositions/single_qubit_decompositions.py`

Utility methods related to optimizing quantum circuits.

## `is_negligible_turn`

```python
def is_negligible_turn(turns: float, tolerance: float) -> bool
```

Returns True is the number of turns in a gate is close to zero.

## `single_qubit_matrix_to_pauli_rotations`

```python
def single_qubit_matrix_to_pauli_rotations(mat: np.ndarray, atol: float=0) -> list[tuple[ops.Pauli, float]]
```

Implements a single-qubit operation with few rotations.

Args:
    mat: The 2x2 unitary matrix of the operation to implement.
    atol: A limit on the amount of absolute error introduced by the
        construction.

Returns:
    A list of (Pauli, half_turns) tuples that, when applied in order,
    perform the desired operation.

## `single_qubit_matrix_to_gates`

```python
def single_qubit_matrix_to_gates(mat: np.ndarray, tolerance: float=0) -> list[ops.Gate]
```

Implements a single-qubit operation with few gates.

Args:
    mat: The 2x2 unitary matrix of the operation to implement.
    tolerance: A limit on the amount of error introduced by the
        construction.

Returns:
    A list of gates that, when applied in order, perform the desired
        operation.

## `single_qubit_op_to_framed_phase_form`

```python
def single_qubit_op_to_framed_phase_form(mat: np.ndarray) -> tuple[np.ndarray, complex, complex]
```

Decomposes a 2x2 unitary M into U^-1 * diag(1, r) * U * diag(g, g).

U translates the rotation axis of M to the Z axis.
g fixes a global phase factor difference caused by the translation.
r's phase is the amount of rotation around M's rotation axis.

This decomposition can be used to decompose controlled single-qubit
rotations into controlled-Z operations bordered by single-qubit operations.

Args:
  mat:  The qubit operation as a 2x2 unitary matrix.

Returns:
    A 2x2 unitary U, the complex relative phase factor r, and the complex
    global phase factor g. Applying M is equivalent (up to global phase) to
    applying U, rotating around the Z axis to apply r, then un-applying U.
    When M is controlled, the control must be rotated around the Z axis to
    apply g.

## `single_qubit_matrix_to_phased_x_z`

```python
def single_qubit_matrix_to_phased_x_z(mat: np.ndarray, atol: float=0) -> list[ops.Gate]
```

Implements a single-qubit operation with a PhasedX and Z gate.

If one of the gates isn't needed, it will be omitted.

Args:
    mat: The 2x2 unitary matrix of the operation to implement.
    atol: A limit on the amount of error introduced by the
        construction.

Returns:
    A list of gates that, when applied in order, perform the desired
        operation.

## `single_qubit_matrix_to_phxz`

```python
def single_qubit_matrix_to_phxz(mat: np.ndarray, atol: float=0) -> ops.PhasedXZGate | None
```

Implements a single-qubit operation with a PhasedXZ gate.

Under the hood, this uses deconstruct_single_qubit_matrix_into_angles which
converts the given matrix to a series of three rotations around the Z, Y, Z
axes. This is then converted to a phased X rotation followed by a Z, in the
form of a single PhasedXZ gate.

Args:
    mat: The 2x2 unitary matrix of the operation to implement.
    atol: A limit on the amount of error introduced by the
        construction.

Returns:
    A PhasedXZ gate that implements the given matrix, or None if it is
    close to identity (trace distance <= atol).
