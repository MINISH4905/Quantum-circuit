---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/analytical_decompositions/two_qubit_state_preparation.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/analytical_decompositions/two_qubit_state_preparation.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/analytical_decompositions/two_qubit_state_preparation.py`

Utility methods for efficiently preparing two qubit states.

## `prepare_two_qubit_state_using_sqrt_iswap`

```python
def prepare_two_qubit_state_using_sqrt_iswap(q0: cirq.Qid, q1: cirq.Qid, state: cirq.STATE_VECTOR_LIKE, *, use_sqrt_iswap_inv: bool=True) -> list[cirq.Operation]
```

Prepares the given 2q state from |00> using at-most 1 √iSWAP gate + single qubit rotations.

Entangled states are prepared using exactly 1 √iSWAP gate while product states are prepared
using only single qubit rotations (0 √iSWAP gates)

Args:
    q0: The first qubit being operated on.
    q1: The other qubit being operated on.
    state: 4x1 matrix representing two qubit state vector, ordered as 00, 01, 10, 11.
    use_sqrt_iswap_inv: If True, uses `cirq.SQRT_ISWAP_INV` instead of `cirq.SQRT_ISWAP`.

Returns:
    List of operations (at-most 1 √iSWAP + single qubit rotations) preparing `state` from |00>.

## `prepare_two_qubit_state_using_cz`

```python
def prepare_two_qubit_state_using_cz(q0: cirq.Qid, q1: cirq.Qid, state: cirq.STATE_VECTOR_LIKE) -> list[cirq.Operation]
```

Prepares the given 2q state from |00> using at-most 1 CZ gate + single qubit rotations.

Entangled states are prepared using exactly 1 CZ gate while product states are prepared
using only single qubit rotations (0 CZ gates)

Args:
    q0: The first qubit being operated on.
    q1: The other qubit being operated on.
    state: 4x1 matrix representing two qubit state vector, ordered as 00, 01, 10, 11.

Returns:
    List of operations (at-most 1 CZ + single qubit rotations) preparing `state` from |00>.

## `prepare_two_qubit_state_using_iswap`

```python
def prepare_two_qubit_state_using_iswap(q0: cirq.Qid, q1: cirq.Qid, state: cirq.STATE_VECTOR_LIKE, use_iswap_inv: bool=False) -> list[cirq.Operation]
```

Prepares the given 2q state from |00> using at-most 1 ISWAP gate + single qubit rotations.

Entangled states are prepared using exactly 1 ISWAP gate while product states are prepared
using only single qubit rotations (0 ISWAP gates)

Args:
    q0: The first qubit being operated on.
    q1: The other qubit being operated on.
    state: 4x1 matrix representing two qubit state vector, ordered as 00, 01, 10, 11.
    use_iswap_inv: If True, uses `cirq.ISWAP_INV` instead of `cirq.ISWAP`.

Returns:
    List of operations (at-most 1 ISWAP + single qubit rotations) preparing state from |00>.
