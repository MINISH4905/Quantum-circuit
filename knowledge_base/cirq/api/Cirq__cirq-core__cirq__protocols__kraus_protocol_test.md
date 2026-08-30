---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/kraus_protocol_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/kraus_protocol_test.py
license: Apache-2.0
---

## Module `cirq-core/cirq/protocols/kraus_protocol_test.py`

Tests for kraus_protocol.py.

## `test_kraus_fallback_to_apply_channel`

```python
def test_kraus_fallback_to_apply_channel(channel_cls, params) -> None
```

Kraus protocol falls back to _apply_channel_ when no _kraus_, _mixture_, or _unitary_.

## `test_kraus_channel_with_has_unitary`

```python
def test_kraus_channel_with_has_unitary() -> None
```

CZSWAP has no unitary dunder method but has_unitary returns True.
