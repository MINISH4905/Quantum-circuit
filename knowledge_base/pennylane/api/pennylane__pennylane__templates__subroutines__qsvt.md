---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/qsvt.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/qsvt.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/qsvt.py`

Contains the QSVT template and qsvt wrapper function.

## `jit_if_jax_available`

```python
def jit_if_jax_available(f, **kwargs)
```

thin wrapper around jax.jit
that jit the function if jax is available
otherwise return the input function

## `qsvt`

```python
def qsvt(A: Operator | TensorLike, poly: TensorLike, encoding_wires: Sequence, block_encoding: Literal[None, 'prepselprep', 'qubitization', 'embedding', 'fable']=None, angle_solver='root-finding')
```

Implements the Quantum Singular Value Transformation (QSVT) for a matrix or Hamiltonian ``A``,
using a polynomial defined by ``poly`` and a block encoding specified by ``block_encoding``.

.. math::

    \begin{pmatrix}
    A & * \\
    * & * \\
    \end{pmatrix}
    \xrightarrow{QSVT}
    \begin{pmatrix}
    \text{poly}(A) + i \dots & * \\
    * & * \\
    \end{pmatrix}

The polynomial transformation is encoded as the real part of the top left term after applying the operator.

This function calculates the required phase angles from the polynomial using :func:`~.poly_to_angles`.

.. note::

    The function :func:`~.poly_to_angles`, used within ``qsvt``, is not JIT-compatible, which
    prevents ``poly`` from being traceable in ``qsvt``. However, ``A`` is traceable
    and can be optimized by JIT within this function.

Args:

    A (Union[tensor_like, Operator]): The matrix on which the QSVT will be applied.
        This can be an array or an object that has a Pauli representation. See :func:`~.pauli_decompose`.

    poly (tensor_like): coefficients of the polynomial ordered from lowest to highest power

    encoding_wires (Sequence[int]): The qubit wires used for the block encoding. See Usage Details below for
        more information on ``encoding_wires`` depending on the block encoding used.

    block_encoding (str): Specifies the type of block encoding to use. Options include:

        - ``"prepselprep"``: Embeds the Hamiltonian ``A`` using :class:`~pennylane.PrepSelPrep`.
          Default encoding for Hamiltonians.
        - ``"qubitization"``: Embeds the Hamiltonian ``A`` using :class:`~pennylane.Qubitization`.
        - ``"embedding"``: Embeds the matrix ``A`` using :class:`~pennylane.BlockEncode`.
          Template not hardware compatible. Default encoding for matrices.
        - ``"fable"``: Embeds the matrix ``A`` using :class:`~pennylane.FABLE`. Template hardware compatible.

    angle_solver (str): Specifies the method used to calculate the angles of the routine
        via :func:`poly_to_angles <pennylane.poly_to_angles>`. Options include:

        - ``"root-finding"`` (Default): effective for polynomials of degree up to :math:`\sim 1000`
        - ``"iterative"``: Effective for polynomials of degree higher than :math:`\sim 1000` for
          the ``"QSP"`` and ``"QSVT"`` routines. Uses Scipy (L-BFGS-B).
        - ``"iterative-optax"``: Recommended for high-degree polynomials
          **when using polynomials of the same degree and running repeatedly**;
          may be slower for a single run due to JIT compilation overhead.
          Uses JAX and Optax. Requires ``jax`` and ``optax`` installed
          and JAX enabled in 64-bit mode. 

Returns:
    (Operator): A quantum operator implementing QSVT on the matrix ``A`` with the
    specified encoding and projector phases.

.. seealso:: :class:`~.QSVT`

Example:

.. code-block:: python

    # P(x) = -x + 0.5 x^3 + 0.5 x^5
    poly = np.array([0, -1, 0, 0.5, 0, 0.5])

    hamiltonian = qp.dot([0.3, 0.7], [qp.Z(1), qp.X(1) @ qp.Z(2)])

    dev = qp.device("default.qubit")


    @qp.qnode(dev)
    def circuit():
        qp.qsvt(hamiltonian, poly, encoding_wires=[0], block_encoding="prepselprep")
        return qp.state()


    matrix = qp.matrix(circuit, wire_order=[0, 1, 2])()

>>> print(matrix[:4, :4].real) # doctest: +SKIP
[[-0.1625  0.     -0.3793  0.    ]
 [ 0.     -0.1625  0.      0.3793]
 [-0.3793  0.      0.1625  0.    ]
 [ 0.      0.3793  0.      0.1625]]


.. details::
    :title: Usage Details

    If the input ``A`` is a Hamiltonian, the valid ``block_encoding`` values are
    ``"prepselprep"`` and ``"qubitization"``. In this case, ``encoding_wires`` refers to the
    ``control`` parameter in the templates :class:`~pennylane.PrepSelPrep` and :class:`~pennylane.Qubitization`,
    respectively. These wires represent the auxiliary qubits necessary for the block encoding of
    the Hamiltonian. The number of ``encoding_wires`` required must be :math:`\lceil \log_2(m) \rceil`,
    where :math:`m` is the number of terms in the Hamiltonian.

    .. code-block:: python

        # P(x) = -1 + 0.2 x^2 + 0.5 x^4
        poly = np.array([-1, 0, 0.2, 0, 0.5])

        hamiltonian = qp.dot([0.3, 0.4, 0.3], [qp.Z(2), qp.X(2) @ qp.Z(3), qp.X(2)])

        dev = qp.device("default.qubit")

        @qp.qnode(dev)
        def circuit():
            qp.qsvt(hamiltonian, poly, encoding_wires=[0, 1], block_encoding="prepselprep")
            return qp.state()


        matrix = qp.matrix(circuit, wire_order=[0, 1, 2, 3])()

    >>> print(np.round(matrix[:4, :4], 4).real) # doctest: +SKIP
    [[-0.7158  0.     -0.      0.    ]
     [ 0.     -0.975   0.     -0.    ]
     [ 0.      0.     -0.7158  0.    ]
     [ 0.      0.      0.     -0.975 ]]


    Alternatively, if the input ``A`` is a matrix, the valid values for ``block_encoding`` are
    ``"embedding"`` and ``"fable"``. In this case, the ``encoding_wires`` parameter corresponds to
    the ``wires`` attribute in the templates :class:`~pennylane.BlockEncode` and :class:`~pennylane.FABLE`,
    respectively. Note that for QSVT to work, the input matrix must be Hermitian.

    .. code-block:: python

        # P(x) = -1 + 0.2 x^2 + 0.5 x^4
        poly = np.array([-0.1, 0, 0.2, 0, 0.5])

        A = np.array([[-0.1, 0, 0, 0.1], [0, 0.2, 0, 0], [0, 0, -0.2, -0.2], [0.1, 0, -0.2, -0.1]])

        dev = qp.device("default.qubit")

        @qp.qnode(dev)
        def circuit():
            qp.qsvt(A, poly, encoding_wires=[0, 1, 2, 3, 4], block_encoding="fable")
            return qp.state()

        matrix = qp.matrix(circuit, wire_order=[0, 1, 2, 3, 4])()

    >>> print(np.round(matrix[:4, :4], 4).real) # doctest: +SKIP
    [[-0.0954  0.     -0.0056 -0.0054]
     [-0.     -0.0912  0.      0.    ]
     [-0.0056  0.     -0.0788  0.0164]
     [-0.0054  0.      0.0164 -0.0842]]

    Note that for the FABLE block encoding to function correctly, it must comply with the following:

    .. math::

            d \|A\|^2 \leq 1,

    where :math:`d` is the maximum dimension of :math:`A` and :math:`\|A\|` is the 2-norm of :math:`A`.
    In the previous example this is satisfied since :math:`d = 4` and :math:`\|A\|^2 = 0.2`:

    >>> print(4 * np.linalg.norm(A, ord='fro')**2)
    0.80...

## `QSVT`

```python
class QSVT(Operation)
```

QSVT(UA,projectors)
Implements the
`quantum singular value transformation <https://arxiv.org/abs/1806.01838>`__ (QSVT) circuit.

