---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/value/abc_alt_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/value/abc_alt_test.py
license: Apache-2.0
---

## `test_classcell_in_namespace`

```python
def test_classcell_in_namespace()
```

Tests a historical issue where super() triggers python to add
`__classcell__` to the namespace passed to the metaclass __new__.
