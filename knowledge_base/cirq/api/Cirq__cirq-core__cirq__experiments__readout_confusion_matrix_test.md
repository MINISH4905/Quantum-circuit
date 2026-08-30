---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/experiments/readout_confusion_matrix_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/experiments/readout_confusion_matrix_test.py
license: Apache-2.0
---

## `add_readout_error`

```python
def add_readout_error(measurements: np.ndarray, zero_errors: np.ndarray, one_errors: np.ndarray, rng: np.random.Generator) -> np.ndarray
```

Add readout errors to measured (or simulated) bitstrings.

Args:
    measurements: The bitstrings to which we will add readout errors. measurements[i,j] is the
                  ith bitstring, qubit j.
    zero_errors: zero_errors[i] is the probability of a 0->1 readout error on qubit i.
    one_errors: one_errors[i] is the probability of a 1->0 readout error on qubit i.
    rng: The pseudorandom number generator to use.

Returns:
    New measurements but with readout errors added.
