---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ftqc/operations.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ftqc/operations.py
license: Apache-2.0
---

## Module `pennylane/ftqc/operations.py`

Contains FTQC/MBQC-specific operations

## `RotXZX`

```python
class RotXZX(Operation)
```

Arbitrary single qubit rotation with angles XZX

.. math::

    R(\phi,\theta,\omega) = RX(\omega)RZ(\theta)RX(\phi)

**Details:**

* Number of wires: 1
* Number of parameters: 3
* Number of dimensions per parameter: (0, 0, 0)
* Gradient recipe: :math:`\frac{d}{d\phi}f(R(\phi, \theta, \omega)) = \frac{1}{2}\left[f(R(\phi+\pi/2, \theta, \omega)) - f(R(\phi-\pi/2, \theta, \omega))\right]`
  where :math:`f` is an expectation value depending on :math:`R(\phi, \theta, \omega)`.
  This gradient recipe applies for each angle argument :math:`\{\phi, \theta, \omega\}`.

.. note::

    If the ``RotXZX`` gate is not supported on the targeted device, PennyLane
    will attempt to decompose the gate into :class:`~.RX` and :class:`~.RZ` gates.

Args:
    phi (float): rotation angle :math:`\phi`
    theta (float): rotation angle :math:`\theta`
    omega (float): rotation angle :math:`\omega`
    wires (Any, Wires): the wire the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_decomposition`

```python
def compute_decomposition(phi, theta, omega, wires)
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.Rot.decomposition`.

Args:
    phi (float): rotation angle :math:`\phi`
    theta (float): rotation angle :math:`\theta`
    omega (float): rotation angle :math:`\omega`
    wires (Any, Wires): the wire the operation acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> from pennylane.ftqc import RotXZX
>>> RotXZX.compute_decomposition(1.2, 2.3, 3.4, wires=0)
[RX(1.2, wires=[0]), RZ(2.3, wires=[0]), RX(3.4, wires=[0])]
