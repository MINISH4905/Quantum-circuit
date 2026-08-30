---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/dagcircuit/dagcircuit.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/dagcircuit/dagcircuit.py
license: Apache-2.0
---

## Module `qiskit/dagcircuit/dagcircuit.py`

Object to represent a quantum circuit as a directed acyclic graph (DAG).

The nodes in the graph are either input/output nodes or operation nodes.
The edges correspond to qubits or bits in the circuit. A directed edge
from node A to node B means that the (qu)bit passes from the output of A
to the input of B. The object's methods allow circuits to be constructed,
composed, and modified. Some natural properties like depth can be computed
directly from the graph.
