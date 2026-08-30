---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/projector.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/projector.py
license: Apache-2.0
---

## `ProjectorString`

```python
class ProjectorString
```

Mapping of `cirq.Qid` to measurement values (with a coefficient) representing a projector.

### `__init__`

```python
def __init__(self, projector_dict: dict[cirq.Qid, int], coefficient: complex=1)
```

Constructor for ProjectorString

Args:
    projector_dict: A python dictionary mapping from cirq.Qid to integers. A key value pair
        represents the desired computational basis state for that qubit.
    coefficient: Initial scalar coefficient. Defaults to 1.

### `matrix`

```python
def matrix(self, projector_qids: Iterable[cirq.Qid] | None=None) -> csr_matrix
```

Returns the matrix of self in computational basis of qubits.

Args:
    projector_qids: Ordered collection of qubits that determine the subspace
        in which the matrix representation of the ProjectorString is to
        be computed. Qbits absent from self.qubits are acted on by
        the identity. Defaults to the qubits of the projector_dict.

Returns:
    A sparse matrix that is the projection in the specified basis.

### `expectation_from_state_vector`

```python
def expectation_from_state_vector(self, state_vector: np.ndarray, qid_map: Mapping[cirq.Qid, int]) -> complex
```

Expectation of the projection from a state vector.

Computes the expectation value of this ProjectorString on the provided state vector.

Args:
    state_vector: An array representing a valid state vector.
    qid_map: A map from all qubits used in this ProjectorString to the
        indices of the qubits that `state_vector` is defined over.

Returns:
    The expectation value of the input state.

### `expectation_from_density_matrix`

```python
def expectation_from_density_matrix(self, state: np.ndarray, qid_map: Mapping[cirq.Qid, int]) -> complex
```

Expectation of the projection from a density matrix.

Computes the expectation value of this ProjectorString on the provided state.

Args:
    state: An array representing a valid  density matrix.
    qid_map: A map from all qubits used in this ProjectorString to the
        indices of the qubits that `state_vector` is defined over.

Returns:
    The expectation value of the input state.
