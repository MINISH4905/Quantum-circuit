---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/resource/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/resource/__init__.py
license: Apache-2.0
---

## Module `pennylane/resource/__init__.py`

The ``resource`` module provides classes and functionality to track the quantum resources
(number of qubits, circuit depth, etc.) required to implement advanced quantum algorithms.

.. seealso::
    The :mod:`~.estimator` module for higher level resource estimation of quantum programs.

Circuit Specifications (specs)
------------------------------

.. currentmodule:: pennylane

.. autosummary::
    :toctree: api

    ~specs

Circuit Specification Classes and Utilities
-------------------------------------------

.. currentmodule:: pennylane.resource

.. autosummary::
    :toctree: api

    ~CircuitSpecs
    ~SpecsResources

    ~resources_from_tape

Error Tracking
--------------

.. currentmodule:: pennylane.resource

.. autosummary::
    :toctree: api

    ~AlgorithmicError
    ~SpectralNormError
    ~ErrorOperation
    ~algo_error

Resource Classes
----------------

.. currentmodule:: pennylane.resource

.. autosummary::
    :toctree: api

    ~Resources
    ~ResourcesOperation

Resource Functions
~~~~~~~~~~~~~~~~~~

.. currentmodule:: pennylane.resource

.. autosummary::
    :toctree: api

    ~add_in_series
    ~add_in_parallel
    ~mul_in_series
    ~mul_in_parallel
    ~substitute

Tracking Resources for Custom Operations
----------------------------------------

We can use the :mod:`null.qubit <pennylane.devices.null_qubit>` device with :class:`pennylane.Tracker`
to track the resources used in a quantum circuit with custom operations without execution.

.. code-block:: python

    from pennylane import numpy as pnp
    from pennylane.resource import Resources, ResourcesOperation

    class MyCustomAlgorithm(ResourcesOperation):
        num_wires = 2

        def resources(self):
            return Resources(
                num_wires=self.num_wires,
                num_gates=5,
                gate_types={"Hadamard": 2, "CNOT": 1, "PauliZ": 2},
                gate_sizes={1: 4, 2: 1},
                depth=3,
            )

    dev = qp.device("null.qubit", wires=[0, 1, 2])

    @qp.set_shots(shots=100)
    @qp.qnode(dev)
    def circuit(theta):
        qp.RZ(theta, wires=0)
        qp.CNOT(wires=[0,1])
        MyCustomAlgorithm(wires=[1, 2])
        return qp.expval(qp.Z(1))

    x = pnp.array(1.23, requires_grad=True)

    with qp.Tracker(dev) as tracker:
        circuit(x)

We can examine the resources by accessing the :code:`resources` key:

    >>> resources_lst = tracker.history['resources']
    >>> print(resources_lst[0])
    Wire allocations: 3
    Total gates: 7
    Gate counts:
    - RZ: 1
    - CNOT: 2
    - Hadamard: 2
    - PauliZ: 2
    Measurements:
    - expval(PauliZ): 1
    Depth: 5
