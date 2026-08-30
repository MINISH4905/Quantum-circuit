---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/routing/device.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/routing/device.py
license: Apache-2.0
---

## `get_linear_device_graph`

```python
def get_linear_device_graph(n_qubits: int) -> nx.Graph
```

Gets the graph of a linearly connected device.

## `get_grid_device_graph`

```python
def get_grid_device_graph(*args, **kwargs) -> nx.Graph
```

Gets the graph of a grid of qubits.

See GridQubit.rect for argument details.

## `gridqubits_to_graph_device`

```python
def gridqubits_to_graph_device(qubits: Iterable[cirq.GridQubit]) -> nx.Graph
```

Gets the graph of a set of grid qubits.

## `nx_qubit_layout`

```python
def nx_qubit_layout(graph: nx.Graph) -> dict[cirq.Qid, tuple[float, float]]
```

Return a layout for a graph for nodes which are qubits.

This can be used in place of nx.spring_layout or other networkx layouts.
GridQubits are positioned according to their row/col. LineQubits are
positioned in a line.

>>> import cirq.contrib.routing as ccr
>>> import networkx as nx
>>> import matplotlib.pyplot as plt
>>> # Clear plot state to prevent issues with pyplot dimensionality.
>>> plt.clf()
>>> g = ccr.gridqubits_to_graph_device(cirq.GridQubit.rect(4,5))
>>> pos = ccr.nx_qubit_layout(g)
>>> nx.draw_networkx(g, pos=pos)
