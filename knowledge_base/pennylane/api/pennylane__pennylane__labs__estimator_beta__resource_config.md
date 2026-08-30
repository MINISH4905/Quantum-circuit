---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/estimator_beta/resource_config.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/estimator_beta/resource_config.py
license: Apache-2.0
---

## Module `pennylane/labs/estimator_beta/resource_config.py`

This module contains the LabsResourceConfig class, which tracks the configuration for resource estimation

## `LabsResourceConfig`

```python
class LabsResourceConfig(ResourceConfig)
```

Sets the values of precisions and custom decompositions when estimating resources for a
quantum workflow (see also :class:`~.pennylane.estimator.resource_config.ResourceConfig`).

.. note::

    The ``LabsResourceConfig`` class inherits from :class:`~.pennylane.estimator.resource_config.ResourceConfig`
    and comes preloaded with many optimized custom resource decompositions and custom symbolic resource
    decompositions. The preloaded decompositions can be accessed via the following attributes:
    ``config.custom_decomps``, ``config.pow_custom_decomps``, ``config.adj_custom_decomps``, and
    ``config.ctrl_custom_decomps``.

The precisions and custom decompositions of resource operators can be
modified using the :meth:`~.pennylane.labs.estimator_beta.resource_config.LabsResourceConfig.set_precision`
and :meth:`~.pennylane.labs.estimator_beta.resource_config.LabsResourceConfig.set_decomp` functions of the
:code:`LabsResourceConfig` class.

**Example**

This example shows how to set a custom precision value for every instance of the :code:`RX` gate.

.. code-block:: pycon

    >>> import pennylane.labs.estimator_beta as qre
    >>> my_config = qre.LabsResourceConfig()
    >>> my_config.set_precision(qre.RX, precision=1e-5)
    >>> res = qre.estimate(
    ...     qre.RX(),
    ...     gate_set={"RZ", "T", "Hadamard"},
    ...     config=my_config,
    ... )
    >>> print(res)
    --- Resources: ---
     Total wires: 1
       algorithmic wires: 1
       allocated wires: 0
         zero state: 0
         any state: 0
     Total gates : 28
       'T': 28

The :code:`LabsResourceConfig` can also be used to set custom decompositions. The following example
shows how to define a custom decomposition for the ``RX`` gate.

.. code-block:: pycon

    >>> def custom_RX_decomp(precision):  # RX = H @ RZ @ H
    ...     h = qre.Hadamard.resource_rep()
    ...     rz = qre.RZ.resource_rep(precision)
    ...     return [qre.GateCount(h, 2), qre.GateCount(rz, 1)]
    >>>
    >>> my_config = qre.LabsResourceConfig()
    >>> my_config.set_decomp(qre.RX, custom_RX_decomp)
    >>> res = qre.estimate(
    ...     qre.RX(precision=None),
    ...     gate_set={"RZ", "T", "Hadamard"},
    ...     config=my_config,
    ... )
    >>> print(res)
    --- Resources: ---
     Total wires: 1
       algorithmic wires: 1
       allocated wires: 0
         zero state: 0
         any state: 0
     Total gates : 3
       'RZ': 1,
       'Hadamard': 2
