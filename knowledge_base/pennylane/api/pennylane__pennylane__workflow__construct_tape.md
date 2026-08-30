---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/workflow/construct_tape.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/construct_tape.py
license: Apache-2.0
---

## Module `pennylane/workflow/construct_tape.py`

Contains a function to extract a single tape from a QNode

## `construct_tape`

```python
def construct_tape(qnode: QNode, level: str | int | slice='user') -> Callable[..., QuantumScript]
```

Constructs the tape for a designated stage in the transform program.

Args:
    qnode (QNode): the qnode we want to get the tapes and post-processing for.
    level (str, int, slice): An indication of what transforms to apply before
        drawing. Check :func:`~.workflow.get_compile_pipeline` for more
        information on the allowed values and usage details of this argument.

Returns:
    tape (QuantumScript): a quantum circuit.

Raises:
    ValueError: if the ``level`` argument corresponds to more than one tape.

.. seealso:: :func:`pennylane.workflow.get_compile_pipeline` to inspect the contents of the transform program for a specified level.

**Example**

.. code-block:: python

    @qp.set_shots(10)
    @qp.qnode(qp.device("default.qubit"))
    def circuit(x):
        qp.RandomLayers([[1.0, 2.0]], wires=(0,1))
        qp.RX(x, wires=0)
        qp.RX(-x, wires=0)
        qp.SWAP((0,1))
        qp.X(0)
        qp.X(0)
        return qp.expval(qp.X(0) + qp.Y(0))

>>> tape = qp.workflow.construct_tape(circuit)(0.5)
>>> from pprint import pprint
>>> pprint(tape.circuit)
[RandomLayers(array([[1., 2.]]), wires=[0, 1]), RX(0.5, wires=[0]), RX(-0.5, wires=[0]), SWAP(wires=[0, 1]), X(0), X(0), expval(X(0) + Y(0))]
