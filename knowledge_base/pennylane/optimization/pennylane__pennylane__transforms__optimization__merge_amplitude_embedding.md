---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/optimization/merge_amplitude_embedding.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/optimization/merge_amplitude_embedding.py
license: Apache-2.0
---

## Module `pennylane/transforms/optimization/merge_amplitude_embedding.py`

Transform for merging AmplitudeEmbedding gates in a quantum circuit.

## `merge_amplitude_embedding`

```python
def merge_amplitude_embedding(tape: QuantumScript) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Quantum function transform to combine amplitude embedding templates that act on different qubits.

Args:
    tape (QNode or QuantumTape or Callable): A quantum circuit (QNode or quantum function).

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[.QuantumTape], function]: The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.


**Example**

You can apply the transform directly on a :class:`QNode`:

.. code-block:: python

    import pennylane as qp

    dev = qp.device('default.qubit', wires=4)

    @qp.transforms.merge_amplitude_embedding
    @qp.qnode(device=dev)
    def circuit():
        qp.CNOT(wires = [0,1])
        qp.AmplitudeEmbedding([0, 1], wires = 2)
        qp.AmplitudeEmbedding([0, 1], wires = 3)
        return qp.state()

>>> print(qp.draw(circuit)())
0: ─╭●───┤  State
1: ─╰X───┤  State
2: ─╭|Ψ⟩─┤  State
3: ─╰|Ψ⟩─┤  State
>>> circuit()
array([0.+0.j, 0.+0.j, 0.+0.j, 1.+0.j, 0.+0.j, 0.+0.j, 0.+0.j, 0.+0.j,
       0.+0.j, 0.+0.j, 0.+0.j, 0.+0.j, 0.+0.j, 0.+0.j, 0.+0.j, 0.+0.j])
