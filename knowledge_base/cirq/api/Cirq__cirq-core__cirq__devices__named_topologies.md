---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/devices/named_topologies.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/devices/named_topologies.py
license: Apache-2.0
---

## `NamedTopology`

```python
class NamedTopology(metaclass=abc.ABCMeta)
```

A topology (graph) with a name.

"Named topologies" provide a mapping from a simple dataclass to a unique graph for categories
of relevant topologies. Relevant topologies may be hardware dependant, but common topologies
are linear (1D) and rectangular grid topologies.

Attributes:
    name: A name that uniquely identifies this topology.
    n_nodes: The number of nodes in the topology.
    graph: A networkx graph representation of the topology.

## `draw_gridlike`

```python
def draw_gridlike(graph: nx.Graph, ax: plt.Axes | None=None, tilted: bool=True, **kwargs) -> dict[_GRIDLIKE_NODE, tuple[int, int]]
```

Draw a grid-like graph using Matplotlib.

This wraps nx.draw_networkx to produce a matplotlib drawing of the graph. Nodes
should be two-dimensional gridlike objects.

Args:
    graph: A NetworkX graph whose nodes are (row, column) coordinates or cirq.GridQubits.
    ax: Optional matplotlib axis to use for drawing.
    tilted: If True, directly position as (row, column); otherwise,
        rotate 45 degrees to accommodate google-style diagonal grids.
    **kwargs: Additional arguments to pass to `nx.draw_networkx`.

Returns:
    A positions dictionary mapping nodes to (x, y) coordinates suitable for future calls
    to NetworkX plotting functionality.

## `LineTopology`

```python
class LineTopology(NamedTopology)
```

A 1D linear topology.

Node indices are contiguous integers starting from 0 with edges between
adjacent integers.

Args:
    n_nodes: The number of nodes in a line.

### `nodes_as_linequbits`

```python
def nodes_as_linequbits(self) -> list[cirq.LineQubit]
```

Get the graph nodes as cirq.LineQubit

### `draw`

```python
def draw(self, ax=None, tilted: bool=True, **kwargs) -> dict[Any, tuple[int, int]]
```

Draw this graph using Matplotlib.

Args:
    ax: Optional matplotlib axis to use for drawing.
    tilted: If True, draw as a horizontal line. Otherwise, draw on a diagonal.
    **kwargs: Additional arguments to pass to `nx.draw_networkx`.

### `nodes_to_linequbits`

```python
def nodes_to_linequbits(self, offset: int=0) -> dict[int, cirq.LineQubit]
```

Return a mapping from graph nodes to `cirq.LineQubit`

Args:
    offset: Offset integer positions of the resultant LineQubits by this amount.

## `TiltedSquareLattice`

```python
class TiltedSquareLattice(NamedTopology)
```

A grid lattice rotated 45-degrees.

This topology is based on Google devices where plaquettes consist of four qubits in a square
connected to a central qubit:

    x   x
      x
    x   x

The corner nodes are not connected to each other. `width` and `height` refer to the rectangle
formed by rotating the lattice 45 degrees. `width` and `height` are measured in half-unit
cells, or equivalently half the number of central nodes.
An example diagram of this topology is shown below. It is a
"tilted-square-lattice-6-4" with width 6 and height 4.

          x
          │
     x────X────x
     │    │    │
x────X────x────X────x
     │    │    │    │
     x────X────x────X───x
          │    │    │
          x────X────x
               │
               x

Nodes are 2-tuples of integers which may be negative. Please see `get_placements` for
mapping this topology to a GridQubit Device.

### `draw`

```python
def draw(self, ax=None, tilted=True, **kwargs) -> dict[_GRIDLIKE_NODE, tuple[int, int]]
```

Draw this graph using Matplotlib.

Args:
    ax: Optional matplotlib axis to use for drawing.
    tilted: If True, directly position as (row, column); otherwise,
        rotate 45 degrees to accommodate the diagonal nature of this topology.
    **kwargs: Additional arguments to pass to `nx.draw_networkx`.

