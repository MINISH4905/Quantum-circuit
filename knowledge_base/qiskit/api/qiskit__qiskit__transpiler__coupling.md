---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/transpiler/coupling.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/coupling.py
license: Apache-2.0
---

## Module `qiskit/transpiler/coupling.py`

Directed graph object for representing coupling between physical qubits.

The nodes of the graph correspond to physical qubits (represented as integers) and the
directed edges indicate which physical qubits are coupled and the permitted direction of
CNOT gates. The object has a distance function that can be used to map quantum circuits
onto a device with this coupling.

## `CouplingMap`

```python
class CouplingMap
```

Directed graph specifying fixed coupling.

Nodes correspond to physical qubits (integers) and directed edges correspond
to permitted CNOT gates, with source and destination corresponding to control
and target qubits, respectively.

### `__init__`

```python
def __init__(self, couplinglist=None, description=None)
```

Create coupling graph. By default, the generated coupling has no nodes.

Args:
    couplinglist (list or None): An initial coupling graph, specified as
        an adjacency list containing couplings, e.g. [[0,1], [0,2], [1,2]].
        It is required that nodes are contiguously indexed starting at 0.
        Missed nodes will be added as isolated nodes in the coupling map.
    description (str): A string to describe the coupling map.

### `size`

```python
def size(self)
```

Return the number of physical qubits in this graph.

### `get_edges`

```python
def get_edges(self)
```

Gets the list of edges in the coupling graph.

Returns:
    Tuple(int,int): Each edge is a pair of physical qubits.

### `add_physical_qubit`

```python
def add_physical_qubit(self, physical_qubit)
```

Add a physical qubit to the coupling graph as a node.

physical_qubit (int): An integer representing a physical qubit.

Raises:
    CouplingError: if trying to add duplicate qubit

### `add_edge`

```python
def add_edge(self, src, dst)
```

Add directed edge to coupling graph.

src (int): source physical qubit
dst (int): destination physical qubit

### `physical_qubits`

```python
def physical_qubits(self)
```

Returns a sorted list of physical_qubits

### `is_connected`

```python
def is_connected(self)
```

Test if the graph is connected.

Return True if connected, False otherwise

### `neighbors`

```python
def neighbors(self, physical_qubit)
```

Return the nearest neighbors of a physical qubit.

Directionality matters, i.e. a neighbor must be reachable
by going one hop in the direction of an edge.

### `distance_matrix`

```python
def distance_matrix(self)
```

Return the distance matrix for the coupling map.

For any qubits where there isn't a path available between them the value
in this position of the distance matrix will be ``math.inf``.

### `compute_distance_matrix`

```python
def compute_distance_matrix(self)
```

Compute the full distance matrix on pairs of nodes.

The distance map self._dist_matrix is computed from the graph using
all_pairs_shortest_path_length. This is normally handled internally
by the :attr:`~qiskit.transpiler.CouplingMap.distance_matrix`
attribute or the :meth:`~qiskit.transpiler.CouplingMap.distance` method
but can be called if you're accessing the distance matrix outside of
those or want to pre-generate it.

### `distance`

```python
def distance(self, physical_qubit1, physical_qubit2)
```

Returns the undirected distance between physical_qubit1 and physical_qubit2.

Args:
    physical_qubit1 (int): A physical qubit
    physical_qubit2 (int): Another physical qubit

Returns:
    int: The undirected distance

Raises:
    CouplingError: if the qubits do not exist in the CouplingMap

### `shortest_undirected_path`

```python
def shortest_undirected_path(self, physical_qubit1, physical_qubit2)
```

Returns the shortest undirected path between physical_qubit1 and physical_qubit2.

Args:
    physical_qubit1 (int): A physical qubit
    physical_qubit2 (int): Another physical qubit
Returns:
    List: The shortest undirected path
Raises:
    CouplingError: When there is no path between physical_qubit1, physical_qubit2.

### `is_symmetric`

```python
def is_symmetric(self)
```

Test if the graph is symmetric.

Return True if symmetric, False otherwise

### `make_symmetric`

```python
def make_symmetric(self)
```

Convert uni-directional edges into bi-directional.

### `reduce`

```python
def reduce(self, mapping, check_if_connected=True)
```

Returns a reduced coupling map that
corresponds to the subgraph of qubits
selected in the mapping.

Args:
    mapping (list): A mapping of reduced qubits to device
        qubits.
    check_if_connected (bool): if True, checks that the reduced
        coupling map is connected.

Returns:
    CouplingMap: A reduced coupling_map for the selected qubits.

Raises:
    CouplingError: Reduced coupling map must be connected.

### `from_full`

```python
def from_full(cls, num_qubits, bidirectional=True) -> 'CouplingMap'
```

Return a fully connected coupling map on n qubits.

### `from_line`

```python
def from_line(cls, num_qubits, bidirectional=True) -> 'CouplingMap'
```

Return a coupling map of n qubits connected in a line.

### `from_ring`

```python
def from_ring(cls, num_qubits, bidirectional=True) -> 'CouplingMap'
```