.. note ::

    This template allows users to define hardware-compatible block encoding and
    projector-controlled phase shift circuits. For a QSVT implementation that is
    tailored to work directly with an input matrix and a transformation polynomial
    see :func:`~.qsvt`.

Given an :class:`~.Operator` :math:`U`, which block encodes the matrix :math:`A`, and a list of
projector-controlled phase shift operations :math:`\vec{\Pi}_\phi`, this template applies a
circuit for the quantum singular value transformation as follows.

When the number of projector-controlled phase shifts is even (:math:`d` is odd), the QSVT
circuit is defined as:

.. math::

    U_{QSVT} = \tilde{\Pi}_{\phi_1}U\left[\prod^{(d-1)/2}_{k=1}\Pi_{\phi_{2k}}U^\dagger
    \tilde{\Pi}_{\phi_{2k+1}}U\right]\Pi_{\phi_{d+1}}.


And when the number of projector-controlled phase shifts is odd (:math:`d` is even):

.. math::

    U_{QSVT} = \left[\prod^{d/2}_{k=1}\Pi_{\phi_{2k-1}}U^\dagger\tilde{\Pi}_{\phi_{2k}}U\right]
    \Pi_{\phi_{d+1}}.

This circuit applies a polynomial transformation (:math:`Poly^{SV}`) to the singular values of
the block encoded matrix:

