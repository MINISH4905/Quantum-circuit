---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/template_matching/template_substitution.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/template_matching/template_substitution.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/template_matching/template_substitution.py`

Template matching substitution, given a list of maximal matches it substitutes
them in circuit and creates a new optimized dag version of the circuit.

## `SubstitutionConfig`

```python
class SubstitutionConfig
```

Class to store the configuration of a given match substitution, which circuit
gates, template gates, qubits, and clbits and predecessors of the match
in the circuit.

### `has_parameters`

```python
def has_parameters(self)
```

Ensure that the template does not have parameters.

## `TemplateSubstitution`

```python
class TemplateSubstitution
```

Class to run the substitution algorithm from the list of maximal matches.

### `__init__`

```python
def __init__(self, max_matches, circuit_dag_dep, template_dag_dep, user_cost_dict=None)
```

Initialize TemplateSubstitution with necessary arguments.
Args:
    max_matches (list): list of maximal matches obtained from the running
     the template matching algorithm.
    circuit_dag_dep (DAGDependency): circuit in the dag dependency form.
    template_dag_dep (DAGDependency): template in the dag dependency form.
    user_cost_dict (Optional[dict]): user provided cost dictionary that will override
        the default cost dictionary.

### `run_dag_opt`

```python
def run_dag_opt(self)
```

It runs the substitution algorithm and creates the optimized DAGCircuit().
