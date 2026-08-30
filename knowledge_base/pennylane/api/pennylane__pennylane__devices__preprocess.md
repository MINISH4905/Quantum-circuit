---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/preprocess.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/preprocess.py
license: Apache-2.0
---

## Module `pennylane/devices/preprocess.py`

This module contains functions for preprocessing `QuantumTape` objects to ensure
that they are supported for execution by a device.

## `null_postprocessing`

```python
def null_postprocessing(results)
```

A postprocessing function returned by a transform that only converts the batch of results
into a result for a single ``QuantumTape``.

## `no_sampling`

```python
def no_sampling(tape: QuantumScript, name: str='device') -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Raises an error if the tape has finite shots.

Args:
    tape (QuantumTape or .QNode or Callable): a quantum circuit
    name (str): name to use in error message.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[.QuantumTape], function]:

    The unaltered input circuit. The output type is explained in :func:`qp.transform <pennylane.transform>`.


This transform can be added to forbid finite shots. For example, ``default.qubit`` uses it for
adjoint and backprop validation.

## `no_analytic`

```python
def no_analytic(tape: QuantumScript, name: str='device') -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Raises an error if the tape does not have finite shots.
Args:
    tape (QuantumTape or .QNode or Callable): a quantum circuit
    name (str): name to use in error message.
Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[.QuantumTape], function]:
    The unaltered input circuit. The output type is explained in :func:`qp.transform <pennylane.transform>`.


This transform can be added to forbid analytic results. This is relevant for devices
that can only return samples and/or counts based results.

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

## `decompose`

