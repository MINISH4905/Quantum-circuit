---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/json.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/json.py
license: Apache-2.0
---

## `assert_json_roundtrip_works`

```python
def assert_json_roundtrip_works(obj, text_should_be=None, resolvers=None) -> None
```

Tests that the given object can serialized and de-serialized

Args:
    obj: The object to test round-tripping for.
    text_should_be: An optional argument to assert the JSON serialized
        output.
    resolvers: Any resolvers if testing those other than the default.

Raises:
    AssertionError: The given object can not be round-tripped according to
        the given arguments.
