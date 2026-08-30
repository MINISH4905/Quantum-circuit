---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/measurements/expval.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/measurements/expval.py
license: Apache-2.0
---

## Module `pennylane/measurements/expval.py`

This module contains the qp.expval measurement.

## `ExpectationMP`

```python
class ExpectationMP(SampleMeasurement, StateMeasurement)
```

Measurement process that computes the expectation value of the supplied observable.

Please refer to :func:`pennylane.expval` for detailed documentation.

Args:
    obs (Union[.Operator, .MeasurementValue]): The observable that is to be measured
        as part of the measurement process. Not all measurement processes require observables
        (for example ``Probability``); this argument is optional.
    wires (.Wires): The wires the measurement process applies to.
        This can only be specified if an observable was not provided.
    eigvals (array): A flat array representing the eigenvalues of the measurement.
        This can only be specified if an observable was not provided.
    id (str): custom label given to a measurement instance, can be useful for some applications
        where the instance has to be identified

## `expval`

```python
def expval(op: Operator | MeasurementValue) -> ExpectationMP
```

Expectation value of the supplied observable.

**Example:**

.. code-block:: python

    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def circuit(x):
        qp.RX(x, wires=0)
        qp.Hadamard(wires=1)
        qp.CNOT(wires=[0, 1])
        return qp.expval(qp.Y(0))

Executing this QNode:

>>> circuit(0.5)
np.float64(-0.479...)

Args:
    op (Union[Operator, MeasurementValue]): a quantum observable object. To
        get expectation values for mid-circuit measurements, ``op`` should be
        a ``MeasurementValue``.

Returns:
    ExpectationMP: measurement process instance