.. math::

    \begin{align}
         U_{QSVT}(A, \vec{\phi}) &=
         \begin{bmatrix}
            Poly^{SV}(A) & \cdot \\
            \cdot & \cdot
        \end{bmatrix}.
    \end{align}

.. seealso::

    :func:`~.qsvt` and `A Grand Unification of Quantum Algorithms <https://arxiv.org/pdf/2105.02859.pdf>`_.

Args:
    UA (Operator): the block encoding circuit, specified as an :class:`~.Operator`,
        like :class:`~.BlockEncode`
    projectors (Sequence[Operator]): a list of projector-controlled phase
        shifts that implement the desired polynomial

Raises:
    ValueError: if the input block encoding is not an operator

**Example**

To implement QSVT in a circuit, we can use the following method:

>>> dev = qp.device("default.qubit", wires=[0])
>>> block_encoding = qp.Hadamard(wires=0)  # note H is a block encoding of 1/sqrt(2)
>>> phase_shifts = [qp.RZ(-2 * theta, wires=0) for theta in (1.23, -0.5, 4)]  # -2*theta to match convention

>>> @qp.qnode(dev)
... def example_circuit():
...     qp.QSVT(block_encoding, phase_shifts)
...     return qp.expval(qp.Z(0))
...

>>> example_circuit()
np.float64(0.5403...)

We can visualize the circuit as follows:

>>> print(qp.draw(example_circuit)())
0: ──QSVT─┤  <Z>

To see the implementation details, we can expand the circuit via :func:`qp.decompose <.transforms.decompose>`:

>>> q_script = qp.tape.QuantumScript(ops=[qp.QSVT(block_encoding, phase_shifts)])
>>> q_scripts, func = qp.decompose(q_script, gate_set=qp.decomposition.gate_sets.ALL_QUBIT_OPS)
>>> q_script = func(q_scripts)
>>> print(q_script.draw(decimals=2))
0: ──RZ(-2.46)──H──RZ(1.00)──H──RZ(-8.00)─┤

See the Usage Details section for more examples on implementing QSVT with different block
encoding methods.

