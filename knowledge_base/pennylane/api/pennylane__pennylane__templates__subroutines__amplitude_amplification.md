---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/amplitude_amplification.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/amplitude_amplification.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/amplitude_amplification.py`

This submodule contains the template for Amplitude Amplification.

## `AmplitudeAmplification`

```python
class AmplitudeAmplification(Operation)
```

Applies amplitude amplification.

Given a state :math:`|\Psi\rangle = \alpha |\phi\rangle + \beta|\phi^{\perp}\rangle`, this
subroutine amplifies the amplitude of the state :math:`|\phi\rangle` such that

.. math::

        \text{A}(U, O)|\Psi\rangle \sim |\phi\rangle.

The implementation of the algorithm is based on [`arXiv:quant-ph/0005055 <https://arxiv.org/abs/quant-ph/0005055>`__].
The template also unlocks advanced techniques such as fixed-point quantum search
[`arXiv:1409.3305 <https://arxiv.org/abs/1409.3305>`__] and oblivious amplitude amplification
[`arXiv:1312.1414 <https://arxiv.org/abs/1312.1414>`__], by reflecting on a subset of wires.

Args:
    U (Operator): the operator that prepares the state :math:`|\Psi\rangle`
    O (Operator): the oracle that flips the sign of the state :math:`|\phi\rangle` and does nothing to the state :math:`|\phi^{\perp}\rangle`
    iters (int): the number of iterations of the amplitude amplification subroutine, default is ``1``
    fixed_point (bool): whether to use the fixed-point amplitude amplification algorithm, default is ``False``
    work_wire (int): the auxiliary wire to use for the fixed-point amplitude amplification algorithm, default is ``None``
    reflection_wires (Wires): the wires to reflect on, default is the wires of ``U``
    p_min (int): the lower bound for the probability of success in fixed-point amplitude amplification, default is ``0.9``

Raises:
    ValueError: ``work_wire`` must be specified if ``fixed_point == True``.
    ValueError: ``work_wire`` must be different from the wires of the oracle ``O``.

**Example**

Amplification of state :math:`|2\rangle` using Grover's algorithm with 3 qubits.
The state :math:`|\Psi\rangle` is constructed as a uniform superposition of basis states.

.. code-block:: python

    @qp.prod
    def generator(wires):
        for wire in wires:
            qp.Hadamard(wires=wire)

    U = generator(wires=range(3))
    O = qp.FlipSign(2, wires=range(3))

    dev = qp.device("default.qubit")

    @qp.qnode(dev)
    def circuit():

        generator(wires=range(3))
        qp.AmplitudeAmplification(U, O, iters=5, fixed_point=True, work_wire=3)

        return qp.probs(wires=range(3))

>>> print(np.round(circuit(),3))
[0.013 0.013 0.91  0.013 0.013 0.013 0.013 0.013]
