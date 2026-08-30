---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/zx/todd.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/zx/todd.py
license: Apache-2.0
---

## Module `pennylane/transforms/zx/todd.py`

This module contains a transform ``todd`` to apply the
`phase_block_optimize <https://pyzx.readthedocs.io/en/latest/api.html#pyzx.optimize.phase_block_optimize>`__
pass (available through the external `pyzx <https://pyzx.readthedocs.io/en/latest/index.html>`__ package)
to a PennyLane Clifford + T circuit.

## `todd`

```python
def todd(tape: QuantumScript) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Apply the `Third Order Duplicate and Destroy (TODD) <https://arxiv.org/abs/1712.01557>`__ algorithm to reduce
the number of T gates in a given Clifford + T circuit.

This transform optimizes a `Clifford + T circuit <https://pennylane.ai/compilation/clifford-t-gate-set>`__
by cutting it into `phase-polynomial <https://pennylane.ai/compilation/phase-polynomial-intermediate-representation>`__
blocks, and using the TODD algorithm to optimize each of these phase polynomials.
Depending on the number of qubits and T gates in the original circuit, it might
take a long time to run.

.. note::

    The transformed output circuit is equivalent to the input up to a global phase.

The implementation is based on the
`pyzx.phase_block_optimize <https://pyzx.readthedocs.io/en/latest/api.html#pyzx.optimize.phase_block_optimize>`__ pass, using
`ZX calculus <https://pennylane.ai/compilation/zx-calculus-intermediate-representation>`__
under the hood.
It often is paired with :func:`~.transforms.zx.push_hadamards` into the combined optimization
pass :func:`~.transforms.zx.optimize_t_count`.

Args:
    tape (QNode or QuantumScript or Callable): the input circuit to be transformed.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumScript], function]:
    the transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

Raises:
    ModuleNotFoundError: if the required ``pyzx`` package is not installed.
    TypeError: if the input quantum circuit is not a Clifford + T circuit.

**Example:**

.. code-block:: python

    import pennylane.transforms.zx as zx

    dev = qp.device("default.qubit")

    @zx.todd
    @qp.qnode(dev)
    def circuit():
        qp.T(0)
        qp.CNOT([0, 1])
        qp.S(0)
        qp.T(0)
        qp.T(1)
        qp.CNOT([0, 2])
        qp.T(1)
        return qp.state()

>>> print(qp.draw(circuit)())
0: ──S†─╭Z─╭●─╭●─┤  State
1: ──S──╰●─│──╰X─┤  State
2: ────────╰X────┤  State
