---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/arithmetic/piecewise_linear_pauli_rotations.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/arithmetic/piecewise_linear_pauli_rotations.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/arithmetic/piecewise_linear_pauli_rotations.py`

Piecewise-linearly-controlled rotation.

## `PiecewiseLinearPauliRotations`

```python
class PiecewiseLinearPauliRotations(FunctionalPauliRotations)
```

Piecewise-linearly-controlled Pauli rotations.

For a piecewise linear (not necessarily continuous) function :math:`f(x)`, which is defined
through breakpoints, slopes and offsets as follows.
Suppose the breakpoints :math:`(x_0, ..., x_J)` are a subset of :math:`[0, 2^n-1]`, where
:math:`n` is the number of state qubits. Further on, denote the corresponding slopes and
offsets by :math:`a_j` and :math:`b_j` respectively.
Then f(x) is defined as:

.. math::

    f(x) = \begin{cases}
        0, x < x_0 \\
        a_j (x - x_j) + b_j, x_j \leq x < x_{j+1}
        \end{cases}

where we implicitly assume :math:`x_{J+1} = 2^n`.

### `__init__`

```python
def __init__(self, num_state_qubits: int | None=None, breakpoints: list[int] | None=None, slopes: list[float] | np.ndarray | None=None, offsets: list[float] | np.ndarray | None=None, basis: str='Y', name: str='pw_lin') -> None
```

Args:
    num_state_qubits: The number of qubits representing the state.
    breakpoints: The breakpoints to define the piecewise-linear function.
        Defaults to ``[0]``.
    slopes: The slopes for different segments of the piecewise-linear function.
        Defaults to ``[1]``.
    offsets: The offsets for different segments of the piecewise-linear function.
        Defaults to ``[0]``.
    basis: The type of Pauli rotation (``'X'``, ``'Y'``, ``'Z'``).
    name: The name of the circuit.

### `breakpoints`

```python
def breakpoints(self) -> list[int]
```

The breakpoints of the piecewise linear function.

The function is linear in the intervals ``[point_i, point_{i+1}]`` where the last
point implicitly is ``2**(num_state_qubits + 1)``.

### `breakpoints`

```python
def breakpoints(self, breakpoints: list[int]) -> None
```

Set the breakpoints.

Args:
    breakpoints: The new breakpoints.

### `slopes`

```python
def slopes(self) -> list[float] | np.ndarray
```

The slopes of the piecewise linear function.

The function is linear in the intervals ``[point_i, point_{i+1}]`` where the last
point implicitly is ``2**(num_state_qubits + 1)``.

### `slopes`

```python
def slopes(self, slopes: list[float]) -> None
```

Set the slopes.

Args:
    slopes: The new slopes.

### `offsets`

```python
def offsets(self) -> list[float] | np.ndarray
```

The offsets of the piecewise linear function.

The function is linear in the intervals ``[point_i, point_{i+1}]`` where the last
point implicitly is ``2**(num_state_qubits + 1)``.

### `offsets`

```python
def offsets(self, offsets: list[float]) -> None
```

Set the offsets.

Args:
    offsets: The new offsets.

### `mapped_slopes`

```python
def mapped_slopes(self) -> np.ndarray
```

The slopes mapped to the internal representation.

Returns:
    The mapped slopes.

### `mapped_offsets`

```python
def mapped_offsets(self) -> np.ndarray
```

The offsets mapped to the internal representation.

Returns:
    The mapped offsets.

### `contains_zero_breakpoint`

```python
def contains_zero_breakpoint(self) -> bool | np.bool_
```

Whether 0 is the first breakpoint.

Returns:
    True, if 0 is the first breakpoint, otherwise False.

### `evaluate`

```python
def evaluate(self, x: float) -> float
```

Classically evaluate the piecewise linear rotation.

Args:
    x: Value to be evaluated at.

Returns:
    Value of piecewise linear function at x.

## `PiecewiseLinearPauliRotationsGate`

```python
class PiecewiseLinearPauliRotationsGate(Gate)
```

Piecewise-linearly-controlled Pauli rotations.

For a piecewise linear (not necessarily continuous) function :math:`f(x)`, which is defined
through breakpoints, slopes and offsets as follows.
Suppose the breakpoints :math:`(x_0, ..., x_J)` are a subset of :math:`[0, 2^n-1]`, where
:math:`n` is the number of state qubits. Further on, denote the corresponding slopes and
offsets by :math:`a_j` and :math:`b_j` respectively.
Then f(x) is defined as:

.. math::

    f(x) = \begin{cases}
        0, x < x_0 \\
        a_j (x - x_j) + b_j, x_j \leq x < x_{j+1}
        \end{cases}

where we implicitly assume :math:`x_{J+1} = 2^n`.

### `__init__`

```python
def __init__(self, num_state_qubits: int | None=None, breakpoints: list[int] | None=None, slopes: Sequence[float] | None=None, offsets: Sequence[float] | None=None, basis: str='Y', label: str | None=None) -> None
```

Construct piecewise-linearly-controlled Pauli rotations.

Args:
    num_state_qubits: The number of qubits representing the state.
    breakpoints: The breakpoints to define the piecewise-linear function.
        Defaults to ``[0]``.
    slopes: The slopes for different segments of the piecewise-linear function.
        Defaults to ``[1]``.
    offsets: The offsets for different segments of the piecewise-linear function.
        Defaults to ``[0]``.
    basis: The type of Pauli rotation (``'X'``, ``'Y'``, ``'Z'``).
    label: The label of the gate.
