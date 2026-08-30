---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/analysis/num_qubits.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/analysis/num_qubits.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/analysis/num_qubits.py`

Calculate the number of qubits of a DAG circuit.

## `NumQubits`

```python
class NumQubits(AnalysisPass)
```

Calculate the number of qubits of a DAG circuit.

The result is saved in ``property_set['num_qubits']`` as an integer.

### `run`

```python
def run(self, dag: DAGCircuit) -> None
```

Run the NumQubits pass on ``dag``.
