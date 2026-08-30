---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/devices/grid_device_metadata.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/devices/grid_device_metadata.py
license: Apache-2.0
---

## Module `cirq-core/cirq/devices/grid_device_metadata.py`

Metadata subtype for 2D Homogenous devices.

## `GridDeviceMetadata`

```python
class GridDeviceMetadata(device.DeviceMetadata)
```

Hardware metadata for homogenous 2d symmetric grid devices.

### `__init__`

```python
def __init__(self, qubit_pairs: Iterable[tuple[cirq.GridQubit, cirq.GridQubit]], gateset: cirq.Gateset, gate_durations: Mapping[cirq.GateFamily, cirq.Duration] | None=None, all_qubits: Iterable[cirq.GridQubit] | None=None, compilation_target_gatesets: Iterable[cirq.CompilationTargetGateset]=(), qubit_attributes: Mapping[cirq.GridQubit, Mapping[str, QubitAttributeValue]] | None=None)
```

Create a GridDeviceMetadata object.

Create a grid device which has a well defined set of couplable
qubit pairs that have the same two qubit gates available in
both coupling directions. Gate times (if provided) are expected
to be uniform across all qubits on the device.

Args:
    qubit_pairs: Iterable of pairs of `cirq.GridQubit`s representing
        bi-directional couplings.
    gateset: `cirq.Gateset` indicating gates supported
        everywhere on the device.
    gate_durations: Optional dictionary of `cirq.GateFamily`
        instances mapping to `cirq.Duration` instances for
        gate timing metadata information. If provided,
        all keys must exist in gateset.
    all_qubits: Optional iterable specifying all qubits
        found on the device. If None, all_qubits will
        be inferred from the entries in qubit_pairs.
    compilation_target_gatesets: A collection of valid
        `cirq.CompilationTargetGateset`s which can be used to
        transform circuits into ones that consist of only
        operations in `gateset`.
    qubit_attributes: Optional dictionary mapping each `cirq.GridQubit`
        to a dictionary of its attribute names and values.

Raises:
    ValueError: if some GateFamily keys in gate_durations are
        not in gateset.
    ValueError: If qubit_pairs contains a self loop.
    ValueError: if all_qubits is provided and is not a superset
        of all the qubits found in qubit_pairs.

### `qubit_set`

```python
def qubit_set(self) -> frozenset[cirq.GridQubit]
```

Returns the set of grid qubits on the device.

Returns:
    Frozenset of qubits on device.

### `qubit_pairs`

```python
def qubit_pairs(self) -> frozenset[frozenset[cirq.GridQubit]]
```

Returns the set of all couple-able qubits on the device.

Each element in the outer frozenset is a 2-element frozenset representing a bidirectional
pair.

### `isolated_qubits`

```python
def isolated_qubits(self) -> frozenset[cirq.GridQubit]
```

Returns the set of all isolated qubits on the device (if applicable).

### `gateset`

```python
def gateset(self) -> cirq.Gateset
```

Returns the `cirq.Gateset` of supported gates on this device.

### `compilation_target_gatesets`

```python
def compilation_target_gatesets(self) -> tuple[cirq.CompilationTargetGateset, ...]
```

Returns a sequence of valid `cirq.CompilationTargetGateset`s for this device.

### `gate_durations`

```python
def gate_durations(self) -> Mapping[cirq.GateFamily, cirq.Duration] | None
```

Get a dictionary mapping from gate family to duration for gates.

To look up the duration of a specific gate instance / gate type / operation which is part of
the device's gateset, you can search for its corresponding GateFamily. For example:

>>> gateset = cirq.Gateset(cirq.ZPowGate)
>>> durations = {cirq.GateFamily(cirq.ZPowGate): cirq.Duration(nanos=1)}
>>> grid_device_metadata = cirq.GridDeviceMetadata((), gateset, durations)
>>>
>>> my_gate = cirq.Z
>>> gate_durations = grid_device_metadata.gate_durations
>>> gate_duration = None
>>> for gate_family in gate_durations:
...     if my_gate in gate_family:
...         gate_duration = gate_durations[gate_family]
...
>>> print(gate_duration)
1 ns

### `qubit_attributes`

```python
def qubit_attributes(self) -> Mapping[cirq.GridQubit, Mapping[str, QubitAttributeValue]]
```

Returns a mapping from qubit to its attributes (if applicable).
