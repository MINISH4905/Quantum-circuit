---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/labs/transforms/select_pauli_rot_phase_gradient.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/transforms/select_pauli_rot_phase_gradient.py
license: Apache-2.0
---

## Module `pennylane/labs/transforms/select_pauli_rot_phase_gradient.py`

Contains the ``select_pauli_rot_phase_gradient`` transform.

## `select_pauli_rot_phase_gradient`

```python
def select_pauli_rot_phase_gradient(tape: QuantumScript, angle_wires: Wires, phase_grad_wires: Wires, work_wires: Wires) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Quantum function transform to decompose all instances of :class:`~.SelectPauliRot` gates into additions
using a phase gradient resource state.

For this routine to work, the provided ``phase_grad_wires`` need to hold the phase gradient
state :math:`|\nabla_Z\rangle = \frac{1}{\sqrt{2^n}} \sum_{m=0}^{2^n-1} e^{-2 \pi i \frac{m}{2^n}} |m\rangle`.
Because this state is not modified and can be re-used at a later stage, the transform does not prepare it but
rather assumes it has been prepared on those wires at an earlier stage. Look at the example below to see how
this state can be prepared.

.. figure:: ../../../_static/multiplexer_QROM.png
                :align: center
                :width: 70%
                :target: javascript:void(0);

Note that this operator contains :class:`~.SemiAdder` that typically uses additional ``work_wires`` for the semi-in-place addition
:math:`\text{SemiAdder}|x\rangle_\text{ang} |y\rangle_\text{phg} = |x\rangle_\text{ang} |x + y\rangle_\text{phg}`.


Args:
    tape (QNode or QuantumTape or Callable): A quantum circuit containing :class:`~.SelectPauliRot` operators.
    angle_wires (Wires): The qubits that conditionally load the angle :math:`\phi` of
        the :class:`~.SelectPauliRot` gate in binary as a multiple of :math:`2\pi`.
        The length of the ``angle_wires`` , i.e. :math:`b`, implicitly determines the precision
        with which the angle is represented.
        E.g., :math:`(1 \cdot 2^{-1} + 0 \cdot 2^{-2} + 1 \cdot 2^{-3}) 2\pi` is represented by three bits as ``101``.
    phase_grad_wires (Wires): Qubits with the catalytic phase gradient state prepared on them.
        Needs to be at least :math:`b` wires and will only use the first :math:`b`.
    work_wires (Wires): Additional work wires to realize the :class:`~.SemiAdder` and :class:`~.QROM`.
        Needs to be at least :math:`b-1` wires.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]: The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

**Example**

.. code-block:: python

    from pennylane.labs.transforms import select_pauli_rot_phase_gradient
    from functools import partial
    import numpy as np

    precision = 4
    wire = "targ"
    angle_wires = [f"ang_{i}" for i in range(precision)]
    phase_grad_wires = [f"phg_{i}" for i in range(precision)]
    work_wires = [f"work_{i}" for i in range(precision - 1)]

    def phase_gradient(wires):
        # prepare phase gradient state
        for i, w in enumerate(wires):
            qp.H(w)
            qp.PhaseShift(-np.pi / 2**i, w)

    @partial(
        select_pauli_rot_phase_gradient,
        angle_wires=angle_wires,
        phase_grad_wires=phase_grad_wires,
        work_wires=work_wires,
    )
    @qp.qnode(qp.device("default.qubit"))
    def select_pauli_rot_circ(phis, control_wires, target_wire):
        phase_gradient(phase_grad_wires)  # prepare phase gradient state

        for wire in control_wires:
            qp.Hadamard(wire)

        qp.SelectPauliRot(phis, control_wires, target_wire, rot_axis="X")

        return qp.probs(target_wire)

    phis = [
        (1 / 2 + 1 / 4 + 1 / 8) * 2 * np.pi,
        (1 / 2 + 1 / 4 + 0 / 8) * 2 * np.pi,
        (1 / 2 + 0 / 4 + 1 / 8) * 2 * np.pi,
        (0 / 2 + 1 / 4 + 1 / 8) * 2 * np.pi,
    ]

>>> print(select_pauli_rot_circ(phis, control_wires=[0, 1], target_wire=wire))
[0.41161165 0.58838835]
