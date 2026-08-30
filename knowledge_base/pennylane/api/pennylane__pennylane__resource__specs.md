---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/resource/specs.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/resource/specs.py
license: Apache-2.0
---

## Module `pennylane/resource/specs.py`

Code for resource estimation

## `specs`

```python
def specs(qnode, level: str | int | slice[int] | Iterable[int | str] | None=None, compute_depth: bool | None=None) -> Callable[..., CircuitSpecs]
```

Provides the specifications of a quantum circuit.

This transform converts a QNode into a callable that provides resource information
about the circuit after applying the specified transforms, expansions, and/or compilation passes.

Args:
    qnode (:class:`~pennylane.QNode` | :class:`~catalyst.jit.QJIT`): the QNode to calculate the specifications for.

Keyword Args:
    level (str | int | slice | iter[int | str] | None): An indication of which transforms, expansions, and passes to apply before
        computing the resource information. See :func:`~pennylane.workflow.get_compile_pipeline` for more details
        on the available levels without ``qjit``. For ``qjit``-compiled workflows, see the sections below for more information.
        When set to ``None`` (the default), this is treated as ``"device"`` for ``qjit``-compiled workflows or ``"gradient"`` otherwise.
    compute_depth (bool): Whether to compute the depth of the circuit. If ``False``, circuit
        depth will not be included in the output. By default, ``specs`` will always attempt to calculate circuit
        depth (behaves as ``True``), except where not available, such as in pass-by-pass analysis for ``qjit``-compiled workflows.

Returns:
    A function that has the same argument signature as ``qnode``. This function returns a
    :class:`~.resource.CircuitSpecs` object containing the ``qnode`` specifications, including gate and
    measurement data, wire allocations, device information, shots, and more.

.. warning::

    Computing circuit depth is computationally expensive and can lead to slower ``specs`` calculations.
    If circuit depth is not needed, set ``compute_depth=False``.

.. note::

    The available options for ``levels`` are different for circuits which have been compiled using Catalyst.
    There are two broad ways to use ``specs`` on ``qjit``-compiled QNodes:

    * Runtime resource tracking via mock circuit execution
    * Pass-by-pass resource collection for user applied compilation passes

    See related sections below for details regarding use with Catalyst.

**Example**

.. code-block:: python

    from pennylane import numpy as pnp

    dev = qp.device("default.qubit", wires=2)
    x = pnp.array([0.1, 0.2])
    Hamiltonian = qp.dot([1.0, 0.5], [qp.X(0), qp.Y(0)])
    gradient_kwargs = {"shifts": pnp.pi / 4}

    @qp.qnode(dev, diff_method="parameter-shift", gradient_kwargs=gradient_kwargs)
    def circuit(x, add_ry=True):
        qp.RX(x[0], wires=0)
        qp.CNOT(wires=(0,1))
        qp.TrotterProduct(Hamiltonian, time=1.0, n=4, order=2)
        if add_ry:
            qp.RY(x[1], wires=1)
        qp.TrotterProduct(Hamiltonian, time=1.0, n=4, order=4)
        return qp.probs(wires=(0,1))

>>> print(qp.specs(circuit)(x, add_ry=False))
Device: default.qubit
Device wires: 2
Shots: Shots(total=None)
Level: gradient
<BLANKLINE>
Wire allocations: 2
Total gates: 98
Gate counts:
- RX: 1
- CNOT: 1
- Evolution: 96
Measurements:
- probs(all wires): 1
Depth: 98

The :class:`~.resource.SpecsResources` can be accessed using the ``.resources`` attribute, which provides more direct
access to the data fields. For example:

>>> qp.specs(circuit)(x, add_ry=False).resources.gate_counts
{'RX': 1, 'CNOT': 1, 'Evolution': 96}

