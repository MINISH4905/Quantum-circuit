---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/eigen_gate_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/eigen_gate_test.py
license: Apache-2.0
---

## `CExpZinGate`

```python
class CExpZinGate(cirq.EigenGate, cirq.testing.TwoQubitGate)
```

Two-qubit gate for the following matrix:
[1  0  0  0]
[0  1  0  0]
[0  0  i  0]
[0  0  0 -i]
