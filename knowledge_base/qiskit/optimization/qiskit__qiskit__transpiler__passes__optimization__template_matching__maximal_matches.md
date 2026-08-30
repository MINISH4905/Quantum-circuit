---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/template_matching/maximal_matches.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/template_matching/maximal_matches.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/template_matching/maximal_matches.py`

It stores all maximal matches from the given matches obtained by the template
matching algorithm.

## `Match`

```python
class Match
```

Class Match is an object to store a list of matches with its qubits and
clbits configuration.

### `__init__`

```python
def __init__(self, match, qubit, clbit)
```

Create a Match with necessary arguments.
Args:
    match (list): list of a match.
    qubit (list): list of qubits configuration.
    clbit (list): list of clbits configuration.

## `MaximalMatches`

```python
class MaximalMatches
```

Class MaximalMatches allows to sort and store the maximal matches from the list
of matches obtained with the template matching algorithm.

### `__init__`

```python
def __init__(self, template_matches)
```

Initialize MaximalMatches with the necessary arguments.
Args:
    template_matches (list): list of matches obtained from running the algorithm.

### `run_maximal_matches`

```python
def run_maximal_matches(self)
```

Method that extracts and stores maximal matches in decreasing length order.
