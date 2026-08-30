---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/vibrational/taylor_ham.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/vibrational/taylor_ham.py
license: Apache-2.0
---

## Module `pennylane/qchem/vibrational/taylor_ham.py`

The functions related to the construction of the Taylor form Hamiltonian.

## `taylor_coeffs`

```python
def taylor_coeffs(pes, max_deg=4, min_deg=3)
```

Computes the coefficients of a Taylor vibrational Hamiltonian.

The coefficients are computed from a multi-dimensional polynomial fit over potential energy data
computed along normal coordinates, with a polynomial specified by ``min_deg`` and ``max_deg``.

Args:
    pes (VibrationalPES): the vibrational potential energy surface object
    max_deg (int): maximum degree of the polynomial used to compute the coefficients
    min_deg (int): minimum degree of the polynomial used to compute the coefficients

Returns:
    List(TensorLike[float]): the coefficients of the Taylor vibrational Hamiltonian

**Example**

>>> freqs = np.array([0.0249722])
>>> pes_onemode = np.array([[0.08477, 0.01437, 0.00000, 0.00937, 0.03414]])
>>> pes_object = qp.qchem.VibrationalPES(freqs=freqs, pes_data=[pes_onemode])
>>> coeffs = qp.qchem.taylor_coeffs(pes_object, 4, 2)
>>> print(coeffs)
[array([[-4.73959071e-05, -3.06785775e-03,  5.21798831e-04]])]

.. details::
    :title: Theory

    A molecular potential energy surface can be defined as [Eq. 7 of
    `J. Chem. Phys. 135, 134108 (2011) <https://pubs.aip.org/aip/jcp/article-abstract/135/13/134108/191108/Size-extensive-vibrational-self-consistent-field?redirectedFrom=PDF>`_]:

    .. math::

        V = V_0 + \sum_{i} F_i q_i + \sum_{i,j} F_{ij} q_i q_j +
                   \sum_{i,j,k} F_{ijk} q_i q_j q_k + \cdots,

    where :math:`q` is a normal coordinate and :math:`F` represents the derivatives of the
    potential energy surface.

    This function computes these derivatives via Taylor expansion of the potential energy data
    by performing a multi-dimensional polynomial fit.

    The potential energy surface along the normal coordinate can be defined as

    .. math::

        V(q_1,\cdots,q_M) = V_0 + \sum_{i=1}^M V_1^{(i)}(q_i) + \sum_{i>j}
        V_2^{(i,j)}(q_i,q_j) + \sum_{i<j<k} V_3^{(i,j,k)}(q_i,q_j,q_k) + \cdots,

    where :math:`V_n` represents the :math:`n`-mode component of the potential energy surface
    computed along the normal coordinate. The :math:`V_n` terms are defined as:

    .. math::

        V_0 &\equiv  V(q_1=0,\cdots,q_M=0) \\
        V_1^{(i)}(q_i) &\equiv  V(0,\cdots,0,q_i,0,\cdots,0) -  V_0 \\
        V_2^{(i,j)}(q_i,q_j) &\equiv  V(0,\cdots,q_i,\cdots,q_j,\cdots,0) -
        V_1^{(i)}(q_i) -  V_1^{(j)}(q_j) -  V_0  \\
        \nonumber \vdots

    Note that the terms :math:`V_n` are represented here by an array of energy points computed
    along the normal coordinates. These energy data are then used in a multi-dimensional
    polynomial fit where each term :math:`V_n` is expanded in terms of products of :math:`q`
    with exponents specified by ``min_deg`` and ``max_deg``.

    The one-mode Taylor coefficients, :math:`\Phi`, computed here are related to the potential
    energy surface as:

    .. math::

        V_1^{(j)}(q_j) \approx \Phi^{(2)}_j q_j^2 + \Phi^{(3)}_j q_j^3 + ... + \Phi^{(n)}_j q_j^n,

    where the largest power :math:`n` is determined by ``max_deg``. Similarly, the two-mode and
    three-mode Taylor coefficients are computed if the two-mode and three-mode potential energy
    surface data, :math:`V_2^{(j, k)}(q_j, q_k)` and :math:`V_3^{(j, k, l)}(q_j, q_k, q_l)`, are
    provided.

## `taylor_dipole_coeffs`

```python
def taylor_dipole_coeffs(pes, max_deg=4, min_deg=1)
```

