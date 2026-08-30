---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/liealg/involutions.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/liealg/involutions.py
license: Apache-2.0
---

## Module `pennylane/liealg/involutions.py`

Cartan involutions

## `int_log2`

```python
def int_log2(x)
```

Compute the integer closest to log_2(x).

## `is_qubit_case`

```python
def is_qubit_case(p, q)
```

Return whether p and q are the same and a power of 2.

## `J`

```python
def J(n, wire=None)
```

This is the standard choice for the symplectic transformation operator.
For an :math:`N`-qubit system (:math:`n=2^N`), it equals :math:`Y_0`.

## `Ipq`

```python
def Ipq(p, q, wire=None)
```

This is the canonical transformation operator for AIII and BDI Cartan
decompositions. For an :math:`N`-qubit system (:math:`n=2^N`) and
:math:`p=q=n/2`, it equals :math:`Z_0`.

## `Kpq`

```python
def Kpq(p, q, wire=None)
```

This is the canonical transformation operator for CII Cartan
decompositions. For an :math:`N`-qubit system (:math:`n=2^N`) and
:math:`p=q=n/2`, it equals :math:`Z_1`.

## `A`

```python
def A(op: np.ndarray | PauliSentence | Operator, wire: int | None=None) -> bool
```

Canonical Cartan decomposition of type A on
:math:`\mathfrak{su}(n)\oplus \mathfrak{su}(n)`, given by
:math:`\theta: x\oplus y \mapsto y\oplus x`.

.. note:: Note that we work with Hermitian
    operators internally, so that the input will be multiplied by :math:`i` before
    evaluating the involution.

Args:
    op (Union[np.ndarray, PauliSentence, Operator]): Operator on which the involution is
        evaluated and for which the parity under the involution is returned.
    wire (int): The wire on which the Pauli-:math:`Y` operator acts to implement the
        involution. Will default to ``0`` if ``None``.

Returns:
    bool: Whether or not the input operator (times :math:`i`) is in the eigenspace of the
    involution :math:`\theta` with eigenvalue :math:`+1`.

## `AI`

```python
def AI(op: np.ndarray | PauliSentence | Operator) -> bool
```

Canonical Cartan decomposition of type AI, given by :math:`\theta: x \mapsto x^\ast`.

.. note:: Note that we work with Hermitian
    operators internally, so that the input will be multiplied by :math:`i` before
    evaluating the involution.

Args:
    op (Union[np.ndarray, PauliSentence, Operator]): Operator on which the involution is
        evaluated and for which the parity under the involution is returned.

Returns:
    bool: Whether or not the input operator (times :math:`i`) is in the eigenspace of the
    involution :math:`\theta` with eigenvalue :math:`+1`.

## `AII`

```python
def AII(op: np.ndarray | PauliSentence | Operator, wire: int | None=None) -> bool
```

Canonical Cartan decomposition of type AII, given by :math:`\theta: x \mapsto Y_0 x^\ast Y_0`.

.. note:: Note that we work with Hermitian
    operators internally, so that the input will be multiplied by :math:`i` before
    evaluating the involution.

Args:
    op (Union[np.ndarray, PauliSentence, Operator]): Operator on which the involution is
        evaluated and for which the parity under the involution is returned.
    wire (int): The wire on which the Pauli-:math:`Y` operator acts to implement the
        involution. Will default to ``0`` if ``None``.

Returns:
    bool: Whether or not the input operator (times :math:`i`) is in the eigenspace of the
    involution :math:`\theta` with eigenvalue :math:`+1`.

## `AIII`

```python
def AIII(op: np.ndarray | PauliSentence | Operator, p: int=None, q: int=None, wire: int | None=None) -> bool
```

Canonical Cartan decomposition of type AIII, given by :math:`\theta: x \mapsto I_{p,q} x I_{p,q}`.

The matrix :math:`I_{p,q}` is given by

.. math::
    I_{p,q}=\text{diag}(\underset{p \text{times}}{\underbrace{1, \dots 1}},
    \underset{q \text{times}}{\underbrace{-1, \dots -1}}).

For :math:`p=q=2^N` for some integer :math:`N`, we have :math:`I_{p,q}=Z_0`.

.. note:: Note that we work with Hermitian operators internally, so that the input will be
    multiplied by :math:`i` before evaluating the involution.