### `nodes_as_gridqubits`

```python
def nodes_as_gridqubits(self) -> list[cirq.GridQubit]
```

Get the graph nodes as cirq.GridQubit

### `nodes_to_gridqubits`

```python
def nodes_to_gridqubits(self, offset=(0, 0)) -> dict[tuple[int, int], cirq.GridQubit]
```

Return a mapping from graph nodes to `cirq.GridQubit`

Args:
    offset: Offset row and column indices of the resultant GridQubits by this amount.
        The offset positions the top-left node in the `draw(tilted=False)` frame.

## `get_placements`

```python
def get_placements(big_graph: nx.Graph, small_graph: nx.Graph, max_placements=100000) -> list[dict]
```

Get 'placements' mapping small_graph nodes onto those of `big_graph`.

This function considers monomorphisms with a restriction: we restrict only to unique set
of `big_graph` qubits. Some monomorphisms may be basically
the same mapping just rotated/flipped which we purposefully exclude. This could
exclude meaningful differences like using the same qubits but having the edges assigned
differently, but it prevents the number of placements from blowing up.

Args:
    big_graph: The parent, super-graph. We often consider the case where this is a
        nx.Graph representation of a Device whose nodes are `cirq.Qid`s like `GridQubit`s.
    small_graph: The subgraph. We often consider the case where this is a NamedTopology
        graph.
    max_placements: Raise a value error if there are more than this many placement
        possibilities. It is possible to use `big_graph`, `small_graph` combinations
        that result in an intractable number of placements.

Raises:
    ValueError: if the number of placements exceeds `max_placements`.

Returns:
    A list of placement dictionaries. Each dictionary maps the nodes in `small_graph` to
    nodes in `big_graph` with a monomorphic relationship. That's to say: if an edge exists
    in `small_graph` between two nodes, it will exist in `big_graph` between the mapped nodes.

## `is_valid_placement`

```python
def is_valid_placement(big_graph: nx.Graph, small_graph: nx.Graph, small_to_big_mapping: dict) -> bool
```

Return whether the given placement is a valid placement of small_graph onto big_graph.

This is done by making sure all the nodes and edges on the mapped version of `small_graph`
are present in `big_graph`.

Args:
    big_graph: A larger graph we're placing `small_graph` onto.
    small_graph: A smaller, (potential) sub-graph to validate the given mapping.
    small_to_big_mapping: A mapping from `small_graph` nodes to `big_graph`
        nodes. After the mapping occurs, we check whether all of the mapped nodes and
        edges exist on `big_graph`.

## `draw_placements`

```python
def draw_placements(big_graph: nx.Graph, small_graph: nx.Graph, small_to_big_mappings: Sequence[dict], max_plots: int=20, axes: Sequence[plt.Axes] | None=None, tilted: bool=True, bad_placement_callback: Callable[[plt.Axes, int], None] | None=None) -> None
```

Draw a visualization of placements from small_graph onto big_graph using Matplotlib.

The entire `big_graph` will be drawn with default blue colored nodes. `small_graph` nodes
and edges will be highlighted with a red color.

Args:
    big_graph: A larger graph to draw with blue colored nodes.
    small_graph: A smaller, sub-graph to highlight with red nodes and edges.
    small_to_big_mappings: A sequence of mappings from `small_graph` nodes to `big_graph`
        nodes.
    max_plots: To prevent an explosion of open Matplotlib figures, we only show the first
        `max_plots` plots.
    axes: Optional list of matplotlib Axes to contain the drawings.
    tilted: Whether to draw gridlike graphs in the ordinary cartesian or tilted plane.
    bad_placement_callback: If provided, we check that the given mappings are valid. If not,
        this callback is called. The callback should accept `ax` and `i` keyword arguments
        for the current axis and mapping index, respectively.
