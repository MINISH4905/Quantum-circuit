---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/pauli/grouping/group_observables.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/pauli/grouping/group_observables.py
license: Apache-2.0
---

## Module `pennylane/pauli/grouping/group_observables.py`

This module contains the high-level Pauli-word-partitioning functionality used in measurement optimization.

## `PauliGroupingStrategy`

```python
class PauliGroupingStrategy
```

Class for partitioning a list of Pauli words according to some binary symmetric relation.

Partitions are defined by the binary symmetric relation of interest, e.g., all Pauli words in a
partition being mutually commuting. The partitioning is accomplished by formulating the list of
Pauli words as a graph where nodes represent Pauli words and edges between nodes denotes that
the two corresponding Pauli words satisfy the symmetric binary relation.

Obtaining the fewest number of partitions such that all Pauli terms within a partition mutually
satisfy the binary relation can then be accomplished by finding a partition of the graph nodes
such that each partition is a fully connected subgraph (a "clique"). The problem of finding the
optimal partitioning, i.e., the fewest number of cliques, is the minimum clique cover (MCC)
problem. The solution of MCC may be found by graph colouring on the complementary graph. Both
MCC and graph colouring are NP-Hard, so heuristic graph colouring algorithms are employed to
find approximate solutions in polynomial time.

Args:
    observables (list[Operator]): A list of Pauli words to be partitioned according to a
        grouping strategy.
    grouping_type (str): The binary relation used to define partitions of
        the Pauli words, can be ``'qwc'`` (qubit-wise commuting), ``'commuting'``, or
        ``'anticommuting'``.
    graph_colourer (str): The heuristic algorithm to employ for graph
        colouring, can be ``'lf'`` (Largest First), ``'rlf'`` (Recursive
        Largest First), ``'dsatur'`` (Degree of Saturation), or ``'gis'`` (IndependentSet). Defaults to ``'lf'``.

Raises:
    ValueError: If arguments specified for ``grouping_type`` or ``graph_colourer``
        are not recognized.

.. seealso:: `rustworkx.ColoringStrategy <https://www.rustworkx.org/apiref/rustworkx.ColoringStrategy.html#coloringstrategy>`_
    for more information on the ``('lf', 'dsatur', 'gis')`` strategies.

### `binary_observables`

```python
def binary_observables(self)
```

Binary Matrix corresponding to the symplectic representation of ``self.observables``.

It is an m x n matrix where each row is the symplectic (binary) representation of
``self.observables``, with ``m = len(self.observables)`` and n the
number of qubits acted on by the observables.

### `binary_repr`

```python
def binary_repr(self, n_qubits=None, wire_map=None)
```

Converts the list of Pauli words to a binary matrix,
i.e. a matrix where row m is the symplectic representation of ``self.observables[m]``.

Args:
    n_qubits (int): number of qubits to specify dimension of binary vector representation
    wire_map (dict): dictionary containing all wire labels used in the Pauli word as keys,
        and unique integer labels as their values

Returns:
    array[int]: a column matrix of the Pauli words in binary vector representation

### `adj_matrix`

```python
def adj_matrix(self) -> np.ndarray
```

Adjacency matrix for the complement of the Pauli graph determined by the ``grouping_type``.

The adjacency matrix for an undirected graph of N nodes is an N x N symmetric binary
matrix, where matrix elements of 1 denote an edge (grouping strategy is **not** satisfied), and
matrix elements of 0 denote no edge (grouping strategy is satisfied).

### `complement_graph`

```python
def complement_graph(self) -> rx.PyGraph
```

Complement graph of the (anti-)commutation graph constructed from the Pauli observables.

Edge ``(i,j)`` is present in the graph if ``observable[i]`` and ``observable[j]`` do **not** satisfy
the ``grouping_type`` strategy.

The nodes are the observables (can only be accessed through their integer index).

### `partition_observables`

```python
def partition_observables(self) -> list[list]
```

Partition the observables into groups of observables mutually satisfying the binary relation determined
by ``self.grouping_type``.

Returns:
    list[list[Operator]]: List of partitions of the Pauli observables made up of mutually (anti-)commuting
    observables.

### `idx_partitions_from_graph`

```python
def idx_partitions_from_graph(self, observables_indices=None) -> tuple[tuple[int, ...], ...]
```

Use ``Rustworkx`` graph colouring algorithms to partition the indices of the Pauli observables into
tuples containing the indices of observables satisying the binary relation determined by ``self.grouping_type``.

Args:
    observables_indices (Optional[TensorLike]): A tensor or list of indices associated to each observable.
        This argument is helpful when the observables used in the graph colouring are part of a bigger set of observables.
        Defaults to None. If ``None``, the partitions are made up of the relative indices, i.e. assuming ``self.observables``
        have indices in [0, len(observables)-1].

Raises:
    IndexError: When ``observables_indices`` is not of the same length as the observables.

Returns:
    tuple[tuple[int]]: Tuple of tuples containing the indices of the partitioned observables.

### `pauli_partitions_from_graph`

```python
def pauli_partitions_from_graph(self) -> list[list]
```

