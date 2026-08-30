---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/dynamic_one_shot.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/dynamic_one_shot.py
license: Apache-2.0
---

## Module `pennylane/transforms/dynamic_one_shot.py`

Contains the batch dimension transform.

## `is_mcm`

```python
def is_mcm(operation)
```

Returns True if the operation is a mid-circuit measurement and False otherwise.

## `null_postprocessing`

```python
def null_postprocessing(results)
```

A postprocessing function returned by a transform that only converts the batch of results
into a result for a single ``QuantumTape``.

## `dynamic_one_shot`

```python
def dynamic_one_shot(tape: QuantumScript, postselect_mode=None, **_) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Transform a QNode to into several one-shot tapes to support dynamic circuit execution.

This transform enables the ``"one-shot"`` mid-circuit measurement method. The ``"one-shot"`` method prompts the
device to perform a series of one-shot executions, where in each execution, the ``qp.measure``
operation applies a probabilistic mid-circuit measurement to the circuit.
This is in contrast with ``qp.defer_measurement``, which instead introduces an extra
wire for each mid-circuit measurement. The ``"one-shot"`` method is favourable in the few-shots
and several-mid-circuit-measurements limit, whereas ``qp.defer_measurements`` is favourable in
the opposite limit.

.. warning::

    This transform should not be directly applied on a QNode. It is automatically added to the
    compile pipeline when a QNode is constructed with `mcm_method='one-shot'`.

Args:
    tape (QNode or QuantumScript or Callable): a quantum circuit.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumScript], function]:

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.
    This circuit will provide the results of a dynamic execution.

**Example**

Most devices that support mid-circuit measurements will include this transform in its
preprocessing automatically when applicable. The recommended way to use dynamic one
shot is to specify ``mcm_method="one-shot"`` in the ``qp.qnode`` decorator.

.. code-block:: python

    dev = qp.device("default.qubit")
    params = np.pi / 4 * np.ones(2)

    @qp.set_shots(100)
    @qp.qnode(dev, mcm_method="one-shot")
    def func(x, y):
        qp.RX(x, wires=0)
        m0 = qp.measure(0)
        qp.cond(m0, qp.RY)(y, wires=1)
        return qp.expval(op=m0)

..details::
    :title: Usage with Catalyst (qjit)

    This transform is compatible with ``qjit``, where it will be applied as an MLIR pass
    rather than a tape-level transform.
    That being said, there are a few differences to be aware of when using the MLIR pass:

    - Shot vectors or broadcasting are not supported
    - Workflows involving gradients are not supported
    - ``qp.var()`` on observables (non-MCM) are unsupported

    To apply the MLIR pass version simply decorate your ``QNode`` with ``@qp.qjit``:

    .. code-block:: python

        @qp.qjit
        @qp.set_shots(10)
        @qp.qnode(qp.device("lightning.qubit", wires=2), mcm_method="one-shot")
        def circ():
            return qp.expval(qp.X(0)+2*qp.Y(1))

    >>> circ() # doctest: +SKIP
    Array(0.4, dtype=float64)

## `get_legacy_capabilities`

```python
def get_legacy_capabilities(dev)
```

Gets the capabilities dictionary of a device.

## `init_auxiliary_tape`

```python
def init_auxiliary_tape(circuit: qp.tape.QuantumScript)
```

Creates an auxiliary circuit to perform one-shot mid-circuit measurement calculations.

Measurements are replaced by SampleMP measurements on wires and observables found in the
original measurements.

Args:
    circuit (QuantumTape): The original QuantumScript

Returns:
    QuantumScript: A copy of the circuit with modified measurements

## `parse_native_mid_circuit_measurements`

```python
def parse_native_mid_circuit_measurements(circuit: qp.tape.QuantumScript, _removed_arg=None, results: None | TensorLike=None, postselect_mode=None)
```

Combines, gathers and normalizes the results of native mid-circuit measurement runs.

Args:
    circuit (QuantumTape): The original ``QuantumScript``.
    _removed_arg : a placeholder for an argument that used to exist. Can be removed pending update to catalyst.
    aux_tapes (List[QuantumTape]): List of auxiliary ``QuantumScript`` objects.
    results (TensorLike): Array of measurement results.
    postselect_mode (None | str): how to handle postselection.

Returns:
    tuple(TensorLike): The results of the simulation.

## `gather_mcm_qjit`

```python
def gather_mcm_qjit(measurement, samples, is_valid, postselect_mode=None)
```

Process MCM measurements when the Catalyst compiler is active.

Args:
    measurement (MeasurementProcess): measurement
    samples (dict): Mid-circuit measurement samples
    is_valid (TensorLike): Boolean array with the same shape as ``samples`` where the value at
        each index specifies whether or not the respective sample is valid.

Returns:
    TensorLike: The combined measurement outcome

## `gather_non_mcm`

```python
def gather_non_mcm(measurement, samples, is_valid, postselect_mode=None) -> TensorLike
```

Combines, gathers and normalizes several measurements with trivial measurement values.

Args:
    measurement (MeasurementProcess): measurement
    samples (TensorLike): Post-processed measurement samples
    is_valid (TensorLike): Boolean array with the same shape as ``samples`` where the value at
        each index specifies whether or not the respective sample is valid.
    postselect_mode (None | str): the postselect mode to use.

Returns:
    TensorLike: The combined measurement outcome

## `gather_mcm`

```python
def gather_mcm(measurement: MeasurementProcess, samples, is_valid, postselect_mode=None)
```

Combines, gathers and normalizes several measurements with non-trivial measurement values.

Args:
    measurement (MeasurementProcess): measurement
    samples (List[dict]): Mid-circuit measurement samples
    is_valid (TensorLike): Boolean array with the same shape as ``samples`` where the value at
        each index specifies whether or not the respective sample is valid.

Returns:
    TensorLike: The combined measurement outcome