Computes the coefficients of a Taylor dipole operator.

The coefficients are computed from a multi-dimensional polynomial fit over dipole moment data
computed along normal coordinates, with a polynomial specified by ``min_deg`` and ``max_deg``.

Args:
    pes (VibrationalPES): the vibrational potential energy surface object
    max_deg (int): maximum degree of the polynomial used to compute the coefficients
    min_deg (int): minimum degree of the polynomial used to compute the coefficients

Returns:
    tuple: a tuple containing:
        - List(TensorLike[float]): coefficients for x-displacements
        - List(TensorLike[float]): coefficients for y-displacements
        - List(TensorLike[float]): coefficients for z-displacements

**Example**

>>> freqs = np.array([0.0249722])
>>> dipole_onemode = np.array([[[-1.24222060e-16, -6.29170686e-17, -7.04678188e-02],
...                             [ 3.83941489e-16, -2.31579327e-18, -3.24444991e-02],
...                             [ 1.67813138e-17, -5.63904474e-17, -5.60662627e-15],
...                             [-7.37584781e-17, -5.51948189e-17,  2.96786374e-02],
...                             [ 1.40526000e-16, -3.67126324e-17,  5.92006212e-02]]])
>>> pes_object = qp.qchem.VibrationalPES(freqs=freqs, dipole_data=[dipole_onemode])
>>> coeffs_x, coeffs_y, coeffs_z = qp.qchem.taylor_dipole_coeffs(pes_object, 4, 2)
>>> print(coeffs_z)
[array([[-1.54126823e-03,  8.17300533e-03,  3.94178001e-05]])]

.. details::
    :title: Theory

    The dipole :math:`D` along each of the :math:`x, y,` and :math:`z` directions is defined as:

    .. math::

        D(q_1,\cdots,q_M) = D_0 + \sum_{i=1}^M D_1^{(i)}(q_i) + \sum_{i>j}
        D_2^{(i,j)}(q_i,q_j) + \sum_{i<j<k} D_3^{(i,j,k)}(q_i,q_j,q_k) + \cdots,

    where :math:`q` is a normal coordinate and :math:`D_n` represents the :math:`n`-mode
    component of the dipole computed along the normal coordinate. The :math:`D_n` terms are
    defined as:

    .. math::

        D_0 &\equiv D(q_1=0,\cdots,q_M=0) \\
        D_1^{(i)}(q_i) &\equiv D(0,\cdots,0,q_i,0,\cdots,0) - D_0 \\
        D_2^{(i,j)}(q_i,q_j) &\equiv D(0,\cdots,q_i,\cdots,q_j,\cdots,0) -
        D_1^{(i)}(q_i) - D_1^{(j)}(q_j) - D_0  \\
        \nonumber \vdots

    The one-mode Taylor dipole coefficients, :math:`\Phi`, computed here are related to the
    dipole data as:

    .. math::

        D_1^{(j)}(q_j) \approx \Phi^{(2)}_j q_j^2 + \Phi^{(3)}_j q_j^3 + ....

    Similarly, the two-mode and three-mode Taylor dipole coefficients are computed if the
    two-mode and three-mode dipole data, :math:`D_2^{(j, k)}(q_j, q_k)` and
    :math:`D_3^{(j, k, l)}(q_j, q_k, q_l)`, are provided.

## `taylor_bosonic`

```python
def taylor_bosonic(coeffs, freqs, is_local=True, uloc=None)
```

Returns a Taylor bosonic vibrational Hamiltonian.

The Taylor vibrational Hamiltonian is defined in terms of kinetic :math:`T` and potential
:math:`V` components  as:

.. math::

    H = T + V.

The kinetic term is defined in terms of momentum :math:`p` operators as

.. math::

    T = \sum_{i\geq j} K_{ij} p_i  p_j,

where the :math:`K` matrix is defined in terms of vibrational frequencies, :math:`\omega`, and
mode localization unitary matrix, :math:`U`, as:

.. math::

    K_{ij} = \sum_{k=1}^M \frac{\omega_k}{2} U_{ki} U_{kj}.

The potential term is defined in terms of normal coordinate operator :math:`q` as:

