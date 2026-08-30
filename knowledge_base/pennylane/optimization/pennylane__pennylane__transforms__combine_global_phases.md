---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/combine_global_phases.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/combine_global_phases.py
license: Apache-2.0
---

## Module `pennylane/transforms/combine_global_phases.py`

Provides a transform to combine all ``qp.GlobalPhase`` gates in a circuit into a single one applied at the end.

## `combine_global_phases`

```python
def combine_global_phases(tape: QuantumScript) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Combine all ``qp.GlobalPhase`` gates into a single ``qp.GlobalPhase`` operation.

This transform returns a new circuit where all ``qp.GlobalPhase`` gates in the original circuit (if exists)
are removed, and a new ``qp.GlobalPhase`` is added at the end of the list of operations with its phase
being a total global phase computed as the algebraic sum of all global phases in the original circuit.

Args:
    tape (QNode or QuantumScript or Callable): the input circuit to be transformed.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumScript], function]:
    the transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

**Example**

Suppose we want to combine all the global phase gates in a given quantum circuit.
The ``combine_global_phases`` transform can be used to do this as follows:

.. code-block:: python

    dev = qp.device("default.qubit", wires=3)

    @qp.transforms.combine_global_phases
    @qp.qnode(dev)
    def circuit():
        qp.GlobalPhase(0.3, wires=0)
        qp.PauliY(wires=0)
        qp.Hadamard(wires=1)
        qp.CNOT(wires=(1,2))
        qp.GlobalPhase(0.46, wires=2)
        return qp.expval(qp.X(0) @ qp.Z(1))

To check the result, let's print out the circuit:

>>> print(qp.draw(circuit)())
0: ──Y────╭GlobalPhase(0.76)─┤ ╭<X@Z>
1: ──H─╭●─├GlobalPhase(0.76)─┤ ╰<X@Z>
2: ────╰X─╰GlobalPhase(0.76)─┤

.. details::
    :title: Usage with qjit

    There are two key differences to note when using ``combine_global_phases`` with ``qjit``:

    * ``combine_global_phases`` must be applied to a QNode. Quantum functions are not supported as input.

    * When used with ``qjit``, the ``combine_global_phases`` compilation pass will merge
      operations surrounding control flow together, while those within the control flow are merged
      together separately (i.e., no formal loop-boundary optimizations).

    Consider the following example:

    .. code-block:: python

        import pennylane as qp

        n = 3
        dev = qp.device('null.qubit', wires=n)

        @qp.qjit(keep_intermediate=True, capture=True)
        @qp.transforms.combine_global_phases
        @qp.qnode(dev)
        def circuit():
            qp.GlobalPhase(0.1, wires = 2)
            qp.X(n-1)
            qp.GlobalPhase(0.1, wires = 1)
            qp.H(n-2)

            @qp.for_loop(0, 2)
            def loop(i):
                qp.GlobalPhase(0.1967, wires=i)
                qp.GlobalPhase(0.7691, wires=i)

            loop()

            qp.GlobalPhase(0.1, wires=0)
            qp.GlobalPhase(0.1, wires=0)

            return qp.expval(qp.Z(0))

    The two ``GlobalPhase`` operations within the ``for_loop`` context will be merged together.
    However, they will not be merged together with the ``GlobalPhase`` operations that occur
    before and after the ``for_loop``.

    This behaviour is shown in the image below, where the application of
    ``combine_global_phases`` results in two ``GlobalPhase`` instances (one inside of a
    ``for_loop`` and the other from the ``GlobalPhase`` instances outside of the ``for_loop``).

    >>> qp.specs(circuit, level="device")().resources.gate_counts
    {'GlobalPhase': 3, 'Hadamard': 1, 'PauliX': 1}
    >>> print(qp.draw_graph(circuit)()) # doctest: +SKIP

    .. figure:: ../../_static/catalyst-combine-global-phases-example.png
        :align: left
