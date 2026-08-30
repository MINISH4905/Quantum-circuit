---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/analytical_decompositions/controlled_gate_decomposition.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/analytical_decompositions/controlled_gate_decomposition.py
license: Apache-2.0
---

## `decompose_multi_controlled_x`

```python
def decompose_multi_controlled_x(controls: Sequence[cirq.Qid], target: cirq.Qid, free_qubits: Sequence[cirq.Qid]) -> list[cirq.Operation]
```

Implements action of multi-controlled Pauli X gate.

Result is guaranteed to consist exclusively of 1-qubit, CNOT and CCNOT
gates.
If `free_qubits` has at least 1 element, result has lengts
O(len(controls)).

Args:
    controls - control qubits.
    targets - target qubits.
    free_qubits - qubits which are neither controlled nor target. Can be
        modified by algorithm, but will end up in their initial state.

## `decompose_multi_controlled_rotation`

```python
def decompose_multi_controlled_rotation(matrix: np.ndarray, controls: Sequence[cirq.Qid], target: cirq.Qid) -> list[cirq.Operation]
```

Implements action of multi-controlled unitary gate.

Returns a sequence of operations, which is equivalent to applying
single-qubit gate with matrix `matrix` on `target`, controlled by
`controls`.

Result is guaranteed to consist exclusively of 1-qubit, CNOT and CCNOT
gates.

If matrix is special unitary, result has length `O(len(controls))`.
Otherwise result has length `O(len(controls)**2)`.

References:
    [1] Barenco, Bennett et al.
        Elementary gates for quantum computation. 1995.
        https://arxiv.org/pdf/quant-ph/9503016.pdf

Args:
    matrix - 2x2 numpy unitary matrix (of real or complex dtype).
    controls - control qubits.
    targets - target qubits.

Returns:
    A list of operations which, applied in a sequence, are equivalent to
    applying `MatrixGate(matrix).on(target).controlled_by(*controls)`.
