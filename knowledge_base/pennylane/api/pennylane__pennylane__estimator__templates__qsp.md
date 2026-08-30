---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/templates/qsp.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/templates/qsp.py
license: Apache-2.0
---

## Module `pennylane/estimator/templates/qsp.py`

Contains templates for Quantum Signal Processing (QSP) based subroutines.

## `GQSP`

```python
class GQSP(ResourceOperator)
```

Resource class for the Generalized Quantum Signal Processing (GQSP) algorithm.

The ``GQSP`` operator is defined based on Theorem 6 of `Generalized Quantum Signal Processing (2024)
<https://arxiv.org/pdf/2308.01501>`_:

.. math::

    GQSP = \left( \prod_{j=1}^{d^{-}} R(\theta_{j}, \phi_{j}, 0) \hat{A}^{\prime} \right)
    \left( \prod_{j=1}^{d^{+}} R(\theta_{j + d^{-}}, \phi_{j + d^{-}}, 0) \hat{A} \right) R(\theta_0, \phi_0, \lambda),

where :math:`R` is the single-qubit rotation operator and :math:`\vec{\phi}`, :math:`\vec{\theta}` and :math:`\lambda`
are the rotation angles that generate the polynomial transformation. The maximum positive and
negative polynomial degrees are denoted by :math:`d^{+}` and :math:`d^{-}`, respectively.
Additionally, :math:`\hat{A}` and :math:`\hat{A}^{\prime}` are given by:

.. math::

    \begin{align}
        \hat{A} &= \ket{0}\bra{0}\otimes\hat{U} + \ket{1}\bra{1}\otimes\mathbf{I}, \\
        \hat{A}^{\prime} &= \ket{0}\bra{0}\otimes\mathbf{I} + \ket{1}\bra{1}\otimes\hat{U}^{\dagger}, \\ \\
    \end{align}

where :math:`U` is a signal operator which encodes a target Hamiltonian.

Args:
    signal_operator (:class:`~.pennylane.estimator.resource_operator.ResourceOperator`): the
        signal operator which encodes a target Hamiltonian
    d_plus (int): The largest positive degree :math:`d^{+}` of the polynomial transformation.
    d_minus (int): The largest (in absolute value) negative degree :math:`d^{-}` of the polynomial
        transformation, representing powers of the adjoint of the signal operator.
    rotation_precision (float | None): The precision with which the general rotation gates are applied.
    wires (WiresLike | None): The wires the operation acts on. This includes both the wires of the
        signal operator and the control wire required for block-encoding.

Resources:
    The resources are obtained as described in Theorem 6 of `Generalized Quantum Signal
    Processing (2024) <https://arxiv.org/pdf/2308.01501>`_.

Raises:
    ValueError: if ``d_plus`` is not a positive integer greater than zero
    ValueError: if ``d_minus`` is not an integer greater than or equal to zero
    ValueError: if ``rotation_precision`` is not a positive real number greater than zero
    ValueError: if the wires provided don't match the number of wires expected by the operator

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> signal_op = qre.RX(0.1, wires=0)
>>> d_plus = 5
>>> d_minus = 3
>>> gqsp = qre.GQSP(signal_op, d_plus, d_minus)
>>> print(qre.estimate(gqsp))
--- Resources: ---
 Total wires: 2
   algorithmic wires: 2
   allocated wires: 0
     zero state: 0
     any state: 0
 Total gates : 1.438E+3
   'T': 1.396E+3,
   'CNOT': 16,
   'X': 10,
   'Hadamard': 16

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * cmpr_signal_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`):
          the compressed representation of the signal operator which encodes the target Hamiltonian
        * d_plus (int): The largest positive degree :math:`d^{+}` of the polynomial transformation.
        * d_minus (int): The largest (in absolute value) negative degree :math:`d^{-}` of the
          polynomial transformation, representing powers of the adjoint of the signal operator.
        * rotation_precision (float | None): The precision with which the general
          rotation gates are applied.

### `resource_rep`

```python
def resource_rep(cls, cmpr_signal_op: CompressedResourceOp, d_plus: int, d_minus: int=0, rotation_precision: float | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    cmpr_signal_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`):
        the compressed representation of the signal operator which encodes the target Hamiltonian
    d_plus (int): The largest positive degree :math:`d^{+}` of the polynomial transformation.
    d_minus (int): The largest (in absolute value) negative degree :math:`d^{-}` of the polynomial
        transformation, representing powers of the adjoint of the signal operator.
    rotation_precision (float | None): The precision with which the general rotation gates are applied.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, cmpr_signal_op: CompressedResourceOp, d_plus: int, d_minus: int=0, rotation_precision: float | None=None) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    cmpr_signal_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`):
        the compressed representation of the signal operator which encodes the target Hamiltonian
    d_plus (int): The largest positive degree :math:`d^{+}` of the polynomial transformation.
    d_minus (int): The largest (in absolute value) negative degree :math:`d^{-}` of the polynomial
        transformation, representing powers of the adjoint of the signal operator.
    rotation_precision (float | None): The precision with which the general rotation gates are applied.

