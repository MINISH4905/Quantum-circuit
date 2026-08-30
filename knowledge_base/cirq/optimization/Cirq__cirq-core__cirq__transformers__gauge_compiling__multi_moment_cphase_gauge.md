---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/gauge_compiling/multi_moment_cphase_gauge.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/gauge_compiling/multi_moment_cphase_gauge.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/gauge_compiling/multi_moment_cphase_gauge.py`

A Multi-Moment Gauge Transformer for the cphase gate.

## `CPhaseGaugeTransformerMM`

```python
class CPhaseGaugeTransformerMM(MultiMomentGaugeTransformer)
```

A gauge transformer for the cphase gate.

### `gauge_on_moments`

```python
def gauge_on_moments(self, moments_to_gauge: list[circuits.Moment], prng: np.random.Generator) -> list[circuits.Moment]
```

Gauges a block of moments that contains at least a cphase gate in each of the moment.

Args:
    moments_to_gauge: A list of moments to be gauged.
    prng: A pseudorandom number generator.

Returns:
    A list of moments after gauging.
