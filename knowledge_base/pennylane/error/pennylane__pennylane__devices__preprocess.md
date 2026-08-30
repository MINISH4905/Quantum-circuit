---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/devices/preprocess.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/preprocess.py
license: Apache-2.0
---

## Error surface of `pennylane/devices/preprocess.py`

### Validation

## `validate_device_wires`

```python
def validate_device_wires(tape: QuantumScript, wires: Wires | None=None, name: str='device') -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Validates that all wires present in the tape are in the set of provided wires. Adds the
device wires to measurement processes like :class:`~.measurements.StateMP` that are broadcasted
across all available wires.

Args:
    tape (QuantumTape or QNode or Callable): a quantum circuit.
    wires=None (Optional[Wires]): the allowed wires. Wires of ``None`` allows any wires
        to be present in the tape.
    name="device" (str): the name of the device to use in error messages.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]:

    The unaltered input circuit. The output type is explained in :func:`qp.transform <pennylane.transform>`.

Raises:
    WireError: if the tape has a wire not present in the provided wires, or if abstract wires are present.

## `validate_multiprocessing_workers`

```python
def validate_multiprocessing_workers(tape: QuantumScript, max_workers: int, device) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Validates the number of workers for multiprocessing.

Checks that the CPU is not oversubscribed and warns user if it is,
making suggestions for the number of workers and/or the number of
threads per worker.

Args:
    tape (QuantumTape or .QNode or Callable): a quantum circuit.
    max_workers (int): Maximal number of multiprocessing workers
    device (pennylane.devices.Device): The device to be checked.

Returns:
    qnode (pennylane.QNode) or quantum function (callable) or tuple[List[.QuantumTape], function]:

    The unaltered input circuit. The output type is explained in :func:`qp.transform <pennylane.transform>`.

## `validate_adjoint_trainable_params`

```python
def validate_adjoint_trainable_params(tape: QuantumScript) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Raises a warning if any of the observables is trainable, and raises an error if any
trainable parameters belong to state-prep operations. Can be used in validating circuits
for adjoint differentiation.

## `validate_observables`

```python
def validate_observables(tape: QuantumScript, stopping_condition: Callable[[Operator], bool], stopping_condition_shots: Callable[[Operator], bool] | None=None, name: str='device') -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Validates the observables and measurements for a circuit.

Args:
    tape (QuantumTape or QNode or Callable): a quantum circuit.
    stopping_condition (callable): a function that specifies whether an observable is accepted.
    stopping_condition_shots (callable): a function that specifies whether an observable is
        accepted in finite-shots mode. This replaces ``stopping_condition`` if and only if the
        tape has shots.
    name (str): the name of the device to use in error messages.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[.QuantumTape], function]:

    The unaltered input circuit. The output type is explained in :func:`qp.transform <pennylane.transform>`.

Raises:
    ~pennylane.DeviceError: if an observable is not supported

**Example:**

>>> def accepted_observable(obj):
...    return obj.name in {"PauliX", "PauliY", "PauliZ"}
>>> tape = qp.tape.QuantumScript([], [qp.expval(qp.Z(0) + qp.Y(0))])
>>> validate_observables(tape, accepted_observable)
Traceback (most recent call last):
...
pennylane.exceptions.DeviceError: Observable Z(0) + Y(0) not supported on device

## `validate_measurements`

```python
def validate_measurements(tape: QuantumScript, analytic_measurements=None, sample_measurements=None, name='device') -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Validates the supported state and sample based measurement processes.

Args:
    tape (QuantumTape, .QNode, Callable): a quantum circuit.
    analytic_measurements (Callable[[MeasurementProcess], bool]): a function from a measurement process
        to whether or not it is accepted in analytic simulations.
    sample_measurements (Callable[[MeasurementProcess], bool]): a function from a measurement process
        to whether or not it accepted for finite shot simulations.
    name (str): the name to use in error messages.

Returns:
    qnode (pennylane.QNode) or quantum function (callable) or tuple[List[.QuantumTape], function]:

    The unaltered input circuit. The output type is explained in :func:`qp.transform <pennylane.transform>`.

Raises:
    ~pennylane.DeviceError: if a measurement process is not supported.

>>> def analytic_measurements(m):
...     return isinstance(m, qp.measurements.StateMP)
>>> def shots_measurements(m):
...     return isinstance(m, qp.measurements.CountsMP)
>>> tape = qp.tape.QuantumScript([], [qp.expval(qp.Z(0))])
>>> validate_measurements(tape, analytic_measurements, shots_measurements)
Traceback (most recent call last):
...
pennylane.exceptions.DeviceError: Measurement expval(Z(0)) not accepted for analytic simulation on device.
>>> tape = qp.tape.QuantumScript([], [qp.sample()], shots=10)
>>> validate_measurements(tape, analytic_measurements, shots_measurements)
Traceback (most recent call last):
...
pennylane.exceptions.DeviceError: Measurement sample(wires=[]) not accepted with finite shots on device
