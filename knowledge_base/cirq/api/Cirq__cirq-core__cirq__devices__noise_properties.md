---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/devices/noise_properties.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/devices/noise_properties.py
license: Apache-2.0
---

## Module `cirq-core/cirq/devices/noise_properties.py`

Classes for representing device noise.

NoiseProperties is an abstract class for capturing metrics of a device that can
be translated into noise models. NoiseModelFromNoiseProperties consumes those
noise models to produce a single noise model which replicates device noise.

## `NoiseProperties`

```python
class NoiseProperties(abc.ABC)
```

Noise-defining properties for a quantum device.

### `build_noise_models`

```python
def build_noise_models(self) -> list[cirq.NoiseModel]
```

Construct all NoiseModels associated with this NoiseProperties.
