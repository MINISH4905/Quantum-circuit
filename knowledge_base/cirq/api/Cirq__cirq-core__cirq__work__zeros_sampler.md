---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/work/zeros_sampler.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/work/zeros_sampler.py
license: Apache-2.0
---

## `ZerosSampler`

```python
class ZerosSampler(work.Sampler, metaclass=abc.ABCMeta)
```

A mock sampler for testing. Immediately returns zeroes.

### `__init__`

```python
def __init__(self, device: devices.Device | None=None)
```

Construct a sampler that returns 0 for all measurements.

Args:
    device: A device against which to validate the circuit. If None,
        no validation will be done.

### `run_sweep`

```python
def run_sweep(self, program: cirq.AbstractCircuit, params: study.Sweepable, repetitions: int=1) -> list[study.Result]
```

Samples circuit as if every measurement resulted in zero.

Args:
    program: The circuit to sample from.
    params: Parameters to run with the program.
    repetitions: The number of times to sample.

Returns:
    Result list for this run; one for each possible parameter
    resolver.

Raises:
    ValueError: circuit is not valid for the sampler, due to invalid
    repeated keys or incompatibility with the sampler's device.
