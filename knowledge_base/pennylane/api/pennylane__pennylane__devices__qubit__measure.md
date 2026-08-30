---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/qubit/measure.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/qubit/measure.py
license: Apache-2.0
---

## Module `pennylane/devices/qubit/measure.py`

Code relevant for performing measurements on a state.

## `flatten_state`

```python
def flatten_state(state, num_wires)
```

Given a non-flat, potentially batched state, flatten it.

Args:
    state (TensorLike): A state that needs flattening
    num_wires (int): The number of wires the state represents

Returns:
    A flat state, with an extra batch dimension if necessary

## `state_diagonalizing_gates`

```python
def state_diagonalizing_gates(measurementprocess: StateMeasurement, state: TensorLike, is_state_batched: bool=False) -> TensorLike
```

Apply a measurement to state when the measurement process has an observable with diagonalizing gates.

Args:
    measurementprocess (StateMeasurement): measurement to apply to the state
    state (TensorLike): state to apply the measurement to
    is_state_batched (bool): whether the state is batched or not

Returns:
    TensorLike: the result of the measurement

## `csr_dot_products`

```python
def csr_dot_products(measurementprocess: ExpectationMP, state: TensorLike, is_state_batched: bool=False) -> TensorLike
```

Measure the expectation value of an observable using dot products between ``scipy.csr_matrix``
representations.

Args:
    measurementprocess (ExpectationMP): measurement process to apply to the state
    state (TensorLike): the state to measure
    is_state_batched (bool): whether the state is batched or not

Returns:
    TensorLike: the result of the measurement

## `full_dot_products`

```python
def full_dot_products(measurementprocess: ExpectationMP, state: TensorLike, is_state_batched: bool=False) -> TensorLike
```

Measure the expectation value of an observable using the dot product between full matrix
representations.

Args:
    measurementprocess (ExpectationMP): measurement process to apply to the state
    state (TensorLike): the state to measure
    is_state_batched (bool): whether the state is batched or not

Returns:
    TensorLike: the result of the measurement

## `sum_of_terms_method`

```python
def sum_of_terms_method(measurementprocess: ExpectationMP, state: TensorLike, is_state_batched: bool=False) -> TensorLike
```

Measure the expectation value of the state when the measured observable is a ``Hamiltonian`` or ``Sum``
and it must be backpropagation compatible.

Args:
    measurementprocess (ExpectationMP): measurement process to apply to the state
    state (TensorLike): the state to measure
    is_state_batched (bool): whether the state is batched or not

Returns:
    TensorLike: the result of the measurement

## `get_measurement_function`

```python
def get_measurement_function(measurementprocess: MeasurementProcess, state: TensorLike) -> Callable[[MeasurementProcess, TensorLike], TensorLike]
```

Get the appropriate method for performing a measurement.

Args:
    measurementprocess (MeasurementProcess): measurement process to apply to the state
    state (TensorLike): the state to measure
    is_state_batched (bool): whether the state is batched or not

Returns:
    Callable: function that returns the measurement result

## `measure`

```python
def measure(measurementprocess: MeasurementProcess, state: TensorLike, is_state_batched: bool=False) -> TensorLike
```

Apply a measurement process to a state.

Args:
    measurementprocess (MeasurementProcess): measurement process to apply to the state
    state (TensorLike): the state to measure
    is_state_batched (bool): whether the state is batched or not

Returns:
    Tensorlike: the result of the measurement
