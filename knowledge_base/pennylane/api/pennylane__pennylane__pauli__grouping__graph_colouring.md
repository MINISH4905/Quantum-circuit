---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/pauli/grouping/graph_colouring.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/pauli/grouping/graph_colouring.py
license: Apache-2.0
---

## Module `pennylane/pauli/grouping/graph_colouring.py`

A module for heuristic algorithms for colouring Pauli graphs.

A Pauli graph is a graph where vertices represent Pauli words and edges denote
if a specified symmetric binary relation (e.g., commutation) is satisfied for the
corresponding Pauli words. The graph-colouring problem is to assign a colour to
each vertex such that no vertices of the same colour are connected, using the
fewest number of colours (lowest "chromatic number") as possible.

## `largest_first`

```python
def largest_first(binary_observables, adj)
```

Performs graph-colouring using the Largest Degree First heuristic. Runtime is quadratic in
number of vertices.

Args:
    binary_observables (array[int]): the set of Pauli words represented by a column matrix
        of the Pauli words in binary vector representation
    adj (array[int]): the adjacency matrix of the Pauli graph

Returns:
    dict(int, list[array[int]]): keys correspond to colours (labelled by integers) and values
    are lists of Pauli words of the same colour in binary vector representation.

**Example**

>>> binary_observables = np.array([[1., 1., 0.],
... [1., 0., 0.],
... [0., 0., 1.],
... [1., 0., 1.]])
>>> adj = np.array([[0., 0., 1.],
... [0., 0., 1.],
... [1., 1., 0.]])
>>> largest_first(binary_observables, adj)
{np.int64(1): [array([0., 0., 1.])], np.int64(2): [array([1., 0., 0.]), array([1., 1., 0.])]}

## `recursive_largest_first`

```python
def recursive_largest_first(binary_observables, adj)
```

Performs graph-colouring using the Recursive Largest Degree First heuristic. Often yields a
lower chromatic number than Largest Degree First, but takes longer (runtime is cubic in number
of vertices).

Args:
    binary_observables (array[int]): the set of Pauli words represented by a column matrix of
        the Pauli words in binary vector representation
    adj (array[int]): the adjacency matrix of the Pauli graph

Returns:
    dict(int, list[array[int]]): keys correspond to colours (labelled by integers) and values
    are lists of Pauli words of the same colour in binary vector representation

**Example**

>>> binary_observables = np.array([[1., 1., 0.],
... [1., 0., 0.],
... [0., 0., 1.],
... [1., 0., 1.]])
>>> adj = np.array([[0., 0., 1.],
... [0., 0., 1.],
... [1., 1., 0.]])
>>> recursive_largest_first(binary_observables, adj)
{1: [array([0., 0., 1.])], 2: [array([1., 1., 0.]), array([1., 0., 0.])]}
