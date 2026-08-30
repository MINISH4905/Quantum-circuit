---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/analytical_decompositions/clifford_decomposition.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/analytical_decompositions/clifford_decomposition.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/analytical_decompositions/clifford_decomposition.py`

Utility methods to decompose Clifford gates into circuits.

## `decompose_clifford_tableau_to_operations`

```python
def decompose_clifford_tableau_to_operations(qubits: Sequence[cirq.Qid], clifford_tableau: qis.CliffordTableau) -> list[ops.Operation]
```

Decompose an n-qubit Clifford Tableau into a list of one/two qubit operations.

The implementation is based on Theorem 8 in [1].
[1] S. Aaronson, D. Gottesman, *Improved Simulation of Stabilizer Circuits*,
    Phys. Rev. A 70, 052328 (2004). https://arxiv.org/abs/quant-ph/0406196

Args:
    qubits: The list of qubits being operated on.
    clifford_tableau: The Clifford Tableau for decomposition.

Returns:
    A list of operations reconstructs the same Clifford tableau.

Raises:
    ValueError: The length of input qubit mismatch with the size of tableau.
