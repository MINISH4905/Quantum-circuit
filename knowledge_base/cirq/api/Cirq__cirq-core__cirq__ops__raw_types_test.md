---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/raw_types_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/raw_types_test.py
license: Apache-2.0
---

## `test_gate_shape_protocol`

```python
def test_gate_shape_protocol() -> None
```

This test is only needed while the `_num_qubits_` and `_qid_shape_`
methods are implemented as alternatives.  This can be removed once the
deprecated `num_qubits` method is removed.

## `test_tagged_operation_forwards_protocols`

```python
def test_tagged_operation_forwards_protocols() -> None
```

The results of all protocols applied to an operation with a tag should
be equivalent to the result without tags.
