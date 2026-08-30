---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/analytical_decompositions/single_to_two_qubit_isometry.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/analytical_decompositions/single_to_two_qubit_isometry.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/analytical_decompositions/single_to_two_qubit_isometry.py`

Analytical decompositions for 2-qubit unitaries when one input qubit is in the |0> state.

## `two_qubit_matrix_to_cz_isometry`

```python
def two_qubit_matrix_to_cz_isometry(q0: cirq.Qid, q1: cirq.Qid, mat: np.ndarray, allow_partial_czs: bool=False, atol: float=1e-08, clean_operations: bool=True) -> list[cirq.Operation]
```

Decomposes a 2q operation into at-most 2 CZs + 1q rotations; assuming `q0` is initially |0>.

The method implements isometry from one to two qubits; assuming qubit `q0` is always in the |0>
state. See Appendix B.1 of https://arxiv.org/abs/1501.06911 for more details.

Args:
    q0: The first qubit being operated on. This is assumed to always be in the |0> state.
    q1: The other qubit being operated on.
    mat: Defines the unitary operation to apply to the pair of qubits.
    allow_partial_czs: Enables the use of Partial-CZ gates.
    atol: A limit on the amount of absolute error introduced by the construction.
    clean_operations: Enables optimizing resulting operation list by merging single qubit
    operations and ejecting phased Paulis and Z operations.

Returns:
    A list of operations implementing the action of the given unitary matrix, assuming
    the input qubit `q0` is in the |0> state.
