---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/common_gates.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/common_gates.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/common_gates.py`

Quantum gates that are commonly used in the literature.

This module creates Gate instances for the following gates:
    X,Y,Z: Pauli gates.
    H,S: Clifford gates.
    T: A non-Clifford gate.
    CZ: Controlled phase gate.
    CNOT: Controlled not gate.

Each of these are implemented as EigenGates, which means that they can be
raised to a power (i.e. cirq.H**0.5). See the definition in EigenGate.

## `XPowGate`

```python
class XPowGate(eigen_gate.EigenGate)
```

A gate that rotates around the X axis of the Bloch sphere.

The unitary matrix of `cirq.XPowGate(exponent=t, global_shift=s)` is:
$$
e^{i \pi t (s + 1/2)}
\begin{bmatrix}
  \cos(\pi t /2) & -i \sin(\pi t /2) \\
  -i \sin(\pi t /2) & \cos(\pi t /2)
\end{bmatrix}
$$

Note in particular that this gate has a global phase factor of
$e^{i \pi t / 2}$ vs the traditionally defined rotation matrices
about the Pauli X axis. See `cirq.Rx` for rotations without the global
phase. The global phase factor can be adjusted by using the `global_shift`
parameter when initializing.

`cirq.X`, the Pauli X gate, is an instance of this gate at `exponent=1`.

### `__init__`

```python
def __init__(self, *, exponent: value.TParamVal=1.0, global_shift: float=0.0, dimension: int=2)
```

Initialize an XPowGate.

Args:
    exponent: The t in gate**t. Determines how much the eigenvalues of
        the gate are phased by. For example, eigenvectors phased by -1
        when `gate**1` is applied will gain a relative phase of
        e^{i pi exponent} when `gate**exponent` is applied (relative to
        eigenvectors unaffected by `gate**1`).
    global_shift: Offsets the eigenvalues of the gate at exponent=1.
        In effect, this controls a global phase factor on the gate's
        unitary matrix. The factor for global_shift=s is:

            exp(i * pi * s * t)

        For example, `cirq.X**t` uses a `global_shift` of 0 but
        `cirq.rx(t)` uses a `global_shift` of -0.5, which is why
        `cirq.unitary(cirq.rx(pi))` equals -iX instead of X.
    dimension: Qudit dimension of this gate. For qu*b*its (the default),
        this is set to 2.

Raises:
    ValueError: If the supplied exponent is a complex number with an
        imaginary component.

### `in_su2`

```python
def in_su2(self) -> Rx
```

Returns an equal-up-global-phase gate from the group SU2.

### `with_canonical_global_phase`

```python
def with_canonical_global_phase(self) -> XPowGate
```

Returns an equal-up-global-phase standardized form of the gate.

### `controlled`

```python
def controlled(self, num_controls: int | None=None, control_values: cv.AbstractControlValues | Sequence[int | Collection[int]] | None=None, control_qid_shape: tuple[int, ...] | None=None) -> raw_types.Gate
```

Returns a controlled `XPowGate`, using a `CXPowGate` where possible.

The `controlled` method of the `Gate` class, of which this class is a
child, returns a `ControlledGate`. This method overrides this behavior
to return a `CXPowGate` or a `ControlledGate` of a `CXPowGate`, when
this is possible.

The conditions for the override to occur are:

* The `global_shift` of the `XPowGate` is 0.
* The `control_values` and `control_qid_shape` are compatible with
    the `CXPowGate`:
    * The last value of `control_qid_shape` is a qubit.
    * The last value of `control_values` corresponds to the
        control being satisfied if that last qubit is 1 and
        not satisfied if the last qubit is 0.

If these conditions are met, then the returned object is a `CXPowGate`
or, in the case that there is more than one controlled qudit, a
`ControlledGate` with the `Gate` being a `CXPowGate`. In the
latter case the `ControlledGate` is controlled by one less qudit
than specified in `control_values` and `control_qid_shape` (since
one of these, the last qubit, is used as the control for the
`CXPowGate`).

If the above conditions are not met, a `ControlledGate` of this
gate will be returned.

Args:
    num_controls: Total number of control qubits.
    control_values: Which control computational basis state to apply the
        sub gate.  A sequence of length `num_controls` where each
        entry is an integer (or set of integers) corresponding to the
        computational basis state (or set of possible values) where that
        control is enabled.  When all controls are enabled, the sub gate is
        applied.  If unspecified, control values default to 1.
    control_qid_shape: The qid shape of the controls.  A tuple of the
        expected dimension of each control qid.  Defaults to
        `(2,) * num_controls`.  Specify this argument when using qudits.

Returns:
    A `cirq.ControlledGate` (or `cirq.CXPowGate` if possible) representing
        `self` controlled by the given control values and qubits.

## `Rx`

```python
class Rx(XPowGate)
```

A gate with matrix $e^{-i X t/2}$ that rotates around the X axis of the Bloch sphere by $t$.

The unitary matrix of `cirq.Rx(rads=t)` is:
$$
e^{-i X t /2} =
    \begin{bmatrix}
        \cos(t/2) & -i \sin(t/2) \\
        -i \sin(t/2) & \cos(t/2)
    \end{bmatrix}
$$

This gate corresponds to the traditionally defined rotation matrices about the Pauli X axis.

### `__init__`

```python
def __init__(self, *, rads: value.TParamVal)
```

Initialize an Rx (`cirq.XPowGate`).

Args:
    rads: Radians to rotate about the X axis of the Bloch sphere.

## `YPowGate`

```python
class YPowGate(eigen_gate.EigenGate)
```

A gate that rotates around the Y axis of the Bloch sphere.

The unitary matrix of `cirq.YPowGate(exponent=t)` is:
$$
    \begin{bmatrix}
        e^{i \pi t /2} \cos(\pi t /2) & - e^{i \pi t /2} \sin(\pi t /2) \\
        e^{i \pi t /2} \sin(\pi t /2) & e^{i \pi t /2} \cos(\pi t /2)
    \end{bmatrix}
$$

Note in particular that this gate has a global phase factor of
$e^{i \pi t / 2}$ vs the traditionally defined rotation matrices
about the Pauli Y axis. See `cirq.Ry` for rotations without the global
phase. The global phase factor can be adjusted by using the `global_shift`
parameter when initializing.

`cirq.Y`, the Pauli Y gate, is an instance of this gate at `exponent=1`.

Unlike `cirq.XPowGate` and `cirq.ZPowGate`, this gate has no generalization
to qudits and hence does not take the dimension argument. Ignoring the
global phase all generalized Pauli operators on a d-level system may be
written as ``X**a Z**b`` for a,b=0,1,...,d-1. For a qubit, there is only one
"mixed" operator: XZ, conventionally denoted -iY. However, when d > 2 there
are (d-1)*(d-1) > 1 such "mixed" operators (still ignoring the global phase).
Due to this ambiguity, qudit Y gate is not well defined. The "mixed" operators
for qudits are generally not referred to by name, but instead are specified in
terms of X and Z.

### `controlled`

```python
def controlled(self, num_controls: int | None=None, control_values: cv.AbstractControlValues | Sequence[int | Collection[int]] | None=None, control_qid_shape: tuple[int, ...] | None=None) -> raw_types.Gate
```

Returns a controlled `YPowGate`, using a `CYPowGate` where possible.

The `controlled` method of the `Gate` class, of which this class is a
child, returns a `ControlledGate`. This method overrides this behavior
to return a `CYPowGate` or a `ControlledGate` of a `CYPowGate`, when
this is possible.

The conditions for the override to occur are:

* The `global_shift` of the `YPowGate` is 0.
* The `control_values` and `control_qid_shape` are compatible with
    the `CYPowGate`:
    * The last value of `control_qid_shape` is a qubit.
    * The last value of `control_values` corresponds to the
        control being satisfied if that last qubit is 1 and
        not satisfied if the last qubit is 0.

If these conditions are met, then the returned object is a `CYPowGate`
or, in the case that there is more than one controlled qudit, a
`ControlledGate` with the `Gate` being a `CYPowGate`. In the
latter case the `ControlledGate` is controlled by one less qudit
than specified in `control_values` and `control_qid_shape` (since
one of these, the last qubit, is used as the control for the
`CYPowGate`).

If the above conditions are not met, a `ControlledGate` of this
gate will be returned.

Args:
    num_controls: Total number of control qubits.
    control_values: Which control computational basis state to apply the
        sub gate.  A sequence of length `num_controls` where each
        entry is an integer (or set of integers) corresponding to the
        computational basis state (or set of possible values) where that
        control is enabled.  When all controls are enabled, the sub gate is
        applied.  If unspecified, control values default to 1.
    control_qid_shape: The qid shape of the controls.  A tuple of the
        expected dimension of each control qid.  Defaults to
        `(2,) * num_controls`.  Specify this argument when using qudits.

Returns:
    A `cirq.ControlledGate` (or `cirq.CYPowGate` if possible) representing
        `self` controlled by the given control values and qubits.

### `in_su2`

```python
def in_su2(self) -> Ry
```

Returns an equal-up-global-phase gate from the group SU2.

### `with_canonical_global_phase`

```python
def with_canonical_global_phase(self) -> YPowGate
```

Returns an equal-up-global-phase standardized form of the gate.

## `Ry`

```python
class Ry(YPowGate)
```

A gate with matrix $e^{-i Y t/2}$ that rotates around the Y axis of the Bloch sphere by $t$.

The unitary matrix of `cirq.Ry(rads=t)` is:
$$
e^{-i Y t / 2} =
    \begin{bmatrix}
        \cos(t/2) & -\sin(t/2) \\
        \sin(t/2) & \cos(t/2)
    \end{bmatrix}
$$

This gate corresponds to the traditionally defined rotation matrices about the Pauli Y axis.

### `__init__`

```python
def __init__(self, *, rads: value.TParamVal)
```

Initialize an Ry (`cirq.YPowGate`).

Args:
    rads: Radians to rotate about the Y axis of the Bloch sphere.

## `ZPowGate`

```python
class ZPowGate(eigen_gate.EigenGate)
```

A gate that rotates around the Z axis of the Bloch sphere.

The unitary matrix of `cirq.ZPowGate(exponent=t, global_shift=s)` is:
$$
    e^{i \pi s t}
    \begin{bmatrix}
        1 & 0 \\
        0 & e^{i \pi t}
    \end{bmatrix}
$$

Note in particular that this gate has a global phase factor of
$e^{i\pi t/2}$ vs the traditionally defined rotation matrices
about the Pauli Z axis. See `cirq.Rz` for rotations without the global
phase. The global phase factor can be adjusted by using the `global_shift`
parameter when initializing.

`cirq.Z`, the Pauli Z gate, is an instance of this gate at `exponent=1`.

### `__init__`

```python
def __init__(self, *, exponent: value.TParamVal=1.0, global_shift: float=0.0, dimension: int=2)
```

Initialize a ZPowGate.

Args:
    exponent: The t in gate**t. Determines how much the eigenvalues of
        the gate are phased by. For example, eigenvectors phased by -1
        when `gate**1` is applied will gain a relative phase of
        e^{i pi exponent} when `gate**exponent` is applied (relative to
        eigenvectors unaffected by `gate**1`).
    global_shift: Offsets the eigenvalues of the gate at exponent=1.
        In effect, this controls a global phase factor on the gate's
        unitary matrix. The factor for global_shift=s is:

            exp(i * pi * s * t)

        For example, `cirq.X**t` uses a `global_shift` of 0 but
        `cirq.rx(t)` uses a `global_shift` of -0.5, which is why
        `cirq.unitary(cirq.rx(pi))` equals -iX instead of X.
    dimension: Qudit dimension of this gate. For qu*b*its (the default),
        this is set to 2.

Raises:
    ValueError: If the supplied exponent is a complex number with an
        imaginary component.

### `in_su2`

```python
def in_su2(self) -> Rz
```

Returns an equal-up-global-phase gate from the group SU2.

### `with_canonical_global_phase`

```python
def with_canonical_global_phase(self) -> ZPowGate
```

Returns an equal-up-global-phase standardized form of the gate.

### `controlled`

```python
def controlled(self, num_controls: int | None=None, control_values: cv.AbstractControlValues | Sequence[int | Collection[int]] | None=None, control_qid_shape: tuple[int, ...] | None=None) -> raw_types.Gate
```

Returns a controlled `ZPowGate`, using a `CZPowGate` where possible.

The `controlled` method of the `Gate` class, of which this class is a
child, returns a `ControlledGate`. This method overrides this behavior
to return a `CZPowGate` or a `ControlledGate` of a `CZPowGate`, when
this is possible.

The conditions for the override to occur are:

* The `global_shift` of the `ZPowGate` is 0.
* The `control_values` and `control_qid_shape` are compatible with
    the `CZPowGate`:
    * The last value of `control_qid_shape` is a qubit.
    * The last value of `control_values` corresponds to the
        control being satisfied if that last qubit is 1 and
        not satisfied if the last qubit is 0.

If these conditions are met, then the returned object is a `CZPowGate`
or, in the case that there is more than one controlled qudit, a
`ControlledGate` with the `Gate` being a `CZPowGate`. In the
latter case the `ControlledGate` is controlled by one less qudit
than specified in `control_values` and `control_qid_shape` (since
one of these, the last qubit, is used as the control for the
`CZPowGate`).

If the above conditions are not met, a `ControlledGate` of this
gate will be returned.

Args:
    num_controls: Total number of control qubits.
    control_values: Which control computational basis state to apply the
        sub gate.  A sequence of length `num_controls` where each
        entry is an integer (or set of integers) corresponding to the
        computational basis state (or set of possible values) where that
        control is enabled.  When all controls are enabled, the sub gate is
        applied.  If unspecified, control values default to 1.
    control_qid_shape: The qid shape of the controls.  A tuple of the
        expected dimension of each control qid.  Defaults to
        `(2,) * num_controls`.  Specify this argument when using qudits.

Returns:
    A `cirq.ControlledGate` (or `cirq.CZPowGate` if possible) representing
        `self` controlled by the given control values and qubits.

## `Rz`

```python
class Rz(ZPowGate)
```

A gate with matrix $e^{-i Z t/2}$ that rotates around the Z axis of the Bloch sphere by $t$.

The unitary matrix of `cirq.Rz(rads=t)` is:
$$
e^{-i Z t /2} =
    \begin{bmatrix}
        e^{-it/2} & 0 \\
        0 & e^{it/2}
    \end{bmatrix}
$$

This gate corresponds to the traditionally defined rotation matrices about the Pauli Z axis.

### `__init__`

```python
def __init__(self, *, rads: value.TParamVal)
```

Initialize an Rz (`cirq.ZPowGate`).

Args:
    rads: Radians to rotate about the Z axis of the Bloch sphere.

## `HPowGate`

```python
class HPowGate(eigen_gate.EigenGate)
```

A Gate that performs a rotation around the X+Z axis of the Bloch sphere.

The unitary matrix of `cirq.HPowGate(exponent=t)` is:
$$
    \begin{bmatrix}
        e^{i\pi t/2} \left(\cos(\pi t/2) - i \frac{\sin (\pi t /2)}{\sqrt{2}}\right)
            && -i e^{i\pi t/2} \frac{\sin(\pi t /2)}{\sqrt{2}} \\
        -i e^{i\pi t/2} \frac{\sin(\pi t /2)}{\sqrt{2}}
            && e^{i\pi t/2} \left(\cos(\pi t/2) + i \frac{\sin (\pi t /2)}{\sqrt{2}}\right)
    \end{bmatrix}
$$
Note in particular that for $t=1$, this gives the Hadamard matrix
$$
    \begin{bmatrix}
        \frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\
        \frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}}
    \end{bmatrix}
$$

`cirq.H`, the Hadamard gate, is an instance of this gate at `exponent=1`.

## `CZPowGate`

```python
class CZPowGate(gate_features.InterchangeableQubitsGate, eigen_gate.EigenGate)
```

A gate that applies a phase to the |11⟩ state of two qubits.

The unitary matrix of `CZPowGate(exponent=t)` is:

$$
\begin{bmatrix}
    1 & 0 & 0 & 0 \\
    0 & 1 & 0 & 0 \\
    0 & 0 & 1 & 0 \\
    0 & 0 & 0 & e^{i \pi t} \\
\end{bmatrix}
$$

`cirq.CZ`, the controlled Z gate, is an instance of this gate at
`exponent=1`.

### `controlled`

```python
def controlled(self, num_controls: int | None=None, control_values: cv.AbstractControlValues | Sequence[int | Collection[int]] | None=None, control_qid_shape: tuple[int, ...] | None=None) -> raw_types.Gate
```

Returns a controlled `CZPowGate`, using a `CCZPowGate` where possible.

The `controlled` method of the `Gate` class, of which this class is a
child, returns a `ControlledGate`. This method overrides this behavior
to return a `CCZPowGate` or a `ControlledGate` of a `CCZPowGate`, when
this is possible.

The conditions for the override to occur are:

* The `global_shift` of the `CZPowGate` is 0.
* The `control_values` and `control_qid_shape` are compatible with
    the `CCZPowGate`:
    * The last value of `control_qid_shape` is a qubit.
    * The last value of `control_values` corresponds to the
        control being satisfied if that last qubit is 1 and
        not satisfied if the last qubit is 0.

If these conditions are met, then the returned object is a `CCZPowGate`
or, in the case that there is more than one controlled qudit, a
`ControlledGate` with the `Gate` being a `CCZPowGate`. In the
latter case the `ControlledGate` is controlled by one less qudit
than specified in `control_values` and `control_qid_shape` (since
one of these, the last qubit, is used as the control for the
`CCZPowGate`).

If the above conditions are not met, a `ControlledGate` of this
gate will be returned.

Args:
    num_controls: Total number of control qubits.
    control_values: Which control computational basis state to apply the
        sub gate.  A sequence of length `num_controls` where each
        entry is an integer (or set of integers) corresponding to the
        computational basis state (or set of possible values) where that
        control is enabled.  When all controls are enabled, the sub gate is
        applied.  If unspecified, control values default to 1.
    control_qid_shape: The qid shape of the controls.  A tuple of the
        expected dimension of each control qid.  Defaults to
        `(2,) * num_controls`.  Specify this argument when using qudits.

Returns:
    A `cirq.ControlledGate` (or `cirq.CCZPowGate` if possible) representing
        `self` controlled by the given control values and qubits.

## `CXPowGate`

```python
class CXPowGate(eigen_gate.EigenGate)
```

A gate that applies a controlled power of an X gate.

Use positional arguments when applying CNOT (controlled-not) to qubits, for
instance, CNOT(q1, q2), where q2 is toggled when q1 is on.

The unitary matrix of `cirq.CXPowGate(exponent=t)` is:

$$
\begin{bmatrix}
    1 & 0 & 0 & 0 \\
    0 & 1 & 0 & 0 \\
    0 & 0 & g c & -i g s \\
    0 & 0 & -i g s & g c
\end{bmatrix}
$$

where:

$$
c = \cos\left(\frac{\pi t}{2}\right)
$$
$$
s = \sin\left(\frac{\pi t}{2}\right)
$$
$$
g = e^{\frac{i \pi t}{2}}
$$

`cirq.CNOT`, the controlled NOT gate, is an instance of this gate at
`exponent=1`.

### `controlled`

```python
def controlled(self, num_controls: int | None=None, control_values: cv.AbstractControlValues | Sequence[int | Collection[int]] | None=None, control_qid_shape: tuple[int, ...] | None=None) -> raw_types.Gate
```

Returns a controlled `CXPowGate`, using a `CCXPowGate` where possible.

The `controlled` method of the `Gate` class, of which this class is a
child, returns a `ControlledGate`. This method overrides this behavior
to return a `CCXPowGate` or a `ControlledGate` of a `CCXPowGate`, when
this is possible.

The conditions for the override to occur are:

* The `global_shift` of the `CXPowGate` is 0.
* The `control_values` and `control_qid_shape` are compatible with
    the `CCXPowGate`:
    * The last value of `control_qid_shape` is a qubit.
    * The last value of `control_values` corresponds to the
        control being satisfied if that last qubit is 1 and
        not satisfied if the last qubit is 0.

If these conditions are met, then the returned object is a `CCXPowGate`
or, in the case that there is more than one controlled qudit, a
`ControlledGate` with the `Gate` being a `CCXPowGate`. In the
latter case the `ControlledGate` is controlled by one less qudit
than specified in `control_values` and `control_qid_shape` (since
one of these, the last qubit, is used as the control for the
`CCXPowGate`).

If the above conditions are not met, a `ControlledGate` of this
gate will be returned.

Args:
    num_controls: Total number of control qubits.
    control_values: Which control computational basis state to apply the
        sub gate.  A sequence of length `num_controls` where each
        entry is an integer (or set of integers) corresponding to the
        computational basis state (or set of possible values) where that
        control is enabled.  When all controls are enabled, the sub gate is
        applied.  If unspecified, control values default to 1.
    control_qid_shape: The qid shape of the controls.  A tuple of the
        expected dimension of each control qid.  Defaults to
        `(2,) * num_controls`.  Specify this argument when using qudits.

Returns:
    A `cirq.ControlledGate` (or `cirq.CCXPowGate` if possible) representing
        `self` controlled by the given control values and qubits.

## `CYPowGate`

```python
class CYPowGate(eigen_gate.EigenGate)
```

A gate that applies a controlled power of a Y gate.

Use positional arguments when applying CY (controlled-Y) to qubits, for
instance, CY(q1, q2), where q2 is toggled when q1 is on.

The unitary matrix of `cirq.CYPowGate(exponent=t)` is:

$$
\begin{bmatrix}
    1 & 0 & 0 & 0 \\
    0 & 1 & 0 & 0 \\
    0 & 0 & g c & -g s \\
    0 & 0 & g s & g c
\end{bmatrix}
$$

where:

$$
c = \cos\left(\frac{\pi t}{2}\right)
$$
$$
s = \sin\left(\frac{\pi t}{2}\right)
$$
$$
g = e^{\frac{i \pi t}{2}}
$$

`cirq.CY`, the controlled Y gate, is an instance of this gate at
`exponent=1`.

### `controlled`

```python
def controlled(self, num_controls: int | None=None, control_values: cv.AbstractControlValues | Sequence[int | Collection[int]] | None=None, control_qid_shape: tuple[int, ...] | None=None) -> raw_types.Gate
```

Returns a controlled `CYPowGate`, using a `CCYPowGate` where possible.

The `controlled` method of the `Gate` class, of which this class is a
child, returns a `ControlledGate`. This method overrides this behavior
to return a `CCYPowGate` or a `ControlledGate` of a `CCYPowGate`, when
this is possible.

The conditions for the override to occur are:

* The `global_shift` of the `CYPowGate` is 0.
* The `control_values` and `control_qid_shape` are compatible with
    the `CCYPowGate`:
    * The last value of `control_qid_shape` is a qubit.
    * The last value of `control_values` corresponds to the
        control being satisfied if that last qubit is 1 and
        not satisfied if the last qubit is 0.

If these conditions are met, then the returned object is a `CCYPowGate`
or, in the case that there is more than one controlled qudit, a
`ControlledGate` with the `Gate` being a `CCYPowGate`. In the
latter case the `ControlledGate` is controlled by one less qudit
than specified in `control_values` and `control_qid_shape` (since
one of these, the last qubit, is used as the control for the
`CCYPowGate`).

If the above conditions are not met, a `ControlledGate` of this
gate will be returned.

Args:
    num_controls: Total number of control qubits.
    control_values: Which control computational basis state to apply the
        sub gate.  A sequence of length `num_controls` where each
        entry is an integer (or set of integers) corresponding to the
        computational basis state (or set of possible values) where that
        control is enabled.  When all controls are enabled, the sub gate is
        applied.  If unspecified, control values default to 1.
    control_qid_shape: The qid shape of the controls.  A tuple of the
        expected dimension of each control qid.  Defaults to
        `(2,) * num_controls`.  Specify this argument when using qudits.

Returns:
    A `cirq.ControlledGate` (or `cirq.CCYPowGate` if possible) representing
        `self` controlled by the given control values and qubits.

## `rx`

```python
def rx(rads: value.TParamVal) -> Rx
```

Returns a gate with the matrix $e^{-i X t / 2}$ where $t=rads$.

## `ry`

```python
def ry(rads: value.TParamVal) -> Ry
```

Returns a gate with the matrix $e^{-i Y t / 2}$ where $t=rads$.

## `rz`

```python
def rz(rads: value.TParamVal) -> Rz
```

Returns a gate with the matrix $e^{-i Z t / 2}$ where $t=rads$.

## `cphase`

```python
def cphase(rads: value.TParamVal) -> CZPowGate
```

Returns a cphase gate with phase of `rad` radians.

Returns a gate with the unitary matrix:

$$
\begin{bmatrix}
    1 & 0 & 0 & 0 \\
    0 & 1 & 0 & 0 \\
    0 & 0 & 1 & 0 \\
    0 & 0 & 0 & e^{i rads} \\
\end{bmatrix}
$$
