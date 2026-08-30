---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/deprecation.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/deprecation.py
license: Apache-2.0
---

## `assert_deprecated`

```python
def assert_deprecated(*msgs: str, deadline: str, count: int | None=1) -> Iterator[None]
```

Allows deprecated functions, classes, decorators in tests.

It acts as a contextmanager that can be used in with statements:
>>> with assert_deprecated("use cirq.x instead", deadline="v0.9"):
>>>     # do something deprecated

Args:
    *msgs: messages that should match the warnings captured
    deadline: the expected deadline the feature will be deprecated by. Has to follow the format
        vX.Y (minor versions only)
    count: if None count of messages is not asserted, otherwise the number of deprecation
        messages have to equal count.
