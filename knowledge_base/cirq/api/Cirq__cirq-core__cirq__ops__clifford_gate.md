---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/clifford_gate.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/clifford_gate.py
license: Apache-2.0
---

## `CommonCliffordGateMetaClass`

```python
class CommonCliffordGateMetaClass(value.ABCMetaImplementAnyOneOf)
```

A metaclass used to lazy initialize several common Clifford Gate as class attributes.

### `all_single_qubit_cliffords`

```python
def all_single_qubit_cliffords(cls) -> Sequence[cirq.SingleQubitCliffordGate]
```

All 24 single-qubit Clifford gates.

## `CliffordGate`

```python
class CliffordGate(raw_types.Gate, CommonCliffordGates)
```

Clifford rotation for N-qubit.

## `SingleQubitCliffordGate`

```python
class SingleQubitCliffordGate(CliffordGate)
```

Any single qubit Clifford rotation.

### `from_xz_map`

```python
def from_xz_map(x_to: tuple[Pauli, bool], z_to: tuple[Pauli, bool]) -> SingleQubitCliffordGate
```

Returns a SingleQubitCliffordGate for the specified transforms.
The Y transform is derived from the X and Z.

Args:
    x_to: Which Pauli to transform X to and if it should negate.
    z_to: Which Pauli to transform Z to and if it should negate.

### `from_single_map`

```python
def from_single_map(pauli_map_to: dict[Pauli, tuple[Pauli, bool]] | None=None, *, x_to: tuple[Pauli, bool] | None=None, y_to: tuple[Pauli, bool] | None=None, z_to: tuple[Pauli, bool] | None=None) -> SingleQubitCliffordGate
```

Returns a SingleQubitCliffordGate for the
specified transform with a 90 or 180 degree rotation.

The arguments are exclusive, only one may be specified.

Args:
    pauli_map_to: A dictionary with a single key value pair describing
        the transform.
    x_to: The transform from cirq.X
    y_to: The transform from cirq.Y
    z_to: The transform from cirq.Z

### `from_double_map`

```python
def from_double_map(pauli_map_to: dict[Pauli, tuple[Pauli, bool]] | None=None, *, x_to: tuple[Pauli, bool] | None=None, y_to: tuple[Pauli, bool] | None=None, z_to: tuple[Pauli, bool] | None=None) -> SingleQubitCliffordGate
```

Returns a SingleQubitCliffordGate for the
specified transform with a 90 or 180 degree rotation.

Either pauli_map_to or two of (x_to, y_to, z_to) may be specified.

Args:
    pauli_map_to: A dictionary with two key value pairs describing
        two transforms.
    x_to: The transform from cirq.X
    y_to: The transform from cirq.Y
    z_to: The transform from cirq.Z

### `from_unitary`

```python
def from_unitary(u: np.ndarray) -> SingleQubitCliffordGate | None
```

Creates Clifford gate with given unitary (up to global phase).

Args:
    u: 2x2 unitary matrix of a Clifford gate.

Returns:
    SingleQubitCliffordGate, whose matrix is equal to given matrix (up
    to global phase), or `None` if `u` is not a matrix of a single-qubit
    Clifford gate.

### `from_unitary_with_global_phase`

```python
def from_unitary_with_global_phase(cls, u: np.ndarray) -> tuple[SingleQubitCliffordGate, complex] | None
```

Creates Clifford gate with given unitary, including global phase.

Args:
    u: 2x2 unitary matrix of a Clifford gate.

Returns:
    A tuple of a SingleQubitCliffordGate and a global phase, such that
    the gate unitary (as given by `cirq.unitary`) times the global phase
    is identical to the given unitary `u`; or `None` if `u` is not the
    matrix of a single-qubit Clifford gate.

### `pauli_tuple`

```python
def pauli_tuple(self, pauli: Pauli) -> tuple[Pauli, bool]
```

Returns a tuple of a Pauli operator and a boolean.

The pauli is the operator of the transform and the boolean
determines whether the operator should be flipped.  For instance,
it is True if the coefficient is -1, and False if the coefficient
is 1.

### `to_phased_xz_gate`

```python
def to_phased_xz_gate(self) -> phased_x_z_gate.PhasedXZGate
```

Convert this gate to a PhasedXZGate instance.

The rotation can be categorized by {axis} * {degree}:
    * Identity: I
    * {x, y, z} * {90, 180, 270}  --- {X, Y, Z} + 6 Quarter turn gates
    * {+/-xy, +/-yz, +/-zx} * 180  --- 6 Hadamard-like gates
    * {middle point of xyz in 4 Quadrant} * {120, 240} --- swapping axis
note 1 + 9 + 6 + 8 = 24 in total.

To associate with Clifford Tableau, it can also be grouped by 4:
    * {I,X,Y,Z} is [[1 0], [0, 1]]
    * {+/- X_sqrt, 2 Hadamard-like gates acting on the YZ plane} is [[1, 0], [1, 1]]
    * {+/- Z_sqrt, 2 Hadamard-like gates acting on the XY plane} is [[1, 1], [0, 1]]
    * {+/- Y_sqrt, 2 Hadamard-like gates acting on the XZ plane} is [[0, 1], [1, 0]]
    * {middle point of xyz in 4 Quadrant} * 120 is [[0, 1], [1, 1]]
    * {middle point of xyz in 4 Quadrant} * 240 is [[1, 1], [1, 0]]

### `commutes_with_single_qubit_gate`

```python
def commutes_with_single_qubit_gate(self, gate: SingleQubitCliffordGate) -> bool
```

Tests if the two circuits would be equivalent up to global phase:
--self--gate-- and --gate--self--

### `merged_with`

```python
def merged_with(self, second: SingleQubitCliffordGate) -> SingleQubitCliffordGate
```

Returns a SingleQubitCliffordGate such that the circuits
    --output-- and --self--second--
are equivalent up to global phase.

### `decompose_gate`

```python
def decompose_gate(self) -> Sequence[cirq.Gate]
```

Decomposes this clifford into a series of H and pauli rotation gates.

Returns:
    A sequence of H and pauli rotation gates which are equivalent to this
    clifford gate if applied in order. This decomposition agrees with
    cirq.unitary(self), including global phase.

### `decompose_rotation`

```python
def decompose_rotation(self) -> Sequence[tuple[Pauli, int]]
```

Decomposes this clifford into a series of pauli rotations.

Each rotation is given as a tuple of (axis, quarter_turns),
where axis is a Pauli giving the axis to rotate about. The
result will be a sequence of zero, one, or two rotations.

Note that the combined unitary effect of these rotations may
differ from cirq.unitary(self) by a global phase.

### `equivalent_gate_before`

```python
def equivalent_gate_before(self, after: SingleQubitCliffordGate) -> SingleQubitCliffordGate
```

Returns a SingleQubitCliffordGate such that the circuits
    --output--self-- and --self--gate--
are equivalent up to global phase.
