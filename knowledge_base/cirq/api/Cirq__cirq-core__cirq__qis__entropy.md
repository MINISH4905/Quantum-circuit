---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/qis/entropy.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/qis/entropy.py
license: Apache-2.0
---

## `process_renyi_entropy_from_bitstrings`

```python
def process_renyi_entropy_from_bitstrings(measured_bitstrings: npt.NDArray[np.int8], subsystem: tuple[int, ...] | None=None, pool: ThreadPoolExecutor | None=None) -> float
```

Compute the Rényi entropy of an array of bitstrings.
Args:
    measured_bitstrings: List of sampled measurement outcomes as a numpy array of bitstrings.
    subsystem: Subsystem of interest
    pool: ThreadPoolExecutor used to paralelleize the computation.

Returns:
    A float indicating the computed entropy.
