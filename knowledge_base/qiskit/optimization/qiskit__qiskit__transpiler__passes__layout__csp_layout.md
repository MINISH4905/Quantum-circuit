---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/layout/csp_layout.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/layout/csp_layout.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/layout/csp_layout.py`

A pass for choosing a Layout of a circuit onto a Coupling graph, as a
Constraint Satisfaction Problem. It tries to find a solution that fully
satisfies the circuit, i.e. no further swap is needed. If no solution is
found, no ``property_set['layout']`` is set.

## `CSPLayout`

```python
class CSPLayout(AnalysisPass)
```

If possible, chooses a Layout as a CSP, using backtracking.

### `__init__`

```python
def __init__(self, coupling_map, strict_direction=False, seed=None, call_limit=1000, time_limit=10)
```

If possible, chooses a Layout as a CSP, using backtracking.

If not possible, does not set the layout property. In all the cases,
the property `CSPLayout_stop_reason` will be added with one of the
following values:

* solution found: If a perfect layout was found.
* nonexistent solution: If no perfect layout was found and every combination was checked.
* call limit reached: If no perfect layout was found and the call limit was reached.
* time limit reached: If no perfect layout was found and the time limit was reached.

Args:
    coupling_map (Union[CouplingMap, Target]): Directed graph representing a coupling map.
    strict_direction (bool): If True, considers the direction of the coupling map.
                             Default is False.
    seed (int): Sets the seed of the PRNG.
    call_limit (int): Amount of times that
        ``constraint.RecursiveBacktrackingSolver.recursiveBacktracking`` will be called.
        None means no call limit. Default: 1000.
    time_limit (int): Amount of seconds that the pass will try to find a solution.
        None means no time limit. Default: 10 seconds.

### `run`

```python
def run(self, dag)
```

run the layout method
