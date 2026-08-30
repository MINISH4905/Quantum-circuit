---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/functions/map_wires.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/functions/map_wires.py
license: Apache-2.0
---

## Module `pennylane/ops/functions/map_wires.py`

This module contains the qp.map_wires function.

## `map_wires`

```python
def map_wires(input: Operator | MeasurementProcess | QuantumScript | QNode | Callable | QuantumScriptBatch, wire_map: dict, queue=False, replace=False)
```

Changes the wires of an operator, tape, qnode or quantum function according
to the given wire map.

Args:
    input (Operator or QNode or QuantumTape or Callable): an operator or a quantum circuit.
    wire_map (dict): dictionary containing the old wires as keys and the new wires as values
    queue (bool): Whether or not to queue the object when recording. Defaults to False.
    replace (bool): When ``queue=True``, if ``replace=True`` the input operators will be
        replaced by its mapped version. Defaults to False.

Returns:
    operator (Operator) or qnode (QNode) or quantum function (Callable) or tuple[List[.QuantumTape], function]:

    The transformed circuit or operator with updated wires in :func:`qp.transform <pennylane.transform>`.

.. note::

    ``qp.map_wires`` can be used as a decorator with the help of the ``functools`` module:

    .. code-block:: python

        dev = qp.device("default.qubit")
        wire_map = {0: 10}

        @qp.map_wires(wire_map=wire_map)
        @qp.qnode(dev)
        def func(x):
            qp.RX(x, wires=0)
            return qp.expval(qp.Z(0))

    >>> print(qp.draw(func)(0.1))
    10: ──RX(0.10)─┤  <Z>


**Example**

Given an operator, ``qp.map_wires`` returns a copy of the operator with its wires changed:

>>> op = qp.RX(0.54, wires=0) + qp.X(1) + (qp.Z(2) @ qp.RY(1.23, wires=3))
>>> op
(
    RX(0.54, wires=[0])
  + X(1)
  + Z(2) @ RY(1.23, wires=[3])
)
>>> wire_map = {0: 3, 1: 2, 2: 1, 3: 0}
>>> qp.map_wires(op, wire_map)
(
    RX(0.54, wires=[3])
  + X(2)
  + Z(1) @ RY(1.23, wires=[0])
)

Moreover, ``qp.map_wires`` can be used to change the wires of QNodes or quantum functions:

>>> dev = qp.device("default.qubit", wires=4)
>>> @qp.qnode(dev)
... def circuit():
...    qp.RX(0.54, wires=0) @ qp.X(1) @ qp.Z(2) @ qp.RY(1.23, wires=3)
...    return qp.probs(wires=0)
...
>>> mapped_circuit = qp.map_wires(circuit, wire_map)
>>> mapped_circuit()
array([0.92885434, 0.07114566])
>>> tape = qp.workflow.construct_tape(mapped_circuit)()
>>> list(tape)
[RX(0.54, wires=[3]) @ X(2) @ Z(1) @ RY(1.23, wires=[0]), probs(wires=[3])]
