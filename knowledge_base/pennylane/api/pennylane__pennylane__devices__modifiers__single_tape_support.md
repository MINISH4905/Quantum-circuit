---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/modifiers/single_tape_support.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/modifiers/single_tape_support.py
license: Apache-2.0
---

## Module `pennylane/devices/modifiers/single_tape_support.py`

Defines the ``single_tape_support`` device modifier.

## `single_tape_support`

```python
def single_tape_support(cls: type) -> type
```

Modifies all functions to accept single tapes in addition to batches. This allows the definition
of the device class to purely focus on executing batches.

Args:
    cls (type): a subclass of :class:`pennylane.devices.Device`

Returns
    type: The inputted class that has now been modified to accept single circuits as well as batches.

.. code-block:: python

    import pennylane as qp

    @single_tape_support
    class MyDevice(qp.devices.Device):

        def execute(self, circuits, execution_config: ExecutionConfig | None = None):
            return tuple(0.0 for _ in circuits)

>>> dev = MyDevice()
>>> t = qp.tape.QuantumScript()
>>> dev.execute(t)
0.0
>>> dev.execute((t, ))
(0.0,)

In this situation, ``MyDevice.execute`` only needs to handle the case where ``circuits`` is an iterable
of :class:`~pennylane.tape.QuantumTape` objects, not a single value.
