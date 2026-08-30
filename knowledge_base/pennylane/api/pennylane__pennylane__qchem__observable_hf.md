---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/observable_hf.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/observable_hf.py
license: Apache-2.0
---

## Module `pennylane/qchem/observable_hf.py`

This module contains the functions needed for creating fermionic and qubit observables.

## `fermionic_observable`

```python
def fermionic_observable(constant, one=None, two=None, cutoff=1e-12)
```

Create a fermionic observable from molecular orbital integrals.

Args:
    constant (array[float]): the contribution of the core orbitals and nuclei
    one (array[float]): the one-particle molecular orbital integrals
    two (array[float]): the two-particle molecular orbital integrals
    cutoff (float): cutoff value for discarding the negligible integrals

Returns:
    ~.FermiSentence: fermionic observable

**Example**

>>> constant = np.array([1.0])
>>> integral = np.array([[0.5, -0.8270995], [-0.8270995, 0.5]])
>>> fermionic_observable(constant, integral)
1.0 * I
+ 0.5 * a⁺(0) a(0)
+ -0.8270995 * a⁺(0) a(2)
+ 0.5 * a⁺(1) a(1)
+ -0.8270995 * a⁺(1) a(3)
+ -0.8270995 * a⁺(2) a(0)
+ 0.5 * a⁺(2) a(2)
+ -0.8270995 * a⁺(3) a(1)
+ 0.5 * a⁺(3) a(3)

## `qubit_observable`

```python
def qubit_observable(o_ferm, cutoff=1e-12, mapping='jordan_wigner')
```

Convert a fermionic observable to a PennyLane qubit observable.

Args:
    o_ferm (Union[~.FermiWord, ~.FermiSentence]): fermionic operator
    cutoff (float): cutoff value for discarding the negligible terms
    mapping (str): Specifies the fermion-to-qubit mapping. Input values can
        be ``'jordan_wigner'``, ``'parity'`` or ``'bravyi_kitaev'``.
Returns:
    Operator: Simplified PennyLane Hamiltonian

**Example**

>>> w1 = qp.FermiWord({(0, 0) : '+', (1, 1) : '-'})
>>> w2 = qp.FermiWord({(0, 0) : '+', (1, 1) : '-'})
>>> s = qp.FermiSentence({w1 : 1.2, w2: 3.1})
>>> print(qubit_observable(s))
-0.775j * (Y(0) @ X(1)) + 0.775 * (Y(0) @ Y(1)) + 0.775 * (X(0) @ X(1)) + 0.775j * (X(0) @ Y(1))
