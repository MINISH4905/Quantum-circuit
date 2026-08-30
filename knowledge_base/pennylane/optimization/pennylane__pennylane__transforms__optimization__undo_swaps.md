---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/optimization/undo_swaps.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/optimization/undo_swaps.py
license: Apache-2.0
---

## Module `pennylane/transforms/optimization/undo_swaps.py`

Transform that eliminates the swap operators by reordering the wires.

## `null_postprocessing`

```python
def null_postprocessing(results)
```

A postprocessing function returned by a transform that only converts the batch of results
into a result for a single ``QuantumTape``.

## `undo_swaps`

```python
def undo_swaps(tape: QuantumScript) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Quantum function transform to remove SWAP gates by running from right to left through the
circuit changing the position of the qubits accordingly.

Args:
    tape (QNode or QuantumTape or Callable): A quantum circuit (QNode or quantum function).

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]: The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

**Example**

You can apply the transform directly on a :class:`QNode`.

.. code-block:: python

    import pennylane as qp

    dev = qp.device('default.qubit', wires=3)

    @qp.transforms.undo_swaps
    @qp.qnode(device=dev)
    def circuit():
        qp.Hadamard(wires=0)
        qp.X(1)
        qp.SWAP(wires=[0,1])
        qp.SWAP(wires=[0,2])
        qp.Y(0)
        return qp.expval(qp.Z(0))

>>> print(qp.draw(circuit)())
0: ──Y─┤  <Z>
1: ──H─┤
2: ──X─┤

The SWAP gates are removed before execution.

.. details::
    :title: Usage Details

    Consider the following quantum function:

    .. code-block:: python

        def qfunc():
            qp.Hadamard(wires=0)
            qp.X(1)
            qp.SWAP(wires=[0,1])
            qp.SWAP(wires=[0,2])
            qp.Y(0)
            return qp.expval(qp.Z(0))

    >>> dev = qp.device('default.qubit', wires=3)
    >>> qnode = qp.QNode(qfunc, dev)
    >>> print(qp.draw(qnode)())
    0: ──H─╭SWAP─╭SWAP──Y─┤  <Z>
    1: ──X─╰SWAP─│────────┤
    2: ──────────╰SWAP────┤

    We can remove the SWAP gates by running the ``undo_swap`` transform, where the wires
    involved in the SWAP gates are interchanged:

    >>> optimized_qnode = undo_swaps(qnode)
    >>> print(qp.draw(optimized_qnode)())
    0: ──Y─┤ <Z>
    1: ──H─┤
    2: ──X─┤

    Gates are iterated through from right to left, where non-SWAP gates are ignored. The first
    gate is a ``Y`` gate, which is left to act on wire ``0``. Next, the right-most SWAP gate
    acting on wires ``(0, 2)`` is removed, and the wires are manually swapped; wire ``2`` now
    becomes wire ``0``, and vice versa. Next, the SWAP gate acting on wires ``(0, 1)`` is
    removed and the wires are interchanged.

    Altogether, this affects the wire labels as follows, where the operations to the left of
    both SWAP gates have their wire labels changed accordingly.

    * wire ``0`` changes to wire ``2`` which changes to wire ``1``. This moves the ``H`` gate from wire ``0`` to wire ``1``.

    * wire ``2`` changes to wire ``0``.

    * wire ``1`` changes to wire ``2``. This moves the ``X`` gate from wire ``1`` to wire ``2``.
