---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/legacy_facade.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/legacy_facade.py
license: Apache-2.0
---

## Module `pennylane/devices/legacy_facade.py`

Defines a LegacyDeviceFacade class for converting legacy devices to the
new interface.

## `null_postprocessing`

```python
def null_postprocessing(results)
```

A postprocessing function with null behavior.

## `legacy_device_expand_fn`

```python
def legacy_device_expand_fn(tape, device)
```

Turn the ``expand_fn`` from the legacy device interface into a transform.

## `legacy_device_batch_transform`

```python
def legacy_device_batch_transform(tape, device)
```

Turn the ``batch_transform`` from the legacy device interface into a transform.

## `adjoint_ops`

```python
def adjoint_ops(op: Operator) -> bool
```

Specify whether or not an Operator is supported by adjoint differentiation.

## `LegacyDeviceFacade`

```python
class LegacyDeviceFacade(Device)
```

A Facade that converts a device from the old ``qp.Device`` interface into the new interface.

Args:
    device (qp.device.LegacyDevice): a device that follows the legacy device interface.

>>> import pennylane as qp
>>> from pennylane.devices import DefaultQutrit, LegacyDeviceFacade
>>> legacy_dev = DefaultQutrit(wires=2)
>>> new_dev = LegacyDeviceFacade(legacy_dev)
>>> pipeline, config = new_dev.preprocess()
>>> print(pipeline)
CompilePipeline(
  [1] defer_measurements(allow_postselect=False),
  [2] legacy_device_batch_transform(device=...),
  [3] legacy_device_expand_fn(device=...)
)
>>> import pprint
>>> pprint.pprint(config)
ExecutionConfig(grad_on_execution=None,
                use_device_gradient=None,
                use_device_jacobian_product=None,
                gradient_method=None,
                gradient_keyword_arguments={},
                device_options={},
                interface=<Interface.NUMPY: 'numpy'>,
                derivative_order=1,
                mcm_config=MCMConfig(mcm_method='deferred', postselect_mode=None),
                convert_to_numpy=True,
                executor_backend=<class 'pennylane.concurrency.executors.native.multiproc.MPPoolExec'>)
>>> new_dev.shots
Shots(total_shots=None, shot_vector=())
>>> tape = qp.tape.QuantumScript([], [qp.sample(wires=0)], shots=5)
>>> new_dev.execute(tape)
array([[0],
   [0],
   [0],
   [0],
   [0]])

### `tracker`

```python
def tracker(self)
```

A :class:`~pennylane.Tracker` that can store information about device executions, shots, batches,
intermediate results, or any additional device dependent information.

### `target_device`

```python
def target_device(self) -> LegacyDevice
```

The device wrapped by the facade.

### `setup_execution_config`

```python
def setup_execution_config(self, config: ExecutionConfig | None=None, circuit: QuantumScript | None=None) -> ExecutionConfig
```

Sets up an ``ExecutionConfig`` that configures the execution behaviour.