Resources:
    The resources are obtained as described in Theorem 6 of
    `Generalized Quantum Signal Processing (2024) <https://arxiv.org/pdf/2308.01501>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `GQSPTimeEvolution`

```python
class GQSPTimeEvolution(ResourceOperator)
```

Resource class for performing Hamiltonian simulation using GQSP.

Args:
    walk_op (:class:`~.pennylane.estimator.resource_operator.ResourceOperator`): the quantum walk operator
    time (float): the simulation time
    one_norm (float): one norm of the Hamiltonian
    poly_approx_precision (float): the tolerance for error in the polynomial approximation
    wires (WiresLike | None): The wires the operation acts on. This includes both the wires of the
        signal operator and the control wire required for block-encoding.

Resources:
    The resources are obtained as described in Theorem 7 and Corollary 8 of
    `Generalized Quantum Signal Processing (2024) <https://arxiv.org/pdf/2308.01501>`_.

Raises:
    ValueError: if the ``wires`` provided don't match the number of wires expected by the operator
    ValueError: if the ``time`` provided is not a positive real number greater than zero
    ValueError: if the ``one_norm`` provided is not a positive real number greater than zero
    ValueError: if the ``poly_approx_precision`` provided is not a positive real number greater than zero

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> walk_op = qre.RX(0.1, wires=0)
>>> time = 1.0
>>> one_norm = 1.0
>>> approx_error = 0.01
>>> hamsim = qre.GQSPTimeEvolution(walk_op, time, one_norm, approx_error)
>>> print(qre.estimate(hamsim))
--- Resources: ---
 Total wires: 2
   algorithmic wires: 2
   allocated wires: 0
     zero state: 0
     any state: 0
 Total gates : 1.110E+3
   'T': 1.080E+3,
   'CNOT': 12,
   'X': 6,
   'Hadamard': 12

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * walk_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`):
          the quantum walk operator
        * time (float): the simulation time
        * one_norm (float): one norm of the Hamiltonian
        * poly_approx_precision (float): the tolerance for error in the polynomial
          approximation

### `resource_rep`

```python
def resource_rep(cls, walk_op: CompressedResourceOp, time: float, one_norm: float, poly_approx_precision: float | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    walk_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): the
        quantum walk operator
    time (float): the simulation time
    one_norm (float): one norm of the Hamiltonian
    poly_approx_precision (float | None): the tolerance for error in the polynomial approximation

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, walk_op: CompressedResourceOp, time: float, one_norm: float, poly_approx_precision: float | None=None) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    walk_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): the
        quantum walk operator
    time (float): the simulation time
    one_norm (float): one norm of the Hamiltonian
    poly_approx_precision (float | None): the tolerance for error in the polynomial approximation