Partition Pauli observables into lists of (anti-)commuting observables
using ``Rustworkx`` graph colouring algorithms based on binary relation determined by  ``self.grouping_type``.

Returns:
    list[list[Operator]]]: List of partitions of the Pauli observables made up of mutually (anti-)commuting terms.

## `items_partitions_from_idx_partitions`

```python
def items_partitions_from_idx_partitions(items: Sequence, idx_partitions: Sequence[Sequence[int]], return_tuples: bool=False) -> Sequence[Sequence]
```

Get the partitions of the items corresponding to the partitions of the indices.

Args:
    items (Sequence): A Sequence of items to be partitioned according to the partition of the indices.
    idx_partitions (Sequence[Sequence[int]]): Sequence of sequences containing the indices of the partitioned items.
    return_tuples (bool): Whether to return tuples of tuples or list of lists.
        Useful when dealing with indices or observables.
Returns:
    Sequence[Sequence]: Sequence of partitions of the items according to the partition of the indices.

## `compute_partition_indices`

```python
def compute_partition_indices(observables: list, grouping_type: str='qwc', method: str='lf') -> tuple[tuple[int]]
```

Computes the partition indices of a list of observables using a specified grouping type
and graph colouring method.

Args:
    observables (list[Operator]): A list of Pauli operators to be partitioned.
    grouping_type (str): The type of binary relation between Pauli observables.
        It can be ``'qwc'``, ``'commuting'``, or ``'anticommuting'``. Defaults to ``'qwc'``.
    method (str): The graph colouring heuristic to use in solving minimum clique cover.
        It can be ``'lf'`` (Largest First), ``'rlf'`` (Recursive Largest First), ``'dsatur'`` (Degree of Saturation),
        or ``'gis'`` (Greedy Independent Set). Defaults to ``'lf'``.

Returns:
    tuple[tuple[int]]: A tuple of tuples where each inner tuple contains the indices of
    observables that are grouped together according to the specified grouping type and
    graph colouring method.

.. seealso:: `rustworkx.ColoringStrategy <https://www.rustworkx.org/apiref/rustworkx.ColoringStrategy.html#coloringstrategy>`_
    for more information on the ``('lf', 'dsatur', 'gis')`` strategies.

**Example**

>>> from pennylane.pauli import compute_partition_indices
>>> observables = [qp.X(0) @ qp.Z(1), qp.Z(0), qp.X(1)]
>>> compute_partition_indices(observables, grouping_type="qwc", method="lf")
((0,), (1, 2))

## `group_observables`

```python
def group_observables(observables: list['qp.operation.Operator'], coefficients: TensorLike | None=None, grouping_type: Literal['qwc', 'commuting', 'anticommuting']='qwc', method: Literal['lf', 'rlf', 'dsatur', 'gis']='lf')
```

Partitions a list of observables (Pauli operations and tensor products thereof) into
groupings according to a binary relation (qubit-wise commuting, fully-commuting, or
anticommuting).

Partitions are found by 1) mapping the list of observables to a graph where vertices represent
observables and edges encode the binary relation, then 2) solving minimum clique cover for the
graph using graph-colouring heuristic algorithms.

Args:
    observables (list[Operator]): a list of Pauli word ``Operator`` instances (Pauli
        operation instances and tensor products thereof)
    coefficients (TensorLike): A tensor or list of coefficients. If not specified,
        output ``partitioned_coeffs`` is not returned.
    grouping_type (str): The type of binary relation between Pauli words.
        It can be ``'qwc'``, ``'commuting'``, or ``'anticommuting'``.
    method (str): The graph colouring heuristic to use in solving minimum clique cover, which
        can be ``'lf'`` (Largest First), ``'rlf'`` (Recursive Largest First),
        ``'dsatur'`` (Degree of Saturation), or ``'gis'`` (IndependentSet). Defaults to ``'lf'``.

Returns:
   tuple:

       * list[list[Operator]]: A list of the obtained groupings. Each grouping
         is itself a list of Pauli word ``Operator`` instances.
       * list[TensorLike]: A list of coefficient groupings. Each coefficient
         grouping is itself a tensor or list of the grouping's corresponding coefficients. This is only
         returned if coefficients are specified.

Raises:
    IndexError: if the input list of coefficients is not of the same length as the input list
        of Pauli words

.. seealso:: `rustworkx.ColoringStrategy <https://www.rustworkx.org/apiref/rustworkx.ColoringStrategy.html#coloringstrategy>`_
    for more information on the ``('lf', 'dsatur', 'gis')`` strategies.

**Example**

>>> from pennylane.pauli import group_observables
>>> obs = [qp.Y(0), qp.X(0) @ qp.X(1), qp.Z(1)]
>>> coeffs = [1.43, 4.21, 0.97]
>>> obs_groupings, coeffs_groupings = group_observables(obs, coeffs, 'anticommuting', 'lf')
>>> obs_groupings
[[Y(0), X(0) @ X(1)], [Z(1)]]
>>> coeffs_groupings
[[np.float64(1.43), np.float64(4.21)], [np.float64(0.97)]]
