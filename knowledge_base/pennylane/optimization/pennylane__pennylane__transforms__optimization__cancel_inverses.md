---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/optimization/cancel_inverses.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/optimization/cancel_inverses.py
license: Apache-2.0
---

## Module `pennylane/transforms/optimization/cancel_inverses.py`

Transform for cancelling adjacent inverse gates in quantum circuits.

## `cancel_inverses`

```python
def cancel_inverses(tape: QuantumScript, recursive: bool=True) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Quantum function transform to remove any operations that are applied next to their
(self-)inverses or adjoint.

Args:
    tape (QNode or QuantumTape or Callable): A quantum circuit (QNode or quantum function).
    recursive (bool): Whether or not to recursively cancel inverses after a first pair of mutual inverses has been cancelled. Enabled by default.

        .. note::
            This argument is not supported within a :func:`~.qjit` workflow.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]:
        The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.


**Example**


You can apply it on quantum functions:

.. code-block:: python

    def qfunc(x, y, z):
        qp.Hadamard(wires=0)
        qp.Hadamard(wires=1)
        qp.Hadamard(wires=0)
        qp.RX(x, wires=2)
        qp.RY(y, wires=1)
        qp.X(1)
        qp.RZ(z, wires=0)
        qp.RX(y, wires=2)
        qp.CNOT(wires=[0, 2])
        qp.X(1)
        return qp.expval(qp.Z(0))

The circuit before optimization:

>>> dev = qp.device("default.qubit")
>>> qnode = qp.QNode(qfunc, dev)
>>> print(qp.draw(qnode)(1, 2, 3))
0: ──H─────────H─────────RZ(3.00)─╭●────┤  <Z>
1: ──H─────────RY(2.00)──X────────│───X─┤
2: ──RX(1.00)──RX(2.00)───────────╰X────┤

We can see that there are two adjacent Hadamards on the first qubit that
should cancel each other out. Similarly, there are two ``X`` gates on the
second qubit that should cancel. We can obtain a simplified circuit by running
the ``cancel_inverses`` transform:

>>> optimized_qnode = qp.transforms.cancel_inverses(qnode)
>>> print(qp.draw(optimized_qnode)(1, 2, 3))
0: ──RZ(3.00)───────────╭●─┤  <Z>
1: ──H─────────RY(2.00)─│──┤
2: ──RX(1.00)──RX(2.00)─╰X─┤

.. details::
    :title: Usage with qjit

    There are three key differences to note when using ``cancel_inverses`` with ``qjit``:

    * ``cancel_inverses`` must be applied to a QNode. Quantum functions are not supported as input.

    * The ``recursive`` argument is not supported, and an error will be raised if a value for ``recursive`` is specified.

    * Only the following gates can be optimized by ``cancel_inverses`` with ``qjit``:

      - :class:`qp.Hadamard <pennylane.Hadamard>`,
      - :class:`qp.PauliX <pennylane.PauliX>`,
      - :class:`qp.PauliY <pennylane.PauliY>`,
      - :class:`qp.PauliZ <pennylane.PauliZ>`
      - :class:`qp.CNOT <pennylane.CNOT>`,
      - :class:`qp.CY <pennylane.CY>`,
      - :class:`qp.CZ <pennylane.CZ>`,
      - :class:`qp.SWAP <pennylane.SWAP>`
      - :class:`qp.Toffoli <pennylane.Toffoli>`

    .. code-block:: python

        dev = qp.device("lightning.qubit", wires=1)

        @qp.qjit(capture=True)
        @qp.transforms.cancel_inverses
        @qp.qnode(dev)
        def circuit():
            qp.RX(0.1, wires=0)
            qp.Hadamard(wires=0)
            qp.Hadamard(wires=0)
            return qp.expval(qp.PauliZ(0))

    >>> print(qp.specs(circuit, level=1)())
    Device: lightning.qubit
    Device wires: 1
    Shots: Shots(total=None)
    Level: cancel-inverses
    <BLANKLINE>
    Wire allocations: 1
    Total gates: 1
    Gate counts:
    - RX: 1
    Measurements:
    - expval(PauliZ): 1
    Depth: Not computed

    Additionally, the ``cancel_inverses`` transform with ``qjit`` supports
    `loop-boundary optimization <https://pennylane.ai/compilation/loop-boundary-optimization>`_.

    For more technical information on how this transform behaves, consult the Catalyst
    documentation for :func:`catalyst.passes.cancel_inverses`.
