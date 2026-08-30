---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/vibrational/vibrational_class.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/vibrational/vibrational_class.py
license: Apache-2.0
---

## Module `pennylane/qchem/vibrational/vibrational_class.py`

This module contains functions and classes to generate data needed to construct a
vibrational Hamiltonian for a given molecule.

## `VibrationalPES`

```python
class VibrationalPES
```

Data class to store information needed to construct a vibrational Hamiltonian for a molecule.

Args:
    freqs (array[float]): normal-mode frequencies in atomic units
    grid (array[float]): grid points to compute potential energy surface data.
        Should be the sample points of the Gauss-Hermite quadrature.
    gauss_weights (array[float]): weights associate with each point in ``grid``.
        Should be the weights of the Gauss-Hermite quadrature.
    uloc (TensorLike[float]): normal mode localization matrix with shape ``(m, m)`` where
        ``m = len(freqs)``
    pes_data (list[TensorLike[float]]): list of one-mode, two-mode and three-mode potential
        energy surface data, with shapes ``(m, l)``, ``(m, m, l, l)`` ``(m, m, m, l, l, l)``,
        respectively, where ``m = len(freqs)`` and ``l > 0``
    dipole_data (list[TensorLike[float]]): list of  one-mode, two-mode and three-mode dipole
        moment data, with shapes ``(m, l, 3)``, ``(m, m, l, l, 3)`` ``(m, m, m, l, l, l, 3)``,
        respectively, where ``m = len(freqs)`` and ``l > 0``
    localized (bool): Whether the potential energy surface data correspond to localized normal
        modes. Default is ``True``.
    dipole_level (int): The level up to which dipole moment data are to be calculated. Input
        values can be ``1``, ``2``, or ``3`` for up to one-mode dipole, two-mode dipole and
        three-mode dipole, respectively. Default value is ``1``.

**Example**

This example shows how to construct the :class:`~.qchem.vibrational.VibrationalPES` object for a
linear diatomic molecule, e.g., :math:`H_2`, with only one vibrational normal mode. The one-mode
potential energy surface data is obtained by sampling ``9`` points along the normal mode, with
grid points and weights that correspond to a Gauss-Hermite quadrature.

>>> freqs = np.array([0.01885397])
>>> grid, weights = np.polynomial.hermite.hermgauss(9)
>>> pes_onemode = [[0.05235573, 0.03093067, 0.01501878, 0.00420778, 0.0,
...                 0.00584504, 0.02881817, 0.08483433, 0.22025702]]
>>> vib_pes = qp.qchem.VibrationalPES(freqs=freqs, grid=grid,
...           gauss_weights=weights, pes_data=[pes_onemode])
>>> vib_pes.freqs
array([0.01885397])

The following example shows how to construct the :class:`~.qchem.vibrational.VibrationalPES`
object for a nonlinear triatomic molecule, e.g., :math:`H_3^+`, with three vibrational
normal modes. We assume that the potential energy surface and dipole data are obtained by
sampling ``5`` points along the normal mode, with grid points and weights that correspond to a
Gauss-Hermite quadrature.

>>> freqs = np.array([0.00978463, 0.00978489, 0.01663723])
>>> grid, weights = np.polynomial.hermite.hermgauss(5)
>>>
>>> uloc = np.array([[-0.99098585,  0.13396657,  0.],
...                  [-0.13396657, -0.99098585,  0.],
...                  [ 0.        ,  0.        ,  1.]])
>>>
>>> pes_onemode = np.random.rand(3, 5)
>>> pes_twomode = np.random.rand(3, 3, 5, 5)
>>> pes_threemode = np.random.rand(3, 3, 3, 5, 5, 5)
>>>
>>> dipole_onemode = np.random.rand(3, 5, 3)
>>> dipole_twomode = np.random.rand(3, 3, 5, 5, 3)
>>> dipole_threemode = np.random.rand(3, 3, 3, 5, 5, 5, 3)
>>>
>>> localized = True
>>> dipole_level = 3
>>>
>>> vib_obj = qp.qchem.VibrationalPES(freqs=freqs, grid=grid, gauss_weights=weights,
...           uloc=uloc, pes_data=[pes_onemode, pes_twomode, pes_threemode],
...           dipole_data=[dipole_onemode, dipole_twomode, dipole_threemode],
...           localized=True, dipole_level=3)
>>> print(vib_obj.dipole_threemode.shape)
(3, 3, 3, 5, 5, 5, 3)

## `optimize_geometry`

```python
def optimize_geometry(molecule, method='rhf')
```

Computes the equilibrium geometry of a molecule.

Args:
    molecule (~qchem.molecule.Molecule): the molecule object
    method (str): Electronic structure method used to perform geometry optimization.
        Available options are ``"rhf"`` and ``"uhf"`` for restricted and unrestricted
        Hartree-Fock, respectively. Default is ``"rhf"``.

Returns:
    array[array[float]]: optimized atomic positions in Cartesian coordinates

**Example**

>>> symbols  = ['H', 'F']
>>> geometry = np.array([[0.0, 0.0, 0.0],
...                      [0.0, 0.0, 1.0]])
>>> mol = qp.qchem.Molecule(symbols, geometry)
>>> eq_geom = qp.qchem.optimize_geometry(mol)
>>> eq_geom
array([[ 0.        ,  0.        , -0.40277116],
       [ 0.        ,  0.        ,  1.40277116]])
