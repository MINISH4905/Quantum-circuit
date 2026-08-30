---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/analytical_decompositions/clifford_decomposition_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/analytical_decompositions/clifford_decomposition_test.py
license: Apache-2.0
---

## `test_clifford_decompose_one_qubit`

```python
def test_clifford_decompose_one_qubit() -> None
```

Two random instance for one qubit decomposition.

## `test_clifford_decompose_two_qubits`

```python
def test_clifford_decompose_two_qubits() -> None
```

Two random instance for two qubits decomposition.

## `test_clifford_decompose_by_unitary`

```python
def test_clifford_decompose_by_unitary() -> None
```

Validate the decomposition of random Clifford Tableau by unitary matrix.

Due to the exponential growth in dimension, it cannot validate very large number of qubits.

## `test_clifford_decompose_by_reconstruction`

```python
def test_clifford_decompose_by_reconstruction() -> None
```

Validate the decomposition of random Clifford Tableau by reconstruction.

This approach can validate large number of qubits compared with the unitary one.
