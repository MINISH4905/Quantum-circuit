---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/analysis/num_tensor_factors.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/analysis/num_tensor_factors.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/analysis/num_tensor_factors.py`

Calculate the number of tensor factors of a DAG circuit.

## `NumTensorFactors`

```python
class NumTensorFactors(AnalysisPass)
```

Calculate the number of tensor factors of a DAG circuit.

The result is saved in ``property_set['num_tensor_factors']`` as an integer.

### `run`

```python
def run(self, dag: DAGCircuit) -> None
```

Run the NumTensorFactors pass on ``dag``.