.. details::
    :title: Usage Details

    The QSVT operation can be used with different block encoding methods, depending on the
    initial operator for which the singular value transformation is applied and the desired
    backend device. Examples are provided below.

    If we want to transform the singular values of a matrix,
    the matrix can be block-encoded with either the :class:`~.BlockEncode` or :class:`~.FABLE`
    operations. Note that :class:`~.BlockEncode` is more efficient on simulator devices but
    it cannot be used with hardware backends because it currently has no gate decomposition.
    The :class:`~.FABLE` operation is less efficient on simulator devices but is hardware
    compatible.

    The following example applies the polynomial :math:`p(x) = -x + 0.5x^3 + 0.5x^5` to an
    arbitrary hermitian matrix using :class:`~.BlockEncode` for block encoding.

    .. code-block:: python

        poly = np.array([0, -1, 0, 0.5, 0, 0.5])
        angles = qp.poly_to_angles(poly, "QSVT")
        input_matrix = np.array([[0.2, 0.1], [0.1, -0.1]])

        wires = [0, 1]
        block_encode = qp.BlockEncode(input_matrix, wires=wires)
        projectors = [
            qp.PCPhase(angles[i], dim=len(input_matrix), wires=wires)
            for i in range(len(angles))
        ]

        dev = qp.device("default.qubit")
        @qp.qnode(dev)
        def circuit():
            qp.QSVT(block_encode, projectors)
            return qp.state()

    >>> circuit() # doctest: +SKIP
    array([-0.1942+0.6665j, -0.0979+0.3583j,  0.332 -0.5105j, -0.0955+0.0104j])

    If we want to transform the singular values of a linear
    combination of unitaries, e.g., a Hamiltonian, it can be block-encoded with operations
    such as :class:`~.PrepSelPrep` or :class:`~.Qubitization`. Note that both of these operations
    have a gate decomposition and can be implemented on hardware. The following example applies the polynomial
    :math:`p(x) = -x + 0.5x^3 + 0.5x^5` to the Hamiltonian :math:`H = 0.1X_3 - 0.7X_3Z_4 - 0.2Z_3Y_4`,
    block-encoded with :class:`~.PrepSelPrep`.

    .. code-block:: python

        poly = np.array([0, -1, 0, 0.5, 0, 0.5])
        H = 0.1 * qp.X(2) - 0.7 * qp.X(2) @ qp.Z(3) - 0.2 * qp.Z(2)

        control_wires = [0, 1]
        block_encode = qp.PrepSelPrep(H, control=control_wires)
        angles = qp.poly_to_angles(poly, "QSVT")

        projectors = [
            qp.PCPhase(angles[i], dim=2 ** len(H.wires), wires=control_wires + H.wires)
            for i in range(len(angles))
        ]

        dev = qp.device("default.qubit")

        @qp.qnode(dev)
        def circuit():
            qp.QSVT(block_encode, projectors)
            return qp.state()

    >>> circuit() # doctest: +SKIP
    array([ 1.44000000e-01+1.01511390e-01j,  0.00000000e+00+0.00000000e+00j,
            4.32000000e-01+3.04534169e-01j,  0.00000000e+00+0.00000000e+00j,
            -4.14503215e-17+7.27402636e-17j,  0.00000000e+00+0.00000000e+00j,
            5.59003542e-01+9.65699229e-02j,  0.00000000e+00+0.00000000e+00j,
            4.22566958e-01+7.30000000e-02j,  0.00000000e+00+0.00000000e+00j,
            -3.16925218e-01-5.47500000e-02j,  0.00000000e+00+0.00000000e+00j,
            5.20486781e-18-4.91300614e-17j,  0.00000000e+00+0.00000000e+00j,
            -2.79501771e-01-4.82849614e-02j,  0.00000000e+00+0.00000000e+00j])

### `data`

```python
def data(self)
```

Flattened list of operator data in this QSVT operation.

