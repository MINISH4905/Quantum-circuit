---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/qubit_management_transformers.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/qubit_management_transformers.py
license: Apache-2.0
---

## `map_clean_and_borrowable_qubits`

```python
def map_clean_and_borrowable_qubits(circuit: cirq.AbstractCircuit, *, qm: cirq.QubitManager | None=None) -> cirq.Circuit
```

Uses `qm: QubitManager` to map all `CleanQubit`/`BorrowableQubit`s to system qubits.

`CleanQubit` and `BorrowableQubit` are internal qubit types that are used as placeholder qubits
to record a clean / dirty ancilla allocation request.

This transformer uses the `QubitManager` provided in the input to:
 - Allocate clean ancilla qubits by delegating to `qm.qalloc` for all `CleanQubit`s.
 - Allocate dirty qubits for all `BorrowableQubit` types via the following two steps:
     1. First analyze the input circuit and check if there are any suitable system qubits
        that can be borrowed, i.e. ones which do not have any overlapping operations
        between circuit[start_index : end_index] where `(start_index, end_index)` is the
        lifespan of temporary borrowable qubit under consideration. If yes, borrow the system
        qubits to replace the temporary `BorrowableQubit`.
     2. If no system qubits can be borrowed, delegate the request to `qm.qborrow`.

Notes:
    1. The borrow protocol can be made more efficient by also considering the newly
allocated clean ancilla qubits in step-1 before delegating to `qm.borrow`, but this
optimization is left as a future improvement.
    2. As of now, the transformer does not preserve moment structure and defaults to
inserting all mapped operations in a resulting circuit using EARLIEST strategy. The reason
is that preserving moment structure forces additional constraints on the qubit allocation
strategy (i.e. if two operations `op1` and `op2` are in the same moment, then we cannot
reuse ancilla across `op1` and `op2`). We leave it up to the user to force such constraints
using the qubit manager instead of making it part of the transformer.
    3. However, for borrowable system qubits managed by the transformer, we do not reuse qubits
within the same moment.
    4. We support recursive mapping within sub-circuits (CircuitOperations). The transformer
traverses into the nested circuits and shares the same QubitManager to ensure
globally unique qubit allocation.

Args:
    circuit: Input `cirq.Circuit` containing temporarily allocated
        `CleanQubit`/`BorrowableQubit`s.
    qm: An instance of `cirq.QubitManager` specifying the strategy to use for allocating /
        deallocating new ancilla qubits to replace the temporary qubits.

Returns:
    An updated `cirq.Circuit` with all `CleanQubit`/`BorrowableQubit` mapped to either existing
    system qubits or new ancilla qubits allocated using the `qm` qubit manager.
