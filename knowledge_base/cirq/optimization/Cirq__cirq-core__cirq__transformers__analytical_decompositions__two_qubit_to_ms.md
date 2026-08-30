---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/analytical_decompositions/two_qubit_to_ms.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/analytical_decompositions/two_qubit_to_ms.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/analytical_decompositions/two_qubit_to_ms.py`

Utility methods related to optimizing quantum circuits using native iontrap operations.

Gate compilation methods implemented here are following the paper below:
    'Basic circuit compilation techniques for an ion-trap quantum machine'
    arXiv:1603.07678

## `two_qubit_matrix_to_ion_operations`

```python
def two_qubit_matrix_to_ion_operations(q0: cirq.Qid, q1: cirq.Qid, mat: np.ndarray, atol: float=1e-08, clean_operations: bool=True) -> list[ops.Operation]
```

Decomposes a two-qubit operation into MS/single-qubit rotation gates.

Args:
    q0: The first qubit being operated on.
    q1: The other qubit being operated on.
    mat: Defines the operation to apply to the pair of qubits.
    atol: A limit on the amount of error introduced by the construction.
    clean_operations: Enables optimizing resulting operation list by
        merging operations and ejecting phased Paulis and Z operations.

Returns:
    A list of operations implementing the matrix.
