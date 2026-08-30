---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/measurements/var.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/measurements/var.py
license: Apache-2.0
---

## Module `pennylane/measurements/var.py`

This module contains the qp.var measurement.

## `VarianceMP`

```python
class VarianceMP(SampleMeasurement, StateMeasurement)
```

Measurement process that computes the variance of the supplied observable.

Please refer to :func:`pennylane.var` for detailed documentation.

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

## `var`

```python
def var(op: Operator | MeasurementValue) -> VarianceMP
```

Variance of the supplied observable.

Args:
    op (Union[Operator, MeasurementValue]): a quantum observable object.
        To get variances for mid-circuit measurements, ``op`` should be a
        ``MeasurementValue``.

Returns:
    VarianceMP: Measurement process instance

**Example:**

.. code-block:: python

    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def circuit(x):
        qp.RX(x, wires=0)
        qp.Hadamard(wires=1)
        qp.CNOT(wires=[0, 1])
        return qp.var(qp.Y(0))

Executing this QNode:

>>> print(circuit(0.5))
0.770...
