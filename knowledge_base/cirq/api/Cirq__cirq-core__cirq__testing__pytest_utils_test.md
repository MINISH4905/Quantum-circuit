---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/pytest_utils_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/pytest_utils_test.py
license: Apache-2.0
---

## `test_session_properties`

```python
def test_session_properties(record_property, request) -> None
```

Record pytest session properties for JUnit XML report.

No testing of actual code.  The purpose of this test is to
record pytest session properties when pytest does XML report.