.. details::
    :title: Specs with Tape Transforms

    Here you can see how the number of gates and their types change as we apply different amounts of transforms
    through the ``level`` argument:

    .. code-block:: python

        dev = qp.device("default.qubit")
        gradient_kwargs = {"shifts": pnp.pi / 4}

        @qp.transforms.merge_rotations
        @qp.transforms.undo_swaps
        @qp.transforms.cancel_inverses
        @qp.qnode(dev, diff_method="parameter-shift", gradient_kwargs=gradient_kwargs)
        def circuit(x):
            qp.RandomLayers(pnp.array([[1.0, 2.0]]), wires=(0, 1))
            qp.RX(x, wires=0)
            qp.RX(-x, wires=0)
            qp.SWAP((0, 1))
            qp.X(0)
            qp.X(0)
            return qp.expval(qp.X(0) + qp.Y(1))

    First, we can inspect the unmodified QNode by setting ``level=0``. Note that ``level="top"`` is equivalent:

    >>> print(qp.specs(circuit, level=0)(0.1).resources)
    Wire allocations: 2
    Total gates: 6
    Gate counts:
    - RandomLayers: 1
    - RX: 2
    - SWAP: 1
    - PauliX: 2
    Measurements:
    - expval(Sum(num_wires=2, num_terms=2)): 1
    Depth: 6

    We can analyze the effects of, for example, applying the first two transforms
    (:func:`~pennylane.transforms.cancel_inverses` and :func:`~pennylane.transforms.undo_swaps`) by setting
    ``level=2``. The result will show that ``SWAP`` and ``PauliX`` are not present in the circuit:

    >>> print(qp.specs(circuit, level=2)(0.1).resources)
    Wire allocations: 2
    Total gates: 3
    Gate counts:
    - RandomLayers: 1
    - RX: 2
    Measurements:
    - expval(Sum(num_wires=2, num_terms=2)): 1
    Depth: 3

    We can then check the resources after applying all user transforms with ``level="user"`` (which, in this particular example,
    would be equivalent to ``level=3``). The two rotations merge and cancel out, leaving us with only ``RandomLayers``:

    >>> print(qp.specs(circuit, level="user")(0.1).resources)
    Wire allocations: 2
    Total gates: 1
    Gate counts:
    - RandomLayers: 1
    Measurements:
    - expval(Sum(num_wires=2, num_terms=2)): 1
    Depth: 1

    After the user transforms, additional transforms for device compatibility and gradient support may be applied. To see the
    resources after all transforms are applied, we can use ``level="device"``. In this case, ``RandomLayers`` is not
    device-compatible and is further decomposed before handing the circuit off to the device:

    >>> print(qp.specs(circuit, level="device")(0.1).resources)
    Wire allocations: 2
    Total gates: 2
    Gate counts:
    - RY: 1
    - RX: 1
    Measurements:
    - expval(Sum(num_wires=2, num_terms=2)): 1
    Depth: 1

    If a QNode with a tape-splitting transform is supplied to the function, the output will provide
    resource information separately for each tape:

    .. code-block:: python

        dev = qp.device("default.qubit")
        H = qp.Hamiltonian([0.2, -0.543], [qp.X(0) @ qp.Z(1), qp.Z(0) @ qp.Y(2)])
        gradient_kwargs = {"shifts": pnp.pi / 4}

        @qp.transforms.split_non_commuting
        @qp.qnode(dev, diff_method="parameter-shift", gradient_kwargs=gradient_kwargs)
        def circuit():
            qp.RandomLayers(qp.numpy.array([[1.0, 2.0]]), wires=(0, 1))
            return qp.expval(H)

    >>> print(qp.specs(circuit, level="user")())
    Device: default.qubit
    Device wires: None
    Shots: Shots(total=None)
    Level: user
    <BLANKLINE>
    Batched tape a:
        Wire allocations: 2
        Total gates: 1
        Gate counts:
        - RandomLayers: 1
        Measurements:
        - expval(Prod(num_wires=2, num_terms=2)): 1
        Depth: 1
    <BLANKLINE>
    Batched tape b:
        Wire allocations: 3
        Total gates: 1
        Gate counts:
        - RandomLayers: 1
        Measurements:
        - expval(Prod(num_wires=2, num_terms=2)): 1
        Depth: 1

    In this case, the ``.resources`` attribute of the returned :class:`~.resource.CircuitSpecs` is a list containing a
    :class:`~.resource.SpecsResources` for each resulting tape:

    >>> qp.specs(circuit, level="user")().resources
    [SpecsResources(gate_types={'RandomLayers': 1}, gate_sizes={2: 1}, measurements={'expval(Prod(num_wires=2, num_terms=2))': 1}, num_allocs=2, depth=1),
     SpecsResources(gate_types={'RandomLayers': 1}, gate_sizes={2: 1}, measurements={'expval(Prod(num_wires=2, num_terms=2))': 1}, num_allocs=3, depth=1)]

