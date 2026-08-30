---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/zx/optimize_t_count.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/zx/optimize_t_count.py
license: Apache-2.0
---

## Module `pennylane/transforms/zx/optimize_t_count.py`

This module contains a transform ``optimize_t_count`` to apply the
`full_optimize <https://pyzx.readthedocs.io/en/latest/api.html#pyzx.optimize.full_optimize>`__
pass (available through the external `pyzx <https://pyzx.readthedocs.io/en/latest/index.html>`__ package)
to a PennyLane Clifford + T circuit.

## `optimize_t_count`

```python
def optimize_t_count(tape: QuantumScript) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Reduce the number of T gates in a `Clifford + T circuit <https://pennylane.ai/compilation/clifford-t-gate-set>`__
by using basic commutation and cancellation rules, combined with a dedicated
`phase-polynomial <https://pennylane.ai/compilation/phase-polynomial-intermediate-representation>`__
optimization strategy based on the
`Third Order Duplicate and Destroy (TODD) <https://arxiv.org/abs/1712.01557>`__ algorithm.

This transform applies a sequence of passes for T-count optimization to the given Clifford + T circuit.
First, some ZX-based commutation and cancellation rules are applied to simplify the circuit.
Then, the circuit is cut into phase-polynomial blocks and the TODD algorithm is used to optimize each of these phase polynomials.
For circuits with many qubits and T gates, this transform may exhibit long run-times.

.. note::

    The transformed output circuit is equivalent to the input up to a global phase.

The implementation is based on the
`pyzx.full_optimize <https://pyzx.readthedocs.io/en/latest/api.html#pyzx.optimize.full_optimize>`__ pass, using
`ZX calculus <https://pennylane.ai/compilation/zx-calculus-intermediate-representation>`__
under the hood. It combines :func:`~.transforms.zx.push_hadamards` and
:func:`~.transforms.zx.todd` into a holistic method.

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

    @zx.optimize_t_count
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
0: ──Z─╭●────╭●─┤  State
1: ────╰X──S─│──┤  State
2: ──────────╰X─┤  State
