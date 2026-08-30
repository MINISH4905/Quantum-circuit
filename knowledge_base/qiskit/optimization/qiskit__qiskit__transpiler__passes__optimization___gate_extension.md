---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/_gate_extension.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/_gate_extension.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/_gate_extension.py`

Dynamically extend Gate classes with functions required for the Hoare
optimizer, namely triviality-conditions and post-conditions.
If `_trivial_if` returns `True` and the qubit is in a classical state
then the gate is trivial.
If a gate has no `_trivial_if`, then it is assumed to be non-trivial.
If a gate has no `_postconditions`, then it is assumed to have unknown post-conditions.
