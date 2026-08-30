---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/routing/commuting_2q_gate_routing/commuting_2q_gate_router.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/routing/commuting_2q_gate_routing/commuting_2q_gate_router.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/routing/commuting_2q_gate_routing/commuting_2q_gate_router.py`

A swap strategy pass for blocks of commuting gates.

## `Commuting2qGateRouter`

```python
class Commuting2qGateRouter(TransformationPass)
```

A class to swap route one or more commuting gates to the coupling map.

This pass routes blocks of commuting two-qubit gates encapsulated as
:class:`.Commuting2qBlock` instructions. This pass will not apply to other instructions.
The mapping to the coupling map is done using swap strategies, see :class:`.SwapStrategy`.
The swap strategy should suit the problem and the coupling map. This transpiler pass
should ideally be executed before the quantum circuit is enlarged with any idle ancilla
qubits. Otherwise, we may swap qubits outside the portion of the chip we want to use.
Therefore, the swap strategy and its associated coupling map do not represent physical
qubits. Instead, they represent an intermediate mapping that corresponds to the physical
qubits once the initial layout is applied. The example below shows how to map a four
qubit :class:`.PauliEvolutionGate` to qubits 0, 1, 3, and 4 of the five qubit device with
the coupling map

.. code-block:: text

    0 -- 1 -- 2
         |
         3
         |
         4

To do this we use a line swap strategy for qubits 0, 1, 3, and 4 defined in terms
of virtual qubits 0, 1, 2, and 3.

.. plot::
   :include-source:
   :nofigs:

    from qiskit import QuantumCircuit
    from qiskit.circuit.library import PauliEvolutionGate
    from qiskit.quantum_info import SparsePauliOp
    from qiskit.transpiler import Layout, CouplingMap, PassManager
    from qiskit.transpiler.passes import FullAncillaAllocation
    from qiskit.transpiler.passes import EnlargeWithAncilla
    from qiskit.transpiler.passes import ApplyLayout
    from qiskit.transpiler.passes import SetLayout

    from qiskit.transpiler.passes.routing.commuting_2q_gate_routing import (
        SwapStrategy,
        FindCommutingPauliEvolutions,
        Commuting2qGateRouter,
    )

    # Define the circuit on virtual qubits
    op = SparsePauliOp.from_list([("IZZI", 1), ("ZIIZ", 2), ("ZIZI", 3)])
    circ = QuantumCircuit(4)
    circ.append(PauliEvolutionGate(op, 1), range(4))

    # Define the swap strategy on qubits before the initial_layout is applied.
    swap_strat = SwapStrategy.from_line([0, 1, 2, 3])

    # Choose qubits 0, 1, 3, and 4 from the backend coupling map shown above.
    backend_cmap = CouplingMap(couplinglist=[(0, 1), (1, 2), (1, 3), (3, 4)])
    initial_layout = Layout.from_intlist([0, 1, 3, 4], *circ.qregs)

    pm_pre = PassManager(
        [
            FindCommutingPauliEvolutions(),
            Commuting2qGateRouter(swap_strat),
            SetLayout(initial_layout),
            FullAncillaAllocation(backend_cmap),
            EnlargeWithAncilla(),
            ApplyLayout(),
        ]
    )

    # Insert swap gates, map to initial_layout and finally enlarge with ancilla.
    pm_pre.run(circ).draw("mpl")

This pass manager relies on the ``current_layout`` which corresponds to the qubit layout as
swap gates are applied. The pass will traverse all nodes in the dag. If a node should be
routed using a swap strategy then it will be decomposed into sub-instructions with swap
layers in between and the ``current_layout`` will be modified. Nodes that should not be
routed using swap strategies will be added back to the dag taking the ``current_layout``
into account.

### `__init__`

```python
def __init__(self, swap_strategy: SwapStrategy | None=None, edge_coloring: dict[tuple[int, int], int] | None=None) -> None
```

Args:
    swap_strategy: An instance of a :class:`.SwapStrategy` that holds the swap layers
        that are used, and the order in which to apply them, to map the instruction to
        the hardware. If this field is not given, it should be contained in the
        property set of the pass. This allows other passes to determine the most
        appropriate swap strategy at run-time.
    edge_coloring: An optional edge coloring of the coupling map (I.e. no two edges that
        share a node have the same color). If the edge coloring is given then the commuting
        gates that can be simultaneously applied given the current qubit permutation are
        grouped according to the edge coloring and applied according to this edge
        coloring. Here, a color is an int which is used as the index to define and
        access the groups of commuting gates that can be applied simultaneously.
        If the edge coloring is not given then the sets will be built-up using a
        greedy algorithm. The edge coloring is useful to position gates such as
        ``RZZGate``\s next to swap gates to exploit CX cancellations.

### `run`

```python
def run(self, dag: DAGCircuit) -> DAGCircuit
```

Run the pass by decomposing the nodes it applies on.

Args:
    dag: The dag to which we will add swaps.

Returns:
    A dag where swaps have been added for the intended gate type.

Raises:
    TranspilerError: If the swap strategy was not given at init time and there is
        no swap strategy in the property set.
    TranspilerError: If the quantum circuit contains more than one qubit register.
    TranspilerError: If there are qubits that are not contained in the quantum register.

### `swap_decompose`

```python
def swap_decompose(self, dag: DAGCircuit, node: DAGOpNode, current_layout: Layout, swap_strategy: SwapStrategy) -> DAGCircuit
```

Take an instance of :class:`.Commuting2qBlock` and map it to the coupling map.

The mapping is done with the swap strategy.

Args:
    dag: The dag which contains the :class:`.Commuting2qBlock` we route.
    node: A node whose operation is a :class:`.Commuting2qBlock`.
    current_layout: The layout before the swaps are applied. This function will
        modify the layout so that subsequent gates can be properly composed on the dag.
    swap_strategy: The swap strategy used to decompose the node.

Returns:
    A dag that is compatible with the coupling map where swap gates have been added
    to map the gates in the :class:`.Commuting2qBlock` to the hardware.
