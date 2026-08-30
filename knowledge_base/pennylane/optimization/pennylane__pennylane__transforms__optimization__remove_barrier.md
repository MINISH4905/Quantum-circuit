---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/optimization/remove_barrier.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/optimization/remove_barrier.py
license: Apache-2.0
---

## Module `pennylane/transforms/optimization/remove_barrier.py`

Transform for removing the Barrier gate from quantum circuits.

## `remove_barrier`

```python
def remove_barrier(tape: QuantumScript) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Quantum transform to remove Barrier gates.

Args:
    tape (QNode or QuantumTape or Callable): A quantum circuit (QNode or quantum function).

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[.QuantumTape], function]: The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

**Example**

The transform can be applied on :class:`QNode` directly.

.. code-block:: python

    import pennylane as qp

    @remove_barrier
    @qp.qnode(qp.device('default.qubit'))
    def circuit(x, y):
        qp.Hadamard(wires=0)
        qp.Hadamard(wires=1)
        qp.Barrier(wires=[0,1])
        qp.X(0)
        return qp.expval(qp.Z(0))

>>> print(qp.draw(circuit)(0.1, 0.2))
0: ──H──X─┤  <Z>
1: ──H────┤

The barrier is removed before execution.

.. details::
    :title: Usage Details

    Consider the following quantum function:

    .. code-block:: python

        def qfunc(x, y):
            qp.Hadamard(wires=0)
            qp.Hadamard(wires=1)
            qp.Barrier(wires=[0,1])
            qp.X(0)
            return qp.expval(qp.Z(0))

    The circuit before optimization:

    >>> dev = qp.device('default.qubit')
    >>> qnode = qp.QNode(qfunc, dev)
    >>> print(qp.draw(qnode)(1, 2))
    0: ──H─╭||──X─┤  <Z>
    1: ──H─╰||────┤

    We can remove the Barrier by running the ``remove_barrier`` transform:

    >>> optimized_qfunc = remove_barrier(qfunc)
    >>> optimized_qnode = qp.QNode(optimized_qfunc, dev)
    >>> print(qp.draw(optimized_qnode)(1, 2))
    0: ──H──X─┤  <Z>
    1: ──H────┤
