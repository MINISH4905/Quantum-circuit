---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/number.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/number.py
license: Apache-2.0
---

## Module `pennylane/qchem/number.py`

This module contains the functions needed for computing the particle number observable.

## `particle_number`

```python
def particle_number(orbitals)
```

Compute the particle number observable :math:`\hat{N}=\sum_\alpha \hat{n}_\alpha`
in the Pauli basis.

The particle number operator is given by

.. math::

    \hat{N} = \sum_\alpha \hat{c}_\alpha^\dagger \hat{c}_\alpha,

where the index :math:`\alpha` runs over the basis of single-particle states
:math:`\vert \alpha \rangle`, and the operators :math:`\hat{c}^\dagger` and :math:`\hat{c}` are
the particle creation and annihilation operators, respectively.

Args:
    orbitals (int): Number of *spin* orbitals. If an active space is defined, this is
        the number of active spin-orbitals.

Returns:
    pennylane.Hamiltonian: the particle number observable

Raises:
    ValueError: If orbitals is less than or equal to 0

**Example**

>>> orbitals = 4
>>> print(particle_number(orbitals))
(
    2.0 * I(0)
  + -0.5 * Z(0)
  + -0.5 * Z(1)
  + -0.5 * Z(2)
  + -0.5 * Z(3)
)
