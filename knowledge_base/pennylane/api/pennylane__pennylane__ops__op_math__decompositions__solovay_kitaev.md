---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/decompositions/solovay_kitaev.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/decompositions/solovay_kitaev.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/decompositions/solovay_kitaev.py`

Solovay-Kitaev implementation for approximate single-qubit unitary decomposition.

## `sk_decomposition`

```python
def sk_decomposition(op, epsilon, *, max_depth=5, basis_set=('H', 'S', 'T'), basis_length=10)
```

Approximate an arbitrary single-qubit gate in the Clifford+T basis using the `Solovay-Kitaev algorithm <https://arxiv.org/abs/quant-ph/0505030>`_.

This method implements the Solovay-Kitaev decomposition algorithm that approximates any single-qubit
operation with :math:`\epsilon > 0` error. The procedure exits when the approximation error
becomes less than :math:`\epsilon`, or when ``max_depth`` approximation passes have been made. In the
latter case, the approximation error could be :math:`\geq \epsilon`.

This algorithm produces a decomposition with :math:`O(\text{log}^{3.97}(1/\epsilon))` operations.

Args:
    op (~pennylane.operation.Operation): A single-qubit gate operation.
    epsilon (float): The maximum permissible error.

Keyword Args:
    max_depth (int): The maximum number of approximation passes. A smaller :math:`\epsilon` would generally require
        a greater number of passes. Default is ``5``.
    basis_set (tuple[str]): Basis set to be used for the decomposition and building an approximate set internally.
        It accepts the following gate terms: ``('X', 'Y', 'Z', 'H', 'T', 'Adjoint(T)', 'S', 'Adjoint(S)')``. Default value is ``('H', 'S', 'T')``.
    basis_length (int): Maximum expansion length of Clifford+T sequences in the internally-built approximate set.
        Default is ``10``.

Returns:
    list[~pennylane.operation.Operation]: A list of gates in the Clifford+T basis set that approximates the given
    operation along with a final global phase operation. The operations are in the circuit-order.

Raises:
    ValueError: If the given operator acts on more than one wires.

**Example**

Suppose one would like to decompose :class:`~.RZ` with rotation angle :math:`\phi = \pi/3`:

.. code-block:: python

    op  = qp.RZ(np.pi/3, wires=0)

    # Get the gate decomposition in ['H', 'S', 'T']
    ops = qp.ops.sk_decomposition(op, epsilon=1e-3)

    # Get the approximate matrix from the ops
    matrix_sk = qp.prod(*reversed(ops)).matrix()

When the function is run for a sufficient ``depth`` with a good enough approximate set,
the output gate sequence should implement the same operation approximately.

>>> qp.math.allclose(op.matrix(), matrix_sk, atol=1e-3)
True
