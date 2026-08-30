---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/evolution/evolution_synthesis.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/evolution/evolution_synthesis.py
license: Apache-2.0
---

## Module `qiskit/synthesis/evolution/evolution_synthesis.py`

Evolution synthesis.

## `EvolutionSynthesis`

```python
class EvolutionSynthesis(ABC)
```

Interface for evolution synthesis algorithms.

### `synthesize`

```python
def synthesize(self, evolution)
```

Synthesize a ``qiskit.circuit.library.PauliEvolutionGate``.

Args:
    evolution (PauliEvolutionGate): The evolution gate to synthesize.

Returns:
    QuantumCircuit: A circuit implementing the evolution.

### `settings`

```python
def settings(self) -> dict[str, Any]
```

Return the settings in a dictionary, which can be used to reconstruct the object.

Returns:
    A dictionary containing the settings of this product formula.

Raises:
    NotImplementedError: The interface does not implement this method.
