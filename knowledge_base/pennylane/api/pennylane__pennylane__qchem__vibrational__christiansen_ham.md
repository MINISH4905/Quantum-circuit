---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/vibrational/christiansen_ham.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/vibrational/christiansen_ham.py
license: Apache-2.0
---

## Module `pennylane/qchem/vibrational/christiansen_ham.py`

The functions related to the construction of the Christiansen form Hamiltonian.

## `christiansen_bosonic`

```python
def christiansen_bosonic(one, two=None, three=None, ordered=True)
```

Generates a Christiansen bosonic vibrational Hamiltonian.

The Christiansen vibrational Hamiltonian is defined based on Eqs. D4-D7
of `arXiv:2504.10602 <https://arxiv.org/abs/2504.10602>`_ as:

.. math::

    H = \sum_{i}^M \sum_{k_i, l_i}^{N_i} C_{k_i, l_i}^{(i)} b_{k_i}^{\dagger} b_{l_i} +
    \sum_{i<j}^{M} \sum_{k_i,l_i}^{N_i} \sum_{k_j,l_j}^{N_j} C_{k_i k_j, l_i l_j}^{(i,j)}
    b_{k_i}^{\dagger} b_{k_j}^{\dagger} b_{l_i} b_{l_j},


where :math:`b^{\dagger}` and :math:`b` are the bosonic creation and annihilation
operators, :math:`M` represents the number of normal modes and :math:`N` is the number of
modals. The coefficients :math:`C` represent the one-mode and two-mode integrals defined as

.. math::

    C_{k_i, l_i}^{(i)} = \int \phi_i^{k_i}(Q_i) \left( T(Q_i) +
    V_1^{(i)}(Q_i) \right) \phi_i^{h_i}(Q_i),

and

.. math::

    C_{k_i, k_j, l_i, l_j}^{(i,j)} = \int \int \phi_i^{k_i}(Q_i) \phi_j^{k_j}(Q_j)
    V_2^{(i,j)}(Q_i, Q_j) \phi_i^{l_i}(Q_i) \phi_j^{l_j}(Q_j) \; \text{d} Q_i \text{d} Q_j,

where :math:`\phi` represents a modal, :math:`Q` represents a normal coordinate, :math:`T`
represents the kinetic energy operator and :math:`V` represents the potential energy operator.
Similarly, the three-mode integrals can be obtained following
Eq. D7 of `arXiv:2504.10602 <https://arxiv.org/abs/2504.10602>`_.

Args:
    one (TensorLike[float]): one-body integrals with shape ``(m, n, n)`` where ``m`` and ``n``
        are the number of modes and the maximum number of bosonic states per mode, repectively
    two (TensorLike[float]): two-body integrals with shape ``(m, m, n, n, n, n)`` where ``m``
        and ``n`` are the number of modes and the maximum number of bosonic states per mode,
        repectively. Default is ``None`` which means that the two-body terms will not be
        included in the Hamiltonian.
    three (TensorLike[float]): three-body integrals with shape ``(m, m, m, n, n, n, n, n, n)``
        where ``m`` and ``n`` are the number of modes and the maximum number of bosonic states
        per mode, repectively. Default is ``None`` which means that the two-body terms will not
        be included in the Hamiltonian.
    cutoff (float): tolerance for discarding the negligible coefficients
    ordered (bool): indicates if integral matrix elements are already ordered. Default is ``True``.

Returns:
    pennylane.bose.BoseSentence: the constructed bosonic operator

**Example**

>>> symbols  = ['H', 'F']
>>> geometry = np.array([[0.0, 0.0, -0.40277116], [0.0, 0.0, 1.40277116]])
>>> mol = qp.qchem.Molecule(symbols, geometry)
>>> pes = qp.qchem.vibrational_pes(mol, optimize=False)
>>> integrals = qp.qchem.vibrational.christiansen_integrals(pes, n_states = 4)
>>> print(qp.qchem.christiansen_bosonic(integrals[0]))
0.010354801267111937 * b⁺(0) b(0)
+ 0.0019394049410426685 * b⁺(0) b(1)
+ 0.00046435758469677135 * b⁺(0) b(2)
+ 0.001638099727072391 * b⁺(0) b(3)
+ 0.0019394049410426685 * b⁺(1) b(0)
+ 0.03139978085503162 * b⁺(1) b(1)
+ 0.005580004725710029 * b⁺(1) b(2)
+ 0.0013758584515161654 * b⁺(1) b(3)
+ 0.00046435758469677135 * b⁺(2) b(0)
+ 0.005580004725710029 * b⁺(2) b(1)
+ 0.05314478483410301 * b⁺(2) b(2)
+ 0.010479092552439511 * b⁺(2) b(3)
+ 0.001638099727072391 * b⁺(3) b(0)
+ 0.0013758584515161654 * b⁺(3) b(1)
+ 0.010479092552439511 * b⁺(3) b(2)
+ 0.07565063279464881 * b⁺(3) b(3)

