---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/measurements/purity.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/measurements/purity.py
license: Apache-2.0
---

## Module `pennylane/measurements/purity.py`

This module contains the qp.purity measurement.

## `PurityMP`

```python
class PurityMP(StateMeasurement)
```

Measurement process that computes the purity of the system prior to measurement.

Please refer to :func:`pennylane.purity` for detailed documentation.

Args:
    wires (.Wires): The wires the measurement process applies to.
    id (str): custom label given to a measurement instance, can be useful for some
        applications where the instance has to be identified

## `purity`

```python
def purity(wires) -> PurityMP
```

The purity of the system prior to measurement.

.. math::
    \gamma = \text{Tr}(\rho^2)

where :math:`\rho` is the density matrix. The purity of a normalized quantum state satisfies
:math:`\frac{1}{d} \leq \gamma \leq 1`, where :math:`d` is the dimension of the Hilbert space.
A pure state has a purity of 1.

Args:
    wires (Sequence[int] or int): The wires of the subsystem

Returns:
    PurityMP: Measurement process instance

**Example**

.. code-block:: python

    dev = qp.device("default.mixed", wires=2)

    @qp.qnode(dev)
    def circuit_purity(p):
        qp.Hadamard(wires=0)
        qp.CNOT(wires=[0, 1])
        qp.BitFlip(p, wires=0)
        qp.BitFlip(p, wires=1)
        return qp.purity(wires=[0,1])

>>> print(circuit_purity(0.1))
0.7048...

.. seealso:: :func:`pennylane.math.purity`
