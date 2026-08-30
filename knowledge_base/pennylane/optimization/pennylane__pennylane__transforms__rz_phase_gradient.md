---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/rz_phase_gradient.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/rz_phase_gradient.py
license: Apache-2.0
---

## Module `pennylane/transforms/rz_phase_gradient.py`

A transform for decomposing RZ rotations using a phase gradient catalyst state.

## `rz_phase_gradient`

```python
def rz_phase_gradient(tape: QuantumScript, angle_wires: Wires, phase_grad_wires: Wires, work_wires: Wires) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Quantum function transform to decompose all instances of :class:`~.RZ` gates into additions
using a phase gradient resource state.

For example, an :class:`~.RZ` gate with angle :math:`\phi = (0 \cdot 2^{-1} + 1 \cdot 2^{-2} + 0 \cdot 2^{-3}) 2\pi`
is translated into the following routine, where the angle is conditionally prepared on the ``angle_wires`` in binary
and added to a ``phase_grad_wires`` register semi-inplace via :class:`~.SemiAdder`.

.. code-block::

    target: ─RZ(ϕ)─ = ────╭●──────────────╭●────exp(iϕ/2)─┤
     ang_0:           ────├|0⟩─╭SemiAdder─├|0⟩────────────┤
     ang_1:           ────├|1⟩─├SemiAdder─├|1⟩────────────┤
     ang_2:           ────╰|0⟩─├SemiAdder─╰|0⟩────────────┤
     phg_0:           ─────────├SemiAdder─────────────────┤
     phg_1:           ─────────├SemiAdder─────────────────┤
     phg_2:           ─────────╰SemiAdder─────────────────┤

For this routine to work, the provided ``phase_grad_wires`` need to hold a phase gradient
state :math:`|\nabla n\rangle = \frac{1}{\sqrt{N}} \sum_{m=0}^{N-1} e^{-2 \pi i \frac{m}{N}} |m\rangle`,
where :math:`n` is the number of qubits and :math:`N=2^n`.
Because this state is not modified and can be re-used at a later stage, the transform does not prepare it but
rather assumes it has been prepared on those wires at an earlier stage.

Note that :class:`~.SemiAdder` requires additional ``work_wires`` (not shown in the diagram) for the semi-in-place addition
:math:`\text{SemiAdder}|x\rangle_\text{ang} |y\rangle_\text{phg} = |x\rangle_\text{ang} |x + y\rangle_\text{phg}`.

More details can be found on page 4 in `arXiv:1709.06648 <https://arxiv.org/abs/1709.06648>`__
and Figure 17a in `arXiv:2211.15465 <https://arxiv.org/abs/2211.15465>`__ (a generalization to
multiplexed :class:`~.RZ` rotations is provided in Figure 4 in
`arXiv:2409.07332 <https://arxiv.org/abs/2409.07332>`__).

Note that technically, this circuit realizes :class:`~.PhaseShift`, i.e. :math:`R_\phi(\phi) = R_Z(\phi) e^{i\phi/2}`.
The additional global phase is taken into account in the decomposition.

Args:
    tape (QNode or QuantumTape or Callable): A quantum circuit containing :class:`~.RZ` gates.
    angle_wires (Wires): The qubits that conditionally load the angle :math:`\phi` of
        the :class:`~.RZ` gate in binary as a multiple of :math:`2\pi`.
        The length of the ``angle_wires`` implicitly determines the precision
        with which the angle is represented.
        E.g., :math:`(2^{-1} + 2^{-2} + 2^{-3}) 2\pi` is exactly represented by three bits as ``111``.
    phase_grad_wires (Wires): The catalyst qubits with a phase gradient state prepared on them.
        Needs to be at least the length of ``angle_wires`` and will only
        use the first ``len(angle_wires)``.
    work_wires (Wires): Additional work wires to realize the :class:`~.SemiAdder` between the ``angle_wires`` and
        ``phase_grad_wires``. Needs to be at least ``b-1`` wires, where ``b=len(phase_grad_wires)`` is
        the precision of the angle :math:`\phi`.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]: The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

**Example**

.. code-block:: python

    from pennylane.transforms.rz_phase_gradient import rz_phase_gradient

    precision = 3
    phi = (1 / 2 + 1 / 4 + 1 / 8) * 2 * np.pi
    wire = "targ"
    angle_wires = [f"ang_{i}" for i in range(precision)]
    phase_grad_wires = [f"phg_{i}" for i in range(precision)]
    work_wires = [f"work_{i}" for i in range(precision - 1)]
    wire_order = [wire] + angle_wires + phase_grad_wires + work_wires


    def phase_gradient(wires):
        for i, w in enumerate(wires):
            qp.H(w)
            qp.PhaseShift(-np.pi/2**i, w)

    @rz_phase_gradient(
        angle_wires=angle_wires,
        phase_grad_wires=phase_grad_wires,
        work_wires=work_wires,
    )
    @qp.qnode(qp.device("default.qubit"))
    def rz_circ(phi, wire):
        phase_gradient(phase_grad_wires)  # prepare phase gradient state

        qp.Hadamard(wire)  # transform rotation
        qp.RZ(phi, wire)
        qp.Hadamard(wire)  # transform rotation

        return qp.probs(wire)


In this example we perform the rotation of an angle of :math:`\phi = (0.111)_2 2\pi`.
Because phase shifts are trivial on computational basis states, we transform the :math:`R_Z`
rotation to :math:`R_X = H R_Z H` via two :class:`~.Hadamard` gates.

Note that for the transform to work, we needed to also prepare a phase gradient state on
the ``phase_grad_wires`` via ``phase_gradient``.

Overall, the full circuit looks like the following:

>>> print(qp.draw(rz_circ, wire_order=wire_order)(phi, wire))
  targ: ──H────────────╭(|Ψ⟩)@SemiAdder@(|Ψ⟩)──H─╭GlobalPhase(2.75)─┤  Probs
 ang_0: ───────────────├(|Ψ⟩)@SemiAdder@(|Ψ⟩)────├GlobalPhase(2.75)─┤
 ang_1: ───────────────├(|Ψ⟩)@SemiAdder@(|Ψ⟩)────├GlobalPhase(2.75)─┤
 ang_2: ───────────────├(|Ψ⟩)@SemiAdder@(|Ψ⟩)────├GlobalPhase(2.75)─┤
 phg_0: ──H──Rϕ(-3.14)─├(|Ψ⟩)@SemiAdder@(|Ψ⟩)────├GlobalPhase(2.75)─┤
 phg_1: ──H──Rϕ(-1.57)─├(|Ψ⟩)@SemiAdder@(|Ψ⟩)────├GlobalPhase(2.75)─┤
 phg_2: ──H──Rϕ(-0.79)─├(|Ψ⟩)@SemiAdder@(|Ψ⟩)────├GlobalPhase(2.75)─┤
work_0: ───────────────├(|Ψ⟩)@SemiAdder@(|Ψ⟩)────├GlobalPhase(2.75)─┤
work_1: ───────────────╰(|Ψ⟩)@SemiAdder@(|Ψ⟩)────╰GlobalPhase(2.75)─┤

The additional work wires are required by the :class:`~.SemiAdder`.
Executing the circuit, we get the following result:

>>> rz_circ(phi, wire)
array([0.853..., 0.146...])

This matches the expected result of just applying a simple ``RX`` gate:

>>> np.abs(qp.RX(phi, 0).matrix()[:, 0]) ** 2
array([0.853..., 0.146...])
