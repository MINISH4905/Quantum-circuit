---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/gqsp.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/gqsp.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/gqsp.py`

Contains the GQSP template.

## `GQSP`

```python
class GQSP(Operation)
```

Implements the generalized quantum signal processing (GQSP) circuit.

This operation encodes a polynomial transformation of an input unitary operator following the algorithm
described in `arXiv:2308.01501 <https://arxiv.org/abs/2308.01501>`__ as:

.. math::
     U
     \xrightarrow{GQSP}
     \begin{pmatrix}
     \text{poly}(U) & * \\
     * & * \\
     \end{pmatrix}

The implementation requires one control qubit.

Args:

    unitary (Operator): the operator to be encoded by the GQSP circuit
    angles (tensor[float]): array of angles defining the polynomial transformation. The shape of the array must be `(3, d+1)`, where `d` is the degree of the polynomial.
    control (Union[Wires, int, str]): control qubit used to encode the polynomial transformation

.. note::

   The  :func:`~.poly_to_angles` function can be used to calculate the angles for a given polynomial.

Example:

.. code-block:: python

    # P(x) = 0.1 + 0.2j x + 0.3 x^2
    poly = [0.1, 0.2j, 0.3]

    angles = qp.poly_to_angles(poly, "GQSP")

    @qp.prod # transforms the qfunc into an Operator
    def unitary(wires):
        qp.RX(0.3, wires)

    dev = qp.device("default.qubit")

    @qp.qnode(dev)
    def circuit(angles):
        qp.GQSP(unitary(wires = 1), angles, control = 0)
        return qp.state()

    matrix = qp.matrix(circuit, wire_order=[0, 1])(angles)

.. code-block:: pycon

    >>> print(np.round(matrix,3)[:2, :2])
    [[0.387+0.198j 0.03 -0.089j]
    [0.03 -0.089j 0.387+0.198j]]

### `compute_decomposition`

```python
def compute_decomposition(*parameters, **hyperparameters)
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.Operator.decomposition`.

Args:
    *parameters (list): trainable parameters of the operator, as stored in the ``parameters`` attribute
    wires (Iterable[Any], Wires): wires that the operator acts on
    **hyperparams (dict): non-trainable hyperparameters of the operator, as stored in the ``hyperparameters`` attribute

Returns:
    list[Operator]: decomposition of the operator
