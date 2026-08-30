---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/decompose.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/decompose.py
license: Apache-2.0
---

## Module `pennylane/transforms/decompose.py`

A transform for decomposing quantum circuits into user defined gate sets. Offers an alternative to the more device-focused decompose transform.

## `null_postprocessing`

```python
def null_postprocessing(results)
```

A postprocessing function returned by a transform that only converts the batch of results
into a result for a single ``QuantumTape``.

## `decompose`

```python
def decompose(tape, *, gate_set=None, stopping_condition=None, max_expansion=None, num_work_wires: int | None=0, minimize_work_wires: bool=False, fixed_decomps: dict | None=None, alt_decomps: dict | None=None, strict: bool=True)
```

Decomposes a quantum circuit into a user-specified gate set.

.. note::

    When ``qp.decomposition.enable_graph()`` is present, this transform takes advantage of the
    new graph-based decomposition algorithm that allows for more flexible and resource-efficient
    decompositions towards any target gate set. The keyword arguments ``fixed_decomps`` and
    ``alt_decomps`` are only functional with this toggle present.

.. seealso::

    For more information on PennyLane's decomposition tools and features, check out the
    :doc:`Compiling Circuits page </introduction/compiling_circuits>`.

Args:
    tape (QuantumScript or QNode or Callable): A quantum circuit (QNode or quantum function).
    gate_set (Iterable[str or type], Dict[type or str, float], optional): The
        target gate set specified as either (1) a sequence of operator types and/or names,
        (2) a dictionary mapping operator types and/or names to their respective costs, in
        which case the total cost will be minimized (only available when the new graph-based
        decomposition system is enabled). If ``None``, the gate set is considered to be
        all operations in ``qp.ops.__all__``.  See :doc:`quantum operators </introduction/operations>`
        for this list. Operators that belong in the target gate set will not be decomposed.
    stopping_condition (Callable, optional): a function that returns ``True`` if the operator
        does not need to be decomposed. If ``None``, the default stopping condition is whether
        the operator is in the target gate set. See the "Gate Set vs. Stopping Condition"
        section below for more details.
    max_expansion (int, optional): The maximum depth of the decomposition. Defaults to ``None``.
        If ``None``, the circuit will be decomposed until the target gate set is reached.
    num_work_wires (int): The maximum number of work wires that can be simultaneously
        allocated. If ``None``, assume an infinite number of work wires. Defaults to ``0``.
    minimize_work_wires (bool): If ``True``, minimize the number of work wires simultaneously
        allocated throughout the circuit. Defaults to ``False``.
    fixed_decomps (Dict[Type[Operator], DecompositionRule]): a dictionary mapping operator types
        to custom decomposition rules. A decomposition rule is a quantum function decorated with
        :func:`~pennylane.register_resources`. The custom decomposition rules specified here
        will be used in place of the existing decomposition rules defined for this operator.
        This is only used when :func:`~pennylane.decomposition.enable_graph` is present.
    alt_decomps (Dict[Type[Operator], List[DecompositionRule]]): a dictionary mapping operator
        types to lists of alternative custom decomposition rules. A decomposition rule is a
        quantum function decorated with :func:`~pennylane.register_resources`. The custom
        decomposition rules specified here will be considered as alternatives to the existing
        decomposition rules defined for this operator, and one of them may be chosen if they
        lead to a more resource-efficient decomposition. This is only used when :func:`~pennylane.decomposition.enable_graph`
        is present.
    strict (bool): If ``False``, operators that do not define a decomposition will be treated
        as supported. Defaults to ``True``

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumScript], function]:

    The decomposed circuit. The output type is explained in :func:`qp.transform <pennylane.transform>`.

.. note::

    This function does not guarantee a decomposition to the target gate set. If an operation
    with no defined decomposition is encountered during decomposition, it will be left in the
    circuit even if it does not belong in the target gate set. In this case, a ``UserWarning``
    will be raised. To suppress this warning, simply add the operator to the gate set.
    When ``qp.decomposition.enabled_graph()``, PennyLane errors out with a ``DecompositionError``.

.. seealso::

    For decomposing into Clifford + T, check out :func:`~.pennylane.clifford_t_decomposition`.

    :func:`qp.devices.preprocess.decompose <.pennylane.devices.preprocess.decompose>` is a
    transform that is intended for device developers. This function will decompose a quantum
    circuit into a set of basis gates available on a specific device architecture.

**Example**

Consider the following tape:

>>> ops = [qp.IsingXX(1.2, wires=(0,1))]
>>> tape = qp.tape.QuantumScript(ops, measurements=[qp.expval(qp.Z(0))])

You can decompose the circuit into a set of gates:

