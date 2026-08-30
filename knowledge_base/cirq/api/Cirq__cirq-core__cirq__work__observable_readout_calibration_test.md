---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/work/observable_readout_calibration_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/work/observable_readout_calibration_test.py
license: Apache-2.0
---

## `DepolarizingWithDampedReadoutNoiseModel`

```python
class DepolarizingWithDampedReadoutNoiseModel(cirq.NoiseModel)
```

This simulates asymmetric readout error.

The noise is structured so the T1 decay is applied, then the readout bitflip, then measurement.
If a circuit contains measurements, they must be in moments that don't also contain gates.