Resources:
    The resources are obtained as described in Theorem 7 and Corollary 8 of
    `Generalized Quantum Signal Processing (2024) <https://arxiv.org/pdf/2308.01501>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `poly_approx`

```python
def poly_approx(time: float, one_norm: float, epsilon: float) -> int
```

Obtain the maximum degree of the polynomial approximation required
to approximate :math:`e^{(iHt \cos{\theta})}` within some error epsilon.

Args:
    time (float): the simulation time
    one_norm (float): one norm of the Hamiltonian
    epsilon (float): the tolerance for error in the polynomial approximation

Returns:
    int: the minimum degree of the polynomial approximation

## `QSVT`

```python
class QSVT(ResourceOperator)
```

Resource class for Quantum Singular Value Transformation (QSVT).

This operation uses a :class:`~.estimator.resource_operator.ResourceOperator` :math:`U` that
block encodes a matrix :math:`A` in its top-left block. This circuit applies a
polynomial transformation (:math:`Poly^{SV}`) of degree :math:`d` to the singular values of the
block encoded matrix:

.. math::

    \begin{align}
         U_{QSVT}(A, \vec{\phi}) &=
         \begin{bmatrix}
            Poly^{SV}(A) & \cdot \\
            \cdot & \cdot
        \end{bmatrix}.
    \end{align}

When the degree of the polynomial is odd, the QSVT circuit is defined as:

.. math::

    U_{QSVT} = \tilde{\Pi}_{\phi_1}U\left[\prod^{(d-1)/2}_{k=1}\Pi_{\phi_{2k}}U^\dagger
    \tilde{\Pi}_{\phi_{2k+1}}U\right],


and when the degree is even,

.. math::

    U_{QSVT} = \left[\prod^{d/2}_{k=1}\Pi_{\phi_{2k-1}}U^\dagger\tilde{\Pi}_{\phi_{2k}}U\right],

where :math:`\Pi_{\phi}` and :math:`\tilde{\Pi}_{\phi}` are projector-controlled phase shifts
(:class:`~.estimator.ops.qubit.parametric_ops_multi_qubit.PCPhase`).

.. seealso::

    :func:`~.qsvt` and :class:`~.QSVT`.

Args:
    block_encoding (:class:`~.estimator.resource_operator.ResourceOperator`): the block encoding operator
    encoding_dims (int | tuple(int)): The dimensions of the encoded matrix.
        If an integer is provided, a square matrix is assumed.
    poly_deg (int): the degree of the polynomial transformation being applied
    wires (WiresLike | None): the wires the operation acts on

Raises:
    ValueError: if ``encoding_dims`` is not a positive integer or a tuple of two positive integers
    ValueError: if ``poly_deg`` is not a positive integer greater than zero
    ValueError: if the ``wires`` provided don't match the number of wires expected by the operator

Resources:
    The resources are obtained as described in Theorem 4 of `A Grand Unification of Quantum Algorithms
    (2021) <https://arxiv.org/pdf/2105.02859>`_.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> block_encoding = qre.RX(0.1, wires=0)
