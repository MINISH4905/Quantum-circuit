---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/clifford/stabilizer_sampler.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/clifford/stabilizer_sampler.py
license: Apache-2.0
---

## `StabilizerSampler`

```python
class StabilizerSampler(sampler.Sampler)
```

An efficient sampler for stabilizer circuits.

### `__init__`

```python
def __init__(self, *, seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None)
```

Inits StabilizerSampler.

Args:
    seed: The random seed or generator to use when sampling.
