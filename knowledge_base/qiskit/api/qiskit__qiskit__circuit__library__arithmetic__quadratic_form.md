---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/arithmetic/quadratic_form.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/arithmetic/quadratic_form.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/arithmetic/quadratic_form.py`

A circuit implementing a quadratic form on binary variables.

## `QuadraticForm`

```python
class QuadraticForm(QuantumCircuit)
```

Implements a quadratic form on binary variables encoded in qubit registers.

A quadratic form on binary variables is a quadratic function :math:`Q` acting on a binary
variable of :math:`n` bits, :math:`x = x_0 ... x_{n-1}`. For an integer matrix :math:`A`,
an integer vector :math:`b` and an integer :math:`c` the function can be written as

.. math::

    Q(x) = x^T A x + x^T b + c

If :math:`A`, :math:`b` or :math:`c` contain scalar values, this circuit computes only
an approximation of the quadratic form.

Provided with :math:`m` qubits to encode the value, this circuit computes :math:`Q(x) \mod 2^m`
in [two's complement](https://stackoverflow.com/questions/1049722/what-is-2s-complement)
representation.

.. math::

    |x\rangle_n |0\rangle_m \mapsto |x\rangle_n |(Q(x) + 2^m) \mod 2^m \rangle_m

Since we use two's complement e.g. the value of :math:`Q(x) = 3` requires 2 bits to represent
the value and 1 bit for the sign: `3 = '011'` where the first `0` indicates a positive value.
On the other hand, :math:`Q(x) = -3` would be `-3 = '101'`, where the first `1` indicates
a negative value and `01` is the two's complement of `3`.

If the value of :math:`Q(x)` is too large to be represented with `m` qubits, the resulting
bitstring is :math:`(Q(x) + 2^m) \mod 2^m)`.

The implementation of this circuit is discussed in [1], Fig. 6.

References:

[1] Gilliam et al., Grover Adaptive Search for Constrained Polynomial Binary Optimization.
`arXiv:1912.04088 <https://arxiv.org/pdf/1912.04088.pdf>`_

### `__init__`

```python
def __init__(self, num_result_qubits: int | None=None, quadratic: np.ndarray | list[list[float | ParameterExpression]] | None=None, linear: np.ndarray | list[float | ParameterExpression] | None=None, offset: float | ParameterExpression | None=None, little_endian: bool=True) -> None
```

Args:
    num_result_qubits: The number of qubits to encode the result. Called :math:`m` in
        the class documentation.
    quadratic: A matrix containing the quadratic coefficients, :math:`A`.
    linear: An array containing the linear coefficients, :math:`b`.
    offset: A constant offset, :math:`c`.
    little_endian: Encode the result in little endianness.

Raises:
    ValueError: If ``linear`` and ``quadratic`` have mismatching sizes.
    ValueError: If ``num_result_qubits`` is unspecified but cannot be determined because
        some values of the quadratic form are parameterized.

### `required_result_qubits`

```python
def required_result_qubits(quadratic: np.ndarray | list[list[float]], linear: np.ndarray | list[float], offset: float) -> int
```

Get the number of required result qubits.

Args:
    quadratic: A matrix containing the quadratic coefficients.
    linear: An array containing the linear coefficients.
    offset: A constant offset.

Returns:
    The number of qubits needed to represent the value of the quadratic form
    in twos complement.

## `QuadraticFormGate`

```python
class QuadraticFormGate(Gate)
```

Implements a quadratic form on binary variables encoded in qubit registers.

A quadratic form on binary variables is a quadratic function :math:`Q` acting on a binary
variable of :math:`n` bits, :math:`x = x_0 ... x_{n-1}`. For an integer matrix :math:`A`,
an integer vector :math:`b` and an integer :math:`c` the function can be written as

.. math::

    Q(x) = x^T A x + x^T b + c

If :math:`A`, :math:`b` or :math:`c` contain scalar values, this circuit computes only
an approximation of the quadratic form.

Provided with :math:`m` qubits to encode the value, this circuit computes :math:`Q(x) \mod 2^m`
in [two's complement](https://stackoverflow.com/questions/1049722/what-is-2s-complement)
representation.

.. math::

    |x\rangle_n |0\rangle_m \mapsto |x\rangle_n |(Q(x) + 2^m) \mod 2^m \rangle_m

Since we use two's complement e.g. the value of :math:`Q(x) = 3` requires 2 bits to represent
the value and 1 bit for the sign: `3 = '011'` where the first `0` indicates a positive value.
On the other hand, :math:`Q(x) = -3` would be `-3 = '101'`, where the first `1` indicates
a negative value and `01` is the two's complement of `3`.

If the value of :math:`Q(x)` is too large to be represented with `m` qubits, the resulting
bitstring is :math:`(Q(x) + 2^m) \mod 2^m)`.

The implementation of this circuit is discussed in [1], Fig. 6.

References:

[1] Gilliam et al., Grover Adaptive Search for Constrained Polynomial Binary Optimization.
`arXiv:1912.04088 <https://arxiv.org/pdf/1912.04088.pdf>`_

### `required_result_qubits`

```python
def required_result_qubits(quadratic: Sequence[Sequence[float]], linear: Sequence[float], offset: float) -> int
```

Get the number of required result qubits.

Args:
    quadratic: A matrix containing the quadratic coefficients.
    linear: An array containing the linear coefficients.
    offset: A constant offset.

Returns:
    The number of qubits needed to represent the value of the quadratic form
    in twos complement.
