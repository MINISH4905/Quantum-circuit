---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/default_qutrit.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/default_qutrit.py
license: Apache-2.0
---

## Module `pennylane/devices/default_qutrit.py`

The default.qutrit device is PennyLane's standard qutrit-based device.

It implements the :class:`~pennylane.devices._legacy_device.Device` methods as well as some built-in
:mod:`qutrit operations <pennylane.ops.qutrit>`, and provides simple pure state
simulation of qutrit-based quantum computing.

## `DefaultQutrit`

```python
class DefaultQutrit(QutritDevice)
```

Default qutrit device for PennyLane.

.. warning::

    The API of ``DefaultQutrit`` will be updated soon to follow a new device interface described
    in :class:`pennylane.devices.Device`.

    This change will not alter device behaviour for most workflows, but may have implications for
    plugin developers and users who directly interact with device methods. Please consult
    :class:`pennylane.devices.Device` and the implementation in
    :class:`pennylane.devices.DefaultQubit` for more information on what the new
    interface will look like and be prepared to make updates in a coming release. If you have any
    feedback on these changes, please create an
    `issue <https://github.com/PennyLaneAI/pennylane/issues>`_ or post in our
    `discussion forum <https://discuss.pennylane.ai/>`_.

Args:
    wires (int, Iterable[Number, str]): Number of subsystems represented by the device,
        or iterable that contains unique labels for the subsystems as numbers (i.e., ``[-1, 0, 2]``)
        or strings (``['auxiliary', 'q1', 'q2']``). Default 1 if not specified.
    shots (None, int): How many times the circuit should be evaluated (or sampled) to estimate
        the expectation values. Defaults to ``None`` if not specified, which means that the device
        returns analytical results.

### `density_matrix`

```python
def density_matrix(self, wires)
```

Returns the reduced density matrix of a given set of wires.

Args:
    wires (Wires): wires of the reduced system.

Returns:
    array[complex]: complex tensor of shape ``(3 ** len(wires), 3 ** len(wires))``
    representing the reduced density matrix.

### `reset`

```python
def reset(self)
```

Reset the device
