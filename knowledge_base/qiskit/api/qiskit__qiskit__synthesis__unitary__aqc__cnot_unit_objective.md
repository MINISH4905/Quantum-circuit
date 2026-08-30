---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/unitary/aqc/cnot_unit_objective.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/unitary/aqc/cnot_unit_objective.py
license: Apache-2.0
---

## Module `qiskit/synthesis/unitary/aqc/cnot_unit_objective.py`

A definition of the approximate circuit compilation optimization problem based on CNOT unit
definition.

## `CNOTUnitObjective`

```python
class CNOTUnitObjective(ApproximatingObjective, ABC)
```

A base class for a problem definition based on CNOT unit. This class may have different
subclasses for objective and gradient computations.

### `__init__`

```python
def __init__(self, num_qubits: int, cnots: np.ndarray) -> None
```

Args:
    num_qubits: number of qubits.
    cnots: a CNOT structure to be used in the optimization procedure.

### `num_cnots`

```python
def num_cnots(self)
```

Returns:
    A number of CNOT units to be used by the approximate circuit.

### `num_thetas`

```python
def num_thetas(self)
```

Returns:
    Number of parameters (angles) of rotation gates in this circuit.

## `DefaultCNOTUnitObjective`

```python
class DefaultCNOTUnitObjective(CNOTUnitObjective)
```

A naive implementation of the objective function based on CNOT units.

### `__init__`

```python
def __init__(self, num_qubits: int, cnots: np.ndarray) -> None
```

Args:
    num_qubits: number of qubits.
    cnots: a CNOT structure to be used in the optimization procedure.
