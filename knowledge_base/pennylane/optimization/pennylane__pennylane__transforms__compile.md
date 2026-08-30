---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/compile.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/compile.py
license: Apache-2.0
---

## Module `pennylane/transforms/compile.py`

Code for the high-level quantum function transform that executes compilation.

## `compile`

```python
def compile(tape: QuantumScript, pipeline: Sequence[Transform]=default_pipeline, basis_set=None, num_passes=1) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Compile a circuit by applying a series of transforms to a quantum function.

.. note::

    While ``qp.compile`` is useful for initial exploration by appliying a default set of
    transforms, the new :class:`~.CompilePipeline` class is the recommended tool for
    constructing large & modular compilation pipelines in a natural way.

The default set of transforms includes (in order):

- pushing all commuting single-qubit gates as far right as possible
  (:func:`~pennylane.transforms.commute_controlled`)
- cancellation of adjacent inverse gates
  (:func:`~pennylane.transforms.cancel_inverses`)
- merging adjacent rotations of the same type
  (:func:`~pennylane.transforms.merge_rotations`)

Args:
    tape (QNode or QuantumTape or Callable): A quantum circuit (QNode or quantum function).
    pipeline (Sequence[transform]): A list of
        tape and/or quantum function transforms to apply.
        The default ``pipeline`` applies the following transforms:
        :func:`~.transforms.commute_controlled`,
        :func:`~.cancel_inverses`, and
        :func:`~.transforms.merge_rotations`.
    basis_set (list[str]): A list of basis gates. When expanding the tape,
        expansion will continue until gates in the specific set are
        reached. If no basis set is specified, a default of
        ``pennylane.ops.__all__`` will be used. This decomposes templates and
        operator arithmetic. If an empty basis set (e.g. ``[]``, ``()``, or
        ``{}``) is provided, all operations that can be decomposed will be
        decomposed.
    num_passes (int): The number of times to apply the set of transforms in
        ``pipeline``. The default is to perform each transform once;
        however, doing so may produce a new circuit where applying the set
        of transforms again may yield further improvement, so the number of
        such passes can be adjusted.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]: The compiled circuit. The output type is explained in :func:`qp.transform <pennylane.transform>`.

**Example**

>>> dev = qp.device('default.qubit', wires=[0, 1, 2])

You can apply the transform directly on a :class:`QNode`:

.. code-block:: python

    @qp.compile
    @qp.qnode(device=dev)
    def circuit(x, y, z):
        qp.Hadamard(wires=0)
        qp.Hadamard(wires=1)
        qp.Hadamard(wires=2)
        qp.RZ(z, wires=2)
        qp.CNOT(wires=[2, 1])
        qp.RX(z, wires=0)
        qp.CNOT(wires=[1, 0])
        qp.RX(x, wires=0)
        qp.CNOT(wires=[1, 0])
        qp.RZ(-z, wires=2)
        qp.RX(y, wires=2)
        qp.Y(2)
        qp.CY(wires=[1, 2])
        return qp.expval(qp.Z(0))

The default compilation pipeline is applied before execution.

Consider the following quantum function:

.. code-block:: python

    def qfunc(x, y, z):
        qp.Hadamard(wires=0)
        qp.Hadamard(wires=1)
        qp.Hadamard(wires=2)
        qp.RZ(z, wires=2)
        qp.CNOT(wires=[2, 1])
        qp.RX(z, wires=0)
        qp.CNOT(wires=[1, 0])
        qp.RX(x, wires=0)
        qp.CNOT(wires=[1, 0])
        qp.RZ(-z, wires=2)
        qp.RX(y, wires=2)
        qp.Y(2)
        qp.CY(wires=[1, 2])
        return qp.expval(qp.Z(0))

Visually, the original function looks like this:

>>> qnode = qp.QNode(qfunc, dev)
>>> print(qp.draw(qnode)(0.2, 0.3, 0.4))
0: ──H──RX(0.40)────╭X──────────RX(0.20)─╭X────┤  <Z>
1: ──H───────────╭X─╰●───────────────────╰●─╭●─┤
2: ──H──RZ(0.40)─╰●──RZ(-0.40)──RX(0.30)──Y─╰Y─┤

We can compile it down to a smaller set of gates using the ``qp.compile``
transform.

>>> compiled_qnode = qp.compile(qnode)
>>> print(qp.draw(compiled_qnode)(0.2, 0.3, 0.4))
0: ──H──RX(0.60)─────────────────┤  <Z>
1: ──H─╭X──────────────────╭●────┤
2: ──H─╰●─────────RX(0.30)─╰Y──Y─┤

You can change up the set of transforms by passing a custom ``pipeline`` to
``qp.compile``. The pipeline is a list of transform functions. Furthermore,
you can specify a number of passes (repetitions of the pipeline), and a list
of gates into which the compiler will first attempt to decompose the
existing operations prior to applying any optimization transforms.

.. code-block:: python

    compiled_qnode = qp.compile(
        qnode,
        pipeline=[
            partial(qp.transforms.commute_controlled, direction="left"),
            partial(qp.transforms.merge_rotations, atol=1e-6),
            qp.transforms.cancel_inverses
        ],
        basis_set=["CNOT", "RX", "RY", "RZ"],
        num_passes=2
    )

    print(qp.draw(compiled_qnode)(0.2, 0.3, 0.4))

.. code-block::

    0: ──RZ(1.57)──RX(1.57)──RZ(1.57)──RX(0.60)─────────────────────────────────────────────────────
    1: ──RZ(1.57)──RX(1.57)──RZ(1.57)─╭X─────────RZ(1.57)─────────────────────────────────────────╭●
    2: ──RZ(1.57)──RX(1.57)──RZ(1.57)─╰●─────────RX(0.30)──RZ(1.57)──RY(3.14)──RZ(1.57)──RY(1.57)─╰X

    ────────────────┤  <Z>
    ─────────────╭●─┤
    ───RY(-1.57)─╰X─┤
