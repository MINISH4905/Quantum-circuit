---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/optimization/commute_controlled.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/optimization/commute_controlled.py
license: Apache-2.0
---

## Module `pennylane/transforms/optimization/commute_controlled.py`

Transforms for pushing commuting gates through targets/control qubits.

## `commute_controlled`

```python
def commute_controlled(tape: QuantumScript, direction='right') -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Quantum transform to move commuting gates past control and target qubits of controlled operations.

Args:
    tape (QNode or QuantumTape or Callable): A quantum circuit.
    direction (str): The direction in which to move single-qubit gates.
        Options are "right" (default), or "left". Single-qubit gates will
        be pushed through controlled operations as far as possible in the
        specified direction.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]: The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.


**Example**

You can apply the transform directly on :class:`QNode`:

.. code-block:: python

    import pennylane as qp

    dev = qp.device('default.qubit')

    @qp.transforms.commute_controlled(direction="right")
    @qp.qnode(device=dev)
    def circuit(theta):
        qp.CZ(wires=[0, 2])
        qp.X(2)
        qp.S(wires=0)

        qp.CNOT(wires=[0, 1])

        qp.Y(1)
        qp.CRY(theta, wires=[0, 1])
        qp.PhaseShift(theta/2, wires=0)

        qp.Toffoli(wires=[0, 1, 2])
        qp.T(wires=0)
        qp.RZ(theta/2, wires=1)

        return qp.expval(qp.Z(0))

>>> print(qp.draw(circuit)(0.5))
0: ─╭●─╭●─╭●───────────╭●──S─────────Rϕ(0.25)──T─┤  <Z>
1: ─│──╰X─╰RY(0.50)──Y─├●──RZ(0.25)──────────────┤
2: ─╰Z─────────────────╰X──X─────────────────────┤

.. details::
    :title: Usage Details

    You can also apply this transform to quantum functions.

    .. code-block:: python

        def qfunc(theta):
            qp.CZ(wires=[0, 2])
            qp.X(2)
            qp.S(wires=0)

            qp.CNOT(wires=[0, 1])

            qp.Y(1)
            qp.CRY(theta, wires=[0, 1])
            qp.PhaseShift(theta/2, wires=0)

            qp.Toffoli(wires=[0, 1, 2])
            qp.T(wires=0)
            qp.RZ(theta/2, wires=1)

            return qp.expval(qp.Z(0))

    >>> qnode = qp.QNode(qfunc, dev)
    >>> print(qp.draw(qnode)(0.5))
    0: ─╭●──S─╭●────╭●─────────Rϕ(0.25)─╭●──T────────┤  <Z>
    1: ─│─────╰X──Y─╰RY(0.50)───────────├●──RZ(0.25)─┤
    2: ─╰Z──X───────────────────────────╰X───────────┤

    Diagonal gates on either side of control qubits do not affect the outcome
    of controlled gates; thus we can push all the single-qubit gates on the
    first qubit together on the right (and fuse them if desired). Similarly, X
    gates commute with the target of ``CNOT`` and ``Toffoli`` (and ``PauliY``
    with ``CRY``). We can use the transform to push single-qubit gates as
    far as possible through the controlled operations:

    >>> optimized_qfunc = commute_controlled(qfunc, direction="right")
    >>> optimized_qnode = qp.QNode(optimized_qfunc, dev)
    >>> print(qp.draw(optimized_qnode)(0.5))
    0: ─╭●─╭●─╭●───────────╭●──S─────────Rϕ(0.25)──T─┤  <Z>
    1: ─│──╰X─╰RY(0.50)──Y─├●──RZ(0.25)──────────────┤
    2: ─╰Z─────────────────╰X──X─────────────────────┤
