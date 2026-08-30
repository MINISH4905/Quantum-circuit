---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/synthesis/linear_functions_synthesis.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/synthesis/linear_functions_synthesis.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/synthesis/linear_functions_synthesis.py`

Synthesize LinearFunctions.

## `LinearFunctionsToPermutations`

```python
class LinearFunctionsToPermutations(TransformationPass)
```

Promotes linear functions to permutations when possible.

### `run`

```python
def run(self, dag: DAGCircuit) -> DAGCircuit
```

Run the LinearFunctionsToPermutations pass on `dag`.
Args:
    dag: input dag.
Returns:
    Output dag with LinearFunctions synthesized.