>>> batch, fn = qp.decompose(tape, gate_set={qp.CNOT, qp.RX})
>>> batch[0].circuit
[CNOT(wires=[0, 1]), RX(1.2, wires=[0]), CNOT(wires=[0, 1]), expval(Z(0))]

You can also apply the transform directly on a :class:`~.pennylane.QNode`:

.. code-block:: python

    @qp.decompose(gate_set={qp.Toffoli, "RX", "RZ"})
    @qp.qnode(qp.device("default.qubit"))
    def circuit():
        qp.Hadamard(wires=[0])
        qp.Toffoli(wires=[0,1,2])
        return qp.expval(qp.Z(0))

Since the Hadamard gate is not defined in our gate set, it will be decomposed into rotations:

>>> print(qp.draw(circuit)())
0: ──RZ(1.57)──RX(1.57)──RZ(1.57)─╭●─┤  <Z>
1: ───────────────────────────────├●─┤
2: ───────────────────────────────╰X─┤

You can also provide a function as the ``stopping_condition`` in addition to providing a ``gate_set``. In this case
the operator decomposition will stop once either it is given in terms of the gates in the ``gate_set`` or
the ``stopping_condition`` is satisfied.

.. code-block:: python

    @qp.decompose(gate_set={"H", "T", "CNOT"}, stopping_condition=lambda op: len(op.wires) <= 2)
    @qp.qnode(qp.device("default.qubit"))
    def circuit():
        qp.Hadamard(wires=[0])
        qp.Toffoli(wires=[0,1,2])
        return qp.expval(qp.Z(0))

The circuit will be decomposed into single or two-qubit operators,

>>> print(qp.draw(circuit)())
0: ──H────────╭●───────────╭●────╭●──T──╭●─┤  <Z>
1: ────╭●─────│─────╭●─────│───T─╰X──T†─╰X─┤
2: ──H─╰X──T†─╰X──T─╰X──T†─╰X──T──H────────┤

You can use the ``max_expansion`` argument to control the number of decomposition stages
applied to the circuit. By default, the function will decompose the circuit until the desired
gate set is reached.

The example below demonstrates how the user can visualize the decomposition in stages:

.. code-block:: python

    phase = 1
    target_wires = [0]
    unitary = qp.RX(phase, wires=0).matrix()
    n_estimation_wires = 3
    estimation_wires = range(1, n_estimation_wires + 1)

    @qp.qnode(qp.device("default.qubit"))
    def circuit():
        # Start in the |+> eigenstate of the unitary
        qp.Hadamard(wires=target_wires)
        qp.QuantumPhaseEstimation(
            unitary,
            target_wires=target_wires,
            estimation_wires=estimation_wires,
        )

>>> print(qp.draw(qp.decompose(circuit, max_expansion=0))())
0: ──H─╭QuantumPhaseEstimation(M0)─┤
1: ────├QuantumPhaseEstimation(M0)─┤
2: ────├QuantumPhaseEstimation(M0)─┤
3: ────╰QuantumPhaseEstimation(M0)─┤
<BLANKLINE>
M0 =
[[0.877...+0.j         0.        -0.479...j]
 [0.        -0.479...j 0.877...+0.j        ]]

>>> print(qp.draw(qp.decompose(circuit, max_expansion=1))())
0: ──H─╭U(M0)⁴─╭U(M0)²─╭U(M0)¹───────┤
1: ──H─╰●──────│───────│───────╭QFT†─┤
2: ──H─────────╰●──────│───────├QFT†─┤
3: ──H─────────────────╰●──────╰QFT†─┤
<BLANKLINE>
M0 =
[[0.877...+0.j         0.        -0.479...j]
 [0.        -0.479...j 0.877...+0.j        ]]

>>> print(qp.draw(qp.decompose(circuit, max_expansion=2))())
0: ──H──RZ(4.71)──RY(1.14)─╭X──RY(-1.14)──RZ(-3.14)─╭X──RZ(-1.57)──RZ(1.57)──RY(1.00)─╭X ···
1: ──H─────────────────────╰●───────────────────────╰●────────────────────────────────│─ ···
2: ──H────────────────────────────────────────────────────────────────────────────────╰● ···
3: ──H────────────────────────────────────────────────────────────────────────────────── ···
<BLANKLINE>
0: ··· ──RY(-1.00)──RZ(-6.28)─╭X──RZ(4.71)──RZ(1.57)──RY(0.50)─╭X──RY(-0.50)──RZ(-6.28)─╭X ···
1: ··· ───────────────────────│────────────────────────────────│────────────────────────│─ ···
2: ··· ───────────────────────╰●───────────────────────────────│────────────────────────│─ ···
3: ··· ────────────────────────────────────────────────────────╰●───────────────────────╰● ···
<BLANKLINE>
0: ··· ──RZ(4.71)────────────────────────────────────────────────────┤
1: ··· ─╭SWAP†─────────────────────────╭(Rϕ(0.79))†─╭(Rϕ(1.57))†──H†─┤
2: ··· ─│─────────────╭(Rϕ(1.57))†──H†─│────────────╰(Rϕ(1.57))†─────┤
3: ··· ─╰SWAP†─────H†─╰(Rϕ(1.57))†─────╰(Rϕ(0.79))†──────────────────┤

