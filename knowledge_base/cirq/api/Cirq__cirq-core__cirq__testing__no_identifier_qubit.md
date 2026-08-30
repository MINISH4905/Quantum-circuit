---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/no_identifier_qubit.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/no_identifier_qubit.py
license: Apache-2.0
---

## `NoIdentifierQubit`

```python
class NoIdentifierQubit(raw_types.Qid)
```

A singleton qubit type that does not have a qudit variant.
This is useful for testing code that wraps qubits as qudits.
