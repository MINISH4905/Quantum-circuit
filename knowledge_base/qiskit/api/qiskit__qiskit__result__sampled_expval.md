---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/result/sampled_expval.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/result/sampled_expval.py
license: Apache-2.0
---

## Module `qiskit/result/sampled_expval.py`

Routines for computing expectation values from sampled distributions

## `sampled_expectation_value`

```python
def sampled_expectation_value(dist: dict | result.Counts | QuasiDistribution | ProbDistribution, oper: str | quantum_info.Pauli | quantum_info.SparsePauliOp | quantum_info.SparseObservable) -> float
```

Computes expectation value from a sampled distribution

Note that passing a raw dict requires bit-string keys.

Args:
    dist: Input sampled distribution.
    oper: The operator for the observable.

Returns:
    The expectation value.
Raises:
    QiskitError: if the input distribution or operator is an invalid type
