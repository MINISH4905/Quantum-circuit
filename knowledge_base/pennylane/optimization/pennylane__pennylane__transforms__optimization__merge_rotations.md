---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/optimization/merge_rotations.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/optimization/merge_rotations.py
license: Apache-2.0
---

## Module `pennylane/transforms/optimization/merge_rotations.py`

Transform for merging adjacent rotations of the same type in a quantum circuit.

## `merge_rotations`

```python
def merge_rotations(tape: QuantumScript, atol=1e-08, include_gates=None) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Quantum transform to combine rotation gates of the same type that act sequentially.

If the combination of two rotations produces an angle that is close to 0,
neither gate will be applied.

Args:
    tape (QNode or QuantumTape or Callable): A quantum circuit (QNode or quantum function).
    atol (float):
        After fusion of gates, if the fused angle :math:`\theta` is such that
        :math:`|\theta|\leq \text{atol}`, no rotation gate will be applied.
    include_gates (None or list[str]): A list of specific operations to merge. If
        set to ``None`` (default), all operations in the
        :attr:`~pennylane.ops.qubit.attributes.composable_rotations` attribute will be merged.
        Otherwise, only the operations whose names match those in the list will undergo merging.

.. note::
    The ``atol`` and ``include_gates`` arguments are not supported within a :func:`~.qjit`
    workflow.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]: The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

**Example**

You can apply ``merge_rotations`` to a quantum function.

.. code-block:: python

    def qfunc(x, y, z):
        qp.RX(x, wires=0)
        qp.RX(y, wires=0)
        qp.CNOT(wires=[1, 2])
        qp.RY(y, wires=1)
        qp.Hadamard(wires=2)
        qp.CRZ(z, wires=[2, 0])
        qp.RY(-y, wires=1)
        return qp.expval(qp.Z(0))

The circuit before optimization:

>>> dev = qp.device("default.qubit")
>>> qnode = qp.QNode(qfunc, dev)
>>> print(qp.draw(qnode)(1, 2, 3))
0: ──RX(1.00)──RX(2.00)─╭RZ(3.00)────────────┤  <Z>
1: ─╭●─────────RY(2.00)─│──────────RY(-2.00)─┤
2: ─╰X─────────H────────╰●───────────────────┤

By inspection, we can combine the two ``RX`` rotations on the first qubit.
On the second qubit, we have a cumulative angle of 0, and the gates will cancel.

>>> optimized_qnode = merge_rotations(qnode)
>>> print(qp.draw(optimized_qnode)(1, 2, 3))
0: ──RX(3.00)────╭RZ(3.00)─┤  <Z>
1: ─╭●───────────│─────────┤
2: ─╰X─────────H─╰●────────┤

It is also possible to explicitly specify which rotations ``merge_rotations`` should
merge using the ``include_gates`` argument. For example, if in the above
circuit we wanted only to merge the "RX" gates, we could do so as follows:

>>> optimized_qfunc = merge_rotations(qfunc, include_gates=["RX"])
>>> optimized_qnode = qp.QNode(optimized_qfunc, dev)
>>> print(qp.draw(optimized_qnode)(1, 2, 3))
0: ──RX(3.00)───────────╭RZ(3.00)────────────┤  <Z>
1: ─╭●─────────RY(2.00)─│──────────RY(-2.00)─┤
2: ─╰X─────────H────────╰●───────────────────┤


.. details::
    :title: Usage Details

    When merging two :class:`~.pennylane.Rot` gates, there are a number of details to consider:

    First, the output angles are not always defined uniquely, because Euler angles are not
    unique for some rotations. ``merge_rotations`` makes a particular choice in
    this case.

    Second, ``merge_rotations`` is not differentiable everywhere when used on ``Rot``.
    It has singularities for specific rotation angles where the derivative will be NaN.

    Finally, this function can be numerically unstable near singular points.
    It is therefore recommended to use it with 64-bit floating point precision angles.

    For a mathematical derivation of the fusion of two ``Rot`` gates, see the documentation
    of :func:`~.pennylane.transforms.single_qubit_fusion`.

.. details::
    :title: Usage with qjit

    There are three key differences to note when using ``merge_rotations`` with ``qjit``:

    * ``merge_rotations`` must be applied to a QNode. Quantum functions are not supported as input.

    * The ``atol`` and ``include_gates`` arguments are not available with ``merge_rotations``
      when used with ``qjit``, and an error will be raised if either arguments are specified.

    * Only the following gates can be optimized by ``merge_rotations`` with ``qjit``:

      - :class:`qp.RX <pennylane.RX>`,
      - :class:`qp.CRX <pennylane.CRX>`,
      - :class:`qp.RY <pennylane.RY>`,
      - :class:`qp.CRY <pennylane.CRY>`,
      - :class:`qp.RZ <pennylane.RZ>`,
      - :class:`qp.CRZ <pennylane.CRZ>`,
      - :class:`qp.PhaseShift <pennylane.PhaseShift>`,
      - :class:`qp.ControlledPhaseShift <pennylane.ControlledPhaseShift>`,
      - :class:`qp.Rot <pennylane.Rot>`,
      - :class:`qp.CRot <pennylane.CRot>`,
      - :class:`qp.MultiRZ <pennylane.MultiRZ>`.

    .. code-block:: python

        dev = qp.device("lightning.qubit", wires=1)

        @qp.qjit(capture=True)
        @qp.transforms.merge_rotations
        @qp.qnode(dev)
        def circuit():
            qp.RX(0.1, wires=0)
            qp.RX(0.2, wires=0)
            return qp.expval(qp.PauliZ(0))

    >>> print(qp.specs(circuit, level=1)())
    Device: lightning.qubit
    Device wires: 1
    Shots: Shots(total=None)
    Level: merge-rotations
    <BLANKLINE>
    Wire allocations: 1
    Total gates: 1
    Gate counts:
    - RX: 1
    Measurements:
    - expval(PauliZ): 1
    Depth: Not computed

    Additionally, the ``merge_rotations`` transform supports
    `loop-boundary optimization <https://pennylane.ai/compilation/loop-boundary-optimization>`_.

    For more technical information on how this transform behaves, consult the Catalyst
    documentation for :func:`catalyst.passes.merge_rotations`.
