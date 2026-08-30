---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/light_cone.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/light_cone.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/light_cone.py`

Cancel the redundant (self-adjoint) gates through commutation relations.

## `LightCone`

```python
class LightCone(TransformationPass)
```

Remove the gates that do not affect the outcome of a measurement on a circuit.

Pass for computing the light-cone of an observable or measurement. The Pass can handle
either an observable one would like to measure or a measurement on a set of qubits.

### `__init__`

```python
def __init__(self, bit_terms: str | None=None, indices: list[int] | None=None) -> None
```

Args:
    bit_terms: If ``None`` the light-cone will be computed for the set of measurements
        in the circuit. If a string is specified, the light-cone will correspond to the
        reduced circuit with the same expectation value for the observable.
    indices: list of non-trivial indices corresponding to the observable in ``bit_terms``.

### `run`

```python
def run(self, dag: DAGCircuit) -> DAGCircuit
```

Run the LightCone pass on `dag`.

Args:
    dag: The DAG to reduce.

Returns:
    The DAG reduced to the light-cone of the observable.
