---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/state_preparations/basis_qutrit.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/state_preparations/basis_qutrit.py
license: Apache-2.0
---

## Module `pennylane/templates/state_preparations/basis_qutrit.py`

Contains the QutritBasisStatePreparation template.

## `QutritBasisStatePreparation`

```python
class QutritBasisStatePreparation(Operation)
```

Prepares a basis state on the given wires using a sequence of TShift gates.

.. warning::

    ``basis_state`` influences the circuit architecture and is therefore incompatible with
    gradient computations.

Args:
    basis_state (array): Input array of shape ``(n,)``, where n is the number of wires
        the state preparation acts on.
    wires (Iterable): wires that the template acts on

**Example**

.. code-block:: python

    dev = qp.device("default.qutrit", wires=4)

    @qp.qnode(dev)
    def circuit(basis_state, obs):
        qp.QutritBasisStatePreparation(basis_state, wires=range(4))
        return [qp.expval(qp.THermitian(obs, wires=i)) for i in range(4)]

    basis_state = [0, 1, 1, 0]
    obs = np.array([[1, 1, 0], [1, -1, 0], [0, 0, np.sqrt(2)]]) / np.sqrt(2)

>>> print(circuit(basis_state, obs)) # doctest: +SKIP
[array(0.7071), array(-0.7071), array(-0.7071), array(0.7071)]

### `compute_decomposition`

```python
def compute_decomposition(basis_state, wires)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.BasisState.decomposition`.

Args:
    basis_state (array): Input array of shape ``(len(wires),)``
    wires (Any or Iterable[Any]): wires that the operator acts on

Returns:
    list[.Operator]: decomposition of the operator

**Example**

>>> qp.QutritBasisStatePreparation.compute_decomposition(basis_state=[1, 2], wires=["a", "b"])
[TShift(wires=['a']), TShift(wires=['b']), TShift(wires=['b'])]
