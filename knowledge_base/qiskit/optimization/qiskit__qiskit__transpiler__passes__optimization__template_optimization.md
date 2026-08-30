---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/template_optimization.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/template_optimization.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/template_optimization.py`

Given a template and a circuit: it applies template matching and substitutes
all compatible maximal matches that reduces the size of the circuit.

**Reference:**

[1] Iten, R., Moyard, R., Metger, T., Sutter, D. and Woerner, S., 2020.
Exact and practical pattern matching for quantum circuit optimization.
`arXiv:1909.05270 <https://arxiv.org/abs/1909.05270>`_

## `TemplateOptimization`

```python
class TemplateOptimization(TransformationPass)
```

Class for the template optimization pass.

### `__init__`

```python
def __init__(self, template_list=None, heuristics_qubits_param=None, heuristics_backward_param=None, user_cost_dict=None)
```

Args:
    template_list (list[QuantumCircuit()]): list of the different template circuit to apply.
    heuristics_backward_param (list[int]): [length, survivor] Those are the parameters for
        applying heuristics on the backward part of the algorithm. This part of the
        algorithm creates a tree of matching scenario. This tree grows exponentially. The
        heuristics evaluate which scenarios have the longest match and keep only those.
        The length is the interval in the tree for cutting it and survivor is the number
        of scenarios that are kept. We advise to use l=3 and s=1 to have serious time
        advantage. We remind that the heuristics implies losing a part of the maximal
        matches. Check reference for more details.
    heuristics_qubits_param (list[int]): [length] The heuristics for the qubit choice make
        guesses from the dag dependency of the circuit in order to limit the number of
        qubit configurations to explore. The length is the number of successors or not
        predecessors that will be explored in the dag dependency of the circuit, each
        qubits of the nodes are added to the set of authorized qubits. We advise to use
        length=1. Check reference for more details.
    user_cost_dict (Dict[str, int]): quantum cost dictionary passed to TemplateSubstitution
        to configure its behavior. This will override any default values if None
        is not given. The key is the name of the gate and the value its quantum cost.

### `run`

```python
def run(self, dag)
```

Args:
    dag(DAGCircuit): DAG circuit.
Returns:
    DAGCircuit: optimized DAG circuit.
Raises:
    TranspilerError: If the template has not the right form or
     if the output circuit acts differently as the input circuit.
