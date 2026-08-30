---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/routing/initial_mapper.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/routing/initial_mapper.py
license: Apache-2.0
---

## `AbstractInitialMapper`

```python
class AbstractInitialMapper(metaclass=abc.ABCMeta)
```

Base class for creating custom initial mapping strategies.

An initial mapping strategy is a placement strategy that places logical qubit variables in an
input circuit onto physical qubits that correspond to a specified device. This placment can be
thought of as a mapping k -> m[k] where k is a logical qubit and m[k] is the physical qubit it
is mapped to. Any initial mapping strategy must satisfy two constraints:
    1. all logical qubits must be placed on the device if the number of logical qubits is <=
        than the number of physical qubits.
    2. if two logical qubits interact (i.e. there exists a 2-qubit operation on them) at any
        point in the input circuit, then they must lie in the same connected components of the
        device graph induced on the physical qubits in the initial mapping.

### `initial_mapping`

```python
def initial_mapping(self, circuit: cirq.AbstractCircuit) -> dict[cirq.Qid, cirq.Qid]
```

Maps the logical qubits of a circuit onto physical qubits on a device.

Args:
    circuit: the input circuit with logical qubits.

Returns:
  qubit_map: the initial mapping of logical qubits to physical qubits.

## `HardCodedInitialMapper`

```python
class HardCodedInitialMapper(AbstractInitialMapper)
```

Initial Mapper class takes a hard-coded mapping and returns it.

### `initial_mapping`

```python
def initial_mapping(self, circuit: cirq.AbstractCircuit) -> dict[cirq.Qid, cirq.Qid]
```

Returns the hard-coded initial mapping.

Args:
    circuit: the input circuit with logical qubits.

Returns:
    the hard-codded initial mapping.

Raises:
    ValueError: if the qubits in circuit are not a subset of the qubit keys in the mapping.
