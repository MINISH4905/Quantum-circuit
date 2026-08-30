---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/sparse_simulator_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/sparse_simulator_test.py
license: Apache-2.0
---

## `test_entangled_reset_does_not_break_randomness`

```python
def test_entangled_reset_does_not_break_randomness() -> None
```

Test for bad assumptions on caching the wave function on general channels.

A previous version of cirq made the mistake of assuming that it was okay to
cache the wavefunction produced by general channels on unrelated qubits
before repeatedly sampling measurements. This test checks for that mistake.