This ensures that the backend of a ``QuantumScript`` which contains a
``QSVT`` operation can be inferred with respect to the types of the
``QSVT`` block encoding and projector-controlled phase shift data.

### `compute_decomposition`

```python
def compute_decomposition(*_data, UA, projectors, **_kwargs)
```

Representation of the operator as a product of other operators.

The :class:`~.QSVT` is decomposed into alternating block encoding
and projector-controlled phase shift operators. This is defined by the following
equations, where :math:`U` is the block encoding operation and both :math:`\Pi_\phi` and
:math:`\tilde{\Pi}_\phi` are projector-controlled phase shifts with angle :math:`\phi`.

When the number of projector-controlled phase shifts is even (:math:`d` is odd), the QSVT
circuit is defined as:

.. math::

    U_{QSVT} = \Pi_{\phi_1}U\left[\prod^{(d-1)/2}_{k=1}\Pi_{\phi_{2k}}U^\dagger
    \tilde{\Pi}_{\phi_{2k+1}}U\right]\Pi_{\phi_{d+1}}.


And when the number of projector-controlled phase shifts is odd (:math:`d` is even):

.. math::

    U_{QSVT} = \left[\prod^{d/2}_{k=1}\Pi_{\phi_{2k-1}}U^\dagger\tilde{\Pi}_{\phi_{2k}}U\right]
    \Pi_{\phi_{d+1}}.

.. seealso:: :meth:`~.QSVT.decomposition`.

Args:
    UA (Operator): the block encoding circuit, specified as a :class:`~.Operator`
    projectors (list[Operator]): a list of projector-controlled phase
        shift circuits that implement the desired polynomial

Returns:
    list[.Operator]: decomposition of the operator

### `compute_matrix`

```python
def compute_matrix(*args, **kwargs)
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.Operator.matrix` and :func:`~.matrix`

Args:
    *params (list): trainable parameters of the operator, as stored in the ``parameters`` attribute
    **hyperparams (dict): non-trainable hyperparameters of the operator, as stored in the ``hyperparameters`` attribute

Returns:
    tensor_like: matrix representation

## `transform_angles`

```python
def transform_angles(angles, routine1, routine2)
```

Converts angles for quantum signal processing (QSP) and quantum singular value transformation (QSVT) routines.

The transformation is based on Appendix A.2 of `arXiv:2105.02859 <https://arxiv.org/abs/2105.02859>`_. Note that QSVT is equivalent to taking the reflection convention of QSP.

Args:
    angles (tensor-like): angles to be transformed
    routine1 (str): the current routine for which the angles are obtained, must be either ``"QSP"`` or ``"QSVT"``
    routine2 (str): the target routine for which the angles should be transformed,
        must be either ``"QSP"`` or ``"QSVT"``

Returns:
    tensor-like: the transformed angles as an array

**Example**

.. code-block::

    >>> qsp_angles = np.array([0.2, 0.3, 0.5])
    >>> qsvt_angles = qp.transform_angles(qsp_angles, "QSP", "QSVT")
    >>> print(qsvt_angles)
    [-6.868...  1.870... -0.285...]


.. details::
    :title: Usage Details

    This example applies the polynomial :math:`P(x) = x - \frac{x^3}{2} + \frac{x^5}{3}` to a block-encoding
    of :math:`x = 0.2`.

    .. code-block::

        poly = np.array([0, 1.0, 0, -1/2, 0, 1/3])

        qsp_angles = qp.poly_to_angles(poly, "QSP")
        qsvt_angles = qp.transform_angles(qsp_angles, "QSP", "QSVT")

        x = 0.2

        # Encodes x in the top left of the matrix
        block_encoding = qp.RX(2 * np.arccos(x), wires=0)

        projectors = [qp.PCPhase(angle, dim=1, wires=0) for angle in qsvt_angles]

        @qp.qnode(qp.device("default.qubit"))
        def circuit_qsvt():
            qp.QSVT(block_encoding, projectors)
            return qp.state()

        output = qp.matrix(circuit_qsvt, wire_order=[0])()[0, 0]
        expected = sum(coef * (x**i) for i, coef in enumerate(poly))

        print("output qsvt: ", output.real)
        print("P(x) =       ", expected)

    .. code-block:: pycon

        output qsvt:  0.19610666666647059
        P(x) =        0.19610666666666668

