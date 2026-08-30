---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/op_tree.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/op_tree.py
license: Apache-2.0
---

## `assert_equivalent_op_tree`

```python
def assert_equivalent_op_tree(x: ops.OP_TREE, y: ops.OP_TREE) -> None
```

Ensures that the two OP_TREEs are equivalent.

Args:
    x: OP_TREE one
    y: OP_TREE two
Returns:
    None
Raises:
     AssertionError if x != y
