---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/graph_device/graph_device.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/graph_device/graph_device.py
license: Apache-2.0
---

## `UndirectedGraphDeviceEdge`

```python
class UndirectedGraphDeviceEdge(metaclass=abc.ABCMeta)
```

An edge of an undirected graph device.

## `FixedDurationUndirectedGraphDeviceEdge`

```python
class FixedDurationUndirectedGraphDeviceEdge(UndirectedGraphDeviceEdge)
```

An edge of an undirected graph device on which every operation is
allowed and has the same duration.

## `UndirectedGraphDevice`

```python
class UndirectedGraphDevice(devices.Device)
```

A device whose properties are represented by an edge-labelled graph.

Each (undirected) edge of the device graph is labelled by an
UndirectedGraphDeviceEdge or None. None indicates that any operation is
allowed and has zero duration.

Each (undirected) edge of the constraint graph is labelled either by a
function or None. The function takes as arguments operations on the
adjacent device edges and raises an error if they are not simultaneously
executable. If None, no such operations are allowed.

Note that
    * the crosstalk graph is allowed to have vertices (i.e. device edges)
        that do not exist in the graph device.
    * duration_of does not check that operation is valid.

### `__init__`

```python
def __init__(self, device_graph: UndirectedHypergraph | None=None, crosstalk_graph: UndirectedHypergraph | None=None) -> None
```

Inits UndirectedGraphDevice.

Args:
    device_graph: An undirected hypergraph whose vertices correspond to
        qubits and whose edges determine allowable operations and their
        durations.
    crosstalk_graph: An undirected hypergraph whose vertices are edges
        of device_graph and whose edges give simultaneity constraints
        thereon.

Raises:
    TypeError: If the crosstalk graph is not a valid crosstalk graph.
