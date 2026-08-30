---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/measurements/mutual_info.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/measurements/mutual_info.py
license: Apache-2.0
---

## Module `pennylane/measurements/mutual_info.py`

This module contains the qp.mutual_info measurement.

## `MutualInfoMP`

```python
class MutualInfoMP(StateMeasurement)
```

Measurement process that computes the mutual information between the provided wires.

Please refer to :func:`pennylane.mutual_info` for detailed documentation.

Args:
    wires (Sequence[.Wires]): The wires the measurement process applies to.
    id (str): custom label given to a measurement instance, can be useful for some applications
        where the instance has to be identified
    log_base (float): base for the logarithm

### `hash`

```python
def hash(self)
```

int: returns an integer hash uniquely representing the measurement process

## `mutual_info`

```python
def mutual_info(wires0, wires1, log_base=None) -> MutualInfoMP
```

Mutual information between the subsystems prior to measurement:

.. math::

    I(A, B) = S(\rho^A) + S(\rho^B) - S(\rho^{AB})

where :math:`S` is the von Neumann entropy.

The mutual information is a measure of correlation between two subsystems.
More specifically, it quantifies the amount of information obtained about
one system by measuring the other system.

Args:
    wires0 (Sequence[int] or int): the wires of the first subsystem
    wires1 (Sequence[int] or int): the wires of the second subsystem
    log_base (float): Base for the logarithm.

Returns:
    MutualInfoMP: measurement process instance

**Example:**

.. code-block:: python

    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def circuit_mutual(x):
        qp.IsingXX(x, wires=[0, 1])
        return qp.mutual_info(wires0=[0], wires1=[1])

Executing this QNode:

>>> print(circuit_mutual(np.pi/2))
1.38...

It is also possible to get the gradient of the previous QNode:

>>> param = pnp.array(np.pi/4, requires_grad=True)
>>> qp.grad(circuit_mutual)(param)
tensor(1.24645048, requires_grad=True)

.. note::

    Calculating the derivative of :func:`~.mutual_info` is currently supported when
    using the classical backpropagation differentiation method (``diff_method="backprop"``)
    with a compatible device and finite differences (``diff_method="finite-diff"``).

.. seealso:: :func:`~pennylane.vn_entropy`, :func:`pennylane.math.mutual_info`
