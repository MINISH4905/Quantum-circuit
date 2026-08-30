---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/zx/converter.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/zx/converter.py
license: Apache-2.0
---

## Module `pennylane/transforms/zx/converter.py`

Transforms for interacting with PyZX, framework for ZX calculus.

## `VertexType`

```python
class VertexType
```

Type of a vertex in the graph.

This class is copied from PyZX as we do not make PyZX a Pennylane requirement.

Copyright (C) 2018 - Aleks Kissinger and John van de Wetering

## `EdgeType`

```python
class EdgeType
```

Type of an edge in the graph.

This class is copied from PyZX as we do not make PyZX a Pennylane requirement.

Copyright (C) 2018 - Aleks Kissinger and John van de Wetering

## `to_zx`

```python
def to_zx(tape, expand_measurements=False)
```

This transform converts a PennyLane quantum tape to a ZX-Graph in the `PyZX framework <https://pyzx.readthedocs.io/en/latest/>`_.
The graph can be optimized and transformed by well-known ZX-calculus reductions.

Args:
    tape(QNode or QuantumTape or Callable or Operation): The PennyLane quantum circuit.
    expand_measurements(bool): The expansion will be applied on measurements that are not in the Z-basis and
        rotations will be added to the operations.

Returns:
    graph (pyzx.Graph) or qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]:

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`. Executing this circuit
    will provide the ZX graph in the form of a PyZX graph.

Raises:
    ModuleNotFoundError: if the required ``pyzx`` package is not installed.

**Example**

You can use the transform decorator directly on your :class:`~.QNode`, quantum function and executing it will produce a
PyZX graph. You can also use the transform directly on the :class:`~.QuantumTape`.

.. code-block:: python

    import pyzx
    dev = qp.device('default.qubit', wires=2)

    @qp.transforms.to_zx
    @qp.qnode(device=dev)
    def circuit(p):
        qp.RZ(p[0], wires=1),
        qp.RZ(p[1], wires=1),
        qp.RX(p[2], wires=0),
        qp.Z(0),
        qp.RZ(p[3], wires=1),
        qp.X(1),
        qp.CNOT(wires=[0, 1]),
        qp.CNOT(wires=[1, 0]),
        qp.SWAP(wires=[0, 1]),
        return qp.expval(qp.Z(0) @ qp.Z(1))

    params = [5 / 4 * np.pi, 3 / 4 * np.pi, 0.1, 0.3]
    g = circuit(params)

>>> g
Graph(20 vertices, 23 edges)

It is now a PyZX graph and can apply function from the framework on your Graph, for example you can draw it:

>>> pyzx.draw_matplotlib(g)
<Figure size ... with 1 Axes>

Alternatively you can use the transform directly on a quantum tape and get PyZX graph.

.. code-block:: python

    operations = [
            qp.RZ(5 / 4 * np.pi, wires=1),
            qp.RZ(3 / 4 * np.pi, wires=1),
            qp.RX(0.1, wires=0),
            qp.Z(0),
            qp.RZ(0.3, wires=1),
            qp.X(1),
            qp.CNOT(wires=[0, 1]),
            qp.CNOT(wires=[1, 0]),
            qp.SWAP(wires=[0, 1]),
        ]

    tape = qp.tape.QuantumTape(operations)
    g = qp.transforms.to_zx(tape)

>>> g
Graph(20 vertices, 23 edges)

.. details::
    :title: Usage Details

    Here we give an example of how to use optimization techniques from ZX calculus to reduce the T count of a
    quantum circuit and get back a PennyLane circuit.

    Let's start by starting with the mod 5 4 circuit from a known benchmark `library <https://github.com/njross/optimizer>`_
    the expanded circuit before optimization is the following QNode:

    .. code-block:: python

        dev = qp.device("default.qubit", wires=5)

        @qp.transforms.to_zx
        @qp.qnode(device=dev)
        def mod_5_4():
            qp.X(4),
            qp.Hadamard(wires=4),
            qp.CNOT(wires=[3, 4]),
            qp.adjoint(qp.T(wires=[4])),
            qp.CNOT(wires=[0, 4]),
            qp.T(wires=[4]),
            qp.CNOT(wires=[3, 4]),
            qp.adjoint(qp.T(wires=[4])),
            qp.CNOT(wires=[0, 4]),
            qp.T(wires=[3]),
            qp.T(wires=[4]),
            qp.CNOT(wires=[0, 3]),
            qp.T(wires=[0]),
            qp.adjoint(qp.T(wires=[3]))
            qp.CNOT(wires=[0, 3]),
            qp.CNOT(wires=[3, 4]),
            qp.adjoint(qp.T(wires=[4])),
            qp.CNOT(wires=[2, 4]),
            qp.T(wires=[4]),
            qp.CNOT(wires=[3, 4]),
            qp.adjoint(qp.T(wires=[4])),
            qp.CNOT(wires=[2, 4]),
            qp.T(wires=[3]),
            qp.T(wires=[4]),
            qp.CNOT(wires=[2, 3]),
            qp.T(wires=[2]),
            qp.adjoint(qp.T(wires=[3]))
            qp.CNOT(wires=[2, 3]),
            qp.Hadamard(wires=[4]),
            qp.CNOT(wires=[3, 4]),
            qp.Hadamard(wires=4),
            qp.CNOT(wires=[2, 4]),
            qp.adjoint(qp.T(wires=[4]),)
            qp.CNOT(wires=[1, 4]),
            qp.T(wires=[4]),
            qp.CNOT(wires=[2, 4]),
            qp.adjoint(qp.T(wires=[4])),
            qp.CNOT(wires=[1, 4]),
            qp.T(wires=[4]),
            qp.T(wires=[2]),
            qp.CNOT(wires=[1, 2]),
            qp.T(wires=[1]),
            qp.adjoint(qp.T(wires=[2]))
            qp.CNOT(wires=[1, 2]),
            qp.Hadamard(wires=[4]),
            qp.CNOT(wires=[2, 4]),
            qp.Hadamard(wires=4),
            qp.CNOT(wires=[1, 4]),
            qp.adjoint(qp.T(wires=[4])),
            qp.CNOT(wires=[0, 4]),
            qp.T(wires=[4]),
            qp.CNOT(wires=[1, 4]),
            qp.adjoint(qp.T(wires=[4])),
            qp.CNOT(wires=[0, 4]),
            qp.T(wires=[4]),
            qp.T(wires=[1]),
            qp.CNOT(wires=[0, 1]),
            qp.T(wires=[0]),
            qp.adjoint(qp.T(wires=[1])),
            qp.CNOT(wires=[0, 1]),
            qp.Hadamard(wires=[4]),
            qp.CNOT(wires=[1, 4]),
            qp.CNOT(wires=[0, 4]),
            return qp.expval(qp.Z(0))

    The circuit contains 63 gates; 28 :func:`qp.T` gates, 28 :func:`qp.CNOT`, 6 :func:`qp.Hadmard` and
    1 :func:`qp.X`. We applied the ``qp.transforms.to_zx`` decorator in order to transform our circuit to
    a ZX graph.

    You can get the PyZX graph by simply calling the QNode:

    >>> g = mod_5_4()
    >>> pyzx.tcount(g)
    28

    PyZX gives multiple options for optimizing ZX graphs (:func:`pyzx.full_reduce`, :func:`pyzx.teleport_reduce`, ...).
    The :func:`pyzx.full_reduce` applies all optimization passes, but the final result may not be circuit-like.
    Converting back to a quantum circuit from a fully reduced graph may be difficult to impossible.
    Therefore we instead recommend using :func:`pyzx.teleport_reduce`, as it preserves the circuit structure.

    >>> g = pyzx.simplify.teleport_reduce(g)
    >>> pyzx.tcount(g)
    8

    If you give a closer look, the circuit contains now 53 gates; 8 :func:`qp.T` gates, 28 :func:`qp.CNOT`, 6 :func:`qp.Hadmard` and
    1 :func:`qp.X` and 10 :func:`qp.S`. We successfully reduced the T-count by 20 and have ten additional
    S gates. The number of CNOT gates remained the same.

    The :func:`from_zx` transform can now convert the optimized circuit back into PennyLane operations:

    .. code-block:: python

        tape_opt = qp.transforms.from_zx(g)

        wires = qp.wires.Wires([4, 3, 0, 2, 1])
        wires_map = dict(zip(tape_opt.wires, wires))
        tape_opt_reorder = qp.map_wires(tape_opt, wire_map=wires_map)[0][0]

        @qp.qnode(device=dev)
        def mod_5_4():
            for g in tape_opt_reorder:
                qp.apply(g)
            return qp.expval(qp.Z(0))

    >>> result = mod_5_4()
    >>> print(result) # doctest: +SKIP
    1.0

