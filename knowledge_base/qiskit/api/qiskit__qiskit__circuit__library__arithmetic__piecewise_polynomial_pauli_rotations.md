---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/arithmetic/piecewise_polynomial_pauli_rotations.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/arithmetic/piecewise_polynomial_pauli_rotations.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/arithmetic/piecewise_polynomial_pauli_rotations.py`

Piecewise-polynomially-controlled Pauli rotations.

## `PiecewisePolynomialPauliRotations`

```python
class PiecewisePolynomialPauliRotations(FunctionalPauliRotations)
```

Piecewise-polynomially-controlled Pauli rotations.

This class implements a piecewise polynomial (not necessarily continuous) function,
:math:`f(x)`, on qubit amplitudes, which is defined through breakpoints and coefficients as
follows.
Suppose the breakpoints :math:`(x_0, ..., x_J)` are a subset of :math:`[0, 2^n-1]`, where
:math:`n` is the number of state qubits. Further on, denote the corresponding coefficients by
:math:`[a_{j,1},...,a_{j,d}]`, where :math:`d` is the highest degree among all polynomials.

Then :math:`f(x)` is defined as:

.. math::

    f(x) = \begin{cases}
        0, x < x_0 \\
        \sum_{i=0}^{i=d}a_{j,i}/2 x^i, x_j \leq x < x_{j+1}
        \end{cases}

where if given the same number of breakpoints as polynomials, we implicitly assume
:math:`x_{J+1} = 2^n`.

.. note::

    Note the :math:`1/2` factor in the coefficients of :math:`f(x)`, this is consistent with
    Qiskit's Pauli rotations.

Examples:

    >>> from qiskit import QuantumCircuit
    >>> from qiskit.circuit.library.arithmetic.piecewise_polynomial_pauli_rotations import\
    ... PiecewisePolynomialPauliRotations
    >>> qubits, breakpoints, coeffs = (2, [0, 2], [[0, -1.2],[-1, 1, 3]])
    >>> poly_r = PiecewisePolynomialPauliRotations(num_state_qubits=qubits,
    ...breakpoints=breakpoints, coeffs=coeffs)
    >>>
    >>> qc = QuantumCircuit(poly_r.num_qubits)
    >>> qc.h(list(range(qubits)));
    >>> qc.append(poly_r.to_instruction(), list(range(qc.num_qubits)));
    >>> qc.draw()
         ┌───┐┌──────────┐
    q_0: ┤ H ├┤0         ├
         ├───┤│          │
    q_1: ┤ H ├┤1         ├
         └───┘│          │
    q_2: ─────┤2         ├
              │  pw_poly │
    q_3: ─────┤3         ├
              │          │
    q_4: ─────┤4         ├
              │          │
    q_5: ─────┤5         ├
              └──────────┘

References:

[1] Haener, T., Roetteler, M., & Svore, K. M. (2018).
Optimizing Quantum Circuits for Arithmetic.
`arXiv:1805.12445 <https://arxiv.org/abs/1805.12445>`_

[2] Carrera Vazquez, A., Hiptmair, R., & Woerner, S. (2022).
Enhancing the Quantum Linear Systems Algorithm using Richardson Extrapolation.
`ACM Transactions on Quantum Computing 3, 1, Article 2 <https://doi.org/10.1145/3490631>`_

### `__init__`

```python
def __init__(self, num_state_qubits: int | None=None, breakpoints: list[int] | None=None, coeffs: list[list[float]] | None=None, basis: str='Y', name: str='pw_poly') -> None
```

Args:
    num_state_qubits: The number of qubits representing the state.
    breakpoints: The breakpoints to define the piecewise-linear function.
        Defaults to ``[0]``.
    coeffs: The coefficients of the polynomials for different segments of the
        piecewise-linear function. ``coeffs[j][i]`` is the coefficient of the i-th power of x
        for the j-th polynomial.
        Defaults to linear: ``[[1]]``.
    basis: The type of Pauli rotation (``'X'``, ``'Y'``, ``'Z'``).
    name: The name of the circuit.

### `breakpoints`

```python
def breakpoints(self) -> list[int]
```

The breakpoints of the piecewise polynomial function.

The function is polynomial in the intervals ``[point_i, point_{i+1}]`` where the last
point implicitly is ``2**(num_state_qubits + 1)``.

Returns:
    The list of breakpoints.

### `breakpoints`

```python
def breakpoints(self, breakpoints: list[int]) -> None
```

Set the breakpoints.

Args:
    breakpoints: The new breakpoints.

### `coeffs`

