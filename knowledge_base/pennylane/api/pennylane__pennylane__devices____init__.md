---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/__init__.py
license: Apache-2.0
---

## Module `pennylane/devices/__init__.py`

This subpackage provides default devices for PennyLane, which do not need external plugins to be installed.
The default devices provide basic built-in qubit
and CV circuit simulators that can be used with PennyLane without the need for additional
dependencies. They may also be used in the PennyLane test suite in order
to verify and test quantum gradient computations.



.. currentmodule:: pennylane.devices
.. autosummary::
    :toctree: api

    capabilities
    default_qubit
    default_gaussian
    default_mixed
    default_qutrit
    default_qutrit_mixed
    default_clifford
    default_tensor
    _legacy_device
    _qubit_device
    _qutrit_device
    null_qubit
    reference_qubit
    tests

Next generation devices
-----------------------

:class:`pennylane.devices.Device` is the latest interface for the next generation of devices that
replaces :class:`pennylane.devices.LegacyDevice` and :class:`pennylane.devices.QubitDevice`.

.. currentmodule:: pennylane.devices
.. autosummary::
    :toctree: api

    ExecutionConfig
    MCMConfig
    Device
    DefaultMixed
    DefaultQubit
    default_tensor.DefaultTensor
    NullQubit
    ReferenceQubit
    DefaultQutritMixed
    LegacyDeviceFacade

Preprocessing Transforms
------------------------

The ``preprocess`` module offers several transforms that can be used in constructing the :meth:`~.devices.Device.preprocess`
method for devices.

.. currentmodule:: pennylane.devices.preprocess
.. autosummary::
    :toctree: api

    decompose
    device_resolve_dynamic_wires
    measurements_from_counts
    measurements_from_samples
    validate_adjoint_trainable_params
    validate_observables
    validate_measurements
    validate_device_wires
    validate_multiprocessing_workers
    validate_adjoint_trainable_params
    no_analytic
    no_sampling

Other transforms that may be relevant to device preprocessing include:

.. currentmodule:: pennylane
.. autosummary::
    :toctree: api

    defer_measurements
    transforms.broadcast_expand
    transforms.split_non_commuting

Modifiers
---------

The ``modifiers`` allow for the easy addition of default behaviour to a device.

.. currentmodule:: pennylane.devices.modifiers
.. autosummary::
    :toctree: api

    single_tape_support
    simulator_tracking

For example with a custom device we can add simulator-style tracking and the ability
to handle a single circuit. See the documentation for each modifier for more details.

.. code-block:: python

    from pennylane.devices import Device
    from pennylane.devices.modifiers import simulator_tracking, single_tape_support

    @simulator_tracking
    @single_tape_support
    class MyDevice(Device):

        def execute(self, circuits, execution_config: ExecutionConfig | None = None):
            return tuple(0.0 for _ in circuits)

>>> import pennylane as qp
>>> dev = MyDevice()
>>> tape = qp.tape.QuantumScript([qp.S(0)], [qp.expval(qp.X(0))])
>>> with dev.tracker:
...     out = dev.execute(tape)
>>> out
0.0
>>> import pprint
>>> pprint.pprint(dev.tracker.history)
{'batches': [1],
 'errors': [{}],
 'executions': [1],
 'resources': [SpecsResources(gate_types={'S': 1},
                              gate_sizes={1: 1},
                              measurements={'expval(PauliX)': 1},
                              num_allocs=1,
                              depth=1)],
 'results': [0.0],
 'simulations': [1]}

Qubit Simulation Tools
----------------------

.. currentmodule:: pennylane.devices.qubit
.. automodule:: pennylane.devices.qubit


Qubit Mixed-State Simulation Tools
-----------------------------------

.. currentmodule:: pennylane.devices.qubit_mixed
.. automodule:: pennylane.devices.qubit_mixed


Qutrit Mixed-State Simulation Tools
-----------------------------------

.. currentmodule:: pennylane.devices.qutrit_mixed
.. automodule:: pennylane.devices.qutrit_mixed
