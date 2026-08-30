---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/greedy_qubit_manager.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/greedy_qubit_manager.py
license: Apache-2.0
---

## `GreedyQubitManager`

```python
class GreedyQubitManager(qubit_manager.QubitManager)
```

Greedy allocator that maximizes/minimizes qubit reuse based on a configurable parameter.

GreedyQubitManager can be configured, using `maximize_reuse` flag, to work in one of two modes:
- Minimize qubit reuse (maximize_reuse=False): For a fixed width, this mode uses a FIFO (First
         in First out) strategy s.t. next allocated qubit is one which was freed the earliest.
- Maximize qubit reuse (maximize_reuse=True): For a fixed width, this mode uses a LIFO (Last in
        First out) strategy s.t. the next allocated qubit is one which was freed the latest.

If the requested qubits are more than the set of free qubits, the qubit manager automatically
resizes the size of the managed qubit pool and adds new free qubits, that have their last
freed time to be -infinity.

For borrowing qubits, the qubit manager simply delegates borrow requests to `self.qalloc`, thus
always allocating new clean qubits.

### `__init__`

```python
def __init__(self, prefix: str, *, size: int=0, maximize_reuse: bool=False)
```

Initializes `GreedyQubitManager`

Args:
    prefix: The prefix to use for naming new clean ancillas allocated by the qubit manager.
            The i'th allocated qubit is of the type `cirq.NamedQubit(f'{prefix}_{i}')`.
    size: The initial size of the pool of ancilla qubits managed by the qubit manager. The
            qubit manager can automatically resize itself when the allocation request
            exceeds the number of available qubits.
    maximize_reuse: Flag to control a FIFO vs LIFO strategy, defaults to False (FIFO).