```python
def coeffs(self) -> list[list[float]]
```

The coefficients of the polynomials.

Returns:
    The polynomial coefficients per interval as nested lists.

### `coeffs`

```python
def coeffs(self, coeffs: list[list[float]]) -> None
```

Set the polynomials.

Args:
    coeffs: The new polynomials.

### `mapped_coeffs`

```python
def mapped_coeffs(self) -> list[list[float]]
```

The coefficients mapped to the internal representation, since we only compare
x>=breakpoint.

Returns:
    The mapped coefficients.

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

Classically evaluate the piecewise polynomial rotation.

Args:
    x: Value to be evaluated at.

Returns:
    Value of piecewise polynomial function at x.

## `PiecewisePolynomialPauliRotationsGate`

```python
class PiecewisePolynomialPauliRotationsGate(Gate)
```

Piecewise-polynomially-controlled Pauli rotations.

This class implements a piecewise polynomial (not necessarily continuous) function,
:math:`f(x)`, on qubit amplitudes, which is defined through breakpoints and coefficients as
follows.

Suppose the breakpoints :math:`(x_0, ..., x_J)` are a subset of :math:`[0, 2^n-1]`, where
:math:`n` is the number of state qubits. Further on, denote the corresponding coefficients by
:math:`[a_{j,1},...,a_{j,d}]`, where :math:`d` is the highest degree among all polynomials.

Then :math:`f(x)` is defined as:

.. math::

    f(x) = \begin{cases}
        0, x < x_0 \\
        \sum_{i=0}^{i=d}a_{j,i}/2 x^i, x_j \leq x < x_{j+1}
        \end{cases}

where if given the same number of breakpoints as polynomials, we implicitly assume
:math:`x_{J+1} = 2^n`.

.. note::

    Note the :math:`1/2` factor in the coefficients of :math:`f(x)`, this is consistent with
    Qiskit's Pauli rotations.

Examples:
    >>> from qiskit import QuantumCircuit
    >>> from qiskit.circuit.library.arithmetic.piecewise_polynomial_pauli_rotations import\
    ... PiecewisePolynomialPauliRotationsGate
    >>> qubits, breakpoints, coeffs = (2, [0, 2], [[0, -1.2],[-1, 1, 3]])
    >>> poly_r = PiecewisePolynomialPauliRotationsGate(num_state_qubits=qubits,
    ...breakpoints=breakpoints, coeffs=coeffs)
    >>>
    >>> qc = QuantumCircuit(poly_r.num_qubits)
    >>> qc.h(list(range(qubits)));
    >>> qc.append(poly_r, list(range(qc.num_qubits)));
    >>> qc.draw()
         ┌───┐┌──────────┐
    q_0: ┤ H ├┤0         ├
         ├───┤│          │
    q_1: ┤ H ├┤1         ├
         └───┘│          │
    q_2: ─────┤2         ├
              │  pw_poly │
    q_3: ─────┤3         ├
              │          │
    q_4: ─────┤4         ├
              │          │
    q_5: ─────┤5         ├
              └──────────┘

References:

[1] Haener, T., Roetteler, M., & Svore, K. M. (2018).
Optimizing Quantum Circuits for Arithmetic.
`arXiv:1805.12445 <https://arxiv.org/abs/1805.12445>`_

[2] Carrera Vazquez, A., Hiptmair, R., & Woerner, S. (2022).
Enhancing the Quantum Linear Systems Algorithm using Richardson Extrapolation.
`ACM Transactions on Quantum Computing 3, 1, Article 2 <https://doi.org/10.1145/3490631>`_

### `__init__`

```python
def __init__(self, num_state_qubits: int, breakpoints: list[int] | None=None, coeffs: list[list[float]] | None=None, basis: str='Y', label: str | None=None) -> None
```

Args:
    num_state_qubits: The number of qubits representing the state.
    breakpoints: The breakpoints to define the piecewise-linear function.
        Defaults to ``[0]``.
    coeffs: The coefficients of the polynomials for different segments of the
        piecewise-linear function. ``coeffs[j][i]`` is the coefficient of the i-th power of x
        for the j-th polynomial.
        Defaults to linear: ``[[1]]``.
    basis: The type of Pauli rotation (``'X'``, ``'Y'``, ``'Z'``).
    label: An optional label for the gate.

### `evaluate`

```python
def evaluate(self, x: float) -> float
```

Classically evaluate the piecewise polynomial rotation.

Args:
    x: Value to be evaluated at.

Returns:
    Value of piecewise polynomial function at x.
