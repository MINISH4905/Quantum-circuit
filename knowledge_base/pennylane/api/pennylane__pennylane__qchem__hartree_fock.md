---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/hartree_fock.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/hartree_fock.py
license: Apache-2.0
---

## Module `pennylane/qchem/hartree_fock.py`

This module contains the functions needed for performing the self-consistent-field calculations.

## `scf`

```python
def scf(mol, n_steps=50, tol=1e-08)
```

Return a function that performs the self-consistent-field calculations.

In the Hartree-Fock method, molecular orbitals are typically constructed as a linear combination
of atomic orbitals

.. math::

    \phi_i(r) = \sum_{\mu} C_{\mu i} \chi_{\mu}(r),

with coefficients :math:`C_{\mu i}` that are initially unknown. The self-consistent-field
iterations are performed to find a converged set of molecular orbital coefficients that minimize
the total energy of the molecular system. This optimization problem can be reduced to solving a
linear system of equations which are usually written as

.. math::

    FC = SCE,

where :math:`E` is a diagonal matrix of eigenvalues, representing the molecular orbital
energies, :math:`C` is the matrix of molecular orbital coefficients, :math:`S` is the overlap
matrix and :math:`F` is the Fock matrix, which also depends on the coefficients. Fixing an
initial guess :math:`C_0`, the corresponding :math:`F_0` is built and the system
:math:`F_0C_0 = SC_0E` is solved to obtain a solution :math:`C_1`. This process is iteratively
repeated until the coefficients are converged.

The key step in in this process is constructing the Fock matrix which is defined as

.. math::

    F = H + \frac{1}{2} J - K,

where :math:`H`, :math:`J` and :math:`K` are the core Hamiltonian matrix, Coulomb matrix and
exchange matrix, respectively. The entries of :math:`H` are computed from the electronic kinetic
energy and the electron-nuclear attraction integrals, which are integrals over atomic basis
functions. The elements of the :math:`J` and :math:`K` matrices are obtained from the Coulomb
and exchange integrals over the basis functions.

Following the procedure in
[`Lehtola et al. Molecules 2020, 25, 1218 <https://www.mdpi.com/1420-3049/25/5/1218>`_], we
express the molecular orbital coefficients in terms of a matrix :math:`X` as
:math:`C = X \tilde{C}` which gives the following transformed equation

.. math::

     \tilde{F} \tilde{C} = \tilde{S} \tilde{C} E,

where :math:`\tilde{F} = X^T F X`, :math:`\tilde{S} = X^T S X` and :math:`S` is the overlap
matrix. We chose :math:`X` such that :math:`\tilde{S} = 1` as

.. math::

    X = V \Lambda^{-1/2} V^T,

where :math:`V` and :math:`\Lambda` are the eigenvectors and eigenvalues of :math:`S`,
respectively. This gives the eigenvalue equation

.. math::

     \tilde{F}\tilde{C} = \tilde{C}E,

which is solved with conventional methods iteratively.

Args:
    mol (~qchem.molecule.Molecule): the molecule object
    n_steps (int): the number of iterations
    tol (float): convergence tolerance

Returns:
    function: function that performs the self-consistent-field calculations

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.0]], requires_grad = False)
>>> alpha = np.array([[3.42525091, 0.62391373, 0.1688554],
>>>                   [3.42525091, 0.62391373, 0.1688554]], requires_grad=True)
>>> mol = qp.qchem.Molecule(symbols, geometry, alpha=alpha)
>>> args = [alpha]
>>> v_fock, coeffs, fock_matrix, h_core, rep_tensor = scf(mol)(*args)
>>> v_fock
array([-0.67578019,  0.94181155])

## `nuclear_energy`

```python
def nuclear_energy(charges, r)
```

Return a function that computes the nuclear-repulsion energy.

The nuclear-repulsion energy is computed as

.. math::

    \sum_{i>j}^n \frac{q_i q_j}{r_{ij}},

where :math:`q`, :math:`r` and :math:`n` denote the nuclear charges (atomic numbers), nuclear
positions and the number of nuclei, respectively.

Args:
    charges (list[int]): nuclear charges in atomic units
    r (array[float]): nuclear positions

Returns:
    function: function that computes the nuclear-repulsion energy

**Example**

>>> symbols  = ['H', 'F']
>>> geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 2.0]], requires_grad = True)
>>> mol = qp.qchem.Molecule(symbols, geometry)
>>> args = [mol.coordinates]
>>> e = nuclear_energy(mol.nuclear_charges, mol.coordinates)(*args)
>>> print(e)
4.5

## `hf_energy`

```python
def hf_energy(mol)
```

Return a function that computes the Hartree-Fock energy.

Args:
    mol (~qchem.molecule.Molecule): the molecule object

Returns:
    function: function that computes the Hartree-Fock energy

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.0]], requires_grad = False)
>>> alpha = np.array([[3.42525091, 0.62391373, 0.1688554],
>>>                   [3.42525091, 0.62391373, 0.1688554]], requires_grad=True)
>>> mol = qp.qchem.Molecule(symbols, geometry, alpha=alpha)
>>> args = [alpha]
>>> hf_energy(mol)(*args)
-1.065999461545263
