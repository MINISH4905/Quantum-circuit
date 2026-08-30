---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/workflow/set_shots.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/set_shots.py
license: Apache-2.0
---

## Module `pennylane/workflow/set_shots.py`

This module contains the set_shots decorator.

## `set_shots`

```python
def set_shots(*args, shots: ShotsLike=_SHOTS_NOT_PROVIDED)
```

Transform used to set or update a circuit's shots.

Args:
    qnode (QNode): The QNode to transform. If not provided, ``set_shots`` can be used as a decorator directly.
    shots (None or int or Sequence[int] or Sequence[tuple[int, int]] or pennylane.shots.Shots): The
        number of shots (or a shots vector) that the transformed circuit will execute.

Returns:
    QNode or callable: The transformed QNode with updated shots, or a wrapper function
    if qnode is not provided.

There are three ways to specify shot values (see :func:`qp.measurements.Shots <pennylane.measurements.Shots>` for more details):

* The value ``None``: analytic mode, no shots
* A positive integer: a fixed number of shots
* A sequence consisting of either positive integers or a tuple-pair of positive integers of the form ``(shots, copies)``

**Examples**

Set the number of shots as a decorator with either a positional or keyword argument:

.. code-block:: python

    @qp.set_shots(1_000)
    @qp.qnode(qp.device("default.qubit", wires=1))
    def circuit_sample():
        qp.RX(1.23, wires=0)
        return qp.sample(qp.Z(0))

>>> result = circuit_sample()
>>> result.shape
(1000,)

Set analytic mode as a decorator (positional argument):

.. code-block:: python

    @qp.set_shots(None)
    @qp.qnode(qp.device("default.qubit", wires=1))
    def circuit_expval():
        qp.RX(1.23, wires=0)
        return qp.expval(qp.Z(0))

>>> result = circuit_expval()
>>> np.allclose(result, np.cos(1.23))
True

The shots can be updated in-line for an existing circuit:

>>> new_circ = qp.set_shots(circuit_sample, shots=(4, 10)) # shot vector
>>> result = new_circ()
>>> a, b = result
>>> a.shape
(4,)
>>> b.shape
(10,)
>>> result # doctest: +SKIP
(array([-1.,  1., -1.,  1.]), array([ 1.,  1.,  1., -1.,  1.,  1., -1., -1.,  1.,  1.]))
