---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/graph_state.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/graph_state.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/graph_state.py`

Graph State circuit and gate.

## `GraphState`

```python
class GraphState(QuantumCircuit)
```

Circuit to prepare a graph state.

Given a graph G = (V, E), with the set of vertices V and the set of edges E,
the corresponding graph state is defined as

.. math::

    |G\rangle = \prod_{(a,b) \in E} CZ_{(a,b)} {|+\rangle}^{\otimes V}

Such a state can be prepared by first preparing all qubits in the :math:`+`
state, then applying a :math:`CZ` gate for each corresponding graph edge.

Graph state preparation circuits are Clifford circuits, and thus
easy to simulate classically. However, by adding a layer of measurements
in a product basis at the end, there is evidence that the circuit becomes
hard to simulate [2].

Reference Circuit:

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit.library import GraphState
   from qiskit.visualization.library import _generate_circuit_library_visualization
   import rustworkx as rx
   G = rx.generators.cycle_graph(5)
   circuit = GraphState(rx.adjacency_matrix(G))
   circuit.name = "Graph state"
   _generate_circuit_library_visualization(circuit)

References:

[1] M. Hein, J. Eisert, H.J. Briegel, Multi-party Entanglement in Graph States,
    `arXiv:0307130 <https://arxiv.org/pdf/quant-ph/0307130.pdf>`_
[2] D. Koh, Further Extensions of Clifford Circuits & their Classical Simulation Complexities.
    `arXiv:1512.07892 <https://arxiv.org/pdf/1512.07892.pdf>`_

### `__init__`

```python
def __init__(self, adjacency_matrix: list | np.ndarray) -> None
```

Create graph state preparation circuit.

Args:
    adjacency_matrix: input graph as n-by-n list of 0-1 lists

Raises:
    CircuitError: If adjacency_matrix is not symmetric.

The circuit prepares a graph state with the given adjacency
matrix.

## `GraphStateGate`

```python
class GraphStateGate(Gate)
```

A gate representing a graph state.

Given a graph G = (V, E), with the set of vertices V and the set of edges E,
the corresponding graph state is defined as

.. math::

    |G\rangle = \prod_{(a,b) \in E} CZ_{(a,b)} {|+\rangle}^{\otimes V}

Such a state can be prepared by first preparing all qubits in the :math:`+`
state, then applying a :math:`CZ` gate for each corresponding graph edge.

Graph state preparation circuits are Clifford circuits, and thus
easy to simulate classically. However, by adding a layer of measurements
in a product basis at the end, there is evidence that the circuit becomes
hard to simulate [2].

Reference Circuit:

.. plot::
    :alt: Circuit diagram output by the previous code.
    :include-source:

    from qiskit.circuit import QuantumCircuit
    from qiskit.circuit.library import GraphStateGate
    import rustworkx as rx

    G = rx.generators.cycle_graph(5)
    circuit = QuantumCircuit(5)
    circuit.append(GraphStateGate(rx.adjacency_matrix(G)), [0, 1, 2, 3, 4])
    circuit.decompose().draw('mpl')

References:

[1] M. Hein, J. Eisert, H.J. Briegel, Multi-party Entanglement in Graph States,
`arXiv:0307130 <https://arxiv.org/pdf/quant-ph/0307130.pdf>`_

[2] D. Koh, Further Extensions of Clifford Circuits & their Classical Simulation Complexities.
`arXiv:1512.07892 <https://arxiv.org/pdf/1512.07892.pdf>`_

### `__init__`

```python
def __init__(self, adjacency_matrix: list | np.ndarray) -> None
```

Args:
    adjacency_matrix: input graph as n-by-n list of 0-1 lists

Raises:
    CircuitError: If adjacency_matrix is not symmetric.

The gate represents a graph state with the given adjacency matrix.

### `validate_parameter`

```python
def validate_parameter(self, parameter)
```

Parameter validation

### `adjacency_matrix`

```python
def adjacency_matrix(self)
```

Returns the adjacency matrix.