Args:
    op (Union[np.ndarray, PauliSentence, Operator]): Operator on which the involution is
        evaluated and for which the parity under the involution is returned.
    p (int): Dimension of first subspace.
    q (int): Dimension of second subspace.
    wire (int): The wire on which the Pauli-:math:`Z` operator acts to implement the
        involution. Will default to ``0`` if ``None``.

Returns:
    bool: Whether or not the input operator (times :math:`i`) is in the eigenspace of the
    involution :math:`\theta` with eigenvalue :math:`+1`.

## `BD`

```python
def BD(op: np.ndarray | PauliSentence | Operator, wire: int | None=None) -> bool
```

Canonical Cartan decomposition of type BD on
:math:`\mathfrak{so}(n)\oplus \mathfrak{so}(n)`, given by
:math:`\theta: x\oplus y \mapsto y\oplus x`.

.. note:: Note that we work with Hermitian
    operators internally, so that the input will be multiplied by :math:`i` before
    evaluating the involution.

Args:
    op (Union[np.ndarray, PauliSentence, Operator]): Operator on which the involution is
        evaluated and for which the parity under the involution is returned.
    wire (int): The wire on which the operator acts to implement the
        involution. Will default to ``0`` if ``None``.

Returns:
    bool: Whether or not the input operator (times :math:`i`) is in the eigenspace of the
    involution :math:`\theta` with eigenvalue :math:`+1`.

## `BDI`

```python
def BDI(op: np.ndarray | PauliSentence | Operator, p: int=None, q: int=None, wire: int | None=None) -> bool
```

Canonical Cartan decomposition of type BDI, given by :math:`\theta: x \mapsto I_{p,q} x I_{p,q}`.

The matrix :math:`I_{p,q}` is given by

.. math::
    I_{p,q}=\text{diag}(\underset{p \text{times}}{\underbrace{1, \dots 1}},
    \underset{q \text{times}}{\underbrace{-1, \dots -1}}).

For :math:`p=q=2^N` for some integer :math:`N`, we have :math:`I_{p,q}=Z_0`.

.. note:: Note that we work with Hermitian operators internally, so that the input will be
    multiplied by :math:`i` before evaluating the involution.


Args:
    op (Union[np.ndarray, PauliSentence, Operator]): Operator on which the involution is
        evaluated and for which the parity under the involution is returned.
    p (int): Dimension of first subspace.
    q (int): Dimension of second subspace.
    wire (int): The wire on which the Pauli-:math:`Z` operator acts to implement the
        involution. Will default to ``0`` if ``None``.

Returns:
    bool: Whether or not the input operator (times :math:`i`) is in the eigenspace of the
    involution :math:`\theta` with eigenvalue :math:`+1`.

## `DIII`

```python
def DIII(op: np.ndarray | PauliSentence | Operator, wire: int | None=None) -> bool
```

Canonical Cartan decomposition of type DIII, given by :math:`\theta: x \mapsto Y_0 x Y_0`.

Args:
    op (Union[np.ndarray, PauliSentence, Operator]): Operator on which the involution is
        evaluated and for which the parity under the involution is returned.
    wire (int): The wire on which the Pauli-:math:`Y` operator acts to implement the
        involution. Will default to ``0`` if ``None``.

Returns:
    bool: Whether or not the input operator (times :math:`i`) is in the eigenspace of the
    involution :math:`\theta` with eigenvalue :math:`+1`.

## `C`

```python
def C(op: np.ndarray | PauliSentence | Operator, wire: int | None=None) -> bool
```

Canonical Cartan decomposition of type C on
:math:`\mathfrak{sp}(n)\oplus \mathfrak{sp}(n)`, given by
:math:`\theta: x\oplus y \mapsto y\oplus x`.

.. note:: Note that we work with Hermitian
    operators internally, so that the input will be multiplied by :math:`i` before
    evaluating the involution.

Args:
    op (Union[np.ndarray, PauliSentence, Operator]): Operator on which the involution is
        evaluated and for which the parity under the involution is returned.
    wire (int): The wire on which the Pauli-:math:`Y` operator acts to implement the
        involution. Will default to ``0`` if ``None``.

Returns:
    bool: Whether or not the input operator (times :math:`i`) is in the eigenspace of the
    involution :math:`\theta` with eigenvalue :math:`+1`.

## `CI`

```python
def CI(op: np.ndarray | PauliSentence | Operator) -> bool
```

Canonical Cartan decomposition of type CI, given by :math:`\theta: x \mapsto x^\ast`.

.. note:: Note that we work with Hermitian
    operators internally, so that the input will be multiplied by :math:`i` before
    evaluating the involution.

