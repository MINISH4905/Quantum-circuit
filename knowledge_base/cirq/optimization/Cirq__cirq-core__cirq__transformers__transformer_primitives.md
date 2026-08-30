---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/transformer_primitives.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/transformer_primitives.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/transformer_primitives.py`

Defines primitives for common transformer patterns.

## `map_moments`

```python
def map_moments(circuit: CIRCUIT_TYPE, map_func: Callable[[circuits.Moment, int], circuits.Moment | Sequence[circuits.Moment]], *, tags_to_ignore: Sequence[Hashable]=(), deep: bool=False) -> CIRCUIT_TYPE
```

Applies local transformation on moments, by calling `map_func(moment)` for each moment.

Args:
    circuit: Input circuit to apply the transformations on. The input circuit is not mutated.
    map_func: Mapping function from (cirq.Moment, moment_index) to a sequence of moments.
    tags_to_ignore: Tagged circuit operations marked with any of `tags_to_ignore` will be
        ignored when recursively applying the transformer primitive to sub-circuits, given
        deep=True.
    deep: If true, `map_func` will be recursively applied to circuits wrapped inside
        any circuit operations contained within `circuit`.

Returns:
    Copy of input circuit with mapped moments.

## `map_operations`

```python
def map_operations(circuit: CIRCUIT_TYPE, map_func: Callable[[ops.Operation, int], ops.OP_TREE], *, deep: bool=False, raise_if_add_qubits=True, tags_to_ignore: Sequence[Hashable]=()) -> CIRCUIT_TYPE
```

Applies local transformations, by calling `map_func(op, moment_index)` for each operation.

By default, the function assumes `issubset(qubit_set(map_func(op, moment_index)), op.qubits)` is
True.

Args:
    circuit: Input circuit to apply the transformations on. The input circuit is not mutated.
    map_func: Mapping function from (cirq.Operation, moment_index) to a cirq.OP_TREE. If the
        resulting optree spans more than 1 moment, it's inserted in-place in the same moment as
        `cirq.CircuitOperation(cirq.FrozenCircuit(op_tree)).with_tags(MAPPED_CIRCUIT_OP_TAG)`
        to preserve moment structure. Utility methods like `cirq.unroll_circuit_op` can
        subsequently be used to unroll the mapped circuit operation.
    deep: If true, `map_func` will be recursively applied to circuits wrapped inside
        any circuit operations contained within `circuit`.
    raise_if_add_qubits: Set to True by default. If True, raises ValueError if
        `map_func(op, idx)` adds operations on qubits outside of `op.qubits`.
    tags_to_ignore: Sequence of tags which should be ignored while applying `map_func` on
        tagged operations -- i.e. `map_func(op, idx)` will be called only for operations that
        satisfy `set(op.tags).isdisjoint(tags_to_ignore)`.

Raises:
      ValueError if `issubset(qubit_set(map_func(op, idx)), op.qubits) is False` and
        `raise_if_add_qubits is True`.

Returns:
    Copy of input circuit with mapped operations (wrapped in a tagged CircuitOperation).

## `map_operations_and_unroll`

```python
def map_operations_and_unroll(circuit: CIRCUIT_TYPE, map_func: Callable[[ops.Operation, int], ops.OP_TREE], *, deep: bool=False, raise_if_add_qubits=True, tags_to_ignore: Sequence[Hashable]=()) -> CIRCUIT_TYPE
```

Applies local transformations via `cirq.map_operations` & unrolls intermediate circuit ops.

See `cirq.map_operations` and `cirq.unroll_circuit_op` for more details.

Args:
    circuit: Input circuit to apply the transformations on. The input circuit is not mutated.
    map_func: Mapping function from (cirq.Operation, moment_index) to a cirq.OP_TREE.
    deep: If true, `map_func` will be recursively applied to circuits wrapped inside
        any circuit operations contained within `circuit`.
    raise_if_add_qubits: Set to True by default. If True, raises ValueError if
        `map_func(op, idx)` adds operations on qubits outside `op.qubits`.
    tags_to_ignore: Sequence of tags which should be ignored while applying `map_func` on
        tagged operations -- i.e. `map_func(op, idx)` will be called only for operations that
        satisfy `set(op.tags).isdisjoint(tags_to_ignore)`.

Returns:
    Copy of input circuit with mapped operations, unrolled in a moment preserving way.

## `merge_operations`

```python
def merge_operations(circuit: CIRCUIT_TYPE, merge_func: Callable[[ops.Operation, ops.Operation], ops.Operation | None], *, tags_to_ignore: Sequence[Hashable]=(), deep: bool=False) -> CIRCUIT_TYPE
```

Merges operations in a circuit by calling `merge_func` iteratively on operations.

Two operations op1 and op2 are merge-able if
    - There is no other operation between op1 and op2 in the circuit
    - is_subset(op1.qubits, op2.qubits) or is_subset(op2.qubits, op1.qubits)

The `merge_func` is a callable which, given two merge-able operations
op1 and op2, decides whether they should be merged into a single operation
or not. If not, it should return None, else it should return the single merged
operation `op`.

The method iterates on the input circuit moment-by-moment from left to right and attempts
to repeatedly merge each operation in the latest moment with all the corresponding merge-able
operations to its left.

If op1 and op2 are merged, both op1 and op2 are deleted from the circuit and
the resulting `merged_op` is inserted at the index corresponding to the larger
of op1/op2. If both op1 and op2 act on the same number of qubits, `merged_op` is
inserted in the smaller moment index to minimize circuit depth.

The number of calls to `merge_func` is O(N), where N = Total no. of operations, because:
    - Every time the `merge_func` returns a new operation, the number of operations in the
        circuit reduces by 1 and hence this can happen at most O(N) times
    - Every time the `merge_func` returns None, the current operation is inserted into the
        frontier and we go on to process the next operation, which can also happen at-most
        O(N) times.

Args:
    circuit: Input circuit to apply the transformations on. The input circuit is not mutated.
    merge_func: Callable to determine whether two merge-able operations in the circuit should
        be merged. If the operations can be merged, the callable should return the merged
        operation, else None.
    tags_to_ignore: Sequence of tags which should be ignored while applying `merge_func` on
        tagged operations -- i.e. `merge_func(op1, op2)` will be called only if both `op1` and
        `op2` satisfy `set(op.tags).isdisjoint(tags_to_ignore)`.
    deep: If true, the transformer primitive will be recursively applied to all circuits
        wrapped inside circuit operations.


Returns:
    Copy of input circuit with merged operations.

Raises:
    ValueError if the merged operation acts on new qubits outside the set of qubits
        corresponding to the original operations to be merged.

## `merge_operations_to_circuit_op`

```python
def merge_operations_to_circuit_op(circuit: CIRCUIT_TYPE, can_merge: Callable[[Sequence[cirq.Operation], Sequence[cirq.Operation]], bool], *, tags_to_ignore: Sequence[Hashable]=(), merged_circuit_op_tag: str='Merged connected component', deep: bool=False) -> CIRCUIT_TYPE
```

Merges connected components of operations and wraps each component into a circuit operation.

Moment structure is preserved for operations that do not participate in merging.
For merged operations, the newly created circuit operations are constructed by inserting
operations using EARLIEST strategy.
If you need more control on moment structure of newly created circuit operations, consider
using `cirq.merge_operations` directly with a custom `merge_func`.

Args:
    circuit: Input circuit to apply the transformations on. The input circuit is not mutated.
    can_merge: Callable to determine whether a new operation `right_op` can be merged into an
        existing connected component of operations `left_ops` based on boolean returned by
        `can_merge(left_ops, right_op)`.
    tags_to_ignore: Tagged operations marked any of `tags_to_ignore` will not be considered as
        potential candidates for any connected component.
    merged_circuit_op_tag: Tag to be applied on circuit operations wrapping valid connected
        components.
    deep: If true, the transformer primitive will be recursively applied to all circuits
        wrapped inside circuit operations.

Returns:
    Copy of input circuit with valid connected components wrapped in tagged circuit operations.

## `merge_k_qubit_unitaries_to_circuit_op`

```python
def merge_k_qubit_unitaries_to_circuit_op(circuit: CIRCUIT_TYPE, k: int, *, tags_to_ignore: Sequence[Hashable]=(), merged_circuit_op_tag: str | None=None, deep: bool=False) -> CIRCUIT_TYPE
```

Merges connected components of operations, acting on <= k qubits, into circuit operations.

Moment structure is preserved for operations that do not participate in merging.
For merged operations, the newly created circuit operations are constructed by inserting
operations using EARLIEST strategy.

Args:
    circuit: Input circuit to apply the transformations on. The input circuit is not mutated.
    k: Merge-able operations acting on <= k qubits are merged into a connected component.
    tags_to_ignore: Tagged operations marked any of `tags_to_ignore` will not be considered as
        potential candidates for any connected component.
    merged_circuit_op_tag: Tag to be applied on circuit operations wrapping valid connected
        components. A default tag is applied if left None.
    deep: If true, the transformer primitive will be recursively applied to all circuits
        wrapped inside circuit operations.

Returns:
    Copy of input circuit with valid connected components wrapped in tagged circuit operations.

## `merge_moments`

```python
def merge_moments(circuit: CIRCUIT_TYPE, merge_func: Callable[[circuits.Moment, circuits.Moment], circuits.Moment | None], *, tags_to_ignore: Sequence[Hashable]=(), deep: bool=False) -> CIRCUIT_TYPE
```

Merges adjacent moments, one by one from left to right, by calling `merge_func(m1, m2)`.

Args:
    circuit: Input circuit to apply the transformations on. The input circuit is not mutated.
    merge_func: Callable to determine whether two adjacent moments in the circuit should be
        merged. If the moments can be merged, the callable should return the merged moment,
        else None.
    tags_to_ignore: Tagged circuit operations marked with any of `tags_to_ignore` will be
        ignored when recursively applying the transformer primitive to sub-circuits, given
        deep=True.
    deep: If true, the transformer primitive will be recursively applied to all circuits
        wrapped inside circuit operations.

Returns:
    Copy of input circuit with merged moments.

## `unroll_circuit_op`

```python
def unroll_circuit_op(circuit: CIRCUIT_TYPE, *, deep: bool=False, tags_to_check: Sequence[Hashable] | None=(MAPPED_CIRCUIT_OP_TAG,)) -> CIRCUIT_TYPE
```

Unrolls (tagged) `cirq.CircuitOperation`s while preserving the moment structure.

Each moment containing a matching circuit operation is expanded into a list of moments with the
unrolled operations, hence preserving the original moment structure.

Args:
    circuit: Input circuit to apply the transformations on. The input circuit is not mutated.
    deep: If true, the transformer primitive will be recursively applied to all circuits
        wrapped inside circuit operations.
    tags_to_check: If specified, only circuit operations tagged with one of the `tags_to_check`
        are unrolled.

Returns:
    Copy of input circuit with (Tagged) CircuitOperation's expanded in a moment preserving way.

## `unroll_circuit_op_greedy_earliest`

```python
def unroll_circuit_op_greedy_earliest(circuit: CIRCUIT_TYPE, *, deep: bool=False, tags_to_check: Sequence[Hashable] | None=(MAPPED_CIRCUIT_OP_TAG,)) -> CIRCUIT_TYPE
```

Unrolls (tagged) `cirq.CircuitOperation`s by inserting operations using EARLIEST strategy.

Each matching `cirq.CircuitOperation` is replaced by inserting underlying operations using the
`cirq.InsertStrategy.EARLIEST` strategy. The greedy approach attempts to minimize circuit depth
of the resulting circuit.

Args:
    circuit: Input circuit to apply the transformations on. The input circuit is not mutated.
    deep: If true, the transformer primitive will be recursively applied to all circuits
        wrapped inside circuit operations.
    tags_to_check: If specified, only circuit operations tagged with one of the `tags_to_check`
        are unrolled.

Returns:
    Copy of input circuit with (Tagged) CircuitOperation's expanded using EARLIEST strategy.

## `unroll_circuit_op_greedy_frontier`

```python
def unroll_circuit_op_greedy_frontier(circuit: CIRCUIT_TYPE, *, deep: bool=False, tags_to_check: Sequence[Hashable] | None=(MAPPED_CIRCUIT_OP_TAG,)) -> CIRCUIT_TYPE
```

Unrolls (tagged) `cirq.CircuitOperation`s by inserting operations inline at qubit frontier.

Each matching `cirq.CircuitOperation` is replaced by inserting underlying operations using the
`circuit.insert_at_frontier` method. The greedy approach attempts to reuse any available space
in existing moments on the right of circuit_op before inserting new moments.

Args:
    circuit: Input circuit to apply the transformations on. The input circuit is not mutated.
    deep: If true, the transformer primitive will be recursively applied to all circuits
        wrapped inside circuit operations.
    tags_to_check: If specified, only circuit operations tagged with one of the `tags_to_check`
        are unrolled.

Returns:
    Copy of input circuit with (Tagged) CircuitOperation's expanded inline at qubit frontier.

## `toggle_tags`

```python
def toggle_tags(circuit: CIRCUIT_TYPE, tags: Sequence[Hashable], *, deep: bool=False)
```

Toggles tags applied on each operation in the circuit, via `op.tags ^= tags`

For every operation `op` in the input circuit, the tags on `op` are replaced by a symmetric
difference of `op.tags` and `tags` -- this is useful in scenarios where you mark a small subset
of operations with a specific tag and then toggle the set of marked operations s.t. every
marked operation is now unmarked and vice versa.

Often used in transformer workflows to apply a transformer on a small subset of operations.

Args:
    circuit: Input circuit to apply the transformations on. The input circuit is not mutated.
    tags: Sequence of tags s.t. `op.tags ^= tags` is done for every operation `op` in circuit.
    deep: If true, tags will be recursively toggled for operations in circuits wrapped inside
        any circuit operations contained within `circuit`.

Returns:
    Copy of transformed input circuit with operation sets marked with `tags` toggled.

## `reverse_circuit`

```python
def reverse_circuit(circuit: cirq.AbstractCircuit) -> cirq.Circuit
```

Return a mutable copy of the circuit with moments and operations reversed.

This creates a circuit with reversed iteration order in `circuit.all_operations()`.
A second call restores back the initial input circuit (as a mutable copy).

Args:
    circuit: The input circuit to be reversed.

Returns:
    A mutable circuit with a reversed order of moments and operations.
