---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/spin/lattice.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/spin/lattice.py
license: Apache-2.0
---

## Module `pennylane/spin/lattice.py`

This file contains functions and classes to create a
:class:`~pennylane.spin.Lattice` object. This object stores all
the necessary information about a lattice.

## `Lattice`

```python
class Lattice
```

Constructs a Lattice object.

Args:
   n_cells (list[int]): Number of cells in each direction of the grid.
   vectors (list[list[float]]): Primitive vectors for the lattice.
   positions (list[list[float]]): Initial positions of the lattice nodes. Default value is
       ``[[0.0]`` :math:`\times` ``number of dimensions]``.
   boundary_condition (bool or list[bool]): Specifies whether or not to enforce periodic
        boundary conditions for the different lattice axes.  Default is ``False`` indicating
        open boundary condition.
   neighbour_order (int): Specifies the interaction level for neighbors within the lattice.
       Default is 1, indicating nearest neighbour. Must be 1 if ``custom_edges`` is defined.
   custom_edges (Optional[list(list(tuples))]): Specifies the edges to be added in the lattice.
       Default value is ``None``, which adds the edges based on ``neighbour_order``.
       Each element in the list is for a separate edge, and can contain 1 or 2 tuples.
       First tuple contains the indices of the starting and ending vertices of the edge.
       Second tuple is optional and contains the operator on that edge and coefficient
       of that operator. Default value is the index of edge in custom_edges list.
   custom_nodes (Optional(list(list(int, tuples)))): Specifies the on-site potentials and
       operators for nodes in the lattice. The default value is `None`, which means no on-site
       potentials. Each element in the list is for a separate node. For each element, the first
       value is the index of the node, and the second element is a tuple which contains the
       operator and coefficient.
   distance_tol (float): Distance below which spatial points are considered equal for the
       purpose of identifying nearest neighbours. Default value is 1e-5.

Raises:
   TypeError:
      if ``n_cells`` contains numbers other than positive integers.
   ValueError:
      if ``positions`` doesn't have a dimension of 2.
   ValueError:
      if ``vectors`` doesn't have a dimension of 2 or the length of vectors is not equal to the number of vectors.
   ValueError:
      if ``boundary_condition`` is not a bool or a list of bools with length equal to the number of vectors.
   ValueError:
      if ``custom_nodes`` contains nodes with negative indices or indices greater than number of sites

Returns:
   Lattice object

**Example**

We can define the positions of nodes in the lattice unit cell along with the lattice vectors
to create a custom lattice layout.

.. code-block:: python

    from pennylane.spin import Lattice

    positions = [[0.2, 0.5],
                 [0.5, 0.2],
                 [0.5, 0.8],
                 [0.8, 0.5]]

    vectors = [[1, 0], [0, 1]]

    n_cells = [2, 2]

    # periodic boundary conditions applied along the [1,0] axis only
    boundary_condition = [True, False]

    lattice = Lattice(n_cells, vectors, positions, boundary_condition=boundary_condition)

>>> lattice.edges
[(10, 13, 0), (0, 11, 0), (4, 15, 0), (2, 5, 0), (3, 8, 0), (7, 12, 0)]

.. details::
    :title: Usage Details

    Unless otherwise specified, the edges will be added based on the ``neighbour_order``,
    which defaults to 1. Increasing ``neighbour_order`` will add additional connections
    in the lattice.

    .. code-block:: python

        positions = [[0.2, 0.5],
                     [0.5, 0.2],
                     [0.5, 0.8],
                     [0.8, 0.5]]

        lattice = Lattice(n_cells=[2, 2],
                          vectors=[[1, 0], [0, 1]],
                          positions=positions,
                          neighbour_order=2,
                          boundary_condition=[True, False])

    >>> len(lattice.edges)
    22

    We can also define edges with custom interactions, as well as adding on-site potentials for the
    nodes:

    .. code-block:: python

        # defining on-site potential at each node in the unit cell
        custom_nodes = [[(0), ('X', 0.5)],
                        [(1), ('X', 0.6)],
                        [(2), ('X', 0.7)],
                        [(3), ('X', 0.8)]]

        # defining custom edges (instead of nearest-neigbour connections) and their interactions
        custom_edges = [[(0, 1), ('XX', 0.5)],
                        [(0, 2), ('YY', 0.6)],
                        [(1, 3), ('ZZ', 0.7)],
                        [(2, 3), ('ZZ', 0.7)]]

    >>> lattice = Lattice(n_cells,
    ...                   vectors,
    ...                   positions,
    ...                   custom_edges=custom_edges,
    ...                   custom_nodes=custom_nodes)
    >>> lattice.edges
    [(0, 1, ('XX', 0.5)),
    (4, 5, ('XX', 0.5)),
    (8, 9, ('XX', 0.5)),
    (12, 13, ('XX', 0.5)),
    (0, 2, ('YY', 0.6)),
    (4, 6, ('YY', 0.6)),
    (8, 10, ('YY', 0.6)),
    (12, 14, ('YY', 0.6)),
    (1, 3, ('ZZ', 0.7)),
    (5, 7, ('ZZ', 0.7)),
    (9, 11, ('ZZ', 0.7)),
    (13, 15, ('ZZ', 0.7)),
    (2, 3, ('ZZ', 0.7)),
    (6, 7, ('ZZ', 0.7)),
    (10, 11, ('ZZ', 0.7)),
    (14, 15, ('ZZ', 0.7))]

