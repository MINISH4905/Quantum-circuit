---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/states/quantum_state.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/states/quantum_state.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/states/quantum_state.py`

Abstract QuantumState class.

## `QuantumState`

```python
class QuantumState
```

Abstract quantum state base class

### `__init__`

```python
def __init__(self, op_shape: OpShape | None=None)
```

Initialize a QuantumState object.

Args:
    op_shape (OpShape):  an OpShape object for state dimensions.

.. note::

    If ``op_shape`` is specified it will take precedence over other
    kwargs.

### `dim`

```python
def dim(self)
```

Return total state dimension.

### `num_qubits`

```python
def num_qubits(self)
```

Return the number of qubits if a N-qubit state or None otherwise.

### `dims`

```python
def dims(self, qargs=None)
```

Return tuple of input dimension for specified subsystems.

### `copy`

```python
def copy(self)
```

Make a copy of current operator.

### `seed`

```python
def seed(self, value=None)
```

Set the seed for the quantum state RNG.

### `is_valid`

```python
def is_valid(self, atol=None, rtol=None)
```

Return True if a valid quantum state.

### `to_operator`

```python
def to_operator(self)
```

Convert state to matrix operator class

### `conjugate`

```python
def conjugate(self)
```

Return the conjugate of the operator.

### `trace`

```python
def trace(self)
```

Return the trace of the quantum state as a density matrix.

### `purity`

```python
def purity(self)
```

Return the purity of the quantum state.

### `tensor`

```python
def tensor(self, other: QuantumState) -> QuantumState
```

Return the tensor product state self ⊗ other.

Args:
    other (QuantumState): a quantum state object.

Returns:
    QuantumState: the tensor product operator self ⊗ other.

Raises:
    QiskitError: if other is not a quantum state.

### `expand`

```python
def expand(self, other: QuantumState) -> QuantumState
```

Return the tensor product state other ⊗ self.

Args:
    other (QuantumState): a quantum state object.

Returns:
    QuantumState: the tensor product state other ⊗ self.

Raises:
    QiskitError: if other is not a quantum state.

### `evolve`

```python
def evolve(self, other: Operator | QuantumChannel, qargs: list | None=None) -> QuantumState
```

Evolve a quantum state by the operator.

Args:
    other (Operator or QuantumChannel): The operator to evolve by.
    qargs (list): a list of QuantumState subsystem positions to apply
                   the operator on.

Returns:
    QuantumState: the output quantum state.

Raises:
    QiskitError: if the operator dimension does not match the
                 specified QuantumState subsystem dimensions.

### `expectation_value`

```python
def expectation_value(self, oper: BaseOperator, qargs: None | list=None) -> complex
```

Compute the expectation value of an operator.

Args:
    oper (BaseOperator): an operator to evaluate expval.
    qargs (None or list): subsystems to apply the operator on.

Returns:
    complex: the expectation value.

### `probabilities`

```python
def probabilities(self, qargs: None | list=None, decimals: None | int=None) -> np.ndarray
```

Return the subsystem measurement probability vector.

Measurement probabilities are with respect to measurement in the
computation (diagonal) basis.

Args:
    qargs (None or list): subsystems to return probabilities for,
        if None return for all subsystems (Default: None).
    decimals (None or int): the number of decimal places to round
        values. If None no rounding is done (Default: None).

Returns:
    np.array: The Numpy vector array of probabilities.

### `probabilities_dict`

```python
def probabilities_dict(self, qargs: None | list=None, decimals: None | int=None) -> dict
```

Return the subsystem measurement probability dictionary.

Measurement probabilities are with respect to measurement in the
computation (diagonal) basis.

This dictionary representation uses a Ket-like notation where the
dictionary keys are qudit strings for the subsystem basis vectors.
If any subsystem has a dimension greater than 10 comma delimiters are
inserted between integers so that subsystems can be distinguished.

Args:
    qargs (None or list): subsystems to return probabilities for,
        if None return for all subsystems (Default: None).
    decimals (None or int): the number of decimal places to round
        values. If None no rounding is done (Default: None).

Returns:
    dict: The measurement probabilities in dict (ket) form.

### `sample_memory`

```python
def sample_memory(self, shots: int, qargs: None | list=None) -> np.ndarray
```

Sample a list of qubit measurement outcomes in the computational basis.

Args:
    shots (int): number of samples to generate.
    qargs (None or list): subsystems to sample measurements for,
                        if None sample measurement of all
                        subsystems (Default: None).

Returns:
    np.array: list of sampled counts in the order sampled.

Additional Information:

    This function *samples* measurement outcomes using the measure
    :meth:`probabilities` for the current state and `qargs`. It does
    not actually implement the measurement so the current state is
    not modified.

    The seed for random number generator used for sampling can be
    set to a fixed value by using the state's :meth:`seed` method.

### `sample_counts`

```python
def sample_counts(self, shots: int, qargs: None | list=None) -> Counts
```

Sample a dict of qubit measurement outcomes in the computational basis.

Args:
    shots (int): number of samples to generate.
    qargs (None or list): subsystems to sample measurements for,
                        if None sample measurement of all
                        subsystems (Default: None).

Returns:
    Counts: sampled counts dictionary.

Additional Information:

    This function *samples* measurement outcomes using the measure
    :meth:`probabilities` for the current state and `qargs`. It does
    not actually implement the measurement so the current state is
    not modified.

    The seed for random number generator used for sampling can be
    set to a fixed value by using the state's :meth:`seed` method.

### `measure`

```python
def measure(self, qargs: list | None=None) -> tuple
```

Measure subsystems and return outcome and post-measure state.

Note that this function uses the QuantumStates internal random
number generator for sampling the measurement outcome. The RNG
seed can be set using the :meth:`seed` method.

Args:
    qargs (list or None): subsystems to sample measurements for,
                          if None sample measurement of all
                          subsystems (Default: None).

Returns:
    tuple: the pair ``(outcome, state)`` where ``outcome`` is the
           measurement outcome string label, and ``state`` is the
           collapsed post-measurement state for the corresponding
           outcome.
