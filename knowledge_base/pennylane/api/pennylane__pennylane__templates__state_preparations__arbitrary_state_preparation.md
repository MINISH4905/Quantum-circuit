---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/state_preparations/arbitrary_state_preparation.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/state_preparations/arbitrary_state_preparation.py
license: Apache-2.0
---

## Module `pennylane/templates/state_preparations/arbitrary_state_preparation.py`

Contains the ArbitraryStatePreparation template.

## `ArbitraryStatePreparation`

```python
class ArbitraryStatePreparation(Operation)
```

Implements an arbitrary state preparation on the specified wires.

An arbitrary state on :math:`n` wires is parametrized by :math:`2^{n+1} - 2`
independent real parameters. This templates uses Pauli word rotations to
parametrize the unitary.

Args:
    weights (tensor_like): Angles of the Pauli word rotations. Needs to have length :math:`2^{n+1} - 2`
        where :math:`n` is the number of wires the template acts upon.
    wires (Iterable): wires that the template acts on

**Example**

ArbitraryStatePreparation can be used to train state preparations,
for example using a circuit with some measurement observable ``H``:

.. code-block:: python

    dev = qp.device("default.qubit", wires=4)

    @qp.qnode(dev)
    def vqe(weights):
        qp.ArbitraryStatePreparation(weights, wires=[0, 1, 2, 3])

        return qp.expval(qp.Hermitian(H, wires=[0, 1, 2, 3]))

The shape of the weights parameter can be computed as follows:

.. code-block:: python

    shape = qp.ArbitraryStatePreparation.shape(n_wires=4)

### `compute_decomposition`

```python
def compute_decomposition(weights, wires)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.ArbitraryStatePreparation.decomposition`.

Args:
    weights (tensor_like): Angles of the Pauli word rotations. Needs to have length :math:`2^{n+1} - 2`
        where :math:`n` is the number of wires the template acts upon.
    wires (Any or Iterable[Any]): wires that the operator acts on

Returns:
    list[.Operator]: decomposition of the operator

**Example**

>>> weights = torch.tensor([1., 2., 3., 4., 5., 6.])
>>> ops = qp.ArbitraryStatePreparation.compute_decomposition(weights, wires=["a", "b"])
>>> from pprint import pprint
>>> pprint(ops)
[PauliRot(1.0, XI, wires=['a', 'b']),
PauliRot(2.0, YI, wires=['a', 'b']),
PauliRot(3.0, IX, wires=['a', 'b']),
PauliRot(4.0, IY, wires=['a', 'b']),
PauliRot(5.0, XX, wires=['a', 'b']),
PauliRot(6.0, XY, wires=['a', 'b'])]

### `shape`

```python
def shape(n_wires)
```

Returns the required shape for the weight tensor.

Args:
        n_wires (int): number of wires

Returns:
    tuple[int]: shape