### `add_edge`

```python
def add_edge(self, edge_indices)
```

Adds a specific edge based on the site index without translating it.

Args:
  edge_indices: List of edges to be added, an edge is defined as a list of integers
       specifying the corresponding node indices.

Returns:
  Updates the edges attribute to include provided edges.

## `generate_lattice`

```python
def generate_lattice(lattice, n_cells, boundary_condition=False, neighbour_order=1)
```

Generates a :class:`~pennylane.spin.Lattice` object for a given lattice shape and number of
cells.

Args:
    lattice (str): Shape of the lattice. Input values can be ``'chain'``, ``'square'``,
        ``'rectangle'``, ``'triangle'``, ``'honeycomb'``,  ``'kagome'``, ``'lieb'``,
        ``'cubic'``, ``'bcc'``, ``'fcc'`` or ``'diamond'``.
    n_cells (list[int]): Number of cells in each direction of the grid.
    boundary_condition (bool or list[bool]): Defines boundary conditions in different lattice axes.
        Default is ``False`` indicating open boundary condition.
    neighbour_order (int): Specifies the interaction level for neighbors within the lattice.
        Default is 1, indicating nearest neighbour.

Returns:
    ~pennylane.spin.Lattice: lattice object.

**Example**

>>> shape = 'square'
>>> n_cells = [2, 2]
>>> boundary_condition = [True, False]
>>> lattice = qp.spin.generate_lattice(shape, n_cells, boundary_condition)
>>> lattice.edges
[(2, 3, 0), (0, 2, 0), (1, 3, 0), (0, 1, 0)]

.. details::
    :title: Lattice details

    The following lattice shapes are currently supported.

    * ``'chain'``: linear arrangement of sites in one dimension

    * ``'square'``: square arrangement of sites in two dimensions

    * ``'rectangle'``: rectangular arrangement of sites in two dimensions

    * ``'triangle'``: triangular arrangement of sites in two dimensions [`Phys. Rev. B 7, 5017 (1973) <https://journals.aps.org/pr/abstract/10.1103/PhysRev.79.357>`_]

    * ``'honeycomb'``: `honeycomb <https://en.wikipedia.org/wiki/Hexagonal_lattice#Honeycomb_point_set>`_ arrangement of sites in two dimensions

    * ``'kagome'``: kagome arrangement of sites in two dimensions [`Prog. Theor. Phys. 6, 306 (1951) <https://academic.oup.com/ptp/article/6/3/306/1852171>`_]

    * ``'lieb'``: Lieb arrangement of sites in two dimensions [`arXiv:1004.5172 <https://arxiv.org/abs/1004.5172>`_]

    * ``'cubic'``: `cubic <https://en.wikipedia.org/wiki/Cubic_crystal_system>`_ arrangement of sites in three dimensions

    * ``'bcc'``: `body-centered cubic <https://en.wikipedia.org/wiki/Cubic_crystal_system>`_ arrangement of sites in three dimensions

    * ``'fcc'``: `face-centered cubic <https://en.wikipedia.org/wiki/Cubic_crystal_system>`_ arrangement of sites in three dimensions

    * ``'diamond'``: `diamond <https://en.wikipedia.org/wiki/Diamond_cubic>`_ arrangement of sites in three dimensions
