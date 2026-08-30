---
framework: qiskit
api_version: 2.5.2
doc_type: error
source_path: qiskit/providers/basic_provider/basic_simulator.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/providers/basic_provider/basic_simulator.py
license: Apache-2.0
---

## Error surface of `qiskit/providers/basic_provider/basic_simulator.py`

### Validation

### `BasicSimulator._validate_initial_statevector`

```python
def _validate_initial_statevector(self) -> None
```

Validate an initial statevector

### `BasicSimulator._validate_measure_sampling`

```python
def _validate_measure_sampling(self, circuit: QuantumCircuit) -> None
```

Determine if measure sampling is allowed for an experiment

### `BasicSimulator._validate`

```python
def _validate(self, run_input: list[QuantumCircuit]) -> None
```

Semantic validations of the input.
