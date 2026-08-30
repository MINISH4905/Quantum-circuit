---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/qutrit/state_preparation.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/qutrit/state_preparation.py
license: Apache-2.0
---

## Module `pennylane/ops/qutrit/state_preparation.py`

This submodule contains the discrete-variable quantum operations concerned
with preparing a certain state on the qutrit device.

## `QutritBasisState`

```python
class QutritBasisState(StatePrepBase)
```

QutritBasisState(n, wires)
Prepares a single computational basis state for a qutrit system.

**Details:**

* Number of wires: Any (the operation can act on any number of wires)
* Number of parameters: 1
* Gradient recipe: None (integer parameters not supported)

.. note::

    If the ``QutritBasisState`` operation is not supported natively on the
    target device, PennyLane will attempt to decompose the operation
    into :class:`~.TShift` operations.

.. note::

    When called in the middle of a circuit, the action of the operation is defined
    as :math:`U|0\rangle = |\psi\rangle`

Args:
    n (array): prepares the basis state :math:`\ket{n}`, where ``n`` is an
        array of integers from the set :math:`\{0, 1, 2\}`, i.e.,
        if ``n = np.array([0, 1, 0])``, prepares the state :math:`|010\rangle`.
    wires (Sequence[int] or int): the wire(s) the operation acts on

**Example**

>>> dev = qp.device('default.qutrit', wires=2)
>>> @qp.qnode(dev)
... def example_circuit():
...     qp.QutritBasisState(np.array([2, 2]), wires=range(2))
...     return qp.state()
>>> print(example_circuit())
[0.+0.j 0.+0.j 0.+0.j 0.+0.j 0.+0.j 0.+0.j 0.+0.j 0.+0.j 1.+0.j]

### `compute_decomposition`

```python
def compute_decomposition(n, wires)
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.BasisState.decomposition`.

Args:
    n (array): prepares the basis state :math:`\ket{n}`, where ``n`` is an
        array of integers from the set :math:`\{0, 1, 2\}`
    wires (Iterable, Wires): the wire(s) the operation acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.QutritBasisState.compute_decomposition([1,0], wires=(0,1))
[QutritBasisStatePreparation(array([1, 0]), wires=[0, 1])]

### `state_vector`

```python
def state_vector(self, wire_order=None)
```

Returns a statevector of shape ``(3,) * num_wires``.
