---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/decompositions/gridsynth.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/decompositions/gridsynth.py
license: Apache-2.0
---

## Module `pennylane/transforms/decompositions/gridsynth.py`

Alias transform function for the Ross-Selinger decomposition (GridSynth) for qjit.

## `gridsynth_setup_inputs`

```python
def gridsynth_setup_inputs(epsilon: float=0.0001, ppr_basis: bool=False)
```

Decomposes RZ and PhaseShift gates into the Clifford+T basis or the PPR basis.

.. warning::

    This transform must be applied within a workflow compiled with :func:`pennylane.qjit`,
    as it is a frontend for Catalyst's ``gridsynth`` compilation pass.
    Consult the Catalyst documentation for more information.

Args:
    tape (QNode): A quantum circuit.
    epsilon (float): The maximum permissible operator norm error per rotation gate. Defaults to ``1e-4``.
    ppr_basis (bool): If True, decompose into the PPR basis. If False, decompose into the Clifford+T basis. Defaults to ``False``.

**Example**

.. code-block:: python

    @qp.qnode(qp.device("lightning.qubit", wires=1))
    def circuit(x):
        qp.Hadamard(0)
        qp.RZ(x, 0)
        qp.PhaseShift(x * 0.2, 0)
        return qp.state()

    gridsynth_circuit = qp.transforms.gridsynth(circuit, epsilon=1e-4)
    qjitted_circuit = qp.qjit(gridsynth_circuit)

>>> circuit(1.1) # doctest: +SKIP
[0.60282587-0.36959568j 0.5076395 +0.49224195j]
>>> qjitted_circuit(1.1) # doctest: +SKIP
[0.6028324 -0.3695921j  0.50763281+0.49224355j]
