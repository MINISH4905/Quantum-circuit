---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/circuits/optimization_pass_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/circuits/optimization_pass_test.py
license: Apache-2.0
---

## `ReplaceWithXGates`

```python
class ReplaceWithXGates(PointOptimizer)
```

Replaces a block of operations with X gates.

Searches ahead for gates covering a subset of the focused operation's
qubits, clears the whole range, and inserts X gates for each cleared
operation's qubits.
