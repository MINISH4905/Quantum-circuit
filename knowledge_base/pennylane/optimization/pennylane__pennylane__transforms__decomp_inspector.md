---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/decomp_inspector.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/decomp_inspector.py
license: Apache-2.0
---

## Module `pennylane/transforms/decomp_inspector.py`

Defines the decomp_inspector transform.

## `DecompGraphInspector`

```python
class DecompGraphInspector
```

Interactive object that queries a solved decomposition graph.

.. seealso::

    See the documentation for the :func:`~pennylane.transforms.decomp_inspector`
    transform for how this object is used.

### `inspect_decomps`

```python
def inspect_decomps(self, op: Operator, *, num_work_wires: int | None=0, show_not_applicable: bool=True) -> _DecompInGraphInfoCollection
```

Display all decomposition rules considered for a given operator.

Args:
    op (Operator): the operator instance to inspect the decomposition rules for.
    num_work_wires (int, optional): the number of work wires available for dynamic allocation.
    show_not_applicable (bool): if True (the default), all decomposition rules, including
        those that are not applicable to the specific operator instance (e.g., due to constraints
        on the number of wires), are displayed.

Returns:
    _DecompInGraphInfoCollection: a displayable object with all the information.

## `decomp_inspector`

```python
def decomp_inspector(tape: QuantumScript, *, gate_set=None, num_work_wires: int | None=0, minimize_work_wires: bool=False, fixed_decomps: dict | None=None, alt_decomps: dict | None=None) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Returns a :class:`DecompGraphInspector` for querying the decomposition decisions made
for a given circuit and target gate set.

.. note::

    This function is only relevant when the new experimental graph-based decomposition system
    (introduced in v0.41) is enabled via :func:`~pennylane.decomposition.enable_graph`. This new
    way of doing decompositions is generally more resource efficient and accommodates multiple
    alternative decomposition rules for an operator.

Args:
    tape (QuantumScript or QNode or Callable): a quantum circuit.
    gate_set (Iterable[str or type], Dict[type or str, float]): The target gate set specified
        as either (1) a sequence of operator types and/or names, (2) a dictionary mapping
        operator types and/or names to their respective costs, in which case the graph will
        try to minimize the total cost.
    num_work_wires (int): The maximum number of work wires that can be simultaneously allocated.
        If ``None``, assume an infinite number of work wires. Defaults to ``0``.
    minimize_work_wires (bool): If ``True``, minimize the number of work wires simultaneously
        allocated throughout the circuit. Defaults to ``False``.
    fixed_decomps (Dict[Type[Operator], DecompositionRule]): a dictionary mapping operator types
        to custom decomposition rules. A decomposition rule is a quantum function decorated with
        :func:`~pennylane.register_resources`. The custom decomposition rules specified here
        will be used in place of the existing decomposition rules defined for this operator.
    alt_decomps (Dict[Type[Operator], List[DecompositionRule]]): a dictionary mapping operator
        types to lists of alternative custom decomposition rules. A decomposition rule is a
        quantum function decorated with :func:`~pennylane.register_resources`. The custom
        decomposition rules specified here will be considered as alternatives to the existing
        decomposition rules defined for this operator, and one of them may be chosen if they
        lead to a more resource-efficient decomposition.

Returns:
    DecompGraphInspector: An interactive object that can be used to inspect the graph.


**Examples**

Applying the ``decomp_inspector`` transform on a circuit will return a
:class:`DecompGraphInspector` object constructed from operators in the circuit.

.. code-block:: python

    qp.decomposition.enable_graph()

    @qp.decomp_inspector(gate_set=qp.gate_sets.ROTATIONS_PLUS_CNOT, num_work_wires=2)
    @qp.qnode(qp.device("default.qubit"))
    def circuit():
        qp.ctrl(qp.MultiRZ(0.5, [0, 1]), control=[3, 4, 5])
        return qp.probs()

    inspector = circuit()

The inspector object allows to query a given operator to identify which decomposition rule was
"CHOSEN" among those that were considered.

>>> inspector.inspect_decomps(qp.ctrl(qp.MultiRZ(0.5, [0, 1]), control=[3, 4, 5]), num_work_wires=2)
CHOSEN: Decomposition 0 (name: flip_zero_ctrl_values(_ctrl_single_work_wire))
<DynamicWire>: ──Allocate─╭X─╭●─────────────╭X──Deallocate─┤
            3: ───────────├●─│──────────────├●─────────────┤
            4: ───────────├●─│──────────────├●─────────────┤
            5: ───────────╰●─│──────────────╰●─────────────┤
            0: ──────────────├MultiRZ(0.50)────────────────┤
            1: ──────────────╰MultiRZ(0.50)────────────────┤
First-Level Expansion Gates: {MultiControlledX(num_control_wires=3, num_work_wires=0, num_zero_control_values=0, work_wire_type=borrowed): 2, Controlled(MultiRZ(num_wires=2), num_control_wires=1, num_work_wires=0, num_zero_control_values=0, work_wire_type=borrowed): 1}
Wire Allocations: {'zero': 1}
Full Expansion Gates: {RZ: 58, CNOT: 34, GlobalPhase: 64, RY: 18, RX: 8, MidMeasure: 2}
Weighted Cost: 120.0
<BLANKLINE>
Decomposition 1 (name: to_controlled_qubit_unitary)
Not applicable (provided operator instance does not meet all conditions for this rule).
<BLANKLINE>
Decomposition 2 (name: controlled(_multi_rz_decomposition))
0: ─╭X─╭RZ(0.50)─╭X─┤
1: ─├●─│─────────├●─┤
3: ─├●─├●────────├●─┤
4: ─├●─├●────────├●─┤
5: ─╰●─╰●────────╰●─┤
First-Level Expansion Gates: {Controlled(RZ, num_control_wires=3, num_work_wires=0, num_zero_control_values=0, work_wire_type=borrowed): 1, MultiControlledX(num_control_wires=4, num_work_wires=0, num_zero_control_values=0, work_wire_type=borrowed): 2}
Full Expansion Gates: {GlobalPhase: 76, RX: 16, MidMeasure: 4, RY: 24, RZ: 80, CNOT: 72}
Weighted Cost: 196.0

For applicable decompositions, the "First-Level Expansion" label refers to the operators immediately produced by the decomposition rule,
whereas the "Full Expansion" refers to the circuit produced by decomposing the operator all the way
down to the target gate set. The weighted cost of the decomposition, computed based on the full expansion, is also displayed.

In addition to the operators at the top level of the circuit, we can also inspect the graph
for how intermediate operators are decomposed. For example, let's look at the single-controlled
``MultiRZ`` produced in the decomposition of the controlled ``MultiRZ`` (notice how ``num_work_wires``
is set to 1 here, since decomposition of the top-level operator already used one of the work
wires in the budget, so this inner operator has one fewer work wire available to it):

>>> inspector.inspect_decomps(qp.ctrl(qp.MultiRZ(0.5, [0, 1]), control=2), num_work_wires=1)
Decomposition 0 (name: flip_zero_ctrl_values(_ctrl_single_work_wire))
Not applicable (provided operator instance does not meet all conditions for this rule).
<BLANKLINE>
Decomposition 1 (name: to_controlled_qubit_unitary)
Not applicable (provided operator instance does not meet all conditions for this rule).
<BLANKLINE>
CHOSEN: Decomposition 2 (name: controlled(_multi_rz_decomposition))
0: ─╭X─╭RZ(0.50)─╭X─┤
1: ─├●─│─────────├●─┤
2: ─╰●─╰●────────╰●─┤
First-Level Expansion Gates: {CRZ: 1, Toffoli: 2}
Full Expansion Gates: {RZ: 20, CNOT: 14, GlobalPhase: 18, RY: 4}
Weighted Cost: 38.0

This can be useful to find out why a circuit cannot be decomposed:

.. code-block:: python

    qp.decomposition.enable_graph()

    @qp.decomp_inspector(gate_set={"RZ", "RX", "CNOT"}, num_work_wires=2)
    @qp.qnode(qp.device("default.qubit"))
    def circuit():
        qp.PauliRot(0.5, "XYZ", [0, 1, 2])
        return qp.probs()

    inspector = circuit()

>>> inspector.inspect_decomps(qp.PauliRot(0.5, "XYZ", [0, 1, 2]))
Decomposition 0 (name: _pauli_rot_decomposition)
0: ──H────────╭MultiRZ(0.50)──H─────────┤
1: ──RX(1.57)─├MultiRZ(0.50)──RX(-1.57)─┤
2: ───────────╰MultiRZ(0.50)────────────┤
First-Level Expansion Gates: {Hadamard: 2, RX: 2, MultiRZ(num_wires=3): 1}
Missing Ops: {Hadamard}

The message suggests that the ``PauliRot`` could not be decomposed because the graph was unable
to find a decomposition for ``Hadamard``. We can investigate further:

>>> inspector.inspect_decomps(qp.Hadamard(0))
Decomposition 0 (name: _hadamard_to_rz_ry)
0: ──RZ(3.14)──RY(1.57)──GlobalPhase(-1.57)─┤
First-Level Expansion Gates: {RZ: 1, RY: 1, GlobalPhase: 1}
Missing Ops: {GlobalPhase}
<BLANKLINE>
Decomposition 1 (name: _hadamard_to_rz_rx)
0: ──RZ(1.57)──RX(1.57)──RZ(1.57)──GlobalPhase(-1.57)─┤
First-Level Expansion Gates: {RZ: 2, RX: 1, GlobalPhase: 1}
Missing Ops: {GlobalPhase}

Now it's finally clear that the reason why ``PauliRot`` could not be decomposed was that
``GlobalPhase`` is missing from the target gate set.

.. details::
    :title: Working with a dynamic work wire allocation budget

    Some decomposition rules make use of dynamically allocated work wires. For example:

    >>> qp.inspect_decomps(qp.MultiControlledX([0, 1, 2, 3]), "one_zeroed_worker")
    Decomposition 0 (name: one_zeroed_worker)
    <DynamicWire>: ──Allocate─╭⊕─╭●──⊕╮──Deallocate─┤
                0: ───────────├●─│───●┤─────────────┤
                1: ───────────╰●─│───●╯─────────────┤
                2: ──────────────├●─────────────────┤
                3: ──────────────╰X─────────────────┤
    Gate Count: {Toffoli: 1, TemporaryAND: 1, Adjoint(TemporaryAND): 1}
    Wire Allocations: {'zero': 1}

    These rules can only be selected if there are enough unused wires left on the device
    for allocation. In order to account for this, the :func:`~pennylane.transforms.decompose`
    transform takes a ``num_work_wires`` argument which acts as a work wire budget. It
    ensures that no more than ``num_work_wires`` number of work wires can be simultaneously
    allocated during the decomposition. Consider the following circuit:

    .. code-block:: python

        @qp.decomp_inspector(gate_set=qp.gate_sets.ROTATIONS_PLUS_CNOT, num_work_wires=2)
        @qp.qnode(qp.device("default.qubit"))
        def circuit():
            qp.ctrl(qp.MultiRZ(0.5, [0, 1]), control=[3, 4, 5, 6])
            qp.MultiControlledX([2, 3, 4, 5, 6])
            return qp.probs()

        inspector = circuit()

    When calling ``inspect_decomps``, we also need to provide the work wire allocation budget:

    >>> op = qp.ctrl(qp.MultiRZ(0.5, [0, 1]), control=[3, 4, 5, 6])
    >>> inspector.inspect_decomps(op, num_work_wires=2)
    CHOSEN: Decomposition 0 (name: flip_zero_ctrl_values(_ctrl_single_work_wire))
    <DynamicWire>: ──Allocate─╭X─╭●─────────────╭X──Deallocate─┤
                3: ───────────├●─│──────────────├●─────────────┤
                4: ───────────├●─│──────────────├●─────────────┤
                5: ───────────├●─│──────────────├●─────────────┤
                6: ───────────╰●─│──────────────╰●─────────────┤
                0: ──────────────├MultiRZ(0.50)────────────────┤
                1: ──────────────╰MultiRZ(0.50)────────────────┤
    First-Level Expansion Gates: {MultiControlledX(num_control_wires=4, num_work_wires=0, num_zero_control_values=0, work_wire_type=borrowed): 2, Controlled(MultiRZ(num_wires=2), num_control_wires=1, num_work_wires=0, num_zero_control_values=0, work_wire_type=borrowed): 1}
    Wire Allocations: {'zero': 1}
    Full Expansion Gates: {RZ: 94, CNOT: 58, GlobalPhase: 104, RY: 26, RX: 12, MidMeasure: 2}
    Weighted Cost: 192.0
    <BLANKLINE>
    Decomposition 1 (name: to_controlled_qubit_unitary)
    Not applicable (provided operator instance does not meet all conditions for this rule).
    <BLANKLINE>
    Decomposition 2 (name: controlled(_multi_rz_decomposition))
    0: ─╭X─╭RZ(0.50)─╭X─┤
    1: ─├●─│─────────├●─┤
    3: ─├●─├●────────├●─┤
    4: ─├●─├●────────├●─┤
    5: ─├●─├●────────├●─┤
    6: ─╰●─╰●────────╰●─┤
    First-Level Expansion Gates: {Controlled(RZ, num_control_wires=4, num_work_wires=0, num_zero_control_values=0, work_wire_type=borrowed): 1, MultiControlledX(num_control_wires=5, num_work_wires=0, num_zero_control_values=0, work_wire_type=borrowed): 2}
    Full Expansion Gates: {GlobalPhase: 200, RX: 32, MidMeasure: 6, RY: 54, RZ: 170, CNOT: 96}
    Weighted Cost: 358.0

    Similarly, for the ``MultiControlledX`` in the circuit:

    >>> op = qp.MultiControlledX([2, 3, 4, 5, 6])
    >>> inspector.inspect_decomps(op, num_work_wires=2)
    Decomposition 0 (name: flip_zero_ctrl_values(_2cx_elbow_explicit))
    Not applicable (provided operator instance does not meet all conditions for this rule).
    <BLANKLINE>
    Decomposition 1 (name: no_workers)
    2: ────╭●───────────────────╭●──────────────────────╭●──────────────────┤
    3: ────├●───────────────────├●──────────────────────├●──────────────────┤
    4: ────│─────────╭●─────────│─────────╭●────────────├●──────────────────┤
    5: ────│─────────├●─────────│─────────├●────────────├●──────────────────┤
    6: ──H─╰X──U(M0)─╰X──U(M0)†─╰X──U(M0)─╰X──U(M0)†──H─╰GlobalPhase(-1.57)─┤
    M0 =
    [[ 9.23879533e-01+0.38268343j -5.34910791e-34+0.j        ]
     [ 5.34910791e-34+0.j          9.23879533e-01-0.38268343j]]
    First-Level Expansion Gates: {Hadamard: 2, QubitUnitary(num_wires=1): 2, MultiControlledX(num_control_wires=2, num_work_wires=2, num_zero_control_values=0, work_wire_type=borrowed): 4, Adjoint(QubitUnitary(num_wires=1)): 2, Controlled(GlobalPhase, num_control_wires=4, num_work_wires=0, num_zero_control_values=0, work_wire_type=borrowed): 1}
    Full Expansion Gates: {GlobalPhase: 43, RY: 14, RZ: 57, RX: 4, CNOT: 58}
    Weighted Cost: 133.0
    <BLANKLINE>
    Decomposition 2 (name: one_zeroed_worker)
    <DynamicWire>: ──Allocate─╭⊕───────╭●────────⊕╮──Deallocate─┤
                2: ───────────├●───────│─────────●┤─────────────┤
                3: ───────────╰●─╭X──X─├●──X─╭X──●╯─────────────┤
                4: ──────────────├●────│─────├●─────────────────┤
                5: ──────────────╰●────│─────╰●─────────────────┤
                6: ────────────────────╰X───────────────────────┤
    First-Level Expansion Gates: {Toffoli: 3, TemporaryAND: 1, Adjoint(TemporaryAND): 1, PauliX: 2}
    Wire Allocations: {'zero': 1}
    Full Expansion Gates: {GlobalPhase: 43, RX: 6, MidMeasure: 1, RY: 11, RZ: 37, CNOT: 22}
    Weighted Cost: 77.0
    <BLANKLINE>
    Decomposition 3 (name: one_borrowed_worker)
    <DynamicWire>: ──Allocate─╭X───────╭●───────╭X───────╭●──Deallocate────┤
                2: ───────────├●───────│────────├●───────│─────────────────┤
                3: ───────────╰●─╭X──X─├●──X─╭X─╰●─╭X──X─├●──X──────────╭X─┤
                4: ──────────────├●────│─────├●────├●────│──────────────├●─┤
                5: ──────────────╰●────│─────╰●────╰●────│──────────────╰●─┤
                6: ────────────────────╰X────────────────╰X────────────────┤
    First-Level Expansion Gates: {Toffoli: 8, PauliX: 4}
    Wire Allocations: {'any': 1}
    Full Expansion Gates: {GlobalPhase: 76, RX: 4, CNOT: 48, RZ: 72, RY: 16}
    Weighted Cost: 140.0
    <BLANKLINE>
    Decomposition 4 (name: one_explicit_worker)
    Not applicable (provided operator instance does not meet all conditions for this rule).
    <BLANKLINE>
    Decomposition 5 (name: two_zeroed_workers)
    Not applicable (provided operator instance does not meet all conditions for this rule).
    <BLANKLINE>
    Decomposition 6 (name: two_borrowed_workers)
    Not applicable (provided operator instance does not meet all conditions for this rule).
    <BLANKLINE>
    Decomposition 7 (name: two_explicit_workers)
    Not applicable (provided operator instance does not meet all conditions for this rule).
    <BLANKLINE>
    CHOSEN: Decomposition 8 (name: many_zeroed_workers)
    <DynamicWire>: ─╭Allocate────╭⊕─╭●──⊕╮─────╭Deallocate─┤
    <DynamicWire>: ─╰Allocate─╭⊕─├●─│───●┤──⊕╮─╰Deallocate─┤
                5: ───────────├●─│──│────│──●┤─────────────┤
                4: ───────────╰●─│──│────│──●╯─────────────┤
                3: ──────────────╰●─│───●╯─────────────────┤
                2: ─────────────────├●─────────────────────┤
                6: ─────────────────╰X─────────────────────┤
    First-Level Expansion Gates: {TemporaryAND: 2, Adjoint(TemporaryAND): 2, Toffoli: 1}
    Wire Allocations: {'zero': 2}
    Full Expansion Gates: {GlobalPhase: 37, RX: 8, MidMeasure: 2, RY: 12, RZ: 29, CNOT: 14}
    Weighted Cost: 65.0
    <BLANKLINE>
    Decomposition 9 (name: many_borrowed_workers)
    <DynamicWire>: ─╭Allocate─╭●─╭X────╭X─╭●─╭X────╭X─╭Deallocate─┤
    <DynamicWire>: ─╰Allocate─│──├●─╭X─├●─│──├●─╭X─├●─╰Deallocate─┤
                2: ───────────├●─│──│──│──├●─│──│──│──────────────┤
                6: ───────────╰X─│──│──│──╰X─│──│──│──────────────┤
                3: ──────────────╰●─│──╰●────╰●─│──╰●─────────────┤
                5: ─────────────────├●──────────├●────────────────┤
                4: ─────────────────╰●──────────╰●────────────────┤
    First-Level Expansion Gates: {Toffoli: 8}
    Wire Allocations: {'any': 2}
    Full Expansion Gates: {CNOT: 48, GlobalPhase: 72, RZ: 72, RY: 16}
    Weighted Cost: 136.0
    <BLANKLINE>
    Decomposition 10 (name: many_explicit_workers)
    Not applicable (provided operator instance does not meet all conditions for this rule).
    <BLANKLINE>
    Decomposition 11 (name: _mcx_to_cnot_or_toffoli)
    Not applicable (provided operator instance does not meet all conditions for this rule).

    We can see that the chosen decomposition rule for the ``MultiControlledX`` uses two work
    wires. However, not every ``MultiControlledX`` in the circuit can be decomposed the same
    way. For example, notice that the chosen decomposition rule for the controlled ``MultiRZ``
    takes a work wire from the dynamic allocation budget, therefore, within the region of the
    decomposition rule, the ``MultiControlledX`` has one fewer work wire available to it. We
    can inspect how the graph chose a decomposition rule for the inner ``MultiControlledX``
    by changing the ``num_work_wires`` argument:

    >>> op = qp.MultiControlledX([2, 3, 4, 5, 6])  # concrete wire labels don't matter
    >>> inspector.inspect_decomps(op, num_work_wires=1)
    Decomposition 0 (name: flip_zero_ctrl_values(_2cx_elbow_explicit))
    Not applicable (provided operator instance does not meet all conditions for this rule).
    <BLANKLINE>
    Decomposition 1 (name: no_workers)
    2: ────╭●───────────────────╭●──────────────────────╭●──────────────────┤
    3: ────├●───────────────────├●──────────────────────├●──────────────────┤
    4: ────│─────────╭●─────────│─────────╭●────────────├●──────────────────┤
    5: ────│─────────├●─────────│─────────├●────────────├●──────────────────┤
    6: ──H─╰X──U(M0)─╰X──U(M0)†─╰X──U(M0)─╰X──U(M0)†──H─╰GlobalPhase(-1.57)─┤
    M0 =
    [[ 9.23879533e-01+0.38268343j -5.34910791e-34+0.j        ]
     [ 5.34910791e-34+0.j          9.23879533e-01-0.38268343j]]
    First-Level Expansion Gates: {Hadamard: 2, QubitUnitary(num_wires=1): 2, MultiControlledX(num_control_wires=2, num_work_wires=2, num_zero_control_values=0, work_wire_type=borrowed): 4, Adjoint(QubitUnitary(num_wires=1)): 2, Controlled(GlobalPhase, num_control_wires=4, num_work_wires=0, num_zero_control_values=0, work_wire_type=borrowed): 1}
    Full Expansion Gates: {GlobalPhase: 43, RY: 14, RZ: 57, RX: 4, CNOT: 58}
    Weighted Cost: 133.0
    <BLANKLINE>
    CHOSEN: Decomposition 2 (name: one_zeroed_worker)
    <DynamicWire>: ──Allocate─╭⊕───────╭●────────⊕╮──Deallocate─┤
                2: ───────────├●───────│─────────●┤─────────────┤
                3: ───────────╰●─╭X──X─├●──X─╭X──●╯─────────────┤
                4: ──────────────├●────│─────├●─────────────────┤
                5: ──────────────╰●────│─────╰●─────────────────┤
                6: ────────────────────╰X───────────────────────┤
    First-Level Expansion Gates: {Toffoli: 3, TemporaryAND: 1, Adjoint(TemporaryAND): 1, PauliX: 2}
    Wire Allocations: {'zero': 1}
    Full Expansion Gates: {GlobalPhase: 43, RX: 6, MidMeasure: 1, RY: 11, RZ: 37, CNOT: 22}
    Weighted Cost: 77.0
    <BLANKLINE>
    Decomposition 3 (name: one_borrowed_worker)
    <DynamicWire>: ──Allocate─╭X───────╭●───────╭X───────╭●──Deallocate────┤
                2: ───────────├●───────│────────├●───────│─────────────────┤
                3: ───────────╰●─╭X──X─├●──X─╭X─╰●─╭X──X─├●──X──────────╭X─┤
                4: ──────────────├●────│─────├●────├●────│──────────────├●─┤
                5: ──────────────╰●────│─────╰●────╰●────│──────────────╰●─┤
                6: ────────────────────╰X────────────────╰X────────────────┤
    First-Level Expansion Gates: {Toffoli: 8, PauliX: 4}
    Wire Allocations: {'any': 1}
    Full Expansion Gates: {GlobalPhase: 76, RX: 4, CNOT: 48, RZ: 72, RY: 16}
    Weighted Cost: 140.0
    <BLANKLINE>
    Decomposition 4 (name: one_explicit_worker)
    Not applicable (provided operator instance does not meet all conditions for this rule).
    <BLANKLINE>
    Decomposition 5 (name: two_zeroed_workers)
    Not applicable (provided operator instance does not meet all conditions for this rule).
    <BLANKLINE>
    Decomposition 6 (name: two_borrowed_workers)
    Not applicable (provided operator instance does not meet all conditions for this rule).
    <BLANKLINE>
    Decomposition 7 (name: two_explicit_workers)
    Not applicable (provided operator instance does not meet all conditions for this rule).
    <BLANKLINE>
    Decomposition 8 (name: many_zeroed_workers)
    Insufficient work wires: requires 2 but only 1 available.
    <BLANKLINE>
    Decomposition 9 (name: many_borrowed_workers)
    Insufficient work wires: requires 2 but only 1 available.
    <BLANKLINE>
    Decomposition 10 (name: many_explicit_workers)
    Not applicable (provided operator instance does not meet all conditions for this rule).
    <BLANKLINE>
    Decomposition 11 (name: _mcx_to_cnot_or_toffoli)
    Not applicable (provided operator instance does not meet all conditions for this rule).
