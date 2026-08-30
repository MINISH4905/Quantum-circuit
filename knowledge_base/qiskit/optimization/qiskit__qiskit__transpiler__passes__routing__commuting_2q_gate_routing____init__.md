---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/routing/commuting_2q_gate_routing/__init__.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/routing/commuting_2q_gate_routing/__init__.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/routing/commuting_2q_gate_routing/__init__.py`

Module containing swap strategies for blocks of commuting gates.

Swap routing is, in general, a hard problem. However, this problem is much simpler if
the gates commute. Many variational algorithms such as QAOA are built with blocks of
commuting gates. Transpiling such circuits with a general purpose SWAP router typically
yields sub optimal results or is costly to run. This module introduces a framework to
transpile blocks of commuting gates by applying layers of a predefined swap strategy.
Further details can also be found here: https://arxiv.org/abs/2202.03459.
