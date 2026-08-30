---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/zx/push_hadamards.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/zx/push_hadamards.py
license: Apache-2.0
---

## Module `pennylane/transforms/zx/push_hadamards.py`

This module contains a transform ``push_hadamards`` to apply the
`basic_optimization <https://pyzx.readthedocs.io/en/latest/api.html#pyzx.optimize.basic_optimization>`__
pass (available through the external `pyzx <https://pyzx.readthedocs.io/en/latest/index.html>`__ package)
to a PennyLane phase-polynomial + Hadamard circuit.

## `push_hadamards`

```python
def push_hadamards(tape: QuantumScript) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Push Hadamard gates as far as possible to one side to cancel them and create fewer larger
`phase-polynomial <https://pennylane.ai/compilation/phase-polynomial-intermediate-representation>`__
blocks, improving the effectiveness of phase-polynomial optimization techniques.

This transform optimizes circuits composed of phase-polynomial blocks and Hadamard gates.
This strategy works by commuting Hadamard gates through the circuit.
To preserve the overall unitary, this process relies on commutation rules that can transform the gates a
Hadamard moves past. For instance, pushing a Hadamard through a CNOT gate will convert the latter into a
CZ gate. Consequently, the final optimized circuit may have, in some cases, a significantly different
internal gate structure.

The transform also applies some basic simplification rules to phase-polynomial blocks themselves to merge phase
gates together when possible (e.g. T^4 = S^2 = Z).

The implementation is based on the
`pyzx.basic_optimization <https://pyzx.readthedocs.io/en/latest/api.html#pyzx.optimize.basic_optimization>`__ pass, using
`ZX calculus <https://pennylane.ai/compilation/zx-calculus-intermediate-representation>`__
under the hood.
It often is paired with :func:`~.transforms.zx.todd` into the combined optimization
pass :func:`~.transforms.zx.optimize_t_count`.

Args:
    tape (QNode or QuantumScript or Callable): the input circuit to be transformed.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumScript], function]:
    the transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

Raises:
    ModuleNotFoundError: if the required ``pyzx`` package is not installed.
    TypeError: if the input quantum circuit is not a phase-polynomial + Hadamard circuit.

**Example:**

.. code-block:: python

    import pennylane.transforms.zx as zx

    dev = qp.device("default.qubit")

    @zx.push_hadamards
    @qp.qnode(dev)
    def circuit():
        qp.T(0)
        qp.Hadamard(0)
        qp.Hadamard(0)
        qp.T(1)
        qp.Hadamard(1)
        qp.CNOT([1, 2])
        qp.Hadamard(1)
        qp.Hadamard(2)
        return qp.state()

>>> print(qp.draw(circuit)())
0: ──T────┤  State
1: ──T─╭X─┤  State
2: ──H─╰●─┤  State
