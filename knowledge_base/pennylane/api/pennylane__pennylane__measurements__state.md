---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/measurements/state.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/measurements/state.py
license: Apache-2.0
---

## Module `pennylane/measurements/state.py`

This module contains the qp.state measurement.

## `StateMP`

```python
class StateMP(StateMeasurement)
```

Measurement process that returns the quantum state in the computational basis.

Please refer to :func:`pennylane.state` for detailed documentation.

Args:
    wires (.Wires): The wires the measurement process applies to.
    id (str): custom label given to a measurement instance, can be useful for some applications
        where the instance has to be identified

## `DensityMatrixMP`

```python
class DensityMatrixMP(StateMP)
```

Measurement process that returns the quantum state in the computational basis.

Please refer to :func:`density_matrix` for detailed documentation.

Args:
    wires (.Wires): The wires the measurement process applies to.
    id (str): custom label given to a measurement instance, can be useful for some applications
        where the instance has to be identified

## `state`

```python
def state() -> StateMP
```

Quantum state in the computational basis.

This function accepts no observables and instead instructs the QNode to return its state. A
``wires`` argument should *not* be provided since ``state()`` always returns a pure state
describing all wires in the device.

Note that the output shape of this measurement process depends on the
number of wires defined for the device.

Returns:
    StateMP: Measurement process instance

**Example:**

.. code-block:: python

    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def circuit():
        qp.Hadamard(wires=1)
        return qp.state()

Executing this QNode:

>>> circuit()
array([0.70710678+0.j, 0.70710678+0.j, 0.        +0.j, 0.        +0.j])

The returned array is in lexicographic order. Hence, we have a :math:`1/\sqrt{2}` amplitude
in both :math:`|00\rangle` and :math:`|01\rangle`.

.. note::

    Differentiating :func:`~pennylane.state` is currently only supported when using the
    classical backpropagation differentiation method (``diff_method="backprop"``) with a
    compatible device.

.. details::
    :title: Usage Details

    A QNode with the ``qp.state`` output can be used in a cost function which
    is then differentiated:

    >>> dev = qp.device('default.qubit', wires=2)
    >>> @qp.qnode(dev, diff_method="backprop")
    ... def test(x):
    ...     qp.RY(x, wires=[0])
    ...     return qp.state()
    >>> def cost(x):
    ...     return np.abs(test(x)[0])
    >>> x = pnp.array(0.54, requires_grad=True)
    >>> cost(x)
    tensor(0.963..., requires_grad=True)
    >>> qp.grad(cost)(x)
    tensor(-0.13..., requires_grad=True)

## `density_matrix`

```python
def density_matrix(wires) -> DensityMatrixMP
```

Quantum density matrix in the computational basis.

This function accepts no observables and instead instructs the QNode to return its density
matrix or reduced density matrix. The ``wires`` argument gives the possibility
to trace out a part of the system. It can result in obtaining a mixed state, which can be
only represented by the reduced density matrix.

Args:
    wires (Sequence[int] or int): the wires of the subsystem

Returns:
    DensityMatrixMP: Measurement process instance

**Example:**

.. code-block:: python

    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def circuit():
        qp.Y(0)
        qp.Hadamard(wires=1)
        return qp.density_matrix([0])

Executing this QNode:

>>> circuit()
array([[0.+0.j, 0.+0.j],
       [0.+0.j, 1.+0.j]])

The returned matrix is the reduced density matrix, where system 1 is traced out.

.. note::

    Calculating the derivative of :func:`~pennylane.density_matrix` is currently only supported when
    using the classical backpropagation differentiation method (``diff_method="backprop"``)
    with a compatible device.
