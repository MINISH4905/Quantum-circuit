---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/work/pauli_sum_collector.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/work/pauli_sum_collector.py
license: Apache-2.0
---

## `PauliSumCollector`

```python
class PauliSumCollector(collector.Collector)
```

Estimates the energy of a linear combination of Pauli observables.

### `__init__`

```python
def __init__(self, circuit: cirq.AbstractCircuit, observable: cirq.PauliSumLike, *, samples_per_term: int, max_samples_per_job: int=1000000)
```

Inits PauliSumCollector.

Args:
    circuit: Produces the state to be tested.
    observable: The pauli product observables to measure. Their sampled
        expectations will be scaled by their coefficients and their
        dictionary weights, and then added up to produce the final
        result.
    samples_per_term: The number of samples to collect for each
        PauliString term in order to estimate its expectation.
    max_samples_per_job: How many samples to request at a time.

### `estimated_energy`

```python
def estimated_energy(self) -> float | complex
```

Sums up the sampled expectations, weighted by their coefficients.
