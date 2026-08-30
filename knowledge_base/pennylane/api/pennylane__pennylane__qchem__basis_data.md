---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/basis_data.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/basis_data.py
license: Apache-2.0
---

## Module `pennylane/qchem/basis_data.py`

This module contains basis set parameters defining Gaussian-type orbitals for a selected number of
atoms. The data are taken from the Basis Set Exchange `library <https://www.basissetexchange.org>`_.
The current data includes the STO-3G, 6-31G, 6-311G and CC-PVDZ, basis sets for elements with atomic
numbers 1-10.

## `load_basisset`

```python
def load_basisset(basis, element)
```

Extracts basis set data from the Basis Set Exchange library.

Args:
    basis (str): name of the basis set
    element (str): atomic symbol of the chemical element

Returns:
    dict[str, list]: dictionary containing orbital names, and the exponents and contraction
    coefficients of a basis function

**Example**

>>> basis = '6-31g'
>>> element = 'He'
>>> basis = qp.qchem.load_basisset(basis, element)
>>> basis
{'orbitals': ['S', 'S'],
 'exponents': [[38.421634, 5.77803, 1.241774], [0.297964]],
 'coefficients': [[0.04013973935, 0.261246097, 0.7931846246], [1.0]]}
