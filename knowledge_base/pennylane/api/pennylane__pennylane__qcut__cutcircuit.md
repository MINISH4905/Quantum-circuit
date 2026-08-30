---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qcut/cutcircuit.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qcut/cutcircuit.py
license: Apache-2.0
---

## Module `pennylane/qcut/cutcircuit.py`

Function cut_circuit for cutting a quantum circuit into smaller circuit fragments.

## `cut_circuit`

```python
def cut_circuit(tape: QuantumScript, auto_cutter: bool | Callable=False, use_opt_einsum: bool=False, device_wires: Wires | None=None, max_depth: int=1, **kwargs) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Cut up a quantum circuit into smaller circuit fragments.

Following the approach outlined in Theorem 2 of
`Peng et al. <https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.125.150504>`__,
strategic placement of :class:`~.WireCut` operations can allow a quantum circuit to be split
into disconnected circuit fragments. Each circuit fragment is then executed multiple times by
varying the state preparations and measurements at incoming and outgoing cut locations,
respectively, resulting in a process tensor describing the action of the fragment. The process
tensors are then contracted to provide the result of the original uncut circuit.

.. note::

    Only circuits that return a single expectation value are supported.

Args:
    tape (QNode or QuantumTape): the quantum circuit to be cut
    auto_cutter (Union[bool, Callable]): Toggle for enabling automatic cutting with the default
        :func:`~.kahypar_cut` partition method. Can also pass a graph partitioning function that
        takes an input graph and returns a list of edges to be cut based on a given set of
        constraints and objective. The default :func:`~.kahypar_cut` function requires KaHyPar to
        be installed using ``pip install kahypar`` for Linux and Mac users or visiting the
        instructions `here <https://kahypar.org>`__ to compile from source for Windows users.
    use_opt_einsum (bool): Determines whether to use the
        `opt_einsum <https://dgasmith.github.io/opt_einsum/>`__ package. This package is useful
        for faster tensor contractions of large networks but must be installed separately using,
        e.g., ``pip install opt_einsum``. Both settings for ``use_opt_einsum`` result in a
        differentiable contraction.
    device_wires (Wires): Wires of the device that the cut circuits are to be run on.
        When transforming a QNode, this argument is optional and will be set to the
        QNode's device wires. Required when transforming a tape.
    max_depth (int): The maximum depth used to expand the circuit while searching for wire cuts.
        Only applicable when transforming a QNode.
    kwargs: Additional keyword arguments to be passed to a callable ``auto_cutter`` argument.
        For the default KaHyPar cutter, please refer to the docstring of functions
        :func:`~.find_and_place_cuts` and :func:`~.kahypar_cut` for the available arguments.

