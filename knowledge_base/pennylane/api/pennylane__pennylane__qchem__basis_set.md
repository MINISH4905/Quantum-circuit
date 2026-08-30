---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/basis_set.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/basis_set.py
license: Apache-2.0
---

## Module `pennylane/qchem/basis_set.py`

This module contains functions and classes to create a
:class:`~pennylane.qchem.basis_set.BasisFunction` object from standard basis sets such as STO-3G.

## `BasisFunction`

```python
class BasisFunction
```

Create a basis function object.

A basis set is composed of a set of basis functions that are typically constructed as a linear
combination of primitive Gaussian functions. For instance, a basis function in the STO-3G basis
set is formed as

.. math::

    \psi = a_1 G_1 + a_2 G_2 + a_3 G_3,

where :math:`a` denotes the contraction coefficients and :math:`G` is a Gaussian function
defined as

.. math::

    G = x^l y^m z^n e^{-\alpha r^2}.

Each Gaussian function is characterized by the angular momentum numbers :math:`(l, m, n)` that
determine the type of the orbital, the exponent :math:`\alpha` and the position vector
:math:`r = (x, y, z)`. These parameters and the contraction coefficients :math:`a` define
atomic basis functions. Predefined values of the exponents and contraction coefficients for
each atomic orbital of a given chemical element can be obtained from reference libraries such as
the Basis Set Exchange `library <https://www.basissetexchange.org>`_.

The basis function object created by the BasisFunction class stores all the basis set parameters
including the angular momentum, exponents, positions and coefficients of the Gaussian functions.

The basis function object can be easily passed to the functions that compute various types of
integrals over such functions, e.g., overlap integrals, which are essential for Hartree-Fock
calculations.

Args:
    l (tuple[int]): angular momentum numbers of the basis function.
    alpha (array(float)): exponents of the primitive Gaussian functions
    coeff (array(float)): coefficients of the contracted Gaussian functions
    r (array(float)): positions of the Gaussian functions

## `atom_basis_data`

```python
def atom_basis_data(name, atom, load_data=False)
```

Generate default basis set parameters for an atom.

This function extracts the angular momentum, exponents, and contraction coefficients of
Gaussian functions forming atomic orbitals for a given atom. These values are taken, by default,
from the basis set data provided in :mod:`~pennylane.qchem.basis_data`. If `load_data = True`,
the basis set data is loaded from the basis-set-exchange library.

Args:
    name (str): name of the basis set
    atom (str): atomic symbol of the chemical element
    load_data (bool): flag to load data from the basis-set-exchange library

Returns:
    list(tuple): tuple containing the angular momentum, the exponents and contraction
    coefficients of a basis function

**Example**

>>> params = atom_basis_data('sto-3g', 'H')
>>> print(params)
[((0, 0, 0), [3.425250914, 0.6239137298, 0.168855404], [0.1543289673, 0.5353281423, 0.4446345422])]

## `mol_basis_data`

```python
def mol_basis_data(name, symbols, load_data=False)
```

Generates default basis set parameters for a molecule.

This function generates the default basis set parameters for a list of atomic symbols and
computes the total number of basis functions for each atom.

Args:
    name (str): name of the basis set
    symbols (list[str]): symbols of the atomic species in the molecule
    load_data (bool): flag to load data from the basis-set-exchange library

Returns:
    tuple(list, tuple): the number of atomic basis functions and the basis set parameters for
    each atom in the molecule

**Example**

>>> n_basis, params = mol_basis_data('sto-3g', ['H', 'H'])
>>> print(n_basis)
[1, 1]
>>> print(params)
(((0, 0, 0), [3.425250914, 0.6239137298, 0.168855404], [0.1543289673, 0.5353281423, 0.4446345422]),
 ((0, 0, 0), [3.425250914, 0.6239137298, 0.168855404], [0.1543289673, 0.5353281423, 0.4446345422]))
