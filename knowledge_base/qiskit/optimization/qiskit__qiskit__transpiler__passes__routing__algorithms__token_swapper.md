---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/routing/algorithms/token_swapper.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/routing/algorithms/token_swapper.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/routing/algorithms/token_swapper.py`

Permutation algorithms for general graphs.

## `ApproximateTokenSwapper`

```python
class ApproximateTokenSwapper
```

A class for computing approximate solutions to the Token Swapping problem.

Internally caches the graph and associated datastructures for re-use.

### `__init__`

```python
def __init__(self, graph: rx.PyGraph, seed: int | np.random.Generator | None=None) -> None
```

Construct an ApproximateTokenSwapping object.

Args:
    graph: Undirected graph representing a coupling map.
    seed: Seed to use for random trials.

### `distance`

```python
def distance(self, vertex0: int, vertex1: int) -> int
```

Compute the distance between two nodes in `graph`.

### `permutation_circuit`

```python
def permutation_circuit(self, permutation: Permutation, trials: int=4) -> PermutationCircuit
```

Perform an approximately optimal Token Swapping algorithm to implement the permutation.

Args:
  permutation: The partial mapping to implement in swaps.
  trials: The number of trials to try to perform the mapping. Minimize over the trials.

Returns:
  The circuit to implement the permutation

### `map`

```python
def map(self, mapping: Mapping[int, int], trials: int=4, parallel_threshold: int=50) -> list[Swap[int]]
```

Perform an approximately optimal Token Swapping algorithm to implement the permutation.

Supports partial mappings (i.e. not-permutations) for graphs with missing tokens.

Based on the paper: Approximation and Hardness for Token Swapping by Miltzow et al. (2016)
ArXiV: https://arxiv.org/abs/1602.05150
and generalization based on our own work.

Args:
  mapping: The partial mapping to implement in swaps.
  trials: The number of trials to try to perform the mapping. Minimize over the trials.
  parallel_threshold: The number of nodes in the graph beyond which the algorithm
        will use parallel processing

Returns:
  The swaps to implement the mapping