## `poly_to_angles`

```python
def poly_to_angles(poly, routine, angle_solver='root-finding', **kwargs)
```

Computes the angles needed to implement a polynomial transformation with quantum signal processing (QSP),
quantum singular value transformation (QSVT) or generalized quantum signal processing (GQSP).

The polynomial :math:`P(x) = \sum_n a_n x^n` must satisfy :math:`|P(x)| \leq 1` for :math:`x \in [-1, 1]`.
In QSP and QSVT, the coefficients :math:`a_n` must be real and the exponents :math:`n` must be either all even or all odd.
For more details see `arXiv:2105.02859 <https://arxiv.org/abs/2105.02859>`_.

Args:
    poly (tensor_like): coefficients of the polynomial ordered from lowest to highest power

    routine (str): the routine for which the angles are computed. Must be either ``"QSP"``, ``"QSVT"`` or ``"GQSP"``.

    angle_solver (str): Specifies the method used to calculate the angles. Options include:

        - ``"root-finding"``: effective for polynomials of degree up to :math:`\sim 1000`
        - ``"iterative"`` (Default): Effective for polynomials of degree higher than :math:`\sim 1000` for
          the ``"QSP"`` and ``"QSVT"`` routines. Uses Scipy (L-BFGS-B).
        - ``"iterative-optax"``: Recommended for high-degree polynomials
          when repeatedly evaluating polynomials of the same degree;
          may be slower for a single usage due to JIT compilation overhead.
          Uses JAX and Optax. Requires ``jax`` and ``optax`` installed
          and JAX enabled in 64-bit mode.

    **kwargs: Additional keyword arguments passed to the underlying solver.

Returns:
    (tensor-like): computed angles for the specified routine

Raises:
    AssertionError: if ``poly`` is not valid
    ValueError: if ``angle_solver`` is not supported

**Example**

This example generates the ``QSVT`` angles for the polynomial :math:`P(x) = x - \frac{x^3}{2} + \frac{x^5}{3}`.

.. code-block::

    >>> poly = np.array([0, 1.0, 0, -1/2, 0, 1/3])
    >>> qsvt_angles = qp.poly_to_angles(poly, "QSVT")
    >>> print(qsvt_angles)
    [-5.497...  1.570...  1.570...  0.583...   1.61...  0.747...]


.. details::
    :title: Usage Details

    This example applies the polynomial :math:`P(x) = x - \frac{x^3}{2} + \frac{x^5}{3}` to a block-encoding
    of :math:`x = 0.2`.

    .. code-block::

        poly = np.array([0, 1.0, 0, -1/2, 0, 1/3])

        qsvt_angles = qp.poly_to_angles(poly, "QSVT")

        x = 0.2

        # Encode x in the top left of the matrix
        block_encoding = qp.RX(2 * np.arccos(x), wires=0)
        projectors = [qp.PCPhase(angle, dim=1, wires=0) for angle in qsvt_angles]

        @qp.qnode(qp.device("default.qubit"))
        def circuit_qsvt():
            qp.QSVT(block_encoding, projectors)
            return qp.state()

        output = qp.matrix(circuit_qsvt, wire_order=[0])()[0, 0]
        expected = sum(coef * (x**i) for i, coef in enumerate(poly))

        print("output qsvt: ", output.real)
        print("P(x) =       ", expected)

    .. code-block:: pycon

        output qsvt:  0.19610666666647059
        P(x) =        0.19610666666666668
