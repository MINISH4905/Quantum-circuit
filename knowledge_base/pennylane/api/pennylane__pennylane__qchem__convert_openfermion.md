---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qchem/convert_openfermion.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qchem/convert_openfermion.py
license: Apache-2.0
---

## Module `pennylane/qchem/convert_openfermion.py`

This module contains the functions for converting between OpenFermion and PennyLane objects.

## `from_openfermion`

```python
def from_openfermion(openfermion_op, wires=None, tol=1e-16)
```

Convert OpenFermion
`FermionOperator <https://quantumai.google/reference/python/openfermion/ops/FermionOperator>`__
to PennyLane :class:`~.fermi.FermiWord` or :class:`~.fermi.FermiSentence` and
OpenFermion `QubitOperator <https://quantumai.google/reference/python/openfermion/ops/QubitOperator>`__
to PennyLane :class:`~.LinearCombination`.

Args:
    openfermion_op (FermionOperator, QubitOperator): OpenFermion operator.
    wires (dict): Custom wire mapping used to convert the external qubit
        operator to a PennyLane operator.
        Only dictionaries with integer keys (for qubit-to-wire conversion) are accepted.
        If ``None``, the identity map (e.g., ``0->0, 1->1, ...``) will be used.
    tol (float): Tolerance for discarding negligible coefficients.

Returns:
    Union[~.FermiWord, ~.FermiSentence, LinearCombination]: PennyLane operator.

**Example**

>>> import pennylane as qp
>>> from openfermion import FermionOperator, QubitOperator
>>> of_op = 0.5 * FermionOperator('0^ 2') + FermionOperator('0 2^')
>>> pl_op = qp.from_openfermion(of_op)
>>> print(pl_op)
0.5 * a⁺(0) a(2)
+ 1.0 * a(0) a⁺(2)

>>> of_op = QubitOperator('X0', 1.2) + QubitOperator('Z1', 2.4)
>>> pl_op = qp.from_openfermion(of_op)
>>> print(pl_op)
1.2 * X(0) + 2.4 * Z(1)

## `to_openfermion`

```python
def to_openfermion(pennylane_op: Sum | LinearCombination | FermiWord | FermiSentence, wires=None, tol=1e-16)
```

Convert a PennyLane operator to OpenFermion
`QubitOperator <https://quantumai.google/reference/python/openfermion/ops/QubitOperator>`__ or
`FermionOperator <https://quantumai.google/reference/python/openfermion/ops/FermionOperator>`__.

Args:
    pennylane_op (~ops.op_math.Sum, ~ops.op_math.LinearCombination, ~.FermiWord, ~.FermiSentence):
        PennyLane operator
    wires (dict): Custom wire mapping used to convert a PennyLane qubit operator
        to the external operator.
        Only dictionaries with integer keys (for qubit-to-wire conversion) are accepted.
        If ``None``, the identity map (e.g., ``0->0, 1->1, ...``) will be used.

Returns:
    (QubitOperator, FermionOperator): OpenFermion operator

**Example**

>>> import pennylane as qp
>>> w1 = qp.FermiWord({(0, 0) : '+', (1, 1) : '-'})
>>> w2 = qp.FermiWord({(0, 1) : '+', (1, 2) : '-'})
>>> fermi_s = qp.FermiSentence({w1 : 1.2, w2: 3.1})
>>> of_fermi_op = qp.to_openfermion(fermi_s)
>>> of_fermi_op
1.2 [0^ 1] +
3.1 [1^ 2]

>>> sum_op = 1.2 * qp.X(0) + 2.4 * qp.Z(1)
>>> of_qubit_op = qp.to_openfermion(sum_op)
>>> of_qubit_op
(1.2+0j) [X0] +
(2.4+0j) [Z1]
