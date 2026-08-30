---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qaoa/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qaoa/__init__.py
license: Apache-2.0
---

## Module `pennylane/qaoa/__init__.py`

Overview
--------

This module provides a collection of methods that help in the construction of
QAOA workflows.

.. currentmodule:: pennylane.qaoa

Mixer Hamiltonians
~~~~~~~~~~~~~~~~~~

Methods for constructing QAOA mixer Hamiltonians.

.. autosummary::
    :toctree: api

    mixers.bit_flip_mixer
    mixers.x_mixer
    mixers.xy_mixer

Cost Hamiltonians
~~~~~~~~~~~~~~~~~

Methods for generating QAOA cost Hamiltonians corresponding to
different optimization problems.

.. autosummary::
    :toctree: api

    cost.bit_driver
    cost.edge_driver
    cost.max_clique
    cost.max_independent_set
    cost.max_weight_cycle
    cost.maxcut
    cost.min_vertex_cover

QAOA Layers
~~~~~~~~~~~

Methods that define cost and mixer layers for use in QAOA workflows.

.. autosummary::
    :toctree: api

    layers.cost_layer
    layers.mixer_layer

Cycle Optimization
~~~~~~~~~~~~~~~~~~

Functionality for finding the maximum weighted cycle of directed graphs.

.. autosummary::
    :toctree: api

    cycle.cycle_mixer
    cycle.edges_to_wires
    cycle.loss_hamiltonian
    cycle.net_flow_constraint
    cycle.out_flow_constraint
    cycle.wires_to_edges
