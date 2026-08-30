---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/arbitrary_unitary.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/arbitrary_unitary.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/arbitrary_unitary.py`

Contains the ArbitraryUnitary template.

## `ArbitraryUnitary`

```python
class ArbitraryUnitary(Operation)
```

Implements an arbitrary unitary on the specified wires.

An arbitrary unitary on :math:`n` wires is parametrized by :math:`4^n - 1`
independent real parameters. This templates uses Pauli word rotations to
parametrize the unitary.

**Example**

ArbitraryUnitary can be used as a building block, e.g. to parametrize arbitrary
two-qubit operations in a circuit:

.. code-block:: python

    def arbitrary_nearest_neighbour_interaction(weights, wires):
        for i, w in enumerate(range(0, len(wires) - 1, 2)):
            ArbitraryUnitary(weights[i], wires=[w, w + 1])

Args:
    weights (tensor_like): The angles of the Pauli word rotations, needs to have length :math:`4^n - 1`
        where :math:`n` is the number of wires the template acts upon.
    wires (Iterable): wires that the template acts on

### `compute_decomposition`

```python
def compute_decomposition(weights, wires)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.ArbitraryUnitary.decomposition`.

Args:
    weights (tensor_like): The angles of the Pauli word rotations, needs to have length :math:`4^n - 1`
            where :math:`n` is the number of wires the template acts upon.
    wires (Any or Iterable[Any]): wires that the operator acts on


Returns:
    list[.Operator]: decomposition of the operator

### `shape`

```python
def shape(n_wires)
```

Compute the expected shape of the weights tensor.

Args:
    n_wires (int): number of wires that template acts on