.. details::
    :title: Runtime Specs with Catalyst

    .. note::

        This functionality is specific to workflows with ``qjit``.

    **Runtime resource tracking** (specified by ``level="device"``) works by mock-executing the desired
    workflow and tracking the number of times a given gate has been applied. This mock-execution happens
    after all compilation steps, and should be highly accurate to the final gate counts of running on
    a real device.

    .. code-block:: python

        dev = qp.device("lightning.qubit", wires=3)

        @qp.qjit
        @qp.transforms.merge_rotations
        @qp.transforms.cancel_inverses
        @qp.qnode(dev)
        def circuit(x):
            qp.RX(x, wires=0)
            qp.RX(x, wires=0)
            qp.X(0)
            qp.X(0)
            qp.CNOT([0, 1])
            return qp.probs()

    >>> print(qp.specs(circuit, level="device")(1.23))
    Device: lightning.qubit
    Device wires: 3
    Shots: Shots(total=None)
    Level: device
    <BLANKLINE>
    Wire allocations: 3
    Total gates: 2
    Gate counts:
    - CNOT: 1
    - RX: 1
    Measurements:
    - probs(all wires): 1
    Depth: 2

    .. note::

        The resources shown when using ``level="device"`` may reflect changes to the circuit beyond those applied
        by the user transforms added to the QNode. Theses changes are a result of additional passes applied to ensure
        compatibility with lowering to MLIR and/or execution on the chosen device.

