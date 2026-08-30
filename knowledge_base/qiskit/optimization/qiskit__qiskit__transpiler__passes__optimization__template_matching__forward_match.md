---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/template_matching/forward_match.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/template_matching/forward_match.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/template_matching/forward_match.py`

Template matching in the forward direction, it takes an initial
match, a configuration of qubit and both circuit and template as inputs. The
result is a list of match between the template and the circuit.


**Reference:**

[1] Iten, R., Moyard, R., Metger, T., Sutter, D. and Woerner, S., 2020.
Exact and practical pattern matching for quantum circuit optimization.
`arXiv:1909.05270 <https://arxiv.org/abs/1909.05270>`_

## `ForwardMatch`

```python
class ForwardMatch
```

Object to apply template matching in the forward direction.

### `__init__`

```python
def __init__(self, circuit_dag_dep, template_dag_dep, node_id_c, node_id_t, qubits, clbits=None)
```

Create a ForwardMatch class with necessary arguments.
Args:
    circuit_dag_dep (DAGDependency): circuit in the dag dependency form.
    template_dag_dep (DAGDependency): template in the dag dependency form.
    node_id_c (int): index of the first gate matched in the circuit.
    node_id_t (int): index of the first gate matched in the template.
    qubits (list): list of considered qubits in the circuit.
    clbits (list): list of considered clbits in the circuit.

### `run_forward_match`

```python
def run_forward_match(self)
```

Apply the forward match algorithm and returns the list of matches given an initial match
and a circuit qubits configuration.
