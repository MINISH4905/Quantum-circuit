---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/template_matching/backward_match.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/template_matching/backward_match.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/template_matching/backward_match.py`

Template matching in the backward direction, it takes an initial match, a
configuration of qubit, both circuit and template as inputs and the list
obtained from forward match. The result is a list of matches between the
template and the circuit.


**Reference:**

[1] Iten, R., Moyard, R., Metger, T., Sutter, D. and Woerner, S., 2020.
Exact and practical pattern matching for quantum circuit optimization.
`arXiv:1909.05270 <https://arxiv.org/abs/1909.05270>`_

## `Match`

```python
class Match
```

Object to represent a match and its qubit configurations.

### `__init__`

```python
def __init__(self, match, qubit, clbit)
```

Create a Match class with necessary arguments.
Args:
    match (list): list of matched gates.
    qubit (list): list of qubits configuration.
    clbit (list): list of clbits configuration.

## `MatchingScenarios`

```python
class MatchingScenarios
```

Class to represent a matching scenario.

### `__init__`

```python
def __init__(self, circuit_matched, circuit_blocked, template_matched, template_blocked, matches, counter)
```

Create a MatchingScenarios class with necessary arguments.
Args:
    circuit_matched (list): list of matchedwith attributes in the circuit.
    circuit_blocked (list): list of isblocked attributes in the circuit.
    template_matched (list): list of matchedwith attributes in the template.
    template_blocked (list): list of isblocked attributes in the template.
    matches (list): list of matches.
    counter (int): counter of the number of circuit gates already considered.

## `MatchingScenariosList`

```python
class MatchingScenariosList
```

Object to define a list of MatchingScenarios, with method to append
and pop elements.

### `__init__`

```python
def __init__(self)
```

Create an empty MatchingScenariosList.

### `append_scenario`

```python
def append_scenario(self, matching)
```

Append a scenario to the list.
Args:
    matching (MatchingScenarios): a scenario of match.

### `pop_scenario`

```python
def pop_scenario(self)
```

Pop the first scenario of the list.
Returns:
    MatchingScenarios: a scenario of match.

## `BackwardMatch`

```python
class BackwardMatch
```

Class BackwardMatch allows to run backward direction part of template
matching algorithm.

### `__init__`

```python
def __init__(self, circuit_dag_dep, template_dag_dep, forward_matches, node_id_c, node_id_t, qubits, clbits=None, heuristics_backward_param=None)
```

Create a ForwardMatch class with necessary arguments.
Args:
    circuit_dag_dep (DAGDependency): circuit in the dag dependency form.
    template_dag_dep (DAGDependency): template in the dag dependency form.
    forward_matches (list): list of match obtained in the forward direction.
    node_id_c (int): index of the first gate matched in the circuit.
    node_id_t (int): index of the first gate matched in the template.
    qubits (list): list of considered qubits in the circuit.
    clbits (list): list of considered clbits in the circuit.
    heuristics_backward_param (list): list that contains the two parameters for
    applying the heuristics (length and survivor).

### `run_backward_match`

```python
def run_backward_match(self)
```

Apply the forward match algorithm and returns the list of matches given an initial match
and a circuit qubits configuration.