.. details::
    :title: Pass-by-pass Specs with Catalyst

    .. note::

        This functionality is specific to workflows with ``qjit``.

    **Pass-by-pass specs** analyze the intermediate representations of compiled circuits.
    This can be helpful for determining how circuit resources change after a given transform or compilation pass.

    .. warning::
        Some resource information from pass-by-pass specs may be estimated, since it is not always
        possible to determine exact resource usage from intermediate representations.
        For example, resources contained in a ``for`` loop with a non-static range or a ``while`` loop will be counted as if only one iteration occurred.
        Additionally, resources contained in conditional branches from ``if`` or ``switch`` statements will take a union of resources over all branches, providing a tight upper-bound.

        Due to similar technical limitations, depth computation is not available for pass-by-pass specs.

    Pass-by-pass specs can be obtained by providing one of the following values for the ``level`` argument:

    * An ``int``: the desired pass level of a user-applied pass, see the note below
    * A marker name (str): The name of an applied :func:`qp.marker <pennylane.marker>` pass
    * An iterable: A ``list``, ``tuple``, or similar containing ints and/or marker names. Should be sorted in
      ascending pass order with no duplicates
    * The string ``"all"``: To provide information at each stage of compilation with respect to user-specified transforms
    * The string ``"all-mlir"``: To provide information at each stage of compilation with respect to user-specified transforms exclusively at the MLIR level
    * The string ``"user"``: To provide information after all user-specified transforms have been applied

    .. note::
        The ``level`` argument is based on user-applied transforms and compilation passes.
        Level ``0`` always corresponds to the original circuit before any user-specified
        tape transforms or compilation passes have been applied,
        and incremental levels correspond to the aggregate of user-specified transforms and passes
        in the order in which they are applied.

        In addition to the user-passes, pass-by-pass inspection will indicate where the MLIR
        "lowering" occurs with the ``Before MLIR Passes`` stage. This will be placed after all tape
        transforms, but before all other MLIR passes. Note that this may be at level ``0`` if there are no tape transforms.
        In some cases, the pass to lower to MLIR will
        apply additional transforms to the circuit to ensure compatibility with the MLIR representation
        and/or with the device, so resources may change as a result of this pass.


    Consider the following circuit:

    .. code-block:: python

        dev = qp.device("lightning.qubit", wires=3)

        @qp.qjit
        @qp.transforms.merge_rotations
        @qp.transforms.cancel_inverses
        @qp.qnode(dev)
        def circuit(x):
            qp.RX(x, wires=0)
            qp.RX(x, wires=0)
            qp.X(0)
            qp.X(0)
            qp.CNOT([0, 1])
            return qp.probs()

    We can get a pass-by-pass overview of the resources using ``level="all"``:

    >>> all_specs = qp.specs(circuit, level="all")(1.23)
    >>> print(all_specs)
    Device: lightning.qubit
    Device wires: 3
    Shots: Shots(total=None)
    Levels:
    - 0: Before MLIR Passes
    - 1: cancel-inverses
    - 2: merge-rotations
    <BLANKLINE>
    ↓Metric     Level→ |  0 |  1 |  2
    ---------------------------------
    Wire allocations   |  3 |  3 |  3
    Total gates        |  5 |  3 |  2
    Gate counts:       |
    - CNOT             |  1 |  1 |  1
    - PauliX           |  2 |  0 |  0
    - RX               |  2 |  2 |  1
    Measurements:      |
    - probs(all wires) |  1 |  1 |  1

    When invoked with an iterable of levels, or ``"all"`` as above, the resources at different levels can be
    accessed from the the returned :class:`~.resource.CircuitSpecs` object's ``.resources`` attribute, using
    the name of a pass or marker. For example:

    >>> print(all_specs.resources['merge-rotations'])
    Wire allocations: 3
    Total gates: 2
    Gate counts:
    - CNOT: 1
    - RX: 1
    Measurements:
    - probs(all wires): 1
    Depth: Not computed

    A shortcut to access the resources after all user-specified transforms and passes have been
    applied is to use the ``"user"`` level. For example, the following will also return the
    resources after the ``merge-rotations`` pass:

    >>> print(qp.specs(circuit, level="user")(1.23).resources)
    Wire allocations: 3
    Total gates: 2
    Gate counts:
    - CNOT: 1
    - RX: 1
    Measurements:
    - probs(all wires): 1
    Depth: Not computed

    .. warning::
        Certain transforms, like the ``split_non_commuting`` transform, can result in splitting a single execution
        into multiple executions. In this case, the resources for that level will be returned as a list of
        :class:`~.resource.SpecsResources` objects. When printed, these split tapes will be shown as individual columns.

    .. code-block:: python

        dev = qp.device("lightning.qubit", wires=3)

        @qp.qjit
        @qp.transforms.cancel_inverses
        @qp.transforms.split_non_commuting
        @qp.qnode(dev)
        def circuit():
            qp.X(0)
            qp.X(0)
            return qp.expval(qp.PauliZ(0)), qp.expval(qp.PauliX(0))

    >>> print(qp.specs(circuit, level="all")())
    Device: lightning.qubit
    Device wires: 3
    Shots: Shots(total=None)
    Levels:
    - 0: Before Tape Transforms
    - 1: split_non_commuting
    - 2: Before MLIR Passes
    - 3: cancel-inverses
    <BLANKLINE>
    ↓Metric   Level→ |    0 |  1-a |  1-b |  2-a |  2-b |  3-a |  3-b
    -----------------------------------------------------------------
    Wire allocations |    1 |    1 |    1 |    3 |    3 |    3 |    3
    Total gates      |    2 |    2 |    2 |    2 |    2 |    0 |    0
    Gate counts:     |
    - PauliX         |    2 |    2 |    2 |    2 |    2 |    0 |    0
    Measurements:    |
    - expval(PauliZ) |    1 |    1 |    0 |    1 |    0 |    1 |    0
    - expval(PauliX) |    1 |    0 |    1 |    0 |    1 |    0 |    1

    Note that in the above example, the ``split_non_commuting`` transform results in two separate executions,
    which are labeled with the suffixes ``-a`` and ``-b`` in the output. The resources for these executions are
    returned and displayed separately, though the level name for both is the same, since they come from the same transform.
