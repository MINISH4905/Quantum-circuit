---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/spin.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/spin.py
license: Apache-2.0
---

## Module `pennylane/qchem/spin.py`

This module contains the functions needed for computing the spin observables.

## `spin2`

```python
def spin2(electrons, orbitals)
```

Compute the total spin observable :math:`\hat{S}^2`.

The total spin observable :math:`\hat{S}^2` is given by

.. math::

    \hat{S}^2 = \frac{3}{4}N + \sum_{ \bm{\alpha}, \bm{\beta}, \bm{\gamma}, \bm{\delta} }
    \langle \bm{\alpha}, \bm{\beta} \vert \hat{s}_1 \cdot \hat{s}_2
    \vert \bm{\gamma}, \bm{\delta} \rangle ~
    \hat{c}_\bm{\alpha}^\dagger \hat{c}_\bm{\beta}^\dagger
    \hat{c}_\bm{\gamma} \hat{c}_\bm{\delta},

where the two-particle matrix elements are computed as,

.. math::

    \langle \bm{\alpha}, \bm{\beta} \vert \hat{s}_1 \cdot \hat{s}_2
    \vert \bm{\gamma}, \bm{\delta} \rangle = && \delta_{\alpha,\delta} \delta_{\beta,\gamma} \\
    && \times \left( \frac{1}{2} \delta_{s_{z_\alpha}, s_{z_\delta}+1}
    \delta_{s_{z_\beta}, s_{z_\gamma}-1} + \frac{1}{2} \delta_{s_{z_\alpha}, s_{z_\delta}-1}
    \delta_{s_{z_\beta}, s_{z_\gamma}+1} + s_{z_\alpha} s_{z_\beta}
    \delta_{s_{z_\alpha}, s_{z_\delta}} \delta_{s_{z_\beta}, s_{z_\gamma}} \right).

In the equations above :math:`N` is the number of electrons, :math:`\alpha` refer to the
quantum numbers of the spatial wave function and :math:`s_{z_\alpha}` is
the spin projection of the single-particle state
:math:`\vert \bm{\alpha} \rangle \equiv \vert \alpha, s_{z_\alpha} \rangle`.
The operators :math:`\hat{c}^\dagger` and :math:`\hat{c}` are the particle creation
and annihilation operators, respectively.

Args:
    electrons (int): Number of electrons. If an active space is defined, this is
        the number of active electrons.
    orbitals (int): Number of *spin* orbitals. If an active space is defined,  this is
        the number of active spin-orbitals.

Returns:
    pennylane.Hamiltonian: the total spin observable :math:`\hat{S}^2`

Raises:
    ValueError: If electrons or orbitals is less than or equal to 0

**Example**

>>> electrons = 2
>>> orbitals = 4
>>> spin2(electrons, orbitals)
(
    0.75 * I(0)
  + 0.375 * Z(0)
  + 0.375 * Z(1)
  + -0.375 * (Z(0) @ Z(1))
  + 0.375 * Z(2)
  + 0.125 * (Z(0) @ Z(2))
  + 0.375 * Z(3)
  + -0.125 * (Z(0) @ Z(3))
  + -0.125 * (Z(1) @ Z(2))
  + 0.125 * (Z(1) @ Z(3))
  + -0.375 * (Z(2) @ Z(3))
  + 0.125 * (Y(0) @ Y(2) @ X(3) @ X(1))
  + 0.125 * (Y(0) @ X(2) @ X(3) @ Y(1))
  + 0.125 * (Y(0) @ Y(2) @ Y(3) @ Y(1))
  + -0.125 * (Y(0) @ X(2) @ Y(3) @ X(1))
  + -0.125 * (X(0) @ Y(2) @ X(3) @ Y(1))
  + 0.125 * (X(0) @ X(2) @ X(3) @ X(1))
  + 0.125 * (X(0) @ Y(2) @ Y(3) @ X(1))
  + 0.125 * (X(0) @ X(2) @ Y(3) @ Y(1))
)

## `spinz`

```python
def spinz(orbitals)
```

Computes the total spin projection observable :math:`\hat{S}_z`.

The total spin projection operator :math:`\hat{S}_z` is given by

.. math::

    \hat{S}_z = \sum_{\alpha, \beta} \langle \alpha \vert \hat{s}_z \vert \beta \rangle
    ~ \hat{c}_\alpha^\dagger \hat{c}_\beta, ~~ \langle \alpha \vert \hat{s}_z
    \vert \beta \rangle = s_{z_\alpha} \delta_{\alpha,\beta},

where :math:`s_{z_\alpha} = \pm 1/2` is the spin-projection of the single-particle state
:math:`\vert \alpha \rangle`. The operators :math:`\hat{c}^\dagger` and :math:`\hat{c}`
are the particle creation and annihilation operators, respectively.

Args:
    orbitals (str): Number of *spin* orbitals. If an active space is defined, this is
        the number of active spin-orbitals.

Returns:
    pennylane.Hamiltonian: the total spin projection observable :math:`\hat{S}_z`

Raises:
    ValueError: If orbitals is less than or equal to 0

**Example**

>>> orbitals = 4
>>> print(spinz(orbitals))
(
    -0.25 * Z(0)
  + 0.25 * Z(1)
  + -0.25 * Z(2)
  + 0.25 * Z(3)
)
