---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/analytical_decompositions/pauli_string_decomposition.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/analytical_decompositions/pauli_string_decomposition.py
license: Apache-2.0
---

## `unitary_to_pauli_string`

```python
def unitary_to_pauli_string(U: npt.NDArray, eps: float=1e-15) -> DensePauliString | None
```

Attempts to find a pauli string (with possible phase) equivalent to U up to eps.

    Based on this answer https://shorturl.at/aA079.
    Let x_mask be the index of the maximum number of the first column of U
    and z_mask be the index of the maximum number of the first column of H†UH
    each of these indicies is n-bits long where U is 2^n x 2^n.

    These two indices/masks encode in binary the indices of the qubits that
    have I, X, Y, Z acting on them as follows:
    x_mask[i] == 1 and z_mask[i] == 0: X acts on the ith qubit
    x_mask[i] == 0 and z_mask[i] == 1: Z acts on the ith qubit
    x_mask[i] == 1 and z_mask[i] == 1: Y acts on the ith qubit
    x_mask[i] == 0 and z_mask[i] == 0: I acts on the ith qubit

Args:
    U: A square array whose dimension is a power of 2.
    eps: numbers smaller than `eps` are considered zero.

Returns:
    A DensePauliString of None.

Raises:
    ValueError: if U is not square with a power of 2 dimension.
