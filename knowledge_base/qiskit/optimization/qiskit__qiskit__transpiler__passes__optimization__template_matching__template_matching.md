---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/template_matching/template_matching.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/template_matching/template_matching.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/template_matching/template_matching.py`

Template matching for all possible qubit configurations and initial matches. It
returns the list of all matches obtained from this algorithm.


**Reference:**

[1] Iten, R., Moyard, R., Metger, T., Sutter, D. and Woerner, S., 2020.
Exact and practical pattern matching for quantum circuit optimization.
`arXiv:1909.05270 <https://arxiv.org/abs/1909.05270>`_

## `TemplateMatching`

```python
class TemplateMatching
```

Class TemplatingMatching allows to apply the full template matching algorithm.

### `__init__`

```python
def __init__(self, circuit_dag_dep, template_dag_dep, heuristics_qubits_param=None, heuristics_backward_param=None)
```

Create a TemplateMatching object with necessary arguments.
Args:
    circuit_dag_dep (QuantumCircuit): circuit.
    template_dag_dep (QuantumCircuit): template.
    heuristics_backward_param (list[int]): [length, survivor]
    heuristics_qubits_param (list[int]): [length]

### `run_template_matching`

```python
def run_template_matching(self)
```

Run the complete algorithm for finding all maximal matches for the given template and
circuit. First it fixes the configuration of the circuit due to the first match.
Then it explores all compatible qubit configurations of the circuit. For each
qubit configurations, we apply first the Forward part of the algorithm  and then
the Backward part of the algorithm. The longest matches for the given configuration
are stored. Finally, the list of stored matches is sorted.