.. math::

    V(q_1,\cdots,q_M) = V_0 + \sum_{i=1}^M V_1^{(i)}(q_i) + \sum_{i>j}
    V_2^{(i,j)}(q_i,q_j) + \sum_{i<j<k} V_3^{(i,j,k)}(q_i,q_j,q_k) + \cdots,

where :math:`V_n` represents the :math:`n`-mode component of the potential energy surface
computed along the normal coordinate. The :math:`V_n` terms are defined as:

.. math::

            V_0 &\equiv  V(q_1=0,\cdots,q_M=0) \\
            V_1^{(i)}(q_i) &\equiv  V(0,\cdots,0,q_i,0,\cdots,0) -  V_0 \\
            V_2^{(i,j)}(q_i,q_j) &\equiv  V(0,\cdots,q_i,\cdots,q_j,\cdots,0) -
            V_1^{(i)}(q_i) -  V_1^{(j)}(q_j) -  V_0  \\
            \nonumber \vdots

These terms are then used in a multi-dimensional polynomial fit to get :math:`n`-mode Taylor
coefficients. For instance, the one-mode Taylor coefficient :math:`\Phi` is related to the
one-mode potential energy surface data as:

.. math::

    V_1^{(j)}(q_j) \approx \Phi^{(2)}_j q_j^2 + \Phi^{(3)}_j q_j^3 + ...

Similarly, the two-mode and three-mode Taylor coefficients are computed if the two-mode and
three-mode potential energy surface data, :math:`V_2^{(j, k)}(q_j, q_k)` and
:math:`V_3^{(j, k, l)}(q_j, q_k, q_l)`, are provided.

This real-space form of the vibrational Hamiltonian can be represented in the bosonic basis by
using equations defined in Eqs. 6, 7 of `arXiv:1703.09313 <https://arxiv.org/abs/1703.09313>`_:

.. math::

    \hat q_i = \frac{1}{\sqrt{2}}(b_i^\dagger + b_i), \quad
    \hat p_i = \frac{1}{\sqrt{2}}(b_i^\dagger - b_i),

where :math:`b^\dagger` and :math:`b` are bosonic creation and annihilation operators,
respectively.

Args:
    coeffs (list(tensorlike(float))): the coefficients of a Taylor vibrational Hamiltonian
    freqs (array(float)): the harmonic vibrational frequencies in atomic units
    is_local (bool): Whether the vibrational modes are localized. Default is ``True``.
    uloc (tensorlike(float)): normal mode localization matrix with shape ``(m, m)`` where
        ``m = len(freqs)``

Returns:
    pennylane.bose.BoseSentence: Taylor bosonic Hamiltonian

**Example**

>>> freqs = np.array([0.025])
>>> one_mode = np.array([[-0.00088528, -0.00361425,  0.00068143]])
>>> uloc = np.array([[1.0]])
>>> ham = qp.qchem.taylor_bosonic(coeffs=[one_mode], freqs=freqs, uloc=uloc)
>>> print(ham)
-0.0012778303419517393 * b⁺(0) b⁺(0) b⁺(0)
+ -0.0038334910258552178 * b⁺(0) b⁺(0) b(0)
+ -0.0038334910258552178 * b⁺(0)
+ -0.0038334910258552178 * b⁺(0) b(0) b(0)
+ -0.0038334910258552178 * b(0)
+ -0.0012778303419517393 * b(0) b(0) b(0)
+ (0.0005795050000000001+0j) * b⁺(0) b⁺(0)
+ (0.026159009999999996+0j) * b⁺(0) b(0)
+ (0.012568432499999997+0j) * I
+ (0.0005795050000000001+0j) * b(0) b(0)
+ 0.00017035749999999995 * b⁺(0) b⁺(0) b⁺(0) b⁺(0)
+ 0.0006814299999999998 * b⁺(0) b⁺(0) b⁺(0) b(0)
+ 0.0010221449999999997 * b⁺(0) b⁺(0) b(0) b(0)
+ 0.0006814299999999998 * b⁺(0) b(0) b(0) b(0)
+ 0.00017035749999999995 * b(0) b(0) b(0) b(0)

## `taylor_hamiltonian`

```python
def taylor_hamiltonian(pes, max_deg=4, min_deg=3, mapping='binary', n_states=2, wire_map=None, tol=1e-12)
```

Returns Taylor vibrational Hamiltonian.

The Taylor vibrational Hamiltonian is defined in terms of kinetic :math:`T` and potential
:math:`V` components  as:

