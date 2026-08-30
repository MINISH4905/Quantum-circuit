---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/routing/line_initial_mapper.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/routing/line_initial_mapper.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/routing/line_initial_mapper.py`

Maps logical to physical qubits by greedily placing lines of logical qubits on the device.

This is the default placement strategy used in the CQC router.

It first creates a partial connectivity graph between logical qubits in the given circuit and then
maps these logical qubits on physical qubits on the device by starting at the center of the device
and greedily choosing the highest degree neighbor.

If some logical qubits are unampped after this first procedure then there are two cases:
    (1) These unmammep logical qubits do interact in the circuit with some other logical partner.
    In this case we map such a qubit to the nearest available physical qubit on the device to the
    one that its partner was mapped to.

    (2) These unampped logical qubits only have single qubit operations on them (i.e they do not
    interact with any other logical qubit at any point in the circuit). In this case we map them to
    the nearest available neighbor to the center of the device.

## `LineInitialMapper`

```python
class LineInitialMapper(initial_mapper.AbstractInitialMapper)
```

Places logical qubits in the circuit onto physical qubits on the device.

Starting from the center physical qubit on the device, attempts to map disjoint lines of
logical qubits given by the circuit graph onto one long line of physical qubits on the
device, greedily maximizing each physical qubit's degree.
If this mapping cannot be completed as one long line of qubits in the circuit graph mapped
to qubits in the device graph, the line can be split as several line segments and then we:
    (i)   Map first line segment.
    (ii)  Find another high degree vertex in G near the center.
    (iii) Map the second line segment
    (iv)  etc.
A line is split by mapping the next logical qubit to the nearest available physical qubit
to the center of the device graph.

The expected runtime of this strategy is O(m logn + n^2) where m is the # of operations in the
given circuit and n is the number of qubits. The first term corresponds to the runtime of
'make_circuit_graph()' and the second for 'initial_mapping()'.

### `__init__`

```python
def __init__(self, device_graph: nx.Graph) -> None
```

Initializes a LineInitialMapper.

Args:
    device_graph: device graph

### `initial_mapping`

```python
def initial_mapping(self, circuit: cirq.AbstractCircuit) -> dict[cirq.Qid, cirq.Qid]
```

Maps disjoint lines of logical qubits onto lines of physical qubits.

Args:
    circuit: the input circuit with logical qubits

Returns:
    a dictionary that maps logical qubits in the circuit (keys) to physical qubits on the
    device (values).
