---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/arithmetic/piecewise_chebyshev.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/arithmetic/piecewise_chebyshev.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/arithmetic/piecewise_chebyshev.py`

Piecewise polynomial Chebyshev approximation to a given f(x).

## `PiecewiseChebyshev`

```python
class PiecewiseChebyshev(BlueprintCircuit)
```

Piecewise Chebyshev approximation to an input function.

For a given function :math:`f(x)` and degree :math:`d`, this class implements a piecewise
polynomial Chebyshev approximation on :math:`n` qubits to :math:`f(x)` on the given intervals.
All the polynomials in the approximation are of degree :math:`d`.

The values of the parameters are calculated according to [1] and see [2] for a more
detailed explanation of the circuit construction and how it acts on the qubits.

Examples:

.. plot::
    :alt: Circuit diagram output by the previous code.
    :include-source:

    import numpy as np
    from qiskit import QuantumCircuit
    from qiskit.circuit.library.arithmetic.piecewise_chebyshev import PiecewiseChebyshev
    f_x, degree, breakpoints, num_state_qubits = lambda x: np.arcsin(1 / x), 2, [2, 4], 2
    pw_approximation = PiecewiseChebyshev(f_x, degree, breakpoints, num_state_qubits)
    pw_approximation._build()
    qc = QuantumCircuit(pw_approximation.num_qubits)
    qc.h(list(range(num_state_qubits)))
    qc.append(pw_approximation.to_instruction(), qc.qubits)
    qc.draw(output='mpl')

References:

[1] Haener, T., Roetteler, M., & Svore, K. M. (2018).
Optimizing Quantum Circuits for Arithmetic.
`arXiv:1805.12445 <https://arxiv.org/abs/1805.12445>`_

[2] Carrera Vazquez, A., Hiptmair, H., & Woerner, S. (2022).
Enhancing the Quantum Linear Systems Algorithm Using Richardson Extrapolation.
`ACM Transactions on Quantum Computing 3, 1, Article 2 <https://doi.org/10.1145/3490631>`_

### `__init__`

```python
def __init__(self, f_x: float | Callable[[int], float], degree: int | None=None, breakpoints: list[int] | None=None, num_state_qubits: int | None=None, name: str='pw_cheb') -> None
```

Args:
    f_x: the function to be approximated. Constant functions should be specified
        as ``f_x = constant``.
    degree: the degree of the polynomials.
        Defaults to ``1``.
    breakpoints: the breakpoints to define the piecewise-linear function.
        Defaults to the full interval.
    num_state_qubits: number of qubits representing the state.
    name: The name of the circuit object.

### `f_x`

```python
def f_x(self) -> float | Callable[[int], float]
```

The function to be approximated.

Returns:
    The function to be approximated.

### `f_x`

```python
def f_x(self, f_x: float | Callable[[int], float] | None) -> None
```

Set the function to be approximated.

Note that this may change the underlying quantum register, if the number of state qubits
changes.

Args:
    f_x: The new function to be approximated.

### `degree`

```python
def degree(self) -> int
```

The degree of the polynomials.

Returns:
    The degree of the polynomials.

### `degree`

```python
def degree(self, degree: int | None) -> None
```

Set the error tolerance.

Note that this may change the underlying quantum register, if the number of state qubits
changes.

Args:
    degree: The new degree.

### `breakpoints`

```python
def breakpoints(self) -> list[int]
```

The breakpoints for the piecewise approximation.

Returns:
    The breakpoints for the piecewise approximation.

### `breakpoints`

```python
def breakpoints(self, breakpoints: list[int] | None) -> None
```

Set the breakpoints for the piecewise approximation.

Note that this may change the underlying quantum register, if the number of state qubits
changes.

Args:
    breakpoints: The new breakpoints for the piecewise approximation.

### `polynomials`

```python
def polynomials(self) -> list[list[float]]
```

The polynomials for the piecewise approximation.

Returns:
    The polynomials for the piecewise approximation.

Raises:
    TypeError: If the input function is not in the correct format.

### `polynomials`

```python
def polynomials(self, polynomials: list[list[float]] | None) -> None
```

Set the polynomials for the piecewise approximation.

Note that this may change the underlying quantum register, if the number of state qubits
changes.

Args:
    polynomials: The new polynomials for the piecewise approximation.

### `num_state_qubits`

```python
def num_state_qubits(self) -> int
```

The number of state qubits representing the state :math:`|x\rangle`.

Returns:
    The number of state qubits.

### `num_state_qubits`

```python
def num_state_qubits(self, num_state_qubits: int | None) -> None
```

Set the number of state qubits.

Note that this may change the underlying quantum register, if the number of state qubits
changes.

Args:
    num_state_qubits: The new number of qubits.

## `PiecewiseChebyshevGate`

```python
class PiecewiseChebyshevGate(Gate)
```

Piecewise Chebyshev approximation to an input function.

For a given function :math:`f(x)` and degree :math:`d`, this class implements a piecewise
polynomial Chebyshev approximation on :math:`n` qubits to :math:`f(x)` on the given intervals.
All the polynomials in the approximation are of degree :math:`d`.

The values of the parameters are calculated according to [1] and see [2] for a more
detailed explanation of the circuit construction and how it acts on the qubits.

Examples:

    .. plot::
       :alt: Example of generating a circuit with the piecewise Chebyshev gate.
       :include-source:

        import numpy as np
        from qiskit import QuantumCircuit
        from qiskit.circuit.library.arithmetic import PiecewiseChebyshevGate

        f_x, num_state_qubits, degree, breakpoints = lambda x: np.arcsin(1 / x), 2, 2, [2, 4]
        pw_approximation = PiecewiseChebyshevGate(f_x, num_state_qubits, degree, breakpoints)

        qc = QuantumCircuit(pw_approximation.num_qubits)
        qc.h(list(range(num_state_qubits)))
        qc.append(pw_approximation, qc.qubits)
        qc.draw(output="mpl")

References:

[1] Haener, T., Roetteler, M., & Svore, K. M. (2018).
Optimizing Quantum Circuits for Arithmetic.
`arXiv:1805.12445 <https://arxiv.org/abs/1805.12445>`_

[2] Carrera Vazquez, A., Hiptmair, H., & Woerner, S. (2022).
Enhancing the Quantum Linear Systems Algorithm Using Richardson Extrapolation.
`ACM Transactions on Quantum Computing 3, 1, Article 2 <https://doi.org/10.1145/3490631>`_

### `__init__`

```python
def __init__(self, f_x: float | Callable[[int], float], num_state_qubits: int, degree: int | None=None, breakpoints: list[int] | None=None, label: str | None=None) -> None
```

Args:
    f_x: the function to be approximated. Constant functions should be specified
        as ``f_x = constant``.
    num_state_qubits: number of qubits representing the state.
    degree: the degree of the polynomials.
        Defaults to ``1``.
    breakpoints: the breakpoints to define the piecewise-linear function.
        Defaults to the full interval.
    label: A label for the gate.
