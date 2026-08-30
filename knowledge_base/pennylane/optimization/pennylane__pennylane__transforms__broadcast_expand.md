---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/broadcast_expand.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/broadcast_expand.py
license: Apache-2.0
---

## Module `pennylane/transforms/broadcast_expand.py`

This module contains the tape expansion function for expanding a
broadcasted tape into multiple tapes.

## `null_postprocessing`

```python
def null_postprocessing(results)
```

A postprocessing function returned by a transform that only converts the batch of results
into a result for a single ``QuantumTape``.

## `broadcast_expand`

```python
def broadcast_expand(tape: QuantumScript) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Expand a broadcasted tape into multiple tapes
and a function that stacks and squeezes the results.

.. warning::

    Currently, not all templates have been updated to support broadcasting.

Args:
    tape (QNode or QuantumTape or Callable): Broadcasted tape to be expanded

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]:

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

    - If the input is a QNode, the broadcasted input QNode
      that computes the QNode output serially with multiple circuit evaluations and
      stacks (and squeezes) the results into one batch of results.

    - If the input is a tape, a tuple containing a list of generated tapes, together with
      a post-processing function. The number of tapes matches the broadcasting dimension
      of the input tape, and the results from the evaluated tapes are stacked and squeezed
      together in the post-processing function.

This expansion function is used internally whenever a device does not
support broadcasting.

**Example**

We may use ``broadcast_expand`` on a ``QNode`` to separate it
into multiple calculations.

>>> from pennylane import numpy as pnp
>>> dev = qp.device("default.qubit", wires=1)
>>> @qp.qnode(dev)
... def circuit(x):
...     qp.RX(x, wires=0)
...     return qp.expval(qp.Z(0))

We can then call ``broadcast_expand`` on the QNode and store the
expanded ``QNode``:

>>> expanded_circuit = qp.transforms.broadcast_expand(circuit)

Let's use the expanded QNode and draw it for broadcasted parameters
with broadcasting axis of length ``3`` passed to ``qp.RX``:

>>> x = np.array([0.2, 0.6, 1.0])
>>> print(qp.draw(expanded_circuit)(x))
0: ──RX(0.20)─┤  <Z>
0: ──RX(0.60)─┤  <Z>
0: ──RX(1.00)─┤  <Z>

Executing the expanded ``QNode`` results in three values, corresponding
to the three parameters in the broadcasted input ``x``:

>>> expanded_circuit(x)
array([0.980..., 0.825..., 0.540...])

We also can call the transform manually on a tape:

>>> ops = [qp.RX(np.array([0.2, 0.6, 1.0]), wires=0)]
>>> measurements = [qp.expval(qp.Z(0))]
>>> tape = qp.tape.QuantumTape(ops, measurements)
>>> tapes, fn = qp.transforms.broadcast_expand(tape)
>>> tapes
(<QuantumScript: wires=[0], params=1>, <QuantumScript: wires=[0], params=1>, <QuantumScript: wires=[0], params=1>)
>>> fn(qp.execute(tapes, qp.device("default.qubit")))
array([0.980..., 0.825..., 0.540...])
