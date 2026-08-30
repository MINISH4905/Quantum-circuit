---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/device_constructor.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/device_constructor.py
license: Apache-2.0
---

## Module `pennylane/devices/device_constructor.py`

This module contains code for the main device construction delegation logic.

## `refresh_devices`

```python
def refresh_devices()
```

Scan installed PennyLane plugins to refresh the device list.

## `device`

```python
def device(name, *args, **kwargs)
```

Load a device and return the instance.

This function is used to load a particular quantum device,
which can then be used to construct QNodes.

PennyLane comes with support for the following devices:

* :mod:`'default.qubit' <pennylane.devices.default_qubit>`: a simple
  state simulator of qubit-based quantum circuit architectures.

* :mod:`'default.mixed' <pennylane.devices.default_mixed>`: a mixed-state
  simulator of qubit-based quantum circuit architectures.

* ``'lightning.qubit'``: a more performant state simulator of qubit-based
  quantum circuit architectures written in C++.

* :mod:`'default.qutrit' <pennylane.devices.default_qutrit>`: a simple
  state simulator of qutrit-based quantum circuit architectures.

* :mod:`'default.qutrit.mixed' <pennylane.devices.default_qutrit_mixed>`: a
  mixed-state simulator of qutrit-based quantum circuit architectures.

* :mod:`'default.gaussian' <pennylane.devices.default_gaussian>`: a simple simulator
  of Gaussian states and operations on continuous-variable circuit architectures.

* :mod:`'default.clifford' <pennylane.devices.default_clifford>`: an efficient
  simulator of Clifford circuits.

* :mod:`'default.tensor' <pennylane.devices.default_tensor>`: a simulator
  of quantum circuits based on tensor networks.

* :mod:`'null.qubit' <pennylane.devices.null_qubit>`: a simulator that performs no
  operations associated with numerical computations.

Additional devices are supported through plugins — see
the  `available plugins <https://pennylane.ai/plugins>`_ for more
details. To list all currently installed devices, run
:func:`qp.about <pennylane.about>`.

Args:
    name (str): the name of the device to load
    wires (Wires): the wires (subsystems) to initialize the device with.
        Note that this is optional for certain devices, such as ``default.qubit``

Keyword Args:
    config (pennylane.Configuration): a PennyLane configuration object
        that contains global and/or device specific configurations.

All devices must be loaded by specifying their **short-name** as listed above,
followed by the **wires** (subsystems) you wish to initialize. The ``wires``
argument can be an integer, in which case the wires of the device are addressed
by consecutive integers:

.. code-block:: python

    import pennylane as qp

    dev = qp.device('default.qubit', wires=5)

    def circuit():
        qp.Hadamard(wires=1)
        qp.Hadamard(wires=[0])
        qp.CNOT(wires=[3, 4])
        ...

The ``wires`` argument can also be a sequence of unique numbers or strings, specifying custom wire labels
that the user employs to address the wires:

.. code-block:: python

    dev = qp.device('default.qubit', wires=['auxiliary', 'q11', 'q12', -1, 1])

    def circuit():
        qp.Hadamard(wires='q11')
        qp.Hadamard(wires=['auxiliary'])
        qp.CNOT(wires=['q12', -1])
        ...

On some newer devices, such as ``default.qubit``, the ``wires`` argument can be omitted altogether,
and instead the wires will be computed when executing a circuit depending on its contents.

>>> dev = qp.device("default.qubit")

When executing quantum circuits on a device, we can specify the number of times the circuit must be executed
to estimate stochastic return values by using the :func:`~pennylane.set_shots` transform.
As an example, ``qp.sample()`` measurements will return as many samples as the number of shots specified.
Note that ``shots`` can be a single integer or a list of shot values.

.. code-block:: python

    dev = qp.device('default.qubit', wires=1, seed=42)

    @qp.set_shots(10)
    @qp.qnode(dev)
    def circuit(a):
        qp.RX(a, wires=0)
        return qp.sample(qp.Z(0))

>>> circuit(0.8)  # 10 samples are returned
array([ 1.,  1., -1.,  1.,  1., -1.,  1.,  1.,  1.,  1.])
>>> new_circuit = qp.set_shots(circuit, shots=[3, 4, 4])
>>> new_circuit(0.8)  # 3, 4, and 4 samples are returned respectively
(array([ 1., -1.,  1.]), array([1., 1., 1., 1.]), array([1., 1., 1., 1.]))
