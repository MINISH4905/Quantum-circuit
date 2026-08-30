---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/pauli/conversion.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/pauli/conversion.py
license: Apache-2.0
---

## Module `pennylane/pauli/conversion.py`

Utility functions to convert between ``~.PauliSentence`` and other PennyLane operators.

## `pauli_decompose`

```python
def pauli_decompose(H, hide_identity=False, wire_order=None, pauli=False, check_hermitian=True) -> LinearCombination | PauliSentence
```

Decomposes a Hermitian matrix into a linear combination of Pauli operators.

Args:
    H (tensor_like[complex] or scipy.sparse matrix): a Hermitian matrix of dimension :math:`2^n\times 2^n`.
        Scipy sparse matrices are also supported and are processed natively without converting to dense format,
        enabling efficient decomposition of large sparse matrices.
    hide_identity (bool): does not include the Identity observable within
        the tensor products of the decomposition if ``True``.
    wire_order (list[Union[int, str]]): the ordered list of wires with respect
        to which the operator is represented as a matrix.
    pauli (bool): return a :class:`~.PauliSentence` instance if ``True``.
    check_hermitian (bool): check if the provided matrix is Hermitian if ``True``.

Returns:
    Union[~.LinearCombination, ~.PauliSentence]: the matrix decomposed as a linear combination
    of Pauli operators, returned either as a :class:`~.ops.LinearCombination` or :class:`~.PauliSentence`
    instance.

**Example:**

We can use this function to compute the Pauli operator decomposition of an arbitrary Hermitian
matrix:

>>> import pennylane as qp
>>> import numpy as np
>>> A = np.array(
... [[-2, -2+1j, -2, -2], [-2-1j,  0,  0, -1], [-2,  0, -2, -1], [-2, -1, -1,  0]])
>>> H = qp.pauli_decompose(A)
>>> import pprint
>>> pprint.pprint(H)
(
    -1.0 * (I(0) @ I(1))
  + -1.5 * (I(0) @ X(1))
  + -0.5 * (I(0) @ Y(1))
  + -1.0 * (I(0) @ Z(1))
  + -1.5 * (X(0) @ I(1))
  + -1.0 * (X(0) @ X(1))
  + -0.5 * (X(0) @ Z(1))
  + 1.0 * (Y(0) @ Y(1))
  + -0.5 * (Z(0) @ X(1))
  + -0.5 * (Z(0) @ Y(1))
)

We can return a :class:`~.PauliSentence` instance by using the keyword argument ``pauli=True``:

>>> ps = qp.pauli_decompose(A, pauli=True)
>>> print(ps)
-1.0 * I
+ -1.5 * X(1)
+ -0.5 * Y(1)
+ -1.0 * Z(1)
+ -1.5 * X(0)
+ -1.0 * X(0) @ X(1)
+ -0.5 * X(0) @ Z(1)
+ 1.0 * Y(0) @ Y(1)
+ -0.5 * Z(0) @ X(1)
+ -0.5 * Z(0) @ Y(1)

By default the wires are numbered [0, 1, ..., n], but we can also set custom wires using the
``wire_order`` argument:

>>> ps = qp.pauli_decompose(A, pauli=True, wire_order=['a', 'b'])
>>> print(ps)
-1.0 * I
+ -1.5 * X(b)
+ -0.5 * Y(b)
+ -1.0 * Z(b)
+ -1.5 * X(a)
+ -1.0 * X(a) @ X(b)
+ -0.5 * X(a) @ Z(b)
+ 1.0 * Y(a) @ Y(b)
+ -0.5 * Z(a) @ X(b)
+ -0.5 * Z(a) @ Y(b)

.. details::
    :title: Theory
    :href: theory

    This method internally uses a generalized decomposition routine to convert the matrix to a
    weighted sum of Pauli words acting on :math:`n` qubits in time :math:`O(n 4^n)`. The input
    matrix is written as a quantum state in the computational basis following the
    `channel-state duality <https://en.wikipedia.org/wiki/Channel-state_duality>`_.
    A Bell basis transformation is then performed using the
    `Walsh-Hadamard transform <https://en.wikipedia.org/wiki/Hadamard_transform>`_, after which
    coefficients for each of the :math:`4^n` Pauli words are computed while accounting for the
    phase from each ``PauliY`` term occurring in the word.

    Scipy sparse matrices are also supported and processed natively without converting to
    dense format, enabling efficient decomposition of large sparse matrices. For example:

    >>> import scipy.sparse as sps
    >>> sparse_H = sps.csr_matrix([[1, 0, 0, 0], [0, -1, 0, 0], [0, 0, -1, 0], [0, 0, 0, 1]])
    >>> qp.pauli_decompose(sparse_H)
    1.0 * (Z(0) @ Z(1))

## `pauli_sentence`

```python
def pauli_sentence(op)
```

Return the PauliSentence representation of an arithmetic operator or Hamiltonian.

Args:
    op (~.Operator): The operator or Hamiltonian that needs to be converted.

Raises:
    ValueError: Op must be a linear combination of Pauli operators

Returns:
    .PauliSentence: the PauliSentence representation of an arithmetic operator or Hamiltonian

## `is_pauli_sentence`

```python
def is_pauli_sentence(op)
```

Returns True of the operator is a PauliSentence and False otherwise.