.. note::

    This function is a PennyLane adaptation to `circuit_to_graph <https://github.com/zxcalc/pyzx/blob/master/pyzx/circuit/graphparser.py#L89>`_.
    It requires the `pyzx <https://pyzx.readthedocs.io/en/latest/>`_ external package to be installed.

.. note::

    Prior to being added to the graph, Toffoli and CCZ gates are replaced by particular decompositions. These decompositions
    are described in detail in: J. Welch, A. Bocharov, and K. Svore, “Efficient Approximation of Diagonal Unitaries over the Clifford+T Basis,”
    Quantum information & computation, vol. 16, Dec. 2014, doi: 10.26421/QIC16.1-2-6.
    This is necessary because Toffoli and CCZ gates are not directly supported in PyZX.

    Copyright (C) 2018 - Aleks Kissinger and John van de Wetering

## `from_zx`

```python
def from_zx(graph, decompose_phases=True)
```

Converts a graph from `PyZX <https://pyzx.readthedocs.io/en/latest/>`_ to a PennyLane tape, if the graph is
diagram-like.

Args:
    graph (Graph): ZX graph in PyZX.
    decompose_phases (bool): If True the phases are decomposed, meaning that :func:`qp.RZ` and :func:`qp.RX` are
        simplified into other gates (e.g. :func:`qp.T`, :func:`qp.S`, ...).

