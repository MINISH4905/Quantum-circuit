---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/unitary/aqc/cnot_unit_circuit.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/unitary/aqc/cnot_unit_circuit.py
license: Apache-2.0
---

## Module `qiskit/synthesis/unitary/aqc/cnot_unit_circuit.py`

This is the Parametric Circuit class: anything that you need for a circuit
to be parametrized and used for approximate compiling optimization.

## `CNOTUnitCircuit`

```python
class CNOTUnitCircuit(ApproximateCircuit)
```

A class that represents an approximate circuit based on CNOT unit blocks.

### `__init__`

```python
def __init__(self, num_qubits: int, cnots: np.ndarray, tol: float | None=0.0, name: str | None=None) -> None
```

Args:
    num_qubits: the number of qubits in this circuit.
    cnots: an array of dimensions ``(2, L)`` indicating where the CNOT units will be placed.
    tol: angle parameter less or equal this (small) value is considered equal zero and
        corresponding gate is not inserted into the output circuit (because it becomes
        identity one in this case).
    name: name of this circuit

Raises:
    ValueError: if an unsupported parameter is passed.

### `thetas`

```python
def thetas(self) -> np.ndarray
```

Returns a vector of rotation angles used by CNOT units in this circuit.

Returns:
    Parameters of the rotation gates in this circuit.

### `build`

```python
def build(self, thetas: np.ndarray) -> None
```

Constructs a Qiskit quantum circuit out of the parameters (angles) of this circuit. If a
    parameter value is less in absolute value than the specified tolerance then the
    corresponding rotation gate will be skipped in the circuit.
