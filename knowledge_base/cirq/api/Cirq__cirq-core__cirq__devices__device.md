---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/devices/device.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/devices/device.py
license: Apache-2.0
---

## `Device`

```python
class Device(metaclass=abc.ABCMeta)
```

Hardware constraints for validating circuits.

This class is an interface for representing constraints and
structures of quantum hardware devices.

This interface is split into two parts: validation and
exploration.  The primary responsibility of this class
is to validate circuits (ie. can this device execute the
circuit as-is?).  The secondary responsibility of the class
is to provide additional information about the device
such as the qubits on the device and their connectivity.
These 'exploratory' attributes are all contained within
the `metadata` attribute.

Implementors of this class should, at minimum, define
the `validate_operation` method.  If the device has more
global constraints (such as not allowing adjacent operations
or having a maximum depth), then `validate_moment` and
`validate_circuit` can also be defined.  If not specified,
these methods default to calling `validate_operation` on each
operation in each moment.

Optionally, implementors may implement a `metadata` function
that contains information about the device.  It is recommended
(but not required) to specify the qubits and connectivity
using a `cirq.DeviceMetadata` object.   This class can also be
sub-classed to give more detailed information, such as gate
durations, gate sets, compilation targets,
vendor-specific information, and other attributes.

### `metadata`

```python
def metadata(self) -> DeviceMetadata | None
```

Returns the associated Metadata with the device if applicable.

Returns:
    `cirq.DeviceMetadata` if specified by the device otherwise None.

### `validate_operation`

```python
def validate_operation(self, operation: cirq.Operation) -> None
```

Raises an exception if an operation is not valid.

Args:
    operation: The operation to validate.

Raises:
    ValueError: The operation isn't valid for this device.

### `validate_circuit`

```python
def validate_circuit(self, circuit: cirq.AbstractCircuit) -> None
```

Raises an exception if a circuit is not valid.

Args:
    circuit: The circuit to validate.

Raises:
    ValueError: The circuit isn't valid for this device.

### `validate_moment`

```python
def validate_moment(self, moment: cirq.Moment) -> None
```

Raises an exception if a moment is not valid.

Args:
    moment: The moment to validate.

Raises:
    ValueError: The moment isn't valid for this device.

## `DeviceMetadata`

```python
class DeviceMetadata
```

Parent type for all device specific metadata classes.

### `__init__`

```python
def __init__(self, qubits: Iterable[cirq.Qid], nx_graph: nx.Graph)
```

Construct a DeviceMetadata object.

Args:
    qubits: Iterable of `cirq.Qid`s that exist on the device.
    nx_graph: `nx.Graph` describing qubit connectivity
        on a device. Nodes represent qubits, directed edges indicate
        directional coupling, undirected edges indicate bi-directional
        coupling.

### `qubit_set`

```python
def qubit_set(self) -> frozenset[cirq.Qid]
```

Returns the set of qubits on the device.

Returns:
    Frozenset of qubits on device.

### `nx_graph`

```python
def nx_graph(self) -> nx.Graph
```

Returns a nx.Graph where nodes are qubits and edges are couple-able qubits.

Returns:
    `nx.Graph` of device connectivity.
