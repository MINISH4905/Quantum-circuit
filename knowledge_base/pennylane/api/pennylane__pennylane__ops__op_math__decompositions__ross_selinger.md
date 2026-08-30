---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/decompositions/ross_selinger.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/decompositions/ross_selinger.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/decompositions/ross_selinger.py`

Ross-Selinger (arXiv:1403.2975v3) implementation for approximate Pauli-Z rotation gate decomposition.

## `apply_clifford_from_idx`

```python
def apply_clifford_from_idx(idx, wire)
```

Apply a Clifford gate sequence by index on the specified wire.

This function maps an integer index to one of the standard Clifford sequences
defined in `clifford_keys_unwired`. The returned function uses `qp.cond`
to select and apply the correct sequence in QJIT-compatible form.

Args:
    idx (int): Index into the Clifford sequence list.
    wire (int): Target wire.

Returns:
    Callable: A conditional function that applies the indexed Clifford sequence.

## `rs_decomposition`

```python
def rs_decomposition(op, epsilon, is_qjit=False, *, max_search_trials=20, max_factoring_trials=1000)
```

Approximate a phase shift rotation gate in the Clifford+T basis using the `Ross-Selinger algorithm <https://arxiv.org/abs/1403.2975>`_.

This method implements the Ross-Selinger decomposition algorithm that approximates any arbitrary
phase shift rotation gate with :math:`\epsilon > 0` error. The procedure exits when the approximation error
becomes less than :math:`\epsilon`, or when ``max_search_trials`` attempts have been made for solution search.
In the latter case, the approximation error could be :math:`\geq \epsilon`.

This algorithm produces a decomposition with :math:`O(3\text{log}_2(1/\epsilon)) + O(\text{log}_2(\text{log}_2(1/\epsilon)))` operations.

Args:
    op (~pennylane.RZ | ~pennylane.PhaseShift): A :class:`~.RZ` or :class:`~.PhaseShift` gate operation.
    epsilon (float): The maximum permissible error.
    is_qjit (bool): Whether the decomposition is being performed with QJIT enabled.

Keyword Args:
    max_search_trials (int): The maximum number of attempts to find a solution
        while performing the grid search according to the Algorithm 7.6.1, in the
        `arXiv:1403.2975v3 <https://arxiv.org/abs/1403.2975>`_. Default is ``20``.
    max_factoring_trials (int): The maximum number of attempts to find a prime factor
        while performing the factoring to solve the Diophantine equation (Algorithm 7.6.2b)
        for the solution found in the grid search. Default is ``1000``.

Returns:
    list[~pennylane.operation.Operation]: A list of gates in the Clifford+T basis set that approximates the given
    operation along with a final global phase operation. The operations are in the circuit-order.

Raises:
    ValueError: If the given operator is not a :class:`~.RZ` or :class:`~.PhaseShift` gate.

**Example**

Suppose one would like to decompose :class:`~.RZ` with rotation angle :math:`\phi = \pi/3`:

.. code-block:: python

    op  = qp.RZ(np.pi/3, wires=0)
    ops = qp.ops.rs_decomposition(op, epsilon=1e-3)

    # Get the approximate matrix from the ops
    matrix_rs = qp.prod(*reversed(ops)).matrix()

When the function is run for a sufficient ``max_search_trials``, the output gate sequence
should implement the same operation approximately, up to an :math:`\epsilon`-error.

>>> qp.math.allclose(op.matrix(), matrix_rs, atol=1e-3)
True
