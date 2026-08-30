---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/modifiers/simulator_tracking.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/modifiers/simulator_tracking.py
license: Apache-2.0
---

## Module `pennylane/devices/modifiers/simulator_tracking.py`

Defines the ``simulator_tracking`` device modifier.

## `simulator_tracking`

```python
def simulator_tracking(cls: type) -> type
```

Modifies all methods to add default simulator style tracking.

Args:
    cls (type): a subclass of :class:`pennylane.devices.Device`

Returns
    type: The inputted class that has now been modified to update the tracker upon function calls.

Simulator style tracking updates:

* ``executions``: the number of unique circuits that would be required on quantum hardware
* ``shots``: the number of shots
* ``resources``: the :class:`~.resource.Resources` for the executed circuit.
* ``"errors"``: combined algorithmic errors from the quantum operations executed by the qnode.
* ``simulations``: the number of simulations performed. One simulation can cover multiple QPU executions,
  such as for non-commuting measurements and batched parameters.
* ``batches``: The number of times :meth:`~pennylane.devices.Device.execute` is called.
* ``results``: The results of each call of :meth:`~pennylane.devices.Device.execute`
* ``derivative_batches``: How many times :meth:`~pennylane.devices.Device.compute_derivatives` is called.
* ``execute_and_derivative_batches``: How many times :meth:`~pennylane.devices.Device.execute_and_compute_derivatives`
  is called
* ``vjp_batches``: How many times :meth:`~pennylane.devices.Device.compute_vjp` is called
* ``execute_and_vjp_batches``: How many times :meth:`~pennylane.devices.Device.execute_and_compute_vjp` is called
* ``jvp_batches``: How many times :meth:`~pennylane.devices.Device.compute_jvp` is called
* ``execute_and_jvp_batches``: How many times :meth:`~pennylane.devices.Device.execute_and_compute_jvp` is called
* ``derivatives``: How many circuits are submitted to :meth:`~pennylane.devices.Device.compute_derivatives`
  or :meth:`~pennylane.devices.Device.execute_and_compute_derivatives`.
* ``vjps``: How many circuits are submitted to :meth:`pennylane.devices.Device.compute_vjp`
  or :meth:`~pennylane.devices.Device.execute_and_compute_vjp`
* ``jvps``: How many circuits are submitted to :meth:`~pennylane.devices.Device.compute_jvp`
  or :meth:`~pennylane.devices.Device.execute_and_compute_jvp`


.. code-block:: python

    import pennylane as qp

    from pennylane.devices.modifiers import simulator_tracking, single_tape_support

    @simulator_tracking
    @single_tape_support
    class MyDevice(qp.devices.Device):

        def execute(self, circuits, execution_config: ExecutionConfig | None = None):
            return tuple(0.0 for c in circuits)

>>> dev = MyDevice()
>>> ops = [qp.S(0)]
>>> measurements = [qp.expval(qp.X(0)), qp.expval(qp.Z(0))]
>>> t = qp.tape.QuantumScript(ops, measurements,shots=50)
>>> with dev.tracker:
...     dev.execute((t, ) )
(0.0,)
>>> import pprint
>>> pprint.pprint(dev.tracker.history)
{'batches': [1],
 'errors': [{}],
 'executions': [2],
 'resources': [SpecsResources(gate_types={'S': 1},
                              gate_sizes={1: 1},
                              measurements={'expval(PauliX)': 1,
                                            'expval(PauliZ)': 1},
                              num_allocs=1,
                              depth=1)],
 'results': [0.0],
 'shots': [100],
 'simulations': [1]}