## `christiansen_hamiltonian`

```python
def christiansen_hamiltonian(pes, n_states=16, cubic=False, wire_map=None, tol=1e-12)
```

Generates a Christiansen vibrational Hamiltonian.

The Christiansen vibrational Hamiltonian is defined based on Eqs. D4-D7
of `arXiv:2504.10602 <https://arxiv.org/abs/2504.10602>`_ as:

.. math::

    H = \sum_{i}^M \sum_{k_i, l_i}^{N_i} C_{k_i, l_i}^{(i)} b_{k_i}^{\dagger} b_{l_i} +
    \sum_{i<j}^{M} \sum_{k_i,l_i}^{N_i} \sum_{k_j,l_j}^{N_j} C_{k_i k_j, l_i l_j}^{(i,j)}
    b_{k_i}^{\dagger} b_{k_j}^{\dagger} b_{l_i} b_{l_j},


where :math:`b^{\dagger}` and :math:`b` are the bosonic creation and annihilation
operators, :math:`M` represents the number of normal modes and :math:`N` is the number of
modals. The coefficients :math:`C` represent the one-mode and two-mode integrals defined as

.. math::

    C_{k_i, l_i}^{(i)} = \int \phi_i^{k_i}(Q_i) \left( T(Q_i) +
    V_1^{(i)}(Q_i) \right) \phi_i^{h_i}(Q_i),

and

.. math::

    C_{k_i, k_j, l_i, l_j}^{(i,j)} = \int \int \phi_i^{k_i}(Q_i) \phi_j^{k_j}(Q_j)
    V_2^{(i,j)}(Q_i, Q_j) \phi_i^{l_i}(Q_i) \phi_j^{l_j}(Q_j) \; \text{d} Q_i \text{d} Q_j,

where :math:`\phi` represents a modal, :math:`Q` represents a normal coordinate, :math:`T`
represents the kinetic energy operator and :math:`V` represents the potential energy operator.
Similarly, the three-mode integrals can be obtained following
Eq. D7 of `arXiv:2504.10602 <https://arxiv.org/abs/2504.10602>`_.

The bosonic creation and annihilation operators are then mapped to the Pauli operators as

.. math::

    b^\dagger_0 = \left(\frac{X_0 - iY_0}{2}\right), \:\: \text{...,} \:\:
    b^\dagger_n = \left(\frac{X_n - iY_n}{2}\right),

and

.. math::

    b_0 = \left(\frac{X_0 + iY_0}{2}\right), \:\: \text{...,} \:\:
    b_n = \left(\frac{X_n + iY_n}{2}\right),

where :math:`X` and :math:`Y` are the Pauli operators.

Args:
    pes(VibrationalPES): object containing the vibrational potential energy surface data
    n_states(int): maximum number of bosonic states per mode
    cubic(bool): Whether to include three-mode couplings. Default is ``False``.
    wire_map (dict): A dictionary defining how to map the states of the Bose operator to qubit
        wires. If ``None``, integers used to label the bosonic states will be used as wire
        labels. Defaults to ``None``.
    tol (float): tolerance for discarding the imaginary part of the coefficients

Returns:
    Operator: the Christiansen Hamiltonian in the qubit basis

**Example**

>>> symbols  = ['H', 'F']
>>> geometry = np.array([[0.0, 0.0, -0.40277116], [0.0, 0.0, 1.40277116]])
>>> mol = qp.qchem.Molecule(symbols, geometry)
>>> pes = qp.qchem.vibrational_pes(mol, optimize=False)
>>> qp.qchem.vibrational.christiansen_hamiltonian(pes, n_states = 4)
(
    0.08527499987546708 * I(0)
  + -0.0051774006335491545 * Z(0)
  + 0.0009697024705108074 * (X(0) @ X(1))
  + 0.0009697024705108074 * (Y(0) @ Y(1))
  + 0.0002321787923591865 * (X(0) @ X(2))
  + 0.0002321787923591865 * (Y(0) @ Y(2))
  + 0.0008190498635406456 * (X(0) @ X(3))
  + 0.0008190498635406456 * (Y(0) @ Y(3))
  + -0.015699890427524253 * Z(1)
  + 0.002790002362847834 * (X(1) @ X(2))
  + 0.002790002362847834 * (Y(1) @ Y(2))
  + 0.000687929225764568 * (X(1) @ X(3))
  + 0.000687929225764568 * (Y(1) @ Y(3))
  + -0.026572392417060237 * Z(2)
  + 0.005239546276220405 * (X(2) @ X(3))
  + 0.005239546276220405 * (Y(2) @ Y(3))
  + -0.037825316397333435 * Z(3)
)

