---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/matrices.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/matrices.py
license: Apache-2.0
---

## Module `pennylane/qchem/matrices.py`

This module contains the functions needed for computing matrices.

## `mol_density_matrix`

```python
def mol_density_matrix(n_electron, c)
```

Compute the molecular density matrix.

The density matrix :math:`P` is computed from the molecular orbital coefficients :math:`C` as

.. math::

    P_{\mu \nu} = \sum_{i=1}^{N} C_{\mu i} C_{\nu i},

where :math:`N = N_{electrons} / 2` is the number of occupied orbitals. Note that the total
density matrix is the sum of the :math:`\alpha` and :math:`\beta` density
matrices, :math:`P = P^{\alpha} + P^{\beta}`.

Args:
    n_electron (integer): number of electrons
    c (array[array[float]]): molecular orbital coefficients

Returns:
    array[array[float]]: density matrix

**Example**

>>> c = np.array([[-0.54828771,  1.21848441], [-0.54828771, -1.21848441]])
>>> n_electron = 2
>>> mol_density_matrix(n_electron, c)
array([[0.30061941, 0.30061941], [0.30061941, 0.30061941]])

## `overlap_matrix`

```python
def overlap_matrix(basis_functions)
```

Return a function that computes the overlap matrix for a given set of basis functions.

Args:
    basis_functions (list[~qchem.basis_set.BasisFunction]): basis functions

Returns:
    function: function that computes the overlap matrix

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.0]], requires_grad = False)
>>> alpha = np.array([[3.42525091, 0.62391373, 0.1688554],
>>>                   [3.42525091, 0.62391373, 0.1688554]], requires_grad=True)
>>> mol = qp.qchem.Molecule(symbols, geometry, alpha=alpha)
>>> args = [alpha]
>>> overlap_matrix(mol.basis_set)(*args)
array([[1.0, 0.7965883009074122], [0.7965883009074122, 1.0]])

## `moment_matrix`

```python
def moment_matrix(basis_functions, order, idx)
```

Return a function that computes the multipole moment matrix for a set of basis functions.

Args:
    basis_functions (list[~qchem.basis_set.BasisFunction]): basis functions
    order (integer): exponent of the position component
    idx (integer): index determining the dimension of the multipole moment integral

Returns:
    function: function that computes the multipole moment matrix

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0], [2.0, 0.0, 0.0]], requires_grad = False)
>>> alpha = np.array([[3.42525091, 0.62391373, 0.1688554],
>>>                   [3.42525091, 0.62391373, 0.1688554]], requires_grad=True)
>>> mol = qp.qchem.Molecule(symbols, geometry, alpha=alpha)
>>> args = [alpha]
>>> order, idx = 1, 0
>>> moment_matrix(mol.basis_set, order, idx)(*args)
tensor([[0.0, 0.4627777], [0.4627777, 2.0]], requires_grad=True)

## `kinetic_matrix`

```python
def kinetic_matrix(basis_functions)
```

Return a function that computes the kinetic matrix for a given set of basis functions.

Args:
    basis_functions (list[~qchem.basis_set.BasisFunction]): basis functions

Returns:
    function: function that computes the kinetic matrix

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.0]], requires_grad = False)
>>> alpha = np.array([[3.42525091, 0.62391373, 0.1688554],
>>>                   [3.42525091, 0.62391373, 0.1688554]], requires_grad=True)
>>> mol = qp.qchem.Molecule(symbols, geometry, alpha=alpha)
>>> args = [alpha]
>>> kinetic_matrix(mol.basis_set)(*args)
array([[0.76003189, 0.38325367], [0.38325367, 0.76003189]])

## `attraction_matrix`

```python
def attraction_matrix(basis_functions, charges, r)
```

Return a function that computes the electron-nuclear attraction matrix for a given set of
basis functions.

Args:
    basis_functions (list[~qchem.basis_set.BasisFunction]): basis functions
    charges (list[int]): nuclear charges
    r (array[float]): nuclear positions

Returns:
    function: function that computes the electron-nuclear attraction matrix

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.0]], requires_grad = False)
>>> alpha = np.array([[3.42525091, 0.62391373, 0.1688554],
>>>                   [3.42525091, 0.62391373, 0.1688554]], requires_grad=True)
>>> mol = qp.qchem.Molecule(symbols, geometry, alpha=alpha)
>>> args = [alpha]
>>> attraction_matrix(mol.basis_set, mol.nuclear_charges, mol.coordinates)(*args)
array([[-2.03852057, -1.60241667], [-1.60241667, -2.03852057]])

## `repulsion_tensor`

```python
def repulsion_tensor(basis_functions)
```

Return a function that computes the electron repulsion tensor for a given set of basis
functions.

Args:
    basis_functions (list[~qchem.basis_set.BasisFunction]): basis functions

Returns:
    function: function that computes the electron repulsion tensor

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.0]], requires_grad = False)
>>> alpha = np.array([[3.42525091, 0.62391373, 0.1688554],
>>>                   [3.42525091, 0.62391373, 0.1688554]], requires_grad=True)
>>> mol = qp.qchem.Molecule(symbols, geometry, alpha=alpha)
>>> args = [alpha]
>>> repulsion_tensor(mol.basis_set)(*args)
array([[[[0.77460595, 0.56886144], [0.56886144, 0.65017747]],
        [[0.56886144, 0.45590152], [0.45590152, 0.56886144]]],
       [[[0.56886144, 0.45590152], [0.45590152, 0.56886144]],
        [[0.65017747, 0.56886144],[0.56886144, 0.77460595]]]])

## `core_matrix`

```python
def core_matrix(basis_functions, charges, r)
```

Return a function that computes the core matrix for a given set of basis functions.

The core matrix is computed as a sum of the kinetic and electron-nuclear attraction matrices.

Args:
    basis_functions (list[~qchem.basis_set.BasisFunction]): basis functions
    charges (list[int]): nuclear charges
    r (array[float]): nuclear positions

Returns:
    function: function that computes the core matrix

**Example**

>>> symbols  = ['H', 'H']
>>> geometry = np.array([[0.0, 0.0, 0.0], [0.0, 0.0, 1.0]], requires_grad = False)
>>> alpha = np.array([[3.42525091, 0.62391373, 0.1688554],
>>>                   [3.42525091, 0.62391373, 0.1688554]], requires_grad=True)
>>> mol = qp.qchem.Molecule(symbols, geometry, alpha=alpha)
>>> args = [alpha]
>>> core_matrix(mol.basis_set, mol.nuclear_charges, mol.coordinates)(*args)
array([[-1.27848869, -1.21916299], [-1.21916299, -1.27848869]])
