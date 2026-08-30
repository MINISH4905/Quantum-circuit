---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/change_op_basis.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/change_op_basis.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/change_op_basis.py`

This submodule defines a class for compute-uncompute patterns.

## `change_op_basis`

```python
def change_op_basis(compute_op: Operator | Callable, target_op: Operator | Callable, uncompute_op: Operator | Callable | None=None)
```

Construct an operator that represents the product of the
operators provided; particularly a compute-uncompute pattern.

Args:
    compute_op (:class:`~.Operator` | Callable): A single operator or ``Callable`` with no inputs that applies quantum operations.
    target_op (:class:`~.Operator` | Callable): A single operator or ``Callable`` with no inputs that applies quantum operations.
    uncompute_op (None | :class:`~.Operator` | Callable): An optional single operator or ``Callable`` with no inputs that applies quantum
        operations. ``None`` corresponds to ``uncompute_op=qp.adjoint(compute_op)``.

Returns:
    ~ops.op_math.ChangeOpBasis: the operator representing the compute-uncompute pattern.

Raises:
    TypeError: if any arguments are not ``Callable`` s or :class:`~.Operator` s, or a ``Callable`` argument has input parameters.

**Example**

Consider the following example involving a ``change_op_basis``. The compute, uncompute pattern
is composed of a Quantum Fourier Transform (``QFT``), followed by a ``PhaseAdder``, and finally
an inverse ``QFT``.

.. code-block:: python

    import pennylane as qp
    from functools import partial

    qp.decomposition.enable_graph()

    dev = qp.device("default.qubit")
    @qp.qnode(dev)
    def circuit():
        qp.H(0)
        qp.CNOT([1,2])
        qp.ctrl(
            qp.change_op_basis(qp.QFT([1,2]), qp.PhaseAdder(1, x_wires=[1,2])),
            control=0
        )
        return qp.state()

    circuit2 = qp.decompose(circuit, max_expansion=1)

When this circuit is decomposed, the ``compute_op`` and ``uncompute_op`` are not controlled,
resulting in a much more resource-efficient decomposition:

>>> print(qp.draw(circuit2)())
0: ──H──────╭●────────────────┤  State
1: ─╭●─╭QFT─├PhaseAdder─╭QFT†─┤  State
2: ─╰X─╰QFT─╰PhaseAdder─╰QFT†─┤  State

A ``Callable`` can also be provided as an argument to ``change_op_basis``. This can be a
function that applies a series of ``Operation`` s. Since ``change_op_basis`` requires this
``Callable`` to have no input arguments, ``functools.partial`` can be used to absorb any
necessary parameters.

.. code-block:: python

    def my_compute_op(a, reg1, reg2):
        qp.BasisState(np.zeros(len(reg2)), reg2)
        qp.QFT(reg1)
        qp.RX(a, reg1[0])

    def my_target_op(wires):
        qp.PauliX(wires[0])

    dev = qp.device("default.qubit")

    @qp.qnode(dev)
    def circuit():
        # Use partial to absorb any input parameters
        compute = partial(my_compute_op, 0.1, [0], [1])
        target = partial(my_target_op, [0])
        qp.change_op_basis(compute, target)
        return qp.state()

    circuit3 = qp.decompose(circuit, max_expansion=1)

>>> print(qp.draw(circuit3)())
0: ─╭RX(0.10)@QFT@|Ψ⟩──X─╭(RX(0.10)@QFT@|Ψ⟩)†─┤  State
1: ─╰RX(0.10)@QFT@|Ψ⟩────╰(RX(0.10)@QFT@|Ψ⟩)†─┤  State

.. warning::

    There is limited support for passing callables to ``change_op_basis`` when program capture
    is enabled. Specifically, passing callables to ``qp.adjoint(qp.change_op_basis)(...)`` and
    ``qp.ctrl(qp.change_op_basis, control=...)(...)`` are not supported with ``@qp.qjit(capture=True)``

.. seealso:: :class:`~.ops.op_math.ChangeOpBasis`

## `ChangeOpBasis`

```python
class ChangeOpBasis(CompositeOp)
```

Composite operator representing a compute-uncompute pattern of operators, which constitutes changing the basis in
which an operator is applied.

Args:
    compute_op (:class:`~.Operator`): A single operator or product that applies quantum operations.
    target_op (:class:`~.Operator`): A single operator or a product that applies quantum operations.
    uncompute_op (:class:`~.Operator`): A single operator or a product that applies quantum operations.
        Default is uncompute_op=qp.adjoint(compute_op).

Returns:
    (Operator): Returns an Operator which is the change_op_basis of the provided Operators: compute_op, target_op, uncompute_op.

.. note::
    When a ``ChangeOpBasis`` operator is iterated over, its factors are iterated in the reverse order. This is to
    have a similar behaviour to ``Prod`` which applies its factors in reverse order.

.. seealso:: :func:`~.change_op_basis`

### `is_verified_hermitian`

```python
def is_verified_hermitian(self)
```

Check if the product operator is hermitian.

Note, this check is not exhaustive. There can be hermitian operators for which this check
yields false, which ARE hermitian. So a false result only implies that a more explicit check
must be performed.

### `decomposition`

```python
def decomposition(self)
```

Decomposition of the product operator is given by each of compute_op, target_op, compute_op† applied in succession.