## `christiansen_dipole`

```python
def christiansen_dipole(pes, n_states=16)
```

Returns Christiansen dipole operator.

The Christiansen dipole operator is constructed similar to the vibrational Hamiltonian operator
defined in Eqs. D4-D7 of `arXiv:2504.10602 <https://arxiv.org/abs/2504.10602>`_. The dipole
operator is defined as

.. math::

    \mu = \sum_{i}^M \sum_{k_i, l_i}^{N_i} C_{k_i, l_i}^{(i)} b_{k_i}^{\dagger} b_{l_i} +
    \sum_{i<j}^{M} \sum_{k_i,l_i}^{N_i} \sum_{k_j,l_j}^{N_j} C_{k_i k_j, l_i l_j}^{(i,j)}
    b_{k_i}^{\dagger} b_{k_j}^{\dagger} b_{l_i} b_{l_j},

where :math:`b^{\dagger}` and :math:`b` are the bosonic creation and annihilation
operators, :math:`M` represents the number of normal modes and :math:`N` is the number of
modals. The coefficients :math:`C` represent the one-mode and two-mode integrals defined as

.. math::

    C_{k_i, l_i}^{(i)} = \int \phi_i^{k_i}(Q_i) \left( D_1^{(i)}(Q_i) \right) \phi_i^{h_i}(Q_i),

and

.. math::

    C_{k_i, k_j, l_i, l_j}^{(i,j)} = \int \int \phi_i^{k_i}(Q_i) \phi_j^{k_j}(Q_j)
    D_2^{(i,j)}(Q_i, Q_j) \phi_i^{l_i}(Q_i) \phi_j^{l_j}(Q_j) \; \text{d} Q_i \text{d} Q_j,

where :math:`\phi` represents a modal, :math:`Q` represents a normal coordinate and :math:`D`
represents the dipole function obtained from the expansion

.. math::

    D({Q}) = \sum_i D_1(Q_i) + \sum_{i>j} D_2(Q_i,Q_j) + ....

Similarly, the three-mode integrals can be obtained following
Eq. D7 of `arXiv:2504.10602 <https://arxiv.org/abs/2504.10602>`_.

The bosonic creation and annihilation operators are then mapped to the Pauli operators as

.. math::

    b^\dagger_0 = \left(\frac{X_0 - iY_0}{2}\right), \:\: \text{...,} \:\:
    b^\dagger_n = \left(\frac{X_n - iY_n}{2}\right),

and

.. math::

    b_0 = \left(\frac{X_0 + iY_0}{2}\right), \:\: \text{...,} \:\:
    b_n = \left(\frac{X_n + iY_n}{2}\right),

where :math:`X` and :math:`Y` are the Pauli operators.

Args:
    pes(VibrationalPES): object containing the vibrational potential energy surface data
    n_states(int): maximum number of bosonic states per mode

Returns:
    tuple: a tuple containing:
        - Operator: the Christiansen dipole operator in the qubit basis for x-displacements
        - Operator: the Christiansen dipole operator in the qubit basis for y-displacements
        - Operator: the Christiansen dipole operator in the qubit basis for z-displacements

**Example**

>>> symbols  = ['H', 'F']
>>> geometry = np.array([[0.0, 0.0, -0.40277116], [0.0, 0.0, 1.40277116]])
>>> mol = qp.qchem.Molecule(symbols, geometry)
>>> pes = qp.qchem.vibrational_pes(mol, optimize=False, dipole_level=3, cubic=True)
>>> dipole = qp.qchem.vibrational.christiansen_dipole(pes, n_states = 4)
>>> dipole[2]
(
    (-0.005512522132269153+0j) * I(0)
  + (0.00037053485106913064+0j) * Z(0)
  + -0.011436347025770977 * (X(0) @ X(1))
  + (-0.011436347025770977+0j) * (Y(0) @ Y(1))
  + -0.0005031491268437766 * (X(0) @ X(2))
  + (-0.0005031491268437766+0j) * (Y(0) @ Y(2))
  + 4.230790346195971e-05 * (X(0) @ X(3))
  + (4.230790346195971e-05+0j) * (Y(0) @ Y(3))
  + (0.001082095170147779+0j) * Z(1)
  + -0.01610015762949269 * (X(1) @ X(2))
  + (-0.01610015762949269+0j) * (Y(1) @ Y(2))
  + -0.0008228492926524582 * (X(1) @ X(3))
  + (-0.0008228492926524582+0j) * (Y(1) @ Y(3))
  + (0.001734095461712748+0j) * Z(2)
  + -0.01960990751144681 * (X(2) @ X(3))
  + (-0.01960990751144681+0j) * (Y(2) @ Y(3))
  + (0.002325796649339495+0j) * Z(3)
)