>>> encoding_dims = (2, 2)
>>> poly_deg = 3
>>> qsvt = qre.QSVT(block_encoding, encoding_dims, poly_deg)
>>> print(qre.estimate(qsvt))
--- Resources: ---
 Total wires: 1
   algorithmic wires: 1
   allocated wires: 0
     zero state: 0
     any state: 0
 Total gates : 39
   'T': 39

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * block_encoding (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`):
          the block encoding operator
        * encoding_dims (int | tuple(int)): The dimensions of the encoded matrix.
          If an integer is provided, a square matrix is assumed.
        * poly_deg (int): the degree of the polynomial transformation being applied

### `resource_rep`

```python
def resource_rep(cls, block_encoding: CompressedResourceOp, encoding_dims: int, poly_deg: int)
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    block_encoding (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`):
        the block encoding operator
    encoding_dims (int | tuple(int)): The dimensions of the encoded matrix.
        If an integer is provided, a square matrix is assumed.
    poly_deg (int): the degree of the polynomial transformation being applied

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, block_encoding: CompressedResourceOp, encoding_dims: int, poly_deg: int)
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    block_encoding (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`):
        the block encoding operator
    encoding_dims (int | tuple(int)): The dimensions of the encoded matrix.
        If an integer is provided, a square matrix is assumed.
    poly_deg (int): the degree of the polynomial transformation being applied

Resources:
    The resources are obtained as described in Theorem 4 of `A Grand Unification of Quantum Algorithms
    (2021) <https://arxiv.org/pdf/2105.02859>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `QSP`

```python
class QSP(ResourceOperator)
```

Implements the `Quantum Signal Processing <https://arxiv.org/pdf/2105.02859>`_
(QSP) circuit.

This template estimates the resources for a QSP circuit of degree :math:`d` (``poly_deg``).
The circuit uses a single-qubit :class:`~.estimator.resource_operator.ResourceOperator`
:math:`W(a)` that block encodes a scalar value :math:`a` in its top-left entry.

The circuit is given as follows in the Z-convention (``convention="Z"``):

.. math::

    \hat{U}_{QSP} = e^{i\phi_{0}\hat{Z}}\prod^{d}_{k=1}\hat{W}(a)e^{i\phi_{k}\hat{Z}} .

The circuit can also be expressed in the X-convention (``convention="X"``):

.. math::

    \hat{U}_{QSP} = e^{i\phi_{0}\hat{X}}\prod^{d}_{k=1}\hat{W}(a)e^{i\phi_{k}\hat{X}} .

.. seealso::

    :func:`~.qsvt` and :class:`~.QSVT`.

Args:
    block_encoding (:class:`~.estimator.resource_operator.ResourceOperator`): the block encoding operator
    poly_deg (int): the degree of the polynomial transformation being applied
    convention (str): the basis used for the rotation operators, valid conventions are ``"X"`` or ``"Z"``
    rotation_precision (float | None): The error threshold for the approximate Clifford + T
        decomposition of the single qubit rotation gates used to implement this operation.
    wires (WiresLike | None): the wires the operation acts on

Raises:
    ValueError: if the block encoding operator acts on more than one qubit
    ValueError: if the convention is not ``"X"`` or ``"Z"``

Resources:
    The resources are obtained as described in Theorem 1 of `A Grand Unification of Quantum Algorithms
    (2021) <https://arxiv.org/pdf/2105.02859>`_.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> block_encoding = qre.RX(0.1, wires=0)
>>> poly_deg = 3
>>> qsp = qre.QSP(block_encoding, poly_deg, convention="Z", rotation_precision=1e-5)
>>> print(qre.estimate(qsp))
--- Resources: ---
 Total wires: 1
   algorithmic wires: 1
   allocated wires: 0
     zero state: 0
     any state: 0
 Total gates : 151
   'T': 151

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * block_encoding (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`):
          the block encoding operator
        * poly_deg (int): the degree of the polynomial transformation being applied
        * convention (str): the basis used for the rotation operators, valid conventions are ``"X"`` or ``"Z"``
        * rotation_precision (float | None): The error threshold for the approximate Clifford + T
          decomposition of the single qubit rotation gates used to implement this operation.

### `resource_rep`

```python
def resource_rep(cls, block_encoding: CompressedResourceOp, poly_deg: int, convention: str='Z', rotation_precision: float | None=None)
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    block_encoding (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`):
        the block encoding operator
    poly_deg (int): the degree of the polynomial transformation being applied
    convention (str):the basis used for the rotation operators, valid conventions are ``"X"`` or ``"Z"``
    rotation_precision (float | None): The error threshold for the approximate Clifford + T
        decomposition of the single qubit rotation gates used to implement this operation.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, block_encoding: CompressedResourceOp, poly_deg: int, convention: str='Z', rotation_precision: float | None=None)
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    block_encoding (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`):
        the block encoding operator
    poly_deg (int): the degree of the polynomial transformation being applied
    convention (str): the basis used for the rotation operators, valid conventions are ``"X"`` or ``"Z"``
    rotation_precision (float): The error threshold for the approximate Clifford + T
        decomposition of the single qubit rotation gates used to implement this operation.

Resources:
    The resources are obtained as described in Theorem 1 of `A Grand Unification of Quantum Algorithms
    (2021) <https://arxiv.org/pdf/2105.02859>`_.

Raises:
    ValueError: if the convention is not ``"X"`` or ``"Z"``

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.
