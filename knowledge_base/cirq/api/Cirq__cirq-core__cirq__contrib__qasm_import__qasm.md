---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/qasm_import/qasm.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/qasm_import/qasm.py
license: Apache-2.0
---

## `circuit_from_qasm`

```python
def circuit_from_qasm(qasm: str) -> cirq.Circuit
```

Parses an OpenQASM string to `cirq.Circuit`.

Args:
    qasm: The OpenQASM string

Returns:
    The parsed circuit
