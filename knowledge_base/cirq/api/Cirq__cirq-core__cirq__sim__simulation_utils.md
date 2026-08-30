---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/simulation_utils.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/simulation_utils.py
license: Apache-2.0
---

## `state_probabilities_by_indices`

```python
def state_probabilities_by_indices(state_probability: np.ndarray, indices: Sequence[int], qid_shape: tuple[int, ...]) -> np.ndarray
```

Returns the probabilities for a state/measurement on the given indices.

Args:
    state_probability: The multi-qubit state probability vector. This is an
        array of 2 to the power of the number of real numbers, and
        so state must be of size ``2**integer``.  The `state_probability` can be
        a vector of size ``2**integer`` or a tensor of shape
        ``(2, 2, ..., 2)``.
    indices: Which qubits are measured. The `state_probability` is assumed to be
        supplied in big endian order. That is the xth index of v, when
        expressed as a bitstring, has its largest values in the 0th index.
    qid_shape: The qid shape of the `state_probability`.

Returns:
    State probabilities.
