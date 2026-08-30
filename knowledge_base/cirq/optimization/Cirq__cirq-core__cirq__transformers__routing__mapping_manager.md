---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/routing/mapping_manager.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/routing/mapping_manager.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/routing/mapping_manager.py`

Manages the mapping from logical to physical qubits during a routing procedure.

## `MappingManager`

```python
class MappingManager
```

Class that manages the mapping from logical to physical qubits.

For efficiency, the mapping manager maps all logical and physical qubits to integers, and
maintains a mapping from logical qubit integers to physical qubit integers. This speedup is
important to avoid qubit hashing in hot-paths like querying distance of two logical qubits
on the device (via `dist_on_device` method).

All public methods of this class expect logical qubits (or corresponding integers that the
logical qubits are mapped to, via `self.logical_qid_to_int` map).

### `__init__`

```python
def __init__(self, device_graph: nx.Graph, initial_mapping: dict[cirq.Qid, cirq.Qid]) -> None
```

Initializes MappingManager.

Args:
    device_graph: connectivity graph of qubits in the hardware device.
    initial_mapping: the initial mapping of logical (keys) to physical qubits (values).

### `physical_qid_to_int`

```python
def physical_qid_to_int(self) -> dict[cirq.Qid, int]
```

Mapping of physical qubits, that were part of the initial mapping, to unique integers.

### `int_to_physical_qid`

```python
def int_to_physical_qid(self) -> list[cirq.Qid]
```

Inverse mapping of unique integers to corresponding physical qubits.

`self.physical_qid_to_int[self.int_to_physical_qid[i]] == i` for each i.

### `logical_qid_to_int`

```python
def logical_qid_to_int(self) -> dict[cirq.Qid, int]
```

Mapping of logical qubits, that were part of the initial mapping, to unique integers.

### `int_to_logical_qid`

```python
def int_to_logical_qid(self) -> list[cirq.Qid]
```

Inverse mapping of unique integers to corresponding physical qubits.

`self.logical_qid_to_int[self.int_to_logical_qid[i]] == i` for each i.

### `logical_to_physical`

```python
def logical_to_physical(self) -> np.ndarray
```

The mapping of logical qubit integers to physical qubit integers.

Let `lq: cirq.Qid` be a logical qubit. Then the corresponding physical qubit that it
maps to can be obtained by:
`self.int_to_physical_qid[self.logical_to_physical[self.logical_qid_to_int[lq]]]`

### `physical_to_logical`

```python
def physical_to_logical(self) -> np.ndarray
```

The mapping of physical qubits integers to logical qubits integers.

Let `pq: cirq.Qid` be a physical qubit. Then the corresponding logical qubit that it
maps to can be obtained by:
`self.int_to_logical_qid[self.physical_to_logical[self.physical_qid_to_int[pq]]]`

### `induced_subgraph_int`

```python
def induced_subgraph_int(self) -> nx.Graph
```

Induced subgraph on physical qubit integers present in `self.logical_to_physical`.

### `dist_on_device`

```python
def dist_on_device(self, lq1: int, lq2: int, *, undirected=False) -> int
```

Finds distance between logical qubits 'lq1' and 'lq2' on the device.

Args:
    lq1: integer corresponding to the first logical qubit.
    lq2: integer corresponding to the second logical qubit.
    undirected: when True compute the distance assuming bidirectional
        edges between connected qubits.

Returns:
    The shortest path distance.

### `is_adjacent`

```python
def is_adjacent(self, lq1: int, lq2: int) -> bool
```

Finds whether logical qubits `lq1` and `lq2` are adjacent on the device.

Args:
    lq1: integer corresponding to the first logical qubit.
    lq2: integer corresponding to the second logical qubit.

Returns:
    True, if physical qubits corresponding to `lq1` and `lq2` are adjacent on
    the device.

### `apply_swap`

```python
def apply_swap(self, lq1: int, lq2: int) -> None
```

Updates the mapping to simulate inserting a swap operation between `lq1` and `lq2`.

Args:
    lq1: integer corresponding to the first logical qubit.
    lq2: integer corresponding to the second logical qubit.

Raises:
    ValueError: whenever lq1 and lq2 are not adjacent on the device.

### `mapped_op`

```python
def mapped_op(self, op: cirq.Operation) -> cirq.Operation
```

Transforms the given logical operation to act on corresponding physical qubits.

Args:
    op: logical operation acting on logical qubits.

Returns:
    The same operation acting on corresponding physical qubits.

### `shortest_path`

```python
def shortest_path(self, lq1: int, lq2: int, *, undirected=False) -> Sequence[int]
```

Find the shortest path between two logical qubits on the device, given their mapping.

Args:
    lq1: integer corresponding to the first logical qubit.
    lq2: integer corresponding to the second logical qubit.
    undirected: when True find the shortest path assuming bidirectional edges
        between connected qubits.

Returns:
    A sequence of logical qubit integers on the shortest path from `lq1` to `lq2`.
