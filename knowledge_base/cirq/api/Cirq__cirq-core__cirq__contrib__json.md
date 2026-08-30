---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/json.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/json.py
license: Apache-2.0
---

## Module `cirq-core/cirq/contrib/json.py`

Functions for JSON serialization and de-serialization for classes in Contrib.

## `contrib_class_resolver`

```python
def contrib_class_resolver(cirq_type: str) -> ObjectFactory | None
```

Extend cirq's JSON API with resolvers for cirq contrib classes.
