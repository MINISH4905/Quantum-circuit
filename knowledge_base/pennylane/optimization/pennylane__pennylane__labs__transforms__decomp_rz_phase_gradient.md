---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/labs/transforms/decomp_rz_phase_gradient.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/transforms/decomp_rz_phase_gradient.py
license: Apache-2.0
---

## Module `pennylane/labs/transforms/decomp_rz_phase_gradient.py`

Decomposition rule for RZ in terms of `phase gradient states <https://pennylane.ai/compilation/phase-gradient/b-rotations>`__

## `make_rz_to_phase_gradient_decomp`

```python
def make_rz_to_phase_gradient_decomp(angle_wires, phase_grad_wires, work_wires)
```

Custom decomposition rule for :class:`~.RZ` gates

This is a temporary workaround before moving to `capture` as default frontend, which unlocks dynamic wire allocation.
Here, we explicitly provide the necessary wires for the `phase gradient decomposition of RZ <https://pennylane.ai/compilation/phase-gradient/b-rotations>`__.
This way, this function can be used in a workflow context that explicitly uses those wires to generate this decomposition rule, which can then be used
as ``alt_decomps`` or ``fixed_decomp`` within :func:`~.pennylane.decompose` (when using the graph-based decomposition system).

Parameters:
    angle_wires (Wires): wires that encode the binary representation of the rotation angle
    phase_grad_wires (Wires): wires that carry a phase gradient state
    work_wires (Wires): additional work wires for :class:`~.SemiAdder` decomposition

Returns:
    qp.decomposition.DecompositionRule: decomposition rule to be used within :func:`~.pennylane.decompose`.

.. seealso:: :func:`~.make_selectpaulirot_to_phase_gradient_decomp`

**Example**

In this example we decompose a circuit containing only a single :class:`~.RZ` gate using the custom decomposition rule
that we generate from within the context of the example, where all auxiliary wires exist.

.. code-block:: python

    import pennylane as qp
    from pennylane.labs.transforms import make_rz_to_phase_gradient_decomp
    import numpy as np

    qp.decomposition.enable_graph()

    prec = 3
    phi = (1/2 + 1/4 + 1/8) * 2 * np.pi # binary rep is (111)

    angle_wires = qp.wires.Wires([f"aux_{i}" for i in range(prec)])
    phase_grad_wires = qp.wires.Wires([f"qft_{i}" for i in range(prec)])
    work_wires = qp.wires.Wires([f"work_{i}" for i in range(prec - 1)])

    custom_decomp = make_rz_to_phase_gradient_decomp(
        angle_wires, phase_grad_wires, work_wires
    )

    @qp.transforms.decompose(
            gate_set={"C(BasisEmbedding)", "SemiAdder", "CNOT", "GlobalPhase"},
            fixed_decomps={qp.RZ: custom_decomp}
    )
    @qp.qnode(qp.device("null.qubit"))
    def circuit():
        qp.RZ(phi, 0)
        return qp.state()

    specs = qp.specs(circuit)()["resources"].gate_types

The resulting circuit corresponds to the `phase gradient decomposition <https://pennylane.ai/compilation/phase-gradient/b-rotations>`__ of RZ,
containing two CNOT fanouts corresponding to the binary representation of the angle (111 in this case), the :class:`~SemiAdder`, and a :class:`~GlobalPhase`.

>>> specs
{'GlobalPhase': 1, 'C(BasisEmbedding)': 2, 'SemiAdder': 1}
>>> print(qp.draw(circuit)())
     0: ─╭GlobalPhase(2.75)─╭●──────────────╭●───┤  State
 aux_0: ─├GlobalPhase(2.75)─├|Ψ⟩─╭SemiAdder─├|Ψ⟩─┤  State
 aux_1: ─├GlobalPhase(2.75)─├|Ψ⟩─├SemiAdder─├|Ψ⟩─┤  State
 aux_2: ─├GlobalPhase(2.75)─╰|Ψ⟩─├SemiAdder─╰|Ψ⟩─┤  State
 qft_0: ─├GlobalPhase(2.75)──────├SemiAdder──────┤  State
 qft_1: ─├GlobalPhase(2.75)──────├SemiAdder──────┤  State
 qft_2: ─├GlobalPhase(2.75)──────├SemiAdder──────┤  State
work_0: ─├GlobalPhase(2.75)──────├SemiAdder──────┤  State
work_1: ─╰GlobalPhase(2.75)──────╰SemiAdder──────┤  State
