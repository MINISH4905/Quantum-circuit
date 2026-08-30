---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/op_tree.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/op_tree.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/op_tree.py`

A recursive type describing trees of operations, and utility methods for it.

## `flatten_op_tree`

```python
def flatten_op_tree(root: OP_TREE, preserve_moments: bool=False) -> Iterator[Operation | cirq.Moment]
```

Performs an in-order iteration of the operations (leaves) in an OP_TREE.

Args:
    root: The operation or tree of operations to iterate.
    preserve_moments: Whether to yield Moments intact instead of
        flattening them

Yields:
    Operations from the tree.

Raises:
    TypeError: root isn't a valid OP_TREE.

## `flatten_to_ops`

```python
def flatten_to_ops(root: OP_TREE) -> Iterator[Operation]
```

Performs an in-order iteration of the operations (leaves) in an OP_TREE.

Args:
    root: The operation or tree of operations to iterate.

Yields:
    Operations or moments from the tree.

Raises:
    TypeError: root isn't a valid OP_TREE.

## `flatten_to_ops_or_moments`

```python
def flatten_to_ops_or_moments(root: OP_TREE) -> Iterator[Operation | cirq.Moment]
```

Performs an in-order iteration OP_TREE, yielding ops and moments.

Args:
    root: The operation or tree of operations to iterate.

Yields:
    Operations or moments from the tree.

Raises:
    TypeError: root isn't a valid OP_TREE.

## `transform_op_tree`

```python
def transform_op_tree(root: OP_TREE, op_transformation: Callable[[Operation], OP_TREE]=lambda e: e, iter_transformation: Callable[[Iterable[OP_TREE]], OP_TREE]=lambda e: e, preserve_moments: bool=False) -> OP_TREE
```

Maps transformation functions onto the nodes of an OP_TREE.

Args:
    root: The operation or tree of operations to transform.
    op_transformation: How to transform the operations (i.e. leaves).
    iter_transformation: How to transform the iterables (i.e. internal
        nodes).
    preserve_moments: Whether to leave Moments alone. If True, the
        transformation functions will not be applied to Moments or the
        operations within them.

Returns:
    A transformed operation tree.

Raises:
    TypeError: root isn't a valid OP_TREE.

## `freeze_op_tree`

```python
def freeze_op_tree(root: OP_TREE) -> OP_TREE
```

Replaces all iterables in the OP_TREE with tuples.

Args:
    root: The operation or tree of operations to freeze.

Returns:
    An OP_TREE with the same operations and branching structure, but where
    all internal nodes are tuples instead of arbitrary iterables.
