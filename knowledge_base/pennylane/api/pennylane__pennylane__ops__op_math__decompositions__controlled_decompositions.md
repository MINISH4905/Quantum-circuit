---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/decompositions/controlled_decompositions.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/decompositions/controlled_decompositions.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/decompositions/controlled_decompositions.py`

This submodule defines functions to decompose controlled operations.

## `ctrl_decomp_bisect`

```python
def ctrl_decomp_bisect(target_operation: Operator, control_wires: Wires)
```

Decompose the controlled version of a target single-qubit operation

Not backpropagation compatible (as currently implemented). Use only with numpy.

Automatically selects the best algorithm based on the matrix (uses specialized more efficient
algorithms if the matrix has a certain form, otherwise falls back to the general algorithm).
These algorithms are defined in sections 3.1 and 3.2 of
`Vale et al. (2023) <https://arxiv.org/abs/2302.06377>`_.

.. warning:: This method will add a global phase for target operations that do not
    belong to the SU(2) group.

Args:
    target_operation (~.operation.Operator): the target operation to decompose
    control_wires (~.wires.Wires): the control wires of the operation

Returns:
    list[Operation]: the decomposed operations

Raises:
    ValueError: if ``target_operation`` is not a single-qubit operation

**Example:**

>>> from pennylane.ops.op_math import ctrl_decomp_bisect
>>> op = qp.T(0) # uses OD algorithm
>>> print(qp.draw(ctrl_decomp_bisect, wire_order=(0,1,2,3,4,5), show_matrices=False)(op, (1,2,3,4,5)))
0: ─╭X──U(M0)─╭X──U(M0)†─╭X──U(M0)─╭X──U(M0)†─╭GlobalPhase(-0.39)─┤
1: ─├●────────│──────────├●────────│──────────├●──────────────────┤
2: ─├●────────│──────────├●────────│──────────├●──────────────────┤
3: ─╰●────────│──────────╰●────────│──────────├●──────────────────┤
4: ───────────├●───────────────────├●─────────├●──────────────────┤
5: ───────────╰●───────────────────╰●─────────╰●──────────────────┤
>>> op = qp.QubitUnitary([[0,1j],[1j,0]], 0) # uses MD algorithm
>>> print(qp.draw(ctrl_decomp_bisect, wire_order=(0,1,2,3,4,5), show_matrices=False)(op, (1,2,3,4,5)))
0: ──H─╭X──U(M0)─╭X──U(M0)†─╭X──U(M0)─╭X──U(M0)†──H─┤
1: ────├●────────│──────────├●────────│─────────────┤
2: ────├●────────│──────────├●────────│─────────────┤
3: ────╰●────────│──────────╰●────────│─────────────┤
4: ──────────────├●───────────────────├●────────────┤
5: ──────────────╰●───────────────────╰●────────────┤
>>> op = qp.Hadamard(0) # uses general algorithm
>>> print(qp.draw(ctrl_decomp_bisect, wire_order=(0,1,2,3,4,5), show_matrices=False)(op, (1,2,3,4,5)))
0: ──U(M0)─╭X──U(M1)†──U(M2)─╭X──U(M2)†─╭X──U(M2)─╭X──U(M2)†─╭X──U(M1)─╭X──U(M0)† ···
1: ────────│─────────────────│──────────├●────────│──────────├●────────│───────── ···
2: ────────│─────────────────│──────────├●────────│──────────├●────────│───────── ···
3: ────────│─────────────────│──────────╰●────────│──────────╰●────────│───────── ···
4: ────────├●────────────────├●───────────────────├●───────────────────├●──────── ···
5: ────────╰●────────────────╰●───────────────────╰●───────────────────╰●──────── ···
<BLANKLINE>
0: ··· ─╭GlobalPhase(-1.57)─┤
1: ··· ─├●──────────────────┤
2: ··· ─├●──────────────────┤
3: ··· ─├●──────────────────┤
4: ··· ─├●──────────────────┤
5: ··· ─╰●──────────────────┤

## `ctrl_decomp_zyz`

```python
def ctrl_decomp_zyz(target_operation: Operator, control_wires: Wires, work_wires: Wires | None=None, work_wire_type: str | None='borrowed') -> list[Operation]
```

Decompose the controlled version of a target single-qubit operation

This function decomposes both single and multiple controlled single-qubit
target operations using the decomposition defined in Lemma 4.3 and Lemma 5.1
for single ``controlled_wires``, and Lemma 7.9 for multiple ``controlled_wires``
from `Barenco et al. (1995) <https://arxiv.org/abs/quant-ph/9503016>`_.

Args:
    target_operation (~.operation.Operator): the target operation or matrix to decompose
    control_wires (~.wires.Wires): the control wires of the operation.
    work_wires (~.wires.Wires): the work wires available for this decomposition
    work_wire_type (str): the type of work wires, either "zeroed" or "borrowed".

Returns:
    list[Operation]: the decomposed operations

Raises:
    ValueError: if ``target_operation`` is not a single-qubit operation

**Example**

We can create a controlled operation using ``qp.ctrl``, or by creating the
decomposed controlled version using ``qp.ctrl_decomp_zyz``.

.. code-block:: python

    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def expected_circuit(op):
        qp.Hadamard(wires=0)
        qp.ctrl(op, [0])
        return qp.probs()

    @qp.qnode(dev)
    def decomp_circuit(op):
        qp.Hadamard(wires=0)
        qp.ops.ctrl_decomp_zyz(op, [0])
        return qp.probs()

Measurements on both circuits will give us the same results:

>>> op = qp.RX(0.123, wires=1)
>>> expected_circuit(op)
array([0.5       , 0.        , 0.498..., 0.001...])

>>> decomp_circuit(op)
array([0.5       , 0.        , 0.498..., 0.001...])

## `ctrl_decomp_bisect_rule`

```python
def ctrl_decomp_bisect_rule(U, wires, **__)
```

The decomposition rule for ControlledQubitUnitary from
`Vale et al. (2023) <https://arxiv.org/abs/2302.06377>`_.

## `single_ctrl_decomp_zyz_rule`

```python
def single_ctrl_decomp_zyz_rule(U, wires, **__)
```

The decomposition rule for ControlledQubitUnitary from Lemma 5.1 of
https://arxiv.org/pdf/quant-ph/9503016

## `multi_control_decomp_zyz_rule`

```python
def multi_control_decomp_zyz_rule(U, wires, work_wires, work_wire_type, **__)
```

The decomposition rule for ControlledQubitUnitary from Lemma 7.9 of
https://arxiv.org/pdf/quant-ph/9503016

## `controlled_two_qubit_unitary_rule`

```python
def controlled_two_qubit_unitary_rule(U, wires, control_values, work_wires, work_wire_type, **__)
```

A controlled two-qubit unitary is decomposed by applying ctrl to the base decomposition.
