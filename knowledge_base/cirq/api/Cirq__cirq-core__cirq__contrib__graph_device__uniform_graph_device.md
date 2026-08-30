---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/graph_device/uniform_graph_device.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/graph_device/uniform_graph_device.py
license: Apache-2.0
---

## `uniform_undirected_graph_device`

```python
def uniform_undirected_graph_device(edges: Iterable[Iterable[ops.Qid]], edge_label: UndirectedGraphDeviceEdge | None=None) -> UndirectedGraphDevice
```

An undirected graph device all of whose edges are the same.

Args:
    edges: The edges.
    edge_label: The label to apply to all edges. Defaults to None.

## `uniform_undirected_linear_device`

```python
def uniform_undirected_linear_device(n_qubits: int, edge_labels: Mapping[int, UndirectedGraphDeviceEdge | None]) -> UndirectedGraphDevice
```

A uniform , undirected graph device whose qubits are arranged
on a line.

Uniformity refers to the fact that all edges of the same size have the same
label.

Args:
    n_qubits: The number of qubits.
    edge_labels: The labels to apply to all edges of a given size.

Raises:
    ValueError: keys to edge_labels are not all at least 1.