```python
def decompose(tape: QuantumScript, stopping_condition: Callable[[Operator], bool], stopping_condition_shots: Callable[[Operator], bool] | None=None, skip_initial_state_prep: bool=True, decomposer: Callable[[Operator], Sequence[Operator]] | None=None, device_wires: Wires | None=None, num_work_wires: int | None=None, target_gates: set | dict | None=None, fixed_decomps: dict | None=None, alt_decomps: dict | None=None, name: str='device', error: type[Exception] | None=None, strict: bool=True) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Decompose operations until the stopping condition is met.

Args:
    tape (QuantumScript or QNode or Callable): a quantum circuit.
    stopping_condition (Callable): a function from an operator to a boolean. If ``False``,
        the operator should be decomposed. If an operator cannot be decomposed and is not
        accepted by ``stopping_condition``, an ``Exception`` will be raised (of a type
        specified by the ``error`` keyword argument).

Keyword Args:
    stopping_condition_shots (Callable): a function from an operator to a boolean. If
        ``False``, the operator should be decomposed. This replaces ``stopping_condition``
        if and only if the tape has shots.
    skip_initial_state_prep (bool): If ``True``, the first operator will not be decomposed if
        it inherits from :class:`~.StatePrepBase`. Defaults to ``True``.
    decomposer (Callable): an optional callable that takes an operator and implements the
        relevant decomposition. If ``None``, defaults to using a callable returning
        ``op.decomposition()`` for any :class:`~.Operator` .
    device_wires (Wires): The device wires. If provided along with ``target_gates`` and
        graph-based decomposition is enabled, will be used to infer available work wires.
    num_work_wires (int): Number of work wires to be used if the graph-based decomposition
        is enabled. If ``device_wires`` are given, they take precedence over ``num_work_wires``
    target_gates (set or dict): Target gate set to be used if the graph-based decomposition
        is enabled. See :func:`qp.decompose <pennylane.transforms.decompose>` for more details.
    fixed_decomps (dict): Fixed decomposition rules to be used if the graph-based decomposition
        is enabled. See :func:`qp.decompose <pennylane.transforms.decompose>` for more details.
    alt_decomps (dict): Alternative decomposition rules to be used if the graph-based
        decomposition is enabled. See :func:`qp.decompose <pennylane.transforms.decompose>`
        for more details.
    name (str): The name of the transform, process or device using decompose. Used in the
        error message. Defaults to "device".
    error (type): An error type to raise if it is not possible to obtain a decomposition that
        fulfills the ``stopping_condition``. Defaults to ``DeviceError``.
    strict (bool): If ``False``, operators that do not define a decomposition will be treated
        as supported. Defaults to ``True``

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumScript], function]:

    The decomposed circuit. The output type is explained in :func:`qp.transform <pennylane.transform>`.

.. seealso::

    This transform is intended for device developers. See
    :func:`qp.decompose <pennylane.transforms.decompose>` for a more user-friendly
    interface.

Raises:
    Exception: Type defaults to ``DeviceError`` but can be modified via keyword argument.
        Raised if an operator is not accepted and does not define a decomposition, or if
        the decomposition enters an infinite loop and raises a ``RecursionError``.

**Example:**

>>> import pennylane as qp
>>> def stopping_condition(obj):
...     return obj.name in {"CNOT", "RX", "RZ"}
>>> tape = qp.tape.QuantumScript([qp.IsingXX(1.2, wires=(0,1))], [qp.expval(qp.Z(0))])
>>> batch, fn = decompose(tape, stopping_condition)
>>> batch[0].circuit
[CNOT(wires=[0, 1]),
RX(1.2, wires=[0]),
CNOT(wires=[0, 1]),
expval(Z(0))]

If an operator cannot be decomposed into a supported operation, an error is raised:

>>> decompose(tape, lambda obj: obj.name == "S")
Traceback (most recent call last):
...
pennylane.exceptions.DeviceError: Operator CNOT(wires=[0, 1]) not supported with device and does not provide a decomposition.

The ``skip_initial_state_prep`` specifies whether the device supports state prep operations
at the beginning of the circuit.

>>> tape = qp.tape.QuantumScript([qp.BasisState([1], wires=0), qp.BasisState([1], wires=1)])
>>> batch, fn = decompose(tape, stopping_condition)
>>> batch[0].circuit
[BasisState(array([1]), wires=[0]), RX(3.141592653589793, wires=[1])]
>>> batch, fn = decompose(tape, stopping_condition, skip_initial_state_prep=False)
>>> batch[0].circuit
[RX(3.141592653589793, wires=[0]), RX(3.141592653589793, wires=[1])]

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

## `measurements_from_samples`

```python
def measurements_from_samples(tape)
```

Quantum function transform that replaces all terminal measurements from a tape with a single
:func:`pennylane.sample` measurement, and adds postprocessing functions for each original measurement.

This transform can be used to make tapes compatible with device backends that only return
:func:`pennylane.sample`. The final output will return the initial requested measurements, calculated instead from
the raw samples returned immediately after execution.

The transform is only applied if the tape is being executed with shots.

.. note::
    This transform diagonalizes all the operations on the tape. An error will
    be raised if non-commuting terms are encountered. To avoid non-commuting
    terms in circuit measurements, the :func:`split_non_commuting <pennylane.transforms.split_non_commuting>`
    transform can be applied.

Args:
    tape (QNode or QuantumTape or Callable): A quantum circuit.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]: The
    transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

**Example**

Consider the tape:

>>> ops = [qp.X(0), qp.RY(1.23, 1)]
>>> measurements = [qp.expval(qp.Y(0)), qp.probs(wires=[1])]
>>> tape = qp.tape.QuantumScript(ops, measurements, shots=10)

We can apply the transform to diagonalize and convert the two measurements to a single `sample` measurement:

>>> (new_tape, ), fn = qp.devices.preprocess.measurements_from_samples(tape)
>>> new_tape.measurements
[sample(wires=[0, 1])]

The tape operations now include diagonalizing gates.

>>> new_tape.operations
[X(0), RY(1.23, wires=[1]), RX(1.5707963267948966, wires=[0])]

Executing the tape returns samples that can be post-processed to get the originally requested measurements:

>>> dev = qp.device("default.qubit", seed=42)
>>> res = dev.execute(new_tape)
>>> res
array([[1, 0],
       [0, 1],
       [1, 1],
       [1, 0],
       [0, 0],
       [1, 1],
       [1, 0],
       [1, 0],
       [0, 0],
       [0, 1]])
>>> fn((res,))
[np.float64(-0.2), array([0.6, 0.4])]

## `measurements_from_counts`

```python
def measurements_from_counts(tape)
```

Quantum function transform that replaces all terminal measurements from a tape with a single
:func:`pennylane.counts` measurement, and adds postprocessing functions for each original measurement.

This transform can be used to make tapes compatible with device backends that only return
:func:`pennylane.counts`. The final output will return the initial requested measurements, calculated instead from
the raw counts returned immediately after execution.

The transform is only applied if the tape is being executed with shots.

.. note::
    This transform diagonalizes all the operations on the tape. An error will
    be raised if non-commuting terms are encountered. To avoid non-commuting
    terms in circuit measurements, the :func:`split_non_commuting <pennylane.transforms.split_non_commuting>`
    transform can be applied.

Args:
    tape (QNode or QuantumTape or Callable): A quantum circuit.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]: The
    transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

**Example**

Consider the tape:

>>> ops = [qp.X(0), qp.RY(1.23, 1)]
>>> measurements = [qp.expval(qp.Y(0)), qp.probs(wires=[1])]
>>> tape = qp.tape.QuantumScript(ops, measurements, shots=10)

We can apply the transform to diagonalize and convert the two measurements to a single `counts` measurement:

>>> (new_tape, ), fn = qp.devices.preprocess.measurements_from_counts(tape)
>>> new_tape.measurements
[CountsMP(wires=[0, 1], all_outcomes=False)]

The tape operations now include diagonalizing gates.

>>> new_tape.operations
[X(0), RY(1.23, wires=[1]), RX(1.5707963267948966, wires=[0])]

The tape is now compatible with a device backend that only supports counts. Executing the
tape returns the raw counts:

>>> dev = qp.device("default.qubit", seed=42)
>>> res = dev.execute(new_tape)
>>> res
{np.str_('00'): np.int64(2), np.str_('01'): np.int64(2), np.str_('10'): np.int64(4), np.str_('11'): np.int64(2)}

And these can be post-processed to get the originally requested measurements:

>>> fn((res,))
[np.float64(-0.19999999999999996), array([0.6, 0.4])]

## `device_resolve_dynamic_wires`

```python
def device_resolve_dynamic_wires(tape: QuantumScript, wires: None | Wires, allow_resets: bool=True) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Allocate dynamic wires in a manner consistent with the provided device wires.

Args:
    tape (QuantumScript): a circuit that may contain dynamic wire allocation
    wires (None| Wires): the device wires

If device wires are provided, possible values for dynamic wires are determined from
device wires not present in the tape.

>>> import pennylane as qp
>>> from pennylane.devices.preprocess import device_resolve_dynamic_wires
>>> def f():
...     qp.H(0)
...     with qp.allocation.allocate(1) as wires:
...         qp.X(wires)
...     with qp.allocation.allocate(1) as wires:
...         qp.X(wires)

>>> transformed = device_resolve_dynamic_wires(f, wires=(0, "a", "b"))
>>> print(qp.draw(transformed)())
0: ──H─┤
a: ──X─┤
b: ──X─┤

If the device has no wires, then wires are allocated starting at the smallest
integer that is larger than all integer wires present in the ``tape``.

>>> transformed_None = device_resolve_dynamic_wires(f, wires=None)
>>> print(qp.draw(transformed_None)())
0: ──H──────────────┤
1: ──X──┤↗│  │0⟩──X─┤

See :func:`~.resolve_dynamic_wires` for a more detailed description.