Args:
    op (Union[np.ndarray, PauliSentence, Operator]): Operator on which the involution is
        evaluated and for which the parity under the involution is returned.

Returns:
    bool: Whether or not the input operator (times :math:`i`) is in the eigenspace of the
    involution :math:`\theta` with eigenvalue :math:`+1`.

## `CII`

```python
def CII(op: np.ndarray | PauliSentence | Operator, p: int=None, q: int=None, wire: int | None=None) -> bool
```

Canonical Cartan decomposition of type CII, given by :math:`\theta: x \mapsto K_{p,q} x K_{p,q}`.

The matrix :math:`K_{p,q}` is given by

.. math::

    K_{p,q}=\text{diag}(
    \underset{p \text{times}}{\underbrace{1, \dots 1}},
    \underset{q \text{times}}{\underbrace{-1, \dots -1}},
    \underset{p \text{times}}{\underbrace{1, \dots 1}},
    \underset{q \text{times}}{\underbrace{-1, \dots -1}},
    ).

For :math:`p=q=2^N` for some integer :math:`N`, we have :math:`K_{p,q}=Z_1`.

.. note:: Note that we work with Hermitian operators internally, so that the input will be
    multiplied by :math:`i` before evaluating the involution.

Args:
    op (Union[np.ndarray, PauliSentence, Operator]): Operator on which the involution is
        evaluated and for which the parity under the involution is returned.
    p (int): Dimension of first subspace.
    q (int): Dimension of second subspace.
    wire (int): The wire on which the Pauli-:math:`Z` operator acts to implement the
        involution. Will default to ``1`` if ``None``.

Returns:
    bool: Whether or not the input operator (times :math:`i`) is in the eigenspace of the
    involution :math:`\theta` with eigenvalue :math:`+1`.

## `even_odd_involution`

```python
def even_odd_involution(op: PauliSentence | np.ndarray | Operator) -> bool
```

The Even-Odd involution.

This is defined in `quant-ph/0701193 <https://arxiv.org/abs/quant-ph/0701193>`__.
For Pauli words and sentences, it comes down to counting non-trivial Paulis in Pauli words.
For an even (odd) number of qubits, it is of type AI (AII).

Args:
    op ( Union[PauliSentence, np.ndarray, Operator]): Input operator

Returns:
    bool: Boolean output ``True`` or ``False`` for odd (:math:`\mathfrak{k}`) and even parity subspace (:math:`\mathfrak{m}`), respectively

.. seealso:: :func:`~cartan_decomp`

**Example**

>>> from pennylane import X, Y, Z
>>> from pennylane.liealg import even_odd_involution
>>> ops = [X(0), X(0) @ Y(1), X(0) @ Y(1) @ Z(2)]
>>> [even_odd_involution(op) for op in ops]
[True, False, True]

Operators with an odd number of non-identity Paulis yield ``1``, whereas even ones yield ``0``.

The function also works with dense matrix representations.

>>> ops_m = [qp.matrix(op, wire_order=range(3)) for op in ops]
>>> [even_odd_involution(op_m) for op_m in ops_m]
[True, False, True]

## `concurrence_involution`

```python
def concurrence_involution(op: PauliSentence | np.ndarray | Operator) -> bool
```

The Concurrence Canonical Decomposition :math:`\Theta(g) = -g^T` as a Cartan
involution function. It is of type AI.

This is defined in `quant-ph/0701193 <https://arxiv.org/abs/quant-ph/0701193>`__.
For Pauli words and sentences, it comes down to counting Pauli-Y operators.

Args:
    op ( Union[PauliSentence, np.ndarray, Operator]): Input operator

Returns:
    bool: Boolean output ``True`` or ``False`` for odd (:math:`\mathfrak{k}`) and even parity subspace (:math:`\mathfrak{m}`), respectively

.. seealso:: :func:`~cartan_decomp`

**Example**

>>> from pennylane import X, Y, Z
>>> from pennylane.liealg import concurrence_involution
>>> ops = [X(0), X(0) @ Y(1), X(0) @ Y(1) @ Z(2), Y(0) @ Y(2)]
>>> [concurrence_involution(op) for op in ops]
[False, True, True, False]

Operators with an odd number of ``Y`` operators yield ``1``, whereas even ones yield ``0``.

The function also works with dense matrix representations.

>>> ops_m = [qp.matrix(op, wire_order=range(3)) for op in ops]
>>> [even_odd_involution(op_m) for op_m in ops_m]
[True, False, True, False]
