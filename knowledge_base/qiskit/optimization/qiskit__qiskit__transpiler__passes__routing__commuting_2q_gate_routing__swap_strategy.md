---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/routing/commuting_2q_gate_routing/swap_strategy.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/routing/commuting_2q_gate_routing/swap_strategy.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/routing/commuting_2q_gate_routing/swap_strategy.py`

Defines a swap strategy class.

## `SwapStrategy`

```python
class SwapStrategy
```

A class representing swap strategies for coupling maps.

A swap strategy is a tuple of swap layers to apply to the coupling map to
route blocks of commuting two-qubit gates. Each swap layer is specified by a set of tuples
which correspond to the edges of the coupling map that are swapped. At each swap layer
SWAP gates are applied to the corresponding edges. These SWAP gates must be executable in
parallel. This means that a qubit can only be present once in a swap layer. For example, the
following swap layers represent the optimal swap strategy for a line with five qubits

.. code-block:: text

    (
        ((0, 1), (2, 3)),  # Swap layer no. 1
        ((1, 2), (3, 4)),  # Swap layer no. 2
        ((0, 1), (2, 3)),  # Swap layer no. 3
    )

This strategy is optimal in the sense that it reaches full qubit-connectivity in the least
amount of swap gates. More generally, a swap strategy is optimal for a given block of
commuting two-qubit gates and a given coupling map if it minimizes the number of gates
applied when routing the commuting two-qubit gates to the coupling map. Finding the optimal
swap strategy is a non-trivial problem but can be done for certain coupling maps such as a
line coupling map. This class stores the permutations of the qubits resulting from the swap
strategy. See https://arxiv.org/abs/2202.03459 for more details.

### `__init__`

```python
def __init__(self, coupling_map: CouplingMap, swap_layers: tuple[tuple[tuple[int, int], ...], ...]) -> None
```

Args:
    coupling_map: The coupling map the strategy is implemented for.
    swap_layers: The swap layers of the strategy, specified as tuple of swap layers.
        Each swap layer is a tuple of edges to which swaps are applied simultaneously.
        Each swap is specified as an edge which is a tuple of two integers.

Raises:
    QiskitError: If the coupling map is not specified.
    QiskitError: if the swap strategy is not valid. A swap strategy is valid if all
        swap gates, specified as tuples, are contained in the edge set of the coupling map.
        A swap strategy is also invalid if a layer has multiple swaps on the same qubit.

### `from_line`

```python
def from_line(cls, line: list[int], num_swap_layers: int | None=None) -> SwapStrategy
```

Creates a swap strategy for a line graph with the specified number of SWAP layers.

This SWAP strategy will use the full line if instructed to do so (i.e. num_variables
is None or equal to num_vertices). If instructed otherwise then the first num_variables
nodes of the line will be used in the swap strategy.

Args:
    line: A line given as a list of nodes, e.g. ``[0, 2, 3, 4]``.
    num_swap_layers: Number of swap layers the swap manager should be initialized with.

Returns:
    A swap strategy that reaches full connectivity on a linear coupling map.

Raises:
    ValueError: If the ``num_swap_layers`` is negative.
    ValueError: If the ``line`` has less than 2 elements and no swap strategy can be applied.

### `__len__`

```python
def __len__(self) -> int
```

Return the length of the strategy as the number of layers.

Returns:
    The number of layers of the swap strategy.

### `__repr__`

```python
def __repr__(self) -> str
```

Representation of the swap strategy.

Returns:
    The representation of the swap strategy.

### `swap_layer`

```python
def swap_layer(self, idx: int) -> list[tuple[int, int]]
```

Return the layer of swaps at the given index.

Args:
    idx: The index of the returned swap layer.

Returns:
    A copy of the swap layer at ``idx`` to avoid any unintentional modification to
    the swap strategy.

### `distance_matrix`

```python
def distance_matrix(self) -> np.ndarray
```

A matrix describing when qubits become adjacent in the swap strategy.

Returns:
    The distance matrix for the SWAP strategy as an array that cannot be written to. Here,
    the entry (i, j) corresponds to the number of SWAP layers that need to be applied to
    obtain a connection between physical qubits i and j.

### `new_connections`

```python
def new_connections(self, idx: int) -> list[set[int]]
```

Returns the new connections obtained after applying the SWAP layer specified by idx, i.e.
a list of qubit pairs that are adjacent to one another after idx steps of the SWAP strategy.

Args:
    idx: The index of the SWAP layer. 1 refers to the first SWAP layer whereas an ``idx``
        of 0 will return the connections present in the original coupling map.

Returns:
    A list of edges representing the new qubit connections.

### `possible_edges`

```python
def possible_edges(self) -> set[tuple[int, int]]
```

Return the qubit connections that can be generated.

Returns:
    The qubit connections that can be accommodated by the swap strategy.

### `missing_couplings`

```python
def missing_couplings(self) -> set[tuple[int, int]]
```

Return the set of couplings that cannot be reached.

Returns:
    The couplings that cannot be reached as a set of Tuples of int. Here,
    each int corresponds to a qubit in the coupling map.

### `swapped_coupling_map`

```python
def swapped_coupling_map(self, idx: int) -> CouplingMap
```

Returns the coupling map after applying ``idx`` swap layers of strategy.

Args:
    idx: The number of swap layers to apply. For idx = 0, the original coupling
        map is returned.

Returns:
    The swapped coupling map.

### `apply_swap_layer`

```python
def apply_swap_layer(self, list_to_swap: list[Any], idx: int, inplace: bool=False) -> list[Any]
```

Permute the elements of ``list_to_swap`` based on layer indexed by ``idx``.

Args:
    list_to_swap: The list of elements to swap.
    idx: The index of the swap layer to apply.
    inplace: A boolean which if set to True will modify the list inplace. By default
        this value is False.

Returns:
    The list with swapped elements

### `inverse_composed_permutation`

```python
def inverse_composed_permutation(self, idx: int) -> list[int]
```

Returns the inversed composed permutation of all swap layers applied up to layer
``idx``. Permutations are represented by list of integers where the ith element
corresponds to the mapping of i under the permutation.

Args:
    idx: The number of swap layers to apply.

Returns:
    The inversed permutation as a list of integer values.
