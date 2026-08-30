---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/circuits/frozen_circuit.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/circuits/frozen_circuit.py
license: Apache-2.0
---

## Module `cirq-core/cirq/circuits/frozen_circuit.py`

An immutable version of the Circuit data structure.

## `FrozenCircuit`

```python
class FrozenCircuit(AbstractCircuit, protocols.SerializableByKey)
```

An immutable version of the Circuit data structure.

FrozenCircuits are immutable (and therefore hashable), but otherwise behave
identically to regular Circuits. Conversion between the two is handled with
the `freeze` and `unfreeze` methods from AbstractCircuit.

### `__init__`

```python
def __init__(self, *contents: cirq.OP_TREE, strategy: cirq.InsertStrategy=InsertStrategy.EARLIEST, tags: Sequence[Hashable]=()) -> None
```

Initializes a frozen circuit.

Args:
    contents: The initial list of moments and operations defining the
        circuit. You can also pass in operations, lists of operations,
        or generally anything meeting the `cirq.OP_TREE` contract.
        Non-moment entries will be inserted according to the specified
        insertion strategy.
    strategy: When initializing the circuit with operations and moments
        from `contents`, this determines how the operations are packed
        together.
    tags: A sequence of any type of object that is useful to attach metadata
        to this circuit as long as the type is hashable.  If you wish the
        resulting circuit to be eventually serialized into JSON, you should
        also restrict the tags to be JSON serializable.

### `tags`

```python
def tags(self) -> tuple[Hashable, ...]
```

Returns a tuple of the Circuit's tags.

### `with_tags`

```python
def with_tags(self, *new_tags: Hashable) -> cirq.FrozenCircuit
```

Creates a new tagged `FrozenCircuit` with `self.tags` and `new_tags` combined.

### `to_op`

```python
def to_op(self) -> cirq.CircuitOperation
```

Creates a CircuitOperation wrapping this circuit.