Returns:
    qnode (QNode) or tuple[List[QuantumTape], function]:

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`. Executing this circuit
    will perform a process tomography of the partitioned circuit fragments and combine the results via tensor contractions.

**Example**

The following :math:`3`-qubit circuit contains a :class:`~.WireCut` operation. When decorated
with ``@qp.cut_circuit``, we can cut the circuit into two :math:`2`-qubit fragments:

.. code-block:: python

    dev = qp.device("default.qubit", wires=2)

    @qp.cut_circuit
    @qp.qnode(dev)
    def circuit(x):
        qp.RX(x, wires=0)
        qp.RY(0.9, wires=1)
        qp.RX(0.3, wires=2)

        qp.CZ(wires=[0, 1])
        qp.RY(-0.4, wires=0)

        qp.WireCut(wires=1)

        qp.CZ(wires=[1, 2])

        return qp.expval(qp.pauli.string_to_pauli_word("ZZZ"))

Executing ``circuit`` will run multiple configurations of the :math:`2`-qubit fragments which
are then postprocessed to give the result of the original circuit:

>>> x = np.array(0.531, requires_grad=True)
>>> circuit(x)
0.47165198882111165

Futhermore, the output of the cut circuit is also differentiable:

>>> qp.grad(circuit)(x)
tensor(-0.27698287, requires_grad=True)

Alternatively, if the optimal wire-cut placement is unknown for an arbitrary circuit, the
``auto_cutter`` option can be enabled to make attempts in finding such an optimal cut. The
following examples shows this capability on the same circuit as above but with the
:class:`~.WireCut` removed:

.. code-block:: python

    @qp.cut_circuit(auto_cutter=True)
    @qp.qnode(dev)
    def circuit(x):
        qp.RX(x, wires=0)
        qp.RY(0.9, wires=1)
        qp.RX(0.3, wires=2)

        qp.CZ(wires=[0, 1])
        qp.RY(-0.4, wires=0)

        qp.CZ(wires=[1, 2])

        return qp.expval(qp.pauli.string_to_pauli_word("ZZZ"))

>>> x = np.array(0.531, requires_grad=True)
>>> circuit(x)
0.47165198882111165
>>> qp.grad(circuit)(x)
tensor(-0.27698287, requires_grad=True)

.. details::
    :title: Usage Details

    Manually placing :class:`~.WireCut` operations and decorating the QNode with the
    ``cut_circuit()`` batch transform is the suggested entrypoint into circuit cutting. However,
    advanced users also have the option to work directly with a :class:`~.QuantumTape` and
    manipulate the tape to perform circuit cutting using the below functionality:

    .. autosummary::
        :toctree:

        ~qcut.tape_to_graph
        ~qcut.find_and_place_cuts
        ~qcut.replace_wire_cut_nodes
        ~qcut.fragment_graph
        ~qcut.graph_to_tape
        ~qcut.expand_fragment_tape
        ~qcut.qcut_processing_fn
        ~qcut.CutStrategy

    The following shows how these elementary steps are combined as part of the
    ``cut_circuit()`` transform.

    Consider the circuit below:

    .. code-block:: python

        ops = [
            qp.RX(0.531, wires=0),
            qp.RY(0.9, wires=1),
            qp.RX(0.3, wires=2),

            qp.CZ(wires=(0,1)),
            qp.RY(-0.4, wires=0),

            qp.WireCut(wires=1),

            qp.CZ(wires=[1, 2]),
        ]
        measurements = [qp.expval(qp.pauli.string_to_pauli_word("ZZZ"))]
        tape = qp.tape.QuantumTape(ops, measurements)

    >>> print(qp.drawer.tape_text(tape))
    0: ──RX─╭●──RY────┤ ╭<Z@Z@Z>
    1: ──RY─╰Z──//─╭●─┤ ├<Z@Z@Z>
    2: ──RX────────╰Z─┤ ╰<Z@Z@Z>

    To cut the circuit, we first convert it to its graph representation:

    >>> graph = qp.qcut.tape_to_graph(tape)

    .. figure:: ../../_static/qcut_graph.svg
        :align: center
        :width: 60%
        :target: javascript:void(0);

    If, however, the optimal location of the :class:`~.WireCut` is unknown, we can use
    :func:`~.find_and_place_cuts` to make attempts in automatically finding such a cut
    given the device constraints. Using the same circuit as above but with the
    :class:`~.WireCut` removed, the same (optimal) cut can be recovered with automatic
    cutting:

    .. code-block:: python

        ops = [
            qp.RX(0.531, wires=0),
            qp.RY(0.9, wires=1),
            qp.RX(0.3, wires=2),

            qp.CZ(wires=(0,1)),
            qp.RY(-0.4, wires=0),

            qp.CZ(wires=[1, 2]),
        ]
        measurements = [qp.expval(qp.pauli.string_to_pauli_word("ZZZ"))]
        uncut_tape = qp.tape.QuantumTape(ops, measurements)

    >>> cut_graph = qp.qcut.find_and_place_cuts(
    ...     graph = qp.qcut.tape_to_graph(uncut_tape),
    ...     cut_strategy = qp.qcut.CutStrategy(max_free_wires=2),
    ... )
    >>> print(qp.qcut.graph_to_tape(cut_graph).draw())
    0: ──RX─╭●──RY────┤ ╭<Z@Z@Z>
    1: ──RY─╰Z──//─╭●─┤ ├<Z@Z@Z>
    2: ──RX────────╰Z─┤ ╰<Z@Z@Z>

    Our next step is to remove the :class:`~.WireCut` nodes in the graph and replace with
    :class:`~.MeasureNode` and :class:`~.PrepareNode` pairs.

    >>> qp.qcut.replace_wire_cut_nodes(graph)

    The :class:`~.MeasureNode` and :class:`~.PrepareNode` pairs are placeholder operations that
    allow us to cut the circuit graph and then iterate over measurement and preparation
    configurations at cut locations. First, the :func:`~.fragment_graph` function pulls apart
    the graph into disconnected components as well as returning the
    `communication_graph <https://en.wikipedia.org/wiki/Quotient_graph>`__
    detailing the connectivity between the components.

    >>> fragments, communication_graph = qp.qcut.fragment_graph(graph)

    We now convert the ``fragments`` back to :class:`~.QuantumTape` objects

    >>> fragment_tapes = [qp.qcut.graph_to_tape(f) for f in fragments]

    The circuit fragments can now be visualized:

    >>> print(fragment_tapes[0].draw(decimals=2))
    0: ──RX(0.53)─╭●──RY(-0.40)───┤  <Z>
    1: ──RY(0.90)─╰Z──MeasureNode─┤

    >>> print(fragment_tapes[1].draw(decimals=1))
    2: ──RX(0.3)─────╭Z─┤ ╭<Z@Z>
    1: ──PrepareNode─╰●─┤ ╰<Z@Z>

    Additionally, we must remap the tape wires to match those available on our device.

    >>> dev = qp.device("default.qubit", wires=2)
    >>> fragment_tapes = [qp.map_wires(t, dict(zip(t.wires, dev.wires)))[0][0] for t in fragment_tapes]

    Next, each circuit fragment is expanded over :class:`~.MeasureNode` and
    :class:`~.PrepareNode` configurations and a flat list of tapes is created:

    .. code-block::

        expanded = [qp.qcut.expand_fragment_tape(t) for t in fragment_tapes]

        configurations = []
        prepare_nodes = []
        measure_nodes = []
        for tapes, p, m in expanded:
            configurations.append(tapes)
            prepare_nodes.append(p)
            measure_nodes.append(m)

        tapes = tuple(tape for c in configurations for tape in c)

    Each configuration is drawn below:

    >>> for t in tapes:
    ...     print(qp.drawer.tape_text(t))
    ...     print()

    .. code-block::

        0: ──RX(0.53)─╭●──RY(-0.40)─┤ ╭<Z@I> ╭<Z@Z>
        1: ──RY(0.90)─╰Z────────────┤ ╰<Z@I> ╰<Z@Z>

        0: ──RX(0.53)─╭●──RY(-0.40)─┤ ╭<Z@X>
        1: ──RY(0.90)─╰Z────────────┤ ╰<Z@X>

        0: ──RX(0.53)─╭●──RY(-0.40)─┤ ╭<Z@Y>
        1: ──RY(0.90)─╰Z────────────┤ ╰<Z@Y>

        0: ──RX(0.30)─╭Z─┤ ╭<Z@Z>
        1: ──I────────╰●─┤ ╰<Z@Z>

        0: ──RX(0.30)─╭Z─┤ ╭<Z@Z>
        1: ──X────────╰●─┤ ╰<Z@Z>

        0: ──RX(0.30)─╭Z─┤ ╭<Z@Z>
        1: ──H────────╰●─┤ ╰<Z@Z>

        0: ──RX(0.30)────╭Z─┤ ╭<Z@Z>
        1: ──H─────────S─╰●─┤ ╰<Z@Z>

    The last step is to execute the tapes and postprocess the results using
    :func:`~.qcut_processing_fn`, which processes the results to the original full circuit
    output via a tensor network contraction

    >>> results = qp.execute(tapes, dev, diff_method=None)
    >>> qp.qcut.qcut_processing_fn(
    ...     results,
    ...     communication_graph,
    ...     prepare_nodes,
    ...     measure_nodes,
    ... )
    0.47165198882111165
