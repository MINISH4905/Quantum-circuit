---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/molecule.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/molecule.py
license: Apache-2.0
---

## Module `pennylane/qchem/molecule.py`

This module contains functions and classes to create a
:class:`~pennylane.qchem.molecule.Molecule` object. This object stores all
the necessary information to perform a Hartree-Fock calculation for a given molecule.

## `Molecule`

```python
class Molecule
```

Create a molecule object that stores molecular information and default basis set parameters.

The molecule object can be passed to functions that perform a Hartree-Fock calculation.

Args:
    symbols (list[str]): Symbols of the atomic species in the molecule. Currently, atoms with
        atomic numbers 1-10 are supported.
    coordinates (array[float]): 1D array with the atomic positions in Cartesian coordinates. The
        coordinates must be given in atomic units and the size of the array should be ``3*N``
        where ``N`` is the number of atoms.
    charge (int): net charge of the molecule
    mult (int): Spin multiplicity :math:`\mathrm{mult}=N_\mathrm{unpaired} + 1` for
        :math:`N_\mathrm{unpaired}` unpaired electrons occupying the HF orbitals.
    basis_name (str): Atomic basis set used to represent the molecular orbitals. Currently, the
        only supported basis sets are ``STO-3G``, ``6-31G``, ``6-311G`` and ``CC-PVDZ``. Other
        basis sets can be loaded from the basis-set-exchange library using ``load_data``.
    load_data (bool): flag to load data from the basis-set-exchange library
    l (tuple[int]): angular momentum quantum numbers of the basis function
    alpha (array[float]): exponents of the primitive Gaussian functions
    coeff (array[float]): coefficients of the contracted Gaussian functions
    r (array[float]): positions of the Gaussian functions
    normalize (bool): if True, the basis functions get normalized
    unit (str): unit of atomic coordinates. Available options are ``unit="bohr"`` and ``unit="angstrom"``.

.. note::
    :class:`~.qchem.Molecule` is not currently compatible with :func:`~.qjit` and ``jax.jit``.

**Example**

Import necessary modules:

>>> from pennylane import numpy as np
>>> from pennylane.qchem import Molecule

Define molecular symbols and geometry:

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, -0.694349],
...                      [0.0, 0.0,  0.694349]], requires_grad = True)
>>> mol = Molecule(symbols, geometry)
>>> print(mol.n_electrons)
2

### `__repr__`

```python
def __repr__(self)
```

Returns the molecule representation in string format

### `atomic_orbital`

```python
def atomic_orbital(self, index)
```

Return a function that evaluates an atomic orbital at a given position.

Args:
    index (int): index of the atomic orbital, order follwos the order of atomic symbols

Returns:
    function: function that computes the value of the orbital at a given position

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.0]], requires_grad = False)
>>> mol = qp.qchem.Molecule(symbols, geometry)
>>> ao = mol.atomic_orbital(0)
>>> ao(0.0, 0.0, 0.0)
0.62824688

### `molecular_orbital`

```python
def molecular_orbital(self, index)
```

Return a function that evaluates a molecular orbital at a given position.

Args:
    index (int): index of the molecular orbital

Returns:
    function: function to evaluate the molecular orbital

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.0]], requires_grad = False)
>>> mol = qp.qchem.Molecule(symbols, geometry)
>>> qp.qchem.scf(mol)() # run scf to obtain the optimized molecular orbitals
>>> mo = mol.molecular_orbital(1)
>>> mo(0.0, 0.0, 0.0)
0.01825128
