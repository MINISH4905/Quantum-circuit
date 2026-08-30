---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/qid_util.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/qid_util.py
license: Apache-2.0
---

## `q`

```python
def q(*args: int | str) -> cirq.LineQubit | cirq.GridQubit | cirq.NamedQubit
```

Constructs a qubit id of the appropriate type based on args.

This is shorthand for constructing qubit ids of common types:
>>> cirq.q(1) == cirq.LineQubit(1)
True
>>> cirq.q(1, 2) == cirq.GridQubit(1, 2)
True
>>> cirq.q("foo") == cirq.NamedQubit("foo")
True

Note that arguments should be treated as positional only.

Args:
    *args: One or two ints, or a single str, as described above.

Returns:
    cirq.LineQubit if called with one integer arg.
    cirq.GridQubit if called with two integer args.
    cirq.NamedQubit if called with one string arg.

Raises:
    ValueError: if called with invalid arguments.
