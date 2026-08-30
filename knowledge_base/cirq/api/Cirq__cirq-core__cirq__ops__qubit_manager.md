---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/qubit_manager.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/qubit_manager.py
license: Apache-2.0
---

## `QubitManager`

```python
class QubitManager(metaclass=abc.ABCMeta)
```

Orchestrates allocation and reuse of helper ancilla qubits used in a circuit.

QubitManager keeps track of ancilla qubits which it can supply in either a clean,
|0> state or dirty, arbitrary state.  Ancilla qubits can be deallocated to become
available for reuse later.  Circuit creators can use QubitManager to obtain ancilla
qubits without having to manually track their availability and state.

### `qalloc`

```python
def qalloc(self, n: int, dim: int=2) -> list[cirq.Qid]
```

Allocate `n` clean qubits, i.e. qubits guaranteed to be in state |0>.

### `qborrow`

```python
def qborrow(self, n: int, dim: int=2) -> list[cirq.Qid]
```

Allocate `n` dirty qubits, i.e. the returned qubits can be in any state.

### `qfree`

```python
def qfree(self, qubits: Iterable[cirq.Qid]) -> None
```

Free pre-allocated clean or dirty qubits managed by this qubit manager.

## `CleanQubit`

```python
class CleanQubit(_BaseAncillaQid)
```

An internal qid type that represents a clean ancilla allocation.

## `BorrowableQubit`

```python
class BorrowableQubit(_BaseAncillaQid)
```

An internal qid type that represents a dirty ancilla allocation.

## `SimpleQubitManager`

```python
class SimpleQubitManager(QubitManager)
```

Allocates a new `CleanQubit`/`BorrowableQubit` for every `qalloc`/`qborrow` request.
