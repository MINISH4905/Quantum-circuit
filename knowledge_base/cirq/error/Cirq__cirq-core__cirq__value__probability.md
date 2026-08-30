---
framework: cirq
api_version: v1.7.0
doc_type: error
source_path: cirq-core/cirq/value/probability.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/value/probability.py
license: Apache-2.0
---

## Error surface of `cirq-core/cirq/value/probability.py`

### Validation

## `validate_probability`

```python
def validate_probability(p: float, p_str: str) -> float
```

Validates that a probability is between 0 and 1 inclusively.

Args:
    p: The value to validate.
    p_str: What to call the probability in error messages.

Returns:
    The probability p if the probability if valid.

Raises:
    ValueError: If the probability is invalid.
