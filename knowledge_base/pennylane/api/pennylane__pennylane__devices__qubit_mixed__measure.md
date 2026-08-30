---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/qubit_mixed/measure.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/qubit_mixed/measure.py
license: Apache-2.0
---

## Module `pennylane/devices/qubit_mixed/measure.py`

Code relevant for performing measurements on a qubit mixed state.

## `state_diagonalizing_gates`

```python
def state_diagonalizing_gates(measurementprocess: StateMeasurement, state: TensorLike, is_state_batched: bool=False, readout_errors: list[Callable]=None) -> TensorLike
```

Apply a measurement to state when the measurement process has an observable with diagonalizing gates.

Args:
    measurementprocess (StateMeasurement): measurement to apply to the state
    state (TensorLike): state to apply the measurement to
    is_state_batched (bool): whether the state is batched or not
    readout_errors (List[Callable]): List of channels to apply to each wire being measured
    to simulate readout errors.

Returns:
    TensorLike: the result of the measurement

## `csr_dot_products_density_matrix`

```python
def csr_dot_products_density_matrix(measurementprocess: ExpectationMP, state: TensorLike, is_state_batched: bool=False, readout_errors: list[Callable]=None) -> TensorLike
```

Measure the expectation value of an observable from a density matrix using dot products between
``scipy.csr_matrix`` representations.

For a density matrix :math:`ho` and observable :math:`O`, the expectation value is: .. math::       ext{Tr}(ho O),

Args:
    measurementprocess (ExpectationMP): measurement process to apply to the density matrix state
    state (TensorLike): the density matrix, reshaped to (dim, dim) if not batched,
        or (batch, dim, dim) if batched. Use _reshape_state_as_matrix for that.
    num_wires (int): the number of wires the state represents
    is_state_batched (bool): whether the state is batched or not

Returns:
    TensorLike: the result of the measurement

## `full_dot_products_density_matrix`

```python
def full_dot_products_density_matrix(measurementprocess: ExpectationMP, state: TensorLike, is_state_batched: bool=False, readout_errors: list[Callable]=None) -> TensorLike
```

Measure the expectation value of an observable from a density matrix using full matrix
multiplication.

For a density matrix ρ and observable O, the expectation value is:
.. math::   ext{Tr}(ho O).

Args:
    measurementprocess (ExpectationMP): measurement process to apply to the density matrix state
    state (TensorLike): the density matrix, reshaped via _reshape_state_as_matrix to
        (dim, dim) if not batched, or (batch, dim, dim) if batched.
    num_wires (int): the number of wires the state represents
    is_state_batched (bool): whether the state is batched or not

Returns:
    TensorLike: the result of the measurement

## `sum_of_terms_method`

```python
def sum_of_terms_method(measurementprocess: ExpectationMP, state: TensorLike, is_state_batched: bool=False, readout_errors: list[Callable]=None) -> TensorLike
```

Measure the expectation value of the state when the measured observable is a ``Hamiltonian`` or ``Sum``
and it must be backpropagation compatible.

Args:
    measurementprocess (ExpectationMP): measurement process to apply to the state
    state (TensorLike): the state to measure
    is_state_batched (bool): whether the state is batched or not

Returns:
    TensorLike: the expectation value of the sum of Hamiltonian observable with respect to the state.

## `get_measurement_function`

```python
def get_measurement_function(measurementprocess: MeasurementProcess, state: TensorLike) -> Callable[[MeasurementProcess, TensorLike, bool, list[Callable]], TensorLike]
```

Get the appropriate method for performing a measurement.

Args:
    measurementprocess (MeasurementProcess): measurement process to apply to the state.
    state (TensorLike): the state to measure.
    is_state_batched (bool): whether the state is batched or not.

Returns:
    Callable: function that returns the measurement result.

## `measure`

```python
def measure(measurementprocess: MeasurementProcess, state: TensorLike, is_state_batched: bool=False, readout_errors: list[Callable]=None) -> TensorLike
```

Apply a measurement process to a state.

Args:
    measurementprocess (MeasurementProcess): measurement process to apply to the state.
    state (TensorLike): the state to measure.
    is_state_batched (bool): whether the state is batched or not.
    readout_errors (List[Callable]): List of channels to apply to each wire being measured
    to simulate readout errors.

Returns:
    Tensorlike: the result of the measurement process being applied to the state.
