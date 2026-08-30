---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/arithmetic/polynomial_pauli_rotations.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/arithmetic/polynomial_pauli_rotations.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/arithmetic/polynomial_pauli_rotations.py`

Polynomially controlled Pauli-rotations.

## `PolynomialPauliRotations`

```python
class PolynomialPauliRotations(FunctionalPauliRotations)
```

A circuit implementing polynomial Pauli rotations.

For a polynomial :math:`p`, a basis state :math:`|i\rangle` of the state register,
and a target qubit initialized in :math:`|0\rangle`, this operator applies a
Pauli rotation to the target qubit by the angle :math:`p(i)`. For the default
``basis="Y"``, this acts as:

.. math::

    |0\rangle |i\rangle \mapsto
    \cos\left(\frac{p(i)}{2}\right) |0\rangle |i\rangle
    + \sin\left(\frac{p(i)}{2}\right) |1\rangle |i\rangle

For ``basis="X"``, the action on the target qubit is:

.. math::

    |0\rangle |i\rangle \mapsto
    \cos\left(\frac{p(i)}{2}\right) |0\rangle |i\rangle
    - i\sin\left(\frac{p(i)}{2}\right) |1\rangle |i\rangle

For ``basis="Z"``, the action on the target qubit is:

.. math::

    |0\rangle |i\rangle \mapsto e^{-i p(i) / 2} |0\rangle |i\rangle

Let :math:`n` be the number of qubits representing the state, :math:`d` the degree of :math:`p`
and :math:`q_i` the qubits, where :math:`q_0` is the least significant qubit. Then for

.. math::

    x = \sum_{i=0}^{n-1} 2^i q_i,

we can write

.. math::

    p(x) = \sum_{j=0}^{j=d} c_j x^j

where :math:`c` are the input coefficients, ``coeffs``.

### `__init__`

```python
def __init__(self, num_state_qubits: int | None=None, coeffs: list[float] | None=None, basis: str='Y', name: str='poly') -> None
```

Args:
    num_state_qubits: The number of qubits representing the state.
    coeffs: The coefficients of the polynomial. ``coeffs[i]`` is the coefficient of
        :math:`x^i`. Defaults to linear: ``[0, 1]``.
    basis: The type of Pauli rotation (``"X"``, ``"Y"``, ``"Z"``).
    name: The name of the circuit.

### `coeffs`

```python
def coeffs(self) -> list[float]
```

The coefficients of the polynomial.

``coeffs[i]`` is the coefficient of the i-th power of the function input :math:`x`,
that means that the rotation angles are based on the coefficients value,
following the formula

.. math::

    c_j x^j ,  j=0, ..., d

where :math:`d` is the degree of the polynomial :math:`p(x)` and :math:`c` are the coefficients
``coeffs``.

Returns:
    The coefficients of the polynomial.

### `coeffs`

```python
def coeffs(self, coeffs: list[float]) -> None
```

Set the coefficients of the polynomial.

``coeffs[i]`` is the coefficient of the i-th power of x.

Args:
    coeffs: The coefficients of the polynomial.

### `degree`

```python
def degree(self) -> int
```

Return the degree of the polynomial, equals to the number of coefficients minus 1.

Returns:
    The degree of the polynomial. If the coefficients have not been set, return 0.

## `PolynomialPauliRotationsGate`

```python
class PolynomialPauliRotationsGate(Gate)
```

A gate implementing polynomial Pauli rotations.

For a polynomial :math:`p`, a basis state :math:`|i\rangle` of the state register,
and a target qubit initialized in :math:`|0\rangle`, this operator applies a
Pauli rotation to the target qubit by the angle :math:`p(i)`. For the default
``basis="Y"``, this acts as:

.. math::

    |0\rangle |i\rangle \mapsto
    \cos\left(\frac{p(i)}{2}\right) |0\rangle |i\rangle
    + \sin\left(\frac{p(i)}{2}\right) |1\rangle |i\rangle

For ``basis="X"``, the action on the target qubit is:

.. math::

    |0\rangle |i\rangle \mapsto
    \cos\left(\frac{p(i)}{2}\right) |0\rangle |i\rangle
    - i\sin\left(\frac{p(i)}{2}\right) |1\rangle |i\rangle

For ``basis="Z"``, the action on the target qubit is:

.. math::

    |0\rangle |i\rangle \mapsto e^{-i p(i) / 2} |0\rangle |i\rangle

Let :math:`n` be the number of qubits representing the state, :math:`d` the degree of :math:`p`
and :math:`q_i` the qubits, where :math:`q_0` is the least significant qubit. Then for

.. math::

    x = \sum_{i=0}^{n-1} 2^i q_i,

we can write

.. math::

    p(x) = \sum_{j=0}^{j=d} c_j x^j

where :math:`c` are the input coefficients, ``coeffs``.

### `__init__`

```python
def __init__(self, num_state_qubits: int, coeffs: list[float] | None=None, basis: str='Y', label: str | None=None) -> None
```

Args:
    num_state_qubits: The number of qubits representing the state.
    coeffs: The coefficients of the polynomial. ``coeffs[i]`` is the coefficient of
        :math:`x^i`. Defaults to linear: ``[0, 1]``.
    basis: The type of Pauli rotation (``"X"``, ``"Y"``, ``"Z"``).
    label: A label for the gate.
