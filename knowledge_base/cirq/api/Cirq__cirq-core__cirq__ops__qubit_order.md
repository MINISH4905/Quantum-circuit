---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/qubit_order.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/qubit_order.py
license: Apache-2.0
---

## `QubitOrder`

```python
class QubitOrder
```

Defines the kronecker product order of qubits.

### `explicit`

```python
def explicit(fixed_qubits: Iterable[cirq.Qid], fallback: QubitOrder | None=None) -> QubitOrder
```

A basis that contains exactly the given qubits in the given order.

Args:
    fixed_qubits: The qubits in basis order.
    fallback: A fallback order to use for extra qubits not in the
        fixed_qubits list. Extra qubits will always come after the
        fixed_qubits, but will be ordered based on the fallback. If no
        fallback is specified, a ValueError is raised when extra qubits
        are specified.

Returns:
    A Basis instance that forces the given qubits in the given order.

Raises:
    ValueError: If a qubit appears twice in `fixed_qubits`, or there were is no fallback
        specified but there are extra qubits.

### `sorted_by`

```python
def sorted_by(key: Callable[[cirq.Qid], Any]) -> QubitOrder
```

A basis that orders qubits ascending based on a key function.

Args:
    key: A function that takes a qubit and returns a key value. The
        basis will be ordered ascending according to these key values.

Returns:
    A basis that orders qubits ascending based on a key function.

### `order_for`

```python
def order_for(self, qubits: Iterable[cirq.Qid]) -> tuple[cirq.Qid, ...]
```

Returns a qubit tuple ordered corresponding to the basis.

Args:
    qubits: Qubits that should be included in the basis. (Additional
        qubits may be added into the output by the basis.)

Returns:
    A tuple of qubits in the same order that their single-qubit
    matrices would be passed into `np.kron` when producing a matrix for
    the entire system.

### `as_qubit_order`

```python
def as_qubit_order(val: cirq.QubitOrderOrList) -> QubitOrder
```

Converts a value into a basis.

Args:
    val: An iterable or a basis.

Returns:
    The basis implied by the value.

Raises:
    ValueError: If `val` is not an iterable or a `QubitOrder`.

### `map`

```python
def map(self, internalize: Callable[[TExternalQubit], TInternalQubit], externalize: Callable[[TInternalQubit], TExternalQubit]) -> QubitOrder
```

Transforms the Basis so that it applies to wrapped qubits.

Args:
    externalize: Converts an internal qubit understood by the underlying
        basis into an external qubit understood by the caller.
    internalize: Converts an external qubit understood by the caller
        into an internal qubit understood by the underlying basis.

Returns:
    A basis that transforms qubits understood by the caller into qubits
    understood by an underlying basis, uses that to order the qubits,
    then wraps the ordered qubits back up for the caller.
