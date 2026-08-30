---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/measurements/vn_entropy.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/measurements/vn_entropy.py
license: Apache-2.0
---

## Module `pennylane/measurements/vn_entropy.py`

This module contains the qp.vn_entropy measurement.

## `VnEntropyMP`

```python
class VnEntropyMP(StateMeasurement)
```

Measurement process that computes the Von Neumann entropy of the system prior to measurement.

Please refer to :func:`~pennylane.vn_entropy` for detailed documentation.

Args:
    wires (.Wires): The wires the measurement process applies to.
        This can only be specified if an observable was not provided.
    id (str): custom label given to a measurement instance, can be useful for some applications
        where the instance has to be identified
    log_base (float): Base for the logarithm.

### `hash`

```python
def hash(self)
```

int: returns an integer hash uniquely representing the measurement process

## `vn_entropy`

```python
def vn_entropy(wires, log_base=None) -> VnEntropyMP
```

Von Neumann entropy of the system prior to measurement.

.. math::
    S( \rho ) = -\text{Tr}( \rho \log ( \rho ))

Args:
    wires (Sequence[int] or int): The wires of the subsystem
    log_base (float): Base for the logarithm.

Returns:
    VnEntropyMP: Measurement process instance

**Example:**

.. code-block:: python

    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def circuit_entropy(x):
        qp.IsingXX(x, wires=[0, 1])
        return qp.vn_entropy(wires=[0])

Executing this QNode:

>>> print(circuit_entropy(np.pi/2))
0.693...

It is also possible to get the gradient of the previous QNode:

>>> param = pnp.array(np.pi/4, requires_grad=True)
>>> qp.grad(circuit_entropy)(param)
tensor(0.623..., requires_grad=True)

.. note::

    Calculating the derivative of :func:`~pennylane.vn_entropy` is currently supported when
    using the classical backpropagation differentiation method (``diff_method="backprop"``)
    with a compatible device and finite differences (``diff_method="finite-diff"``).

.. note::

    ``qp.vn_entropy`` can also be used to compute the entropy of entanglement between two
    subsystems by computing the Von Neumann entropy of either of the subsystems.

.. seealso:: :func:`pennylane.math.vn_entropy`, :func:`pennylane.math.vn_entanglement_entropy`
