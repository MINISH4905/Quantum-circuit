---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/null_qubit.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/null_qubit.py
license: Apache-2.0
---

## Module `pennylane/devices/null_qubit.py`

The null.qubit device is a no-op device, useful for resource estimation, and for
benchmarking PennyLane's auxiliary functionality outside direct circuit evaluations.

## `zero_measurement`

```python
def zero_measurement(mp: MeasurementProcess, num_device_wires, shots: int | None, batch_size: int, interface: str)
```

Create all-zero results for various measurement processes.

## `NullQubit`

```python
class NullQubit(Device)
```

Null qubit device for PennyLane. This device performs no operations involved in numerical calculations.
Instead the time spent in execution is dominated by support (or setting up) operations, like tape creation etc.

Args:
    wires (int, Iterable[Number, str]): Number of wires present on the device, or iterable that
        contains unique labels for the wires as numbers (i.e., ``[-1, 0, 2]``) or strings
        (``['aux_wire', 'q1', 'q2']``). Default ``None`` if not specified.
    shots (int, Sequence[int], Sequence[Union[int, Sequence[int]]]): The default number of shots
        to use in executions involving this device.
    track_resources (bool): If True, turn on Catalyst device resource tracking.
    resources_filename (string): If set, the static filename to use when saving resource data.
        If not set, the filename will match ``__pennylane_resources_data_*`` where the wildcard (asterisk)
        is replaced by the timestamp of when execution began in nanoseconds since Unix EPOCH.
    compute_depth (bool): If True, compute the circuit depth as part of resource tracking.
    target_device (qp.devices.Device): The target device to use for preprocessing steps. If None, ``DefaultQubit`` is used.

**Example:**

.. code-block:: python

    import pennylane as qp

    qs = qp.tape.QuantumScript(
        [qp.Hadamard(0), qp.CNOT([0, 1])],
        [qp.expval(qp.PauliZ(0)), qp.probs()],
    )
    qscripts = [qs, qs, qs]

>>> dev = NullQubit()
>>> program, execution_config = dev.preprocess()
>>> new_batch, post_processing_fn = program(qscripts)
>>> results = dev.execute(new_batch, execution_config=execution_config)
>>> post_processing_fn(results)
((array(0.), array([1., 0., 0., 0.])),
 (array(0.), array([1., 0., 0., 0.])),
 (array(0.), array([1., 0., 0., 0.])))


This device currently supports (trivial) derivatives:

>>> from pennylane.devices import ExecutionConfig
>>> dev.supports_derivatives(ExecutionConfig(gradient_method="device"))
True

This device can be used to track resource usage:

.. code-block:: python

    n_layers = 50
    n_wires = 100
    shape = qp.StronglyEntanglingLayers.shape(n_layers=n_layers, n_wires=n_wires)

    @qp.qnode(dev)
    def circuit(params):
        qp.StronglyEntanglingLayers(params, wires=range(n_wires))
        return [qp.expval(qp.Z(i)) for i in range(n_wires)]

    params = np.random.random(shape)

    with qp.Tracker(dev) as tracker:
        circuit(params)

>>> print(tracker.history["resources"][0])
Wire allocations: 100
Total gates: 10000
Gate counts:
- Rot: 5000
- CNOT: 5000
Measurements:
- expval(PauliZ): 100
Depth: 502


.. details::
    :title: Tracking

    ``NullQubit`` tracks:

    * ``executions``: the number of unique circuits that would be required on quantum hardware
    * ``shots``: the number of shots
    * ``resources``: the :class:`~.resource.Resources` for the executed circuit.
    * ``simulations``: the number of simulations performed. One simulation can cover multiple QPU executions, such as for non-commuting measurements and batched parameters.
    * ``batches``: The number of times :meth:`~.execute` is called.
    * ``results``: The results of each call of :meth:`~.execute`
    * ``derivative_batches``: How many times :meth:`~.compute_derivatives` is called.
    * ``execute_and_derivative_batches``: How many times :meth:`~.execute_and_compute_derivatives` is called
    * ``vjp_batches``: How many times :meth:`~.compute_vjp` is called
    * ``execute_and_vjp_batches``: How many times :meth:`~.execute_and_compute_vjp` is called
    * ``jvp_batches``: How many times :meth:`~.compute_jvp` is called
    * ``execute_and_jvp_batches``: How many times :meth:`~.execute_and_compute_jvp` is called
    * ``derivatives``: How many circuits are submitted to :meth:`~.compute_derivatives` or :meth:`~.execute_and_compute_derivatives`.
    * ``vjps``: How many circuits are submitted to :meth:`~.compute_vjp` or :meth:`~.execute_and_compute_vjp`
    * ``jvps``: How many circuits are submitted to :meth:`~.compute_jvp` or :meth:`~.execute_and_compute_jvp`

### `name`

```python
def name(self)
```

The name of the device.
