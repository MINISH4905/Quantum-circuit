---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/acquaintance/permutation.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/acquaintance/permutation.py
license: Apache-2.0
---

## `PermutationGate`

```python
class PermutationGate(ops.Gate, metaclass=abc.ABCMeta)
```

A permutation gate indicates a change in the mapping from qubits to
logical indices.

Args:
    num_qubits: The number of qubits the gate should act on.
    swap_gate: The gate that swaps the indices mapped to by a pair of
        qubits (e.g. SWAP or fermionic swap).

### `permutation`

```python
def permutation(self) -> dict[int, int]
```

permutation = {i: s[i]} indicates that the i-th element is mapped to
the s[i]-th element.

### `update_mapping`

```python
def update_mapping(self, mapping: dict[ops.Qid, LogicalIndex], keys: Sequence[cirq.Qid]) -> None
```

Updates a mapping (in place) from qubits to logical indices.

Args:
    mapping: The mapping to update.
    keys: The qubits acted on by the gate.

## `MappingDisplayGate`

```python
class MappingDisplayGate(ops.Gate)
```

Displays the indices mapped to a set of wires.

## `display_mapping`

```python
def display_mapping(circuit: cirq.Circuit, initial_mapping: LogicalMapping) -> None
```

Inserts display gates between moments to indicate the mapping throughout
the circuit.

## `SwapPermutationGate`

```python
class SwapPermutationGate(PermutationGate)
```

Generic swap gate.

## `LinearPermutationGate`

```python
class LinearPermutationGate(PermutationGate)
```

A permutation gate that decomposes a given permutation using a linear
sorting network.

### `__init__`

```python
def __init__(self, num_qubits: int, permutation: dict[int, int], swap_gate: cirq.Gate=ops.SWAP) -> None
```

Initializes a linear permutation gate.

Args:
    num_qubits: The number of qubits to permute.
    permutation: The permutation effected by the gate.
    swap_gate: The swap gate used in decompositions.

## `update_mapping`

```python
def update_mapping(mapping: dict[ops.Qid, LogicalIndex], operations: cirq.OP_TREE) -> None
```

Updates a mapping (in place) from qubits to logical indices according to
a set of permutation gates. Any gates other than permutation gates are
ignored.

Args:
    mapping: The mapping to update.
    operations: The operations to update according to.

## `get_logical_operations`

```python
def get_logical_operations(operations: cirq.OP_TREE, initial_mapping: dict[ops.Qid, ops.Qid]) -> Iterable[cirq.Operation]
```

Gets the logical operations specified by the physical operations and
initial mapping.

Args:
    operations: The physical operations.
    initial_mapping: The initial mapping of physical to logical qubits.

Raises:
    ValueError: A non-permutation physical operation acts on an unmapped
        qubit.
