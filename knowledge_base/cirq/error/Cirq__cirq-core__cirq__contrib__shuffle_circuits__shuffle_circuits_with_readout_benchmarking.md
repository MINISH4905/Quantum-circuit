---
framework: cirq
api_version: v1.7.0
doc_type: error
source_path: cirq-core/cirq/contrib/shuffle_circuits/shuffle_circuits_with_readout_benchmarking.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/shuffle_circuits/shuffle_circuits_with_readout_benchmarking.py
license: Apache-2.0
---

## Error surface of `cirq-core/cirq/contrib/shuffle_circuits/shuffle_circuits_with_readout_benchmarking.py`

### Validation

## `_validate_experiment_input_with_sweep`

```python
def _validate_experiment_input_with_sweep(input_circuits: Sequence[circuits.Circuit], sweep_params: Sequence[study.Sweepable], circuit_repetitions: int | list[int], rng_or_seed: np.random.Generator | int | None=None)
```

Validates the input for the run_sweep_with_readout_benchmarking function.
