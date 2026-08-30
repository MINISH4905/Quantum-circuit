---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/three_qubit_gates.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/three_qubit_gates.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/three_qubit_gates.py`

Common quantum gates that target three qubits.

## `CCZPowGate`

```python
class CCZPowGate(gate_features.InterchangeableQubitsGate, eigen_gate.EigenGate)
```

A doubly-controlled-Z that can be raised to a power.

The unitary matrix of `CCZ**t` is (empty elements are $0$):

$$
\begin{bmatrix}
    1 & & & & & & & \\
    & 1 & & & & & & \\
    & & 1 & & & & & \\
    & & & 1 & & & & \\
    & & & & 1 & & & \\
    & & & & & 1 & & \\
    & & & & & & 1 & \\
    & & & & & & & e^{i \pi t}
\end{bmatrix}
$$

### `controlled`

```python
def controlled(self, num_controls: int | None=None, control_values: cv.AbstractControlValues | Sequence[int | Collection[int]] | None=None, control_qid_shape: tuple[int, ...] | None=None) -> raw_types.Gate
```

Returns a controlled `ZPowGate` with two additional controls.

The `controlled` method of the `Gate` class, of which this class is a
child, returns a `ControlledGate` with `sub_gate = self`. This method
overrides this behavior to return a `ControlledGate` with
`sub_gate = ZPowGate`.

## `ThreeQubitDiagonalGate`

```python
class ThreeQubitDiagonalGate(raw_types.Gate)
```

A three qubit gate whose unitary is given by a diagonal $8 \times 8$ matrix.

This gate's off-diagonal elements are zero and its on diagonal
elements are all phases.

### `__init__`

```python
def __init__(self, diag_angles_radians: Sequence[value.TParamVal]) -> None
```

A three qubit gate with only diagonal elements.

This gate's off-diagonal elements are zero and its on diagonal
elements are all phases.

Args:
    diag_angles_radians: The list of angles on the diagonal in radians.
        If these values are $(x_0, x_1, \ldots , x_7)$ then the unitary
        has diagonal values $(e^{i x_0}, e^{i x_1}, \ldots, e^{i x_7})$.

## `CCXPowGate`

```python
class CCXPowGate(gate_features.InterchangeableQubitsGate, eigen_gate.EigenGate)
```

A Toffoli (doubly-controlled-NOT) that can be raised to a power.

The unitary matrix of `CCX**t` is an 8x8 identity except the bottom right
2x2 area is the matrix of `X**t`:

$$
\begin{bmatrix}
    1 & & & & & & & \\
    & 1 & & & & & & \\
    & & 1 & & & & & \\
    & & & 1 & & & & \\
    & & & & 1 & & & \\
    & & & & & 1 & & \\
    & & & & & & e^{i \pi t / 2} \cos(\pi t) & -i e^{i \pi t / 2} \sin(\pi t) \\
    & & & & & & -i e^{i \pi t / 2} \sin(\pi t) & e^{i \pi t / 2} \cos(\pi t)
\end{bmatrix}
$$

### `controlled`

```python
def controlled(self, num_controls: int | None=None, control_values: cv.AbstractControlValues | Sequence[int | Collection[int]] | None=None, control_qid_shape: tuple[int, ...] | None=None) -> raw_types.Gate
```

Returns a controlled `XPowGate` with two additional controls.

The `controlled` method of the `Gate` class, of which this class is a
child, returns a `ControlledGate` with `sub_gate = self`. This method
overrides this behavior to return a `ControlledGate` with
`sub_gate = XPowGate`.

## `CCYPowGate`

```python
class CCYPowGate(gate_features.InterchangeableQubitsGate, eigen_gate.EigenGate)
```

A doubly-controlled-Y that can be raised to a power.

The unitary matrix of `CCY**t` is an 8x8 identity except the bottom right
2x2 area is the matrix of `Y**t`:

$$
\begin{bmatrix}
    1 & & & & & & & \\
    & 1 & & & & & & \\
    & & 1 & & & & & \\
    & & & 1 & & & & \\
    & & & & 1 & & & \\
    & & & & & 1 & & \\
    & & & & & & e^{i \pi t / 2} \cos(\pi t / 2) & -e^{i \pi t / 2} \sin(\pi t / 2) \\
    & & & & & & e^{i \pi t / 2} \sin(\pi t / 2) & e^{i \pi t / 2} \cos(\pi t / 2)
\end{bmatrix}
$$

### `controlled`

```python
def controlled(self, num_controls: int | None=None, control_values: cv.AbstractControlValues | Sequence[int | Collection[int]] | None=None, control_qid_shape: tuple[int, ...] | None=None) -> raw_types.Gate
```

Returns a controlled `YPowGate` with two additional controls.

The `controlled` method of the `Gate` class, of which this class is a
child, returns a `ControlledGate` with `sub_gate = self`. This method
overrides this behavior to return a `ControlledGate` with
`sub_gate = YPowGate`.

## `CSwapGate`

```python
class CSwapGate(gate_features.InterchangeableQubitsGate, raw_types.Gate)
```

A controlled swap gate. The Fredkin gate.

### `controlled`

```python
def controlled(self, num_controls: int | None=None, control_values: cv.AbstractControlValues | Sequence[int | Collection[int]] | None=None, control_qid_shape: tuple[int, ...] | None=None) -> raw_types.Gate
```

Returns a controlled `SWAP` with one additional control.

The `controlled` method of the `Gate` class, of which this class is a
child, returns a `ControlledGate` with `sub_gate = self`. This method
overrides this behavior to return a `ControlledGate` with
`sub_gate = SWAP`.
