---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/convert.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/convert.py
license: Apache-2.0
---

## Module `pennylane/qchem/convert.py`

This module contains the functions for converting an external operator to a Pennylane operator.

## `import_operator`

```python
def import_operator(qubit_observable, format='openfermion', wires=None, tol=10000000000.0)
```

Convert an external operator to a PennyLane operator.

We currently support `OpenFermion <https://quantumai.google/openfermion>`__ operators: the function accepts most types of
OpenFermion qubit operators, such as those corresponding to Pauli words and sums of Pauli words.

Args:
    qubit_observable: external qubit operator that will be converted
    format (str): the format of the operator object to convert from
    wires (.Wires, list, tuple, dict): Custom wire mapping used to convert the external qubit
        operator to a PennyLane operator.
        For types ``Wires``/list/tuple, each item in the iterable represents a wire label
        for the corresponding qubit index.
        For type dict, only int-keyed dictionaries (for qubit-to-wire conversion) are accepted.
        If ``None``, the identity map (e.g., ``0->0, 1->1, ...``) will be used.
    tol (float): Tolerance in `machine epsilon <https://numpy.org/doc/stable/reference/generated/numpy.real_if_close.html>`_
        for the imaginary part of the coefficients in ``qubit_observable``.
        Coefficients with imaginary part less than :math:`(2.22 \cdot 10^{-16}) \cdot \text{tol}` are considered to be real.

Returns:
    (.Operator): PennyLane operator representing any operator expressed as linear combinations of
    Pauli words, e.g.,
    :math:`\sum_{k=0}^{N-1} c_k O_k`

**Example**

>>> h_pl = import_operator(h_of, format='openfermion')
>>> print(h_pl)
(-0.0548 * X(0 @ X(1) @ Y(2) @ Y(3))) + (0.14297 * Z(0 @ Z(1)))

## `import_state`

```python
def import_state(solver, tol=1e-15)
```

Convert an external wavefunction to a state vector.

The sources of wavefunctions that are currently accepted are listed below.

    * The PySCF library (the restricted and unrestricted CISD/CCSD
      methods are supported). The `solver` argument is then the associated PySCF CISD/CCSD Solver object.
    * The library Dice implementing the SHCI method. The `solver` argument is then the tuple(list[str], array[float]) of Slater determinants and their coefficients.
    * The library Block2 implementing the DMRG method. The `solver` argument is then the tuple(list[int], array[float]) of Slater determinants and their coefficients.

Args:
    solver: external wavefunction object
    tol (float): the tolerance for discarding Slater determinants based on their coefficients

Raises:
    ValueError: if external object type is not supported

Returns:
    array: normalized state vector of length :math:`2^M`, where :math:`M` is the number of spin orbitals

**Example**

>>> from pyscf import gto, scf, ci
>>> mol = gto.M(atom=[['H', (0, 0, 0)], ['H', (0,0,0.71)]], basis='sto6g')
>>> myhf = scf.UHF(mol).run()
>>> myci = ci.UCISD(myhf).run()
>>> wf_cisd = qp.qchem.import_state(myci, tol=1e-1)
>>> print(wf_cisd)
[ 0.        +0.j  0.        +0.j  0.        +0.j  0.1066467 +0.j
  0.        +0.j  0.        +0.j  0.        +0.j  0.        +0.j
  0.        +0.j  0.        +0.j  0.        +0.j  0.        +0.j
 -0.99429698+0.j  0.        +0.j  0.        +0.j  0.        +0.j]
