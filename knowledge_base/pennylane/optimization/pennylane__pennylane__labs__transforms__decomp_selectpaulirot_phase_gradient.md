---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/labs/transforms/decomp_selectpaulirot_phase_gradient.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/transforms/decomp_selectpaulirot_phase_gradient.py
license: Apache-2.0
---

## Module `pennylane/labs/transforms/decomp_selectpaulirot_phase_gradient.py`

Decomposition rule for SelectPauliRot in terms of `phase gradient states <https://pennylane.ai/compilation/phase-gradient/d-multiplex-rotations>`__

## `make_selectpaulirot_to_phase_gradient_decomp`

```python
def make_selectpaulirot_to_phase_gradient_decomp(angle_wires, phase_grad_wires, work_wires)
```

Custom decomposition rule for :class:`~.SelectPauliRot` gates

This is a temporary workaround before moving to `capture` as default frontend, which unlocks dynamic wire allocation.
Here, we explicitly provide the necessary wires for the `phase gradient decomposition of SelectPauliRot <https://pennylane.ai/compilation/phase-gradient/d-multiplex-rotations>`__.
This way, this function can be used in a workflow context that explicitly uses those wires to generate this decomposition rule, which can then be used
as ``alt_decomps`` or ``fixed_decomp`` within :func:`~.pennylane.decompose`.

Parameters:
    angle_wires (Wires): wires that encode the binary representation of the rotation angle
    phase_grad_wires (Wires): wires that carry a phase gradient state
    work_wires (Wires): additional work wires for :class:`~SemiAdder` decomposition

Returns:
    func: decomposition rule to be used within :func:`~.pennylane.decompose`.

.. seealso:: :func:`~.make_rz_to_phase_gradient_decomp`

**Example**

In this example we decompose a circuit containing only a single :class:`~.SelectPauliRot` gate using the custom decomposition rule
that we generate from within the context of the example, where all auxiliary wires exist.

.. code-block:: python

    import pennylane as qp
    from pennylane.labs.transforms import make_selectpaulirot_to_phase_gradient_decomp
    import numpy as np

    qp.decomposition.enable_graph()

    prec = 3
    np.random.seed(35)
    angles = np.random.rand(2**3)

    angle_wires = qp.wires.Wires([f"aux_{i}" for i in range(prec)])
    phase_grad_wires = qp.wires.Wires([f"qft_{i}" for i in range(prec)])
    work_wires = qp.wires.Wires([f"work_{i}" for i in range(prec - 1)])

    custom_decomp = make_selectpaulirot_to_phase_gradient_decomp(
        angle_wires, phase_grad_wires, work_wires
    )

    @qp.decompose(
        gate_set={"QROM", "Adjoint(QROM)", "SemiAdder", "MultiControlledX", "GlobalPhase"},
        fixed_decomps={qp.SelectPauliRot: custom_decomp}
    )
    @qp.qnode(qp.device("null.qubit"))
    def circuit(angles):
        qp.SelectPauliRot(angles, control_wires=range(3), target_wire=3)
        return qp.state()

    specs = qp.specs(circuit)(angles)["resources"].gate_types

The resulting circuit corresponds to the `phase gradient decomposition <https://pennylane.ai/compilation/phase-gradient/d-multiplex-rotations>`__ of ``SelectPauliRot``,
containing two CNOT fanouts corresponding to the binary representation of the angle (111 in this case), the :class:`~SemiAdder`, and a :class:`~GlobalPhase`.

>>> specs
{'QROM': 1, 'MultiControlledX': 6, 'SemiAdder': 1, 'Adjoint(QROM)': 1}
>>> print(qp.draw(circuit, wire_order=[0, 1, 2, 3] + angle_wires + phase_grad_wires + work_wires)(angles))
     0: ─╭QROM(M0)──────────────────────────────╭QROM(M0)†─┤  State
     1: ─├QROM(M0)──────────────────────────────├QROM(M0)†─┤  State
     2: ─├QROM(M0)──────────────────────────────├QROM(M0)†─┤  State
     3: ─│─────────╭○─╭○─╭○────────────╭○─╭○─╭○─│──────────┤  State
 aux_0: ─├QROM(M0)─│──│──│──╭SemiAdder─│──│──│──├QROM(M0)†─┤  State
 aux_1: ─├QROM(M0)─│──│──│──├SemiAdder─│──│──│──├QROM(M0)†─┤  State
 aux_2: ─├QROM(M0)─│──│──│──├SemiAdder─│──│──│──├QROM(M0)†─┤  State
 qft_0: ─│─────────╰X─│──│──├SemiAdder─│──│──╰X─│──────────┤  State
 qft_1: ─│────────────╰X─│──├SemiAdder─│──╰X────│──────────┤  State
 qft_2: ─│───────────────╰X─├SemiAdder─╰X───────│──────────┤  State
work_0: ─├QROM(M0)──────────├SemiAdder──────────├QROM(M0)†─┤  State
work_1: ─╰QROM(M0)──────────╰SemiAdder──────────╰QROM(M0)†─┤  State