Return a coupling map of n qubits connected to each of their neighbors in a ring.

### `from_grid`

```python
def from_grid(cls, num_rows, num_columns, bidirectional=True) -> 'CouplingMap'
```

Return a coupling map of qubits connected on a grid of num_rows x num_columns.

### `from_heavy_hex`

```python
def from_heavy_hex(cls, distance, bidirectional=True) -> 'CouplingMap'
```

Return a heavy hexagon graph coupling map.

A heavy hexagon graph is described in:

https://journals.aps.org/prx/abstract/10.1103/PhysRevX.10.011022

Args:
    distance (int): The code distance for the generated heavy hex
        graph. The value for distance can be any odd positive integer.
        The distance relates to the number of qubits by:
        :math:`n = \frac{5d^2 - 2d - 1}{2}` where :math:`n` is the
        number of qubits and :math:`d` is the ``distance`` parameter.
    bidirectional (bool): Whether the edges in the output coupling
        graph are bidirectional or not. By default this is set to
        ``True``
Returns:
    CouplingMap: A heavy hex coupling graph

### `from_heavy_square`

```python
def from_heavy_square(cls, distance, bidirectional=True) -> 'CouplingMap'
```

Return a heavy square graph coupling map.

A heavy square graph is described in:

https://journals.aps.org/prx/abstract/10.1103/PhysRevX.10.011022

Args:
    distance (int): The code distance for the generated heavy square
        graph. The value for distance can be any odd positive integer.
        The distance relates to the number of qubits by:
        :math:`n = 3d^2 - 2d` where :math:`n` is the
        number of qubits and :math:`d` is the ``distance`` parameter.
    bidirectional (bool): Whether the edges in the output coupling
        graph are bidirectional or not. By default this is set to
        ``True``
Returns:
    CouplingMap: A heavy square coupling graph

### `from_hexagonal_lattice`

```python
def from_hexagonal_lattice(cls, rows, cols, bidirectional=True) -> 'CouplingMap'
```

Return a hexagonal lattice graph coupling map.

Args:
    rows (int): The number of rows to generate the graph with.
    cols (int): The number of columns to generate the graph with.
    bidirectional (bool): Whether the edges in the output coupling
        graph are bidirectional or not. By default this is set to
        ``True``
Returns:
    CouplingMap: A hexagonal lattice coupling graph

### `largest_connected_component`

```python
def largest_connected_component(self)
```

Return a set of qubits in the largest connected component.

### `connected_components`

```python
def connected_components(self) -> list['CouplingMap']
```

Separate a :Class:`~.CouplingMap` into subgraph :class:`~.CouplingMap`
for each connected component.

The connected components of a :class:`~.CouplingMap` are the subgraphs
that are not part of any larger subgraph. For example, if you had a
coupling map that looked like::

    0 --> 1   4 --> 5 ---> 6 --> 7
    |     |
    |     |
    V     V
    2 --> 3

then the connected components of that graph are the subgraphs::

    0 --> 1
    |     |
    |     |
    V     V
    2 --> 3

and::

    4 --> 5 ---> 6 --> 7

For a connected :class:`~.CouplingMap` object there is only a single connected
component, the entire :class:`~.CouplingMap`.

This method will return a list of :class:`~.CouplingMap` objects, one for each connected
component in this :class:`~.CouplingMap`. The data payload of each node in the
:attr:`~.CouplingMap.graph` attribute will contain the qubit number in the original
graph. This will enable mapping the qubit index in a component subgraph to
the original qubit in the combined :class:`~.CouplingMap`. For example::

    from qiskit.transpiler import CouplingMap

    cmap = CouplingMap([[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3]])
    component_cmaps = cmap.connected_components()
    print(component_cmaps[1].graph[0])

will print ``3`` as index ``0`` in the second component is qubit 3 in the original cmap.

Returns:
    list: A list of :class:`~.CouplingMap` objects for each connected
        components. The order of this list is deterministic but
        implementation specific and shouldn't be relied upon as
        part of the API.

### `__str__`

```python
def __str__(self)
```

Return a string representation of the coupling graph.

### `__eq__`

```python
def __eq__(self, other)
```

Check if the graph in ``other`` has the same node labels and edges as the graph in
``self``.

This function assumes that the graphs in :class:`.CouplingMap` instances are connected.

Args:
    other (CouplingMap): The other coupling map.

Returns:
    bool: Whether or not other is isomorphic to self.

### `draw`

```python
def draw(self, method='neato')
```

Draws the coupling map.

This function calls the :func:`~rustworkx.visualization.graphviz_draw` function from the
``rustworkx`` package to draw the :class:`CouplingMap` object.

.. warning::
    This function will call the system Graphviz tool on a file involving user-controllable
    strings (such as qubit objects).  It is recommended to only call this function on
    trusted input.

Args:
    method (str): The layout method to use. See the documentation for
        :func:`~rustworkx.visualization.graphviz_draw` for the list of supported methods

Returns:
    PIL.Image: Drawn coupling map.
