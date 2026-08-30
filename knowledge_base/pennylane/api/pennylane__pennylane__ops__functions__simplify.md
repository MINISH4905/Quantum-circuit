---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/functions/simplify.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/functions/simplify.py
license: Apache-2.0
---

## Module `pennylane/ops/functions/simplify.py`

This module contains the qp.simplify function.

## `simplify`

```python
def simplify(input: Operator | MeasurementProcess | QuantumScript | QNode | Callable)
```

Simplifies an operator, tape, qnode or quantum function by reducing its arithmetic depth
or number of rotation parameters.

Args:
    input (.Operator, .MeasurementProcess, pennylane.QNode, .QuantumTape, or Callable): an
        operator, quantum node, tape or function that applies quantum operations

Returns:
    (Operator or MeasurementProcess or qnode (QNode) or quantum function (Callable)
    or tuple[List[QuantumTape], function]): Simplified input. If an operator or measurement
    process is provided as input, the simplified input is returned directly. Otherwise, the
    transformed circuit is returned as described in :func:`qp.transform <pennylane.transform>`.

**Example**

Given an instantiated operator, ``qp.simplify`` reduces the operator's arithmetic depth:

>>> op = qp.adjoint(qp.RX(0.54, wires=0) + qp.X(0) + qp.Z(1))
>>> op.arithmetic_depth
2
>>> sim_op = qp.simplify(op)
>>> sim_op.arithmetic_depth
1
>>> type(sim_op)
<class 'pennylane.ops.op_math.sum.Sum'>
>>> sim_op.operands
(RX(12.026370614359173, wires=[0]), X(0), Z(1))

This function can also simplify the number of rotation gate parameters:

>>> qp.simplify(qp.Rot(np.pi / 2, 0.1, -np.pi / 2, wires=0))
RX(0.1, wires=[0])

Both types of simplification occur together:

>>> op = qp.adjoint(qp.U2(-np.pi/2, np.pi/2, wires=0) + qp.X(0))
>>> op
Adjoint(U2(-1.5707963267948966, 1.5707963267948966, wires=[0]) + X(0))
>>> qp.simplify(op)
RX(10.995574287564276, wires=[0]) + X(0)

Moreover, ``qp.simplify`` can be used to simplify QNodes or quantum functions:

>>> dev = qp.device("default.qubit", wires=2)
>>> @qp.qnode(dev)
... @qp.simplify
... def circuit():
...     qp.adjoint(qp.prod(qp.RX(1, 0) ** 1, qp.RY(1, 0), qp.RZ(1, 0)))
...     return qp.probs(wires=0)
>>> circuit()
array([0.64596329, 0.35403671])
>>> tape = qp.workflow.construct_tape(circuit)()
>>> list(tape)
[RZ(11.566370614359172, wires=[0]) @ RY(11.566370614359172, wires=[0]) @ RX(11.566370614359172, wires=[0]),
 probs(wires=[0])]
