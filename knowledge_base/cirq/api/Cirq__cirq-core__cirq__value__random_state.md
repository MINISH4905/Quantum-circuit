---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/value/random_state.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/value/random_state.py
license: Apache-2.0
---

## `parse_random_state`

```python
def parse_random_state(random_state: RANDOM_STATE_OR_SEED_LIKE) -> np.random.RandomState
```

Interpret an object as a pseudorandom number generator.

If `random_state` is None, returns the module `np.random`.
If `random_state` is an integer, returns
`np.random.RandomState(random_state)`.
Otherwise, returns `random_state` unmodified.

Args:
    random_state: The object to be used as or converted to a pseudorandom
        number generator.

Returns:
    The pseudorandom number generator object.