.. details::
    :title: Integration with the Graph-Based Decomposition System

    This transform takes advantage of the new graph-based decomposition algorithm when
    ``qp.decomposition.enable_graph()`` is present, which allows for more flexible
    decompositions towards any target gate set. For example, the current system does not
    guarantee a decomposition to the desired target gate set:

    .. code-block:: python

        import pennylane as qp

        with qp.queuing.AnnotatedQueue() as q:
            qp.CRX(0.5, wires=[0, 1])

        tape = qp.tape.QuantumScript.from_queue(q)
        [new_tape], _ = qp.decompose([tape], gate_set={"RX", "RY", "RZ", "CZ", "CNOT"})

    >>> from pprint import pprint
    >>> pprint(new_tape.operations)
    [RZ(np.float64(1.57...), wires=[1]),
     RY(0.25, wires=[1]),
     CNOT(wires=[0, 1]),
     RY(-0.25, wires=[1]),
     CNOT(wires=[0, 1]),
     RZ(np.float64(-1.57...), wires=[1])]

    With the new system enabled, the transform produces the expected outcome.

    >>> qp.decomposition.enable_graph()
    >>> [new_tape], _ = qp.decompose([tape], gate_set={"RX", "RY", "RZ", "CZ"})
    >>> new_tape.operations
    [RX(0.25, wires=[1]), CZ(wires=[0, 1]), RX(-0.25, wires=[1]), CZ(wires=[0, 1])]

    **Weighted Gate Sets**

    With the graph based decomposition enabled, gate weights can be provided in the ``gate_set`` parameter. For example:

    .. code-block:: python

        @qp.decompose(
            gate_set={qp.Toffoli: 1.23, qp.RX: 4.56, qp.CZ: 0.01, qp.H: 420, qp.CRZ: 100}
        )
        @qp.qnode(qp.device("default.qubit"))
        def circuit():
            qp.CRX(0.1, wires=[0, 1])
            qp.Toffoli(wires=[0, 1, 2])
            return qp.expval(qp.Z(0))

    >>> print(qp.draw(circuit)())
    0: ───────────╭●────────────╭●─╭●─┤  <Z>
    1: ──RX(0.05)─╰Z──RX(-0.05)─╰Z─├●─┤
    2: ────────────────────────────╰X─┤

    .. code-block:: python

        @qp.decompose(
            gate_set={qp.Toffoli: 1.23, qp.RX: 4.56, qp.CZ: 0.01, qp.H: 0.1, qp.CRZ: 0.1}
        )
        @qp.qnode(qp.device("default.qubit"))
        def circuit():
            qp.CRX(0.1, wires=[0, 1])
            qp.Toffoli(wires=[0, 1, 2])
            return qp.expval(qp.Z(0))

    >>> print(qp.draw(circuit)())
    0: ────╭●───────────╭●─┤  <Z>
    1: ──H─╰RZ(0.10)──H─├●─┤
    2: ─────────────────╰X─┤

    Here, when the Hadamard and ``CRZ`` have relatively high weights, a decomposition involving them is considered
    *less* efficient. When they have relatively low weights, a decomposition involving them is considered *more*
    efficient.

    **Gate Set vs. Stopping Condition**

    With the new graph-based decomposition system enabled, we make the distinction between a
    target gate set and a stopping condition. The ``gate_set`` is a collection of operator
    types and/or names that is required by the graph-based decomposition solver, which chooses
    a decomposition rule for each operator that ultimately minimizes the total number of gates
    in terms of the target gate set (or the total cost if weights are provided). On the other
    hand, the ``stopping_condition`` is a function that determines whether an operator instance
    needs to be decomposed. In short, the ``gate_set`` is specified in terms of operator types,
    whereas the ``stopping_condition`` is specified in terms of operator instances.

    Here is an example of using ``stopping_condition`` to not decompose a ``qp.QubitUnitary``
    instance if it's equivalent to the identity matrix.

    .. code-block:: python

        import pennylane as qp

        qp.decomposition.enable_graph()

        # Prepare a unitary matrix that we want to decompose
        U = qp.matrix(qp.Rot(0.1, 0.2, 0.3, wires=0) @ qp.Identity(wires=1))

        def stopping_condition(op):

            if isinstance(op, qp.QubitUnitary):
                identity = math.eye(2 ** len(op.wires))
                return math.allclose(op.matrix(), identity)

            return False

    Note that the ``stopping_condition`` does not need to check whether the operator is in the
    target gate set. This will always be checked.

    .. code-block:: python

        @qp.decompose(
            gate_set={qp.RZ, qp.RY, qp.GlobalPhase, qp.CNOT},
            stopping_condition=stopping_condition,
        )
        @qp.qnode(qp.device("default.qubit"))
        def circuit():
            qp.QubitUnitary(U, wires=[0, 1])
            return qp.expval(qp.PauliZ(0))

    >>> print(qp.draw(circuit)())
    0: ──RZ(0.10)──RY(0.20)──RZ(0.30)─┤  <Z>
    1: ──U(M0)────────────────────────┤
    <BLANKLINE>
    M0 =
    [[1.+0.j 0.+0.j]
        [0.+0.j 1.+0.j]]

    We can see that the ``QubitUnitary`` on wire 1 is not decomposed due to the stopping
    condition, despite ``QubitUnitary`` not being in the target gate set.

    **Customizing Decompositions**

    The new system also enables specifying custom decomposition rules. When ``qp.decomposition.enable_graph()``
    is present, this transform accepts two additional keyword arguments: ``fixed_decomps`` and
    ``alt_decomps``. The user can define custom decomposition rules as quantum functions decorated
    with ``@qp.register_resources``, and provide them to the transform via these arguments.

    .. seealso:: :func:`qp.register_resources <pennylane.register_resources>`

    The ``fixed_decomps`` forces the transform to use the specified decomposition rules for
    certain operators if they need to be decomposed (i.e., when they're not in the target gate
    set), whereas the ``alt_decomps`` is used to provide alternative decomposition rules
    for operators that may be chosen if they lead to a more resource-efficient decomposition.

    In the following example, ``isingxx_decomp`` will always be used to decompose ``qp.IsingXX``
    gates; when it comes to ``qp.CNOT``, the system will choose the most efficient decomposition rule
    among ``my_cnot1``, ``my_cnot2``, and all existing decomposition rules defined for ``qp.CNOT``.

    .. code-block:: python

        import pennylane as qp

        qp.decomposition.enable_graph()

        @qp.register_resources({qp.CNOT: 2, qp.RX: 1})
        def isingxx_decomp(phi, wires, **__):
            qp.CNOT(wires=wires)
            qp.RX(phi, wires=[wires[0]])
            qp.CNOT(wires=wires)

        @qp.register_resources({qp.H: 2, qp.CZ: 1})
        def my_cnot1(wires, **__):
            qp.H(wires=wires[1])
            qp.CZ(wires=wires)
            qp.H(wires=wires[1])

        @qp.register_resources({qp.RY: 2, qp.CZ: 1, qp.Z: 2})
        def my_cnot2(wires, **__):
            qp.RY(np.pi/2, wires[1])
            qp.Z(wires[1])
            qp.CZ(wires=wires)
            qp.RY(np.pi/2, wires[1])
            qp.Z(wires[1])

        @qp.decompose(
            gate_set={"RX", "RZ", "CZ", "GlobalPhase"},
            alt_decomps={qp.CNOT: [my_cnot1, my_cnot2]},
            fixed_decomps={qp.IsingXX: isingxx_decomp},
        )
        @qp.qnode(qp.device("default.qubit"))
        def circuit():
            qp.CNOT(wires=[0, 1])
            qp.IsingXX(0.5, wires=[0, 1])
            return qp.state()

    >>> qp.specs(circuit)()["resources"].gate_types
    {'RZ': 12, 'RX': 7, 'GlobalPhase': 6, 'CZ': 3}
    >>> qp.decomposition.disable_graph()

    **Degenerate Graph Solutions**

    There could be cases that arise where the decomposition graph solution is non-deterministic
    if there are intermediate gate decompositions that have the same overall costs. This is not
    normally an issue, except for in cases where graph decompositions are being used with
    ``qjit`` and intermediate gates include operations that are non-executable by Catalyst.
    An example of such a gate is the ``PauliRot`` operation. If an intermediate decomposition is
    chosen that includes a ``qp.PauliRot`` instance, Catalyst cannot execute the program. If
    this behaviour is encountered, this can be counteracted by adding a prohibitively large
    penalty to the graph solution should it encounter a ``qp.PauliRot`` instance (e.g.,
    ``qp.transforms.decomopose(..., gate_set={..., qp.PauliRot: 100_000})``).
