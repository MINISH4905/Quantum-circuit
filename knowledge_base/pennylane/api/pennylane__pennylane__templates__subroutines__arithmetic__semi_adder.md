---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/arithmetic/semi_adder.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/arithmetic/semi_adder.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/arithmetic/semi_adder.py`

Contains the SemiAdder template for performing the semi-out-place addition.

## `SemiAdder`

```python
class SemiAdder(Operation)
```

This operator performs the plain addition of two integers :math:`x` and :math:`y` in the computational basis:

.. math::

    \text{SemiAdder} |x \rangle | y \rangle = |x \rangle | x + y  \rangle,

This operation is also referred to as semi-out-place addition or quantum-quantum in-place addition in the literature.

The implementation is based on `arXiv:1709.06648 <https://arxiv.org/abs/1709.06648>`_.

Args:
    x_wires (Sequence[int]): The wires that store the integer :math:`x`. The number of wires must be sufficient to
        represent :math:`x` in binary.
    y_wires (Sequence[int]): The wires that store the integer :math:`y`. The number of wires must be sufficient to
        represent :math:`y` in binary. These wires are also used
        to encode the integer :math:`x+y` which is computed modulo :math:`2^{\text{len(y_wires)}}` in the computational basis.
    work_wires (Optional(Sequence[int])): The auxiliary wires to use for the addition. At least, ``len(y_wires) - 1`` work
        wires should be provided.

**Example**

This example computes the sum of two integers :math:`x=3` and :math:`y=4`.

.. code-block:: python

    x = 3
    y = 4

    wires = qp.registers({"x":3, "y":6, "work":5})

    dev = qp.device("default.qubit")

    @qp.set_shots(1)
    @qp.qnode(dev)
    def circuit():
        qp.BasisEmbedding(x, wires=wires["x"])
        qp.BasisEmbedding(y, wires=wires["y"])
        qp.SemiAdder(wires["x"], wires["y"], wires["work"])
        return qp.sample(wires=wires["y"])

.. code-block:: pycon

    >>> print(circuit())
    [[0 0 0 1 1 1]]

The result :math:`[[0 0 0 1 1 1]]`, is the binary representation of :math:`3 + 4 = 7`.

Note that the result is computed modulo :math:`2^{\text{len(y_wires)}}` which makes the computed value dependent on the size of the ``y_wires`` register. This behavior is demonstrated in the following example.

.. code-block:: python

    x = 3
    y = 1

    wires = qp.registers({"x":3, "y":2, "work":1})

    dev = qp.device("default.qubit")

    @qp.set_shots(1)
    @qp.qnode(dev)
    def circuit():
        qp.BasisEmbedding(x, wires=wires["x"])
        qp.BasisEmbedding(y, wires=wires["y"])
        qp.SemiAdder(wires["x"], wires["y"], wires["work"])
        return qp.sample(wires=wires["y"])

>>> print(circuit())
[[0 0]]

The result :math:`[0\ 0]` is the binary representation of :math:`3 + 1 = 4` where :math:`4 \mod 2^2 = 0`.

### `decomposition`

```python
def decomposition(self)
```

Representation of the operator as a product of other operators.

### `compute_decomposition`

```python
def compute_decomposition(x_wires, y_wires, work_wires)
```

Representation of the operator as a product of other operators.
The implementation is based on `arXiv:1709.06648 <https://arxiv.org/abs/1709.06648>`_.

Args:

    x_wires (Sequence[int]): The wires that store the integer :math:`x`. The number of wires must be sufficient to
        represent :math:`x` in binary.
    y_wires (Sequence[int]): The wires that store the integer :math:`y`. The number of wires must be sufficient to
        represent :math:`y` in binary. These wires are also used
        to encode the integer :math:`x+y` which is computed modulo :math:`2^{\text{len(y_wires)}}` in the computational basis.
    work_wires (Sequence[int]): The auxiliary wires to use for the addition. At least, ``len(y_wires) - 1`` work
        wires should be provided.

Returns:
    list[.Operator]: Decomposition of the operator
