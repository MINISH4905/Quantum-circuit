---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/qutrit_mixed/measure.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/qutrit_mixed/measure.py
license: Apache-2.0
---

## Module `pennylane/devices/qutrit_mixed/measure.py`

Code relevant for performing measurements on a qutrit mixed state.

## `calculate_expval`

```python
def calculate_expval(measurementprocess: ExpectationMP, state: TensorLike, is_state_batched: bool=False, readout_errors: list[Callable]=None) -> TensorLike
```

Measure the expectation value of an observable.

Args:
    measurementprocess (ExpectationMP): measurement process to apply to the state.
    state (TensorLike): the state to measure.
    is_state_batched (bool): whether the state is batched or not.
    readout_errors (List[Callable]): List of chanels to apply to each wire being measured
    to simulate readout errors.

Returns:
    TensorLike: expectation value of observable wrt the state.

## `calculate_reduced_density_matrix`

```python
def calculate_reduced_density_matrix(measurementprocess: StateMeasurement, state: TensorLike, is_state_batched: bool=False, _readout_errors: list[Callable]=None) -> TensorLike
```

Get the state or reduced density matrix.

Args:
    measurementprocess (StateMeasurement): measurement to apply to the state.
    state (TensorLike): state to apply the measurement to.
    is_state_batched (bool): whether the state is batched or not.
    _readout_errors (List[Callable]): List of channels to apply to each wire being measured
    to simulate readout errors. These are not applied on this type of measurement.

Returns:
    TensorLike: state or reduced density matrix.

## `calculate_probability`

```python
def calculate_probability(measurementprocess: StateMeasurement, state: TensorLike, is_state_batched: bool=False, readout_errors: list[Callable]=None) -> TensorLike
```

Find the probability of measuring states.

Args:
    measurementprocess (StateMeasurement): measurement to apply to the state.
    state (TensorLike): state to apply the measurement to.
    is_state_batched (bool): whether the state is batched or not.
    readout_errors (List[Callable]): List of channels to apply to each wire being measured
    to simulate readout errors.

Returns:
    TensorLike: the probability of the state being in each measurable state.

## `calculate_variance`

```python
def calculate_variance(measurementprocess: StateMeasurement, state: TensorLike, is_state_batched: bool=False, readout_errors: list[Callable]=None) -> TensorLike
```

Find variance of observable.

Args:
    measurementprocess (StateMeasurement): measurement to apply to the state.
    state (TensorLike): state to apply the measurement to.
    is_state_batched (bool): whether the state is batched or not.
    readout_errors (List[Callable]): List of operators to apply to each wire being measured
    to simulate readout errors.

Returns:
    TensorLike: the variance of the observable wrt the state.

## `calculate_expval_sum_of_terms`

```python
def calculate_expval_sum_of_terms(measurementprocess: ExpectationMP, state: TensorLike, is_state_batched: bool=False, readout_errors: list[Callable]=None) -> TensorLike
```

Measure the expectation value of the state when the measured observable is a ``Hamiltonian`` or ``Sum``
and it must be backpropagation compatible.

Args:
    measurementprocess (ExpectationMP): measurement process to apply to the state.
    state (TensorLike): the state to measure.
    is_state_batched (bool): whether the state is batched or not.
    readout_errors (List[Callable]): List of channels to apply to each wire being measured
    to simulate readout errors.

Returns:
    TensorLike: the expectation value of the sum of Hamiltonian observable wrt the state.

## `get_measurement_function`

```python
def get_measurement_function(measurementprocess: MeasurementProcess) -> Callable[[MeasurementProcess, TensorLike, bool, list[Callable]], TensorLike]
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