**Example**

From the example for the :func:`~.to_zx` function, one can convert back the PyZX graph to a PennyLane by using the
function :func:`~.from_zx`.

.. code-block:: python

    dev = qp.device('default.qubit', wires=2)

    @qp.transforms.to_zx
    def circuit(p):
        qp.RZ(p[0], wires=0),
        qp.RZ(p[1], wires=0),
        qp.RX(p[2], wires=1),
        qp.Z(1),
        qp.RZ(p[3], wires=0),
        qp.X(0),
        qp.CNOT(wires=[1, 0]),
        qp.CNOT(wires=[0, 1]),
        qp.SWAP(wires=[1, 0]),
        return qp.expval(qp.Z(0) @ qp.Z(1))

    params = [5 / 4 * np.pi, 3 / 4 * np.pi, 0.1, 0.3]
    g = circuit(params)

    pennylane_tape = qp.transforms.from_zx(g)

You can check that the operations are similar but some were decomposed in the process.

>>> ops = pennylane_tape.operations
>>> from pprint import pprint
>>> pprint(ops)
[Z(0),
 T(0),
 RX(0.10..., wires=[1]),
 Z(0),
 Adjoint(T(0)),
 Z(1),
 RZ(0.30..., wires=[0]),
 X(0),
 CNOT(wires=[1, 0]),
 CNOT(wires=[0, 1]),
 CNOT(wires=[1, 0]),
 CNOT(wires=[0, 1]),
 CNOT(wires=[1, 0])]

.. warning::

    Be careful because not all graphs are circuit-like, so the process might not be successful
    after you apply some optimization on your PyZX graph. You can extract a circuit by using the dedicated
    PyZX function.

.. note::

    It is a PennyLane adapted and reworked `graph_to_circuit <https://github.com/Quantomatic/pyzx/blob/master/pyzx/circuit/graphparser.py>`_
    function.

    Copyright (C) 2018 - Aleks Kissinger and John van de Wetering
