---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/evolution/matrix_synthesis.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/evolution/matrix_synthesis.py
license: Apache-2.0
---

## Module `qiskit/synthesis/evolution/matrix_synthesis.py`

Exact synthesis of operator evolution via (exponentially expensive) matrix exponentiation.

## `MatrixExponential`

```python
class MatrixExponential(EvolutionSynthesis)
```

Exact operator evolution via matrix exponentiation and unitary synthesis.

This class synthesizes the exponential of operators by calculating their exponentially-sized
matrix representation and using exact matrix exponentiation followed by unitary synthesis
to obtain a circuit. This process is not scalable and serves as comparison or benchmark
for small systems.
