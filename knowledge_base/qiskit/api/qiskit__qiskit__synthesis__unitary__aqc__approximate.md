---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/unitary/aqc/approximate.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/unitary/aqc/approximate.py
license: Apache-2.0
---

## Module `qiskit/synthesis/unitary/aqc/approximate.py`

Base classes for an approximate circuit definition.

## `ApproximateCircuit`

```python
class ApproximateCircuit(QuantumCircuit, ABC)
```

A base class that represents an approximate circuit.

### `__init__`

```python
def __init__(self, num_qubits: int, name: str | None=None) -> None
```

Args:
    num_qubits: number of qubits this circuit will span.
    name: a name of the circuit.

### `thetas`

```python
def thetas(self) -> np.ndarray
```

The property is not implemented and raises a ``NotImplementedError`` exception.

Returns:
    a vector of parameters of this circuit.

### `build`

```python
def build(self, thetas: np.ndarray) -> None
```

Constructs this circuit out of the parameters(thetas). Parameter values must be set before
    constructing the circuit.

Args:
    thetas: a vector of parameters to be set in this circuit.

## `ApproximatingObjective`

```python
class ApproximatingObjective(ABC)
```

A base class for an optimization problem definition. An implementing class must provide at least
an implementation of the ``objective`` method. In such case only gradient free optimizers can
be used. Both methods, ``objective`` and ``gradient``, are preferable to have in an implementation.

### `objective`

```python
def objective(self, param_values: np.ndarray) -> SupportsFloat
```

Computes a value of the objective function given a vector of parameter values.

Args:
    param_values: a vector of parameter values for the optimization problem.

Returns:
    a float value of the objective function.

### `gradient`

```python
def gradient(self, param_values: np.ndarray) -> np.ndarray
```

Computes a gradient with respect to parameters given a vector of parameter values.

Args:
    param_values: a vector of parameter values for the optimization problem.

Returns:
    an array of gradient values.

### `target_matrix`

```python
def target_matrix(self) -> np.ndarray
```

Returns:
    a matrix being approximated

### `target_matrix`

```python
def target_matrix(self, target_matrix: np.ndarray) -> None
```

Args:
    target_matrix: a matrix to approximate in the optimization procedure.

### `num_thetas`

```python
def num_thetas(self) -> int
```

Returns:
    the number of parameters in this optimization problem.