.. math::

    H = T + V.

The kinetic term is defined in terms of momentum :math:`p` operator as

.. math::

    T = \sum_{i\geq j} K_{ij} p_i  p_j,

where the :math:`K` matrix is defined in terms of vibrational frequencies, :math:`\omega`, and
mode localization unitary matrix, :math:`U`, as:

.. math::

    K_{ij} = \sum_{k=1}^M \frac{\omega_k}{2} U_{ki} U_{kj}.

The potential term is defined in terms of the normal coordinate operator :math:`q` as:

.. math::

    V(q_1,\cdots,q_M) = V_0 + \sum_{i=1}^M V_1^{(i)}(q_i) + \sum_{i>j}
    V_2^{(i,j)}(q_i,q_j) + \sum_{i<j<k} V_3^{(i,j,k)}(q_i,q_j,q_k) + \cdots,

where :math:`V_n` represents the :math:`n`-mode component of the potential energy surface
computed along the normal coordinate. The :math:`V_n` terms are defined as:

.. math::

            V_0 &\equiv  V(q_1=0,\cdots,q_M=0) \\
            V_1^{(i)}(q_i) &\equiv  V(0,\cdots,0,q_i,0,\cdots,0) -  V_0 \\
            V_2^{(i,j)}(q_i,q_j) &\equiv  V(0,\cdots,q_i,\cdots,q_j,\cdots,0) -
            V_1^{(i)}(q_i) -  V_1^{(j)}(q_j) -  V_0  \\
            \nonumber \vdots

These terms are then used in a multi-dimensional polynomial fit with a polynomial specified by
``min_deg`` and ``max_deg`` to get :math:`n`-mode Taylor coefficients. For instance, the
one-mode Taylor coefficient :math:`\Phi` is related to the one-mode potential energy surface
data as:

.. math::

    V_1^{(j)}(q_j) \approx \Phi^{(2)}_j q_j^2 + \Phi^{(3)}_j q_j^3 + ...

Similarly, the two-mode and three-mode Taylor coefficients are computed if the two-mode and
three-mode potential energy surface data, :math:`V_2^{(j, k)}(q_j, q_k)` and
:math:`V_3^{(j, k, l)}(q_j, q_k, q_l)`, are provided.

This real space form of the vibrational Hamiltonian can be represented in the bosonic basis by
using equations defined in Eqs. 6, 7 of `arXiv:1703.09313 <https://arxiv.org/abs/1703.09313>`_:

.. math::

    \hat q_i = \frac{1}{\sqrt{2}}(b_i^\dagger + b_i), \quad
    \hat p_i = \frac{1}{\sqrt{2}}(b_i^\dagger - b_i),

where :math:`b^\dagger` and :math:`b` are bosonic creation and annihilation operators,
respectively.

The bosonic Hamiltonian is then converted to a qubit operator with a selected ``mapping``
method to obtain a linear combination as:

.. math::

    H = \sum_{i} c_i P_i,

where :math:`P` is a tensor product of Pauli operators and :math:`c` is a constant.

Args:
    pes (VibrationalPES): object containing the vibrational potential energy surface data
    max_deg (int): maximum degree of the polynomial used to compute the coefficients
    min_deg (int): minimum degree of the polynomial used to compute the coefficients
    mapping (str): Method used to map to qubit basis. Input values can be ``"binary"``
        or ``"unary"``. Default is ``"binary"``.
    n_states(int): maximum number of allowed bosonic states
    wire_map (dict): A dictionary defining how to map the states of the Bose operator to qubit
        wires. If ``None``, integers used to label the bosonic states will be used as wire labels.
        Defaults to ``None``.
    tol (float): tolerance for discarding the imaginary part of the coefficients during mapping

Returns:
    Operator: the Taylor Hamiltonian

**Example**

>>> freqs = np.array([0.0249722])
>>> pes_onemode = np.array([[0.08477, 0.01437, 0.00000, 0.00937, 0.03414]])
>>> pes_object = qp.qchem.VibrationalPES(freqs=freqs, pes_data=[pes_onemode], localized=False)
>>> ham = qp.qchem.taylor_hamiltonian(pes_object)
>>> print(ham)
0.026123120450329353 * I(0) + -0.01325338030021957 * Z(0) + -0.0032539545260859464 * X(0)
