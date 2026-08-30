---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/functions/iterative_qpe.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/functions/iterative_qpe.py
license: Apache-2.0
---

## Module `pennylane/ops/functions/iterative_qpe.py`

This module contains the qp.iterative_qpe function.

## `iterative_qpe`

```python
def iterative_qpe(base, aux_wire, iters)
```

Performs the `iterative quantum phase estimation <https://arxiv.org/pdf/quant-ph/0610214.pdf>`_ circuit.

Given a unitary :math:`U`, this function applies the circuit for iterative quantum phase
estimation and returns a list of mid-circuit measurements with qubit reset.

Args:
    base (Operator): the phase estimation unitary, specified as an :class:`~.Operator`
    aux_wire (Union[Wires, int, str]): the wire to be used for the estimation
    iters (int): the number of measurements to be performed

Returns:
    list[MeasurementValue]: the abstract results of the mid-circuit measurements

.. seealso:: :class:`~.QuantumPhaseEstimation`, :func:`~.measure`

**Example**

.. code-block:: python

    dev = qp.device("default.qubit", seed=42)

    @qp.set_shots(5)
    @qp.qnode(dev)
    def circuit():

        # Initial state
        qp.X(0)

        # Iterative QPE
        measurements = qp.iterative_qpe(qp.RZ(2.0, wires=[0]), aux_wire=1, iters=3)

        return qp.sample(measurements)

>>> result = circuit()
>>> assert result.shape == (5, 3)
>>> print(result)
[[0 0 1]
 [0 0 1]
 [0 0 1]
 [0 0 1]
 [0 0 1]]

The output is an array of size ``(number of shots, number of iterations)``.

>>> print(qp.draw(circuit, max_length=150)())
0: ──X─╭RZ(2.00)⁴─────────────────╭RZ(2.00)²────────────────────────────╭RZ(2.00)¹────────────────────────────────────┤
1: ──H─╰●──────────H──┤↗│  │0⟩──H─╰●──────────Rϕ(-1.57)──H──┤↗│  │0⟩──H─╰●──────────Rϕ(-1.57)──Rϕ(-0.79)──H──┤↗│  │0⟩─┤
                       ╚══════════════════════╩══════════════║══════════════════════║══════════╩══════════════║═══════╡ ╭Sample[MCM]
                                                             ╚══════════════════════╩═════════════════════════║═══════╡ ├Sample[MCM]
                                                                                                              ╚═══════╡ ╰Sample[MCM]
