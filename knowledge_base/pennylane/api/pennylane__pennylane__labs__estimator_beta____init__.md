---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/estimator_beta/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/estimator_beta/__init__.py
license: Apache-2.0
---

## Module `pennylane/labs/estimator_beta/__init__.py`

This module contains experimental features for
resource estimation.

.. warning::

    This module is experimental. Frequent changes will occur,
    with no guarantees of stability or backwards compatibility.


Resource Estimation
~~~~~~~~~~~~~~~~~~~

.. currentmodule:: pennylane.labs.estimator_beta

.. autosummary::
    :toctree: api

    ~estimate
    ~LabsResourceConfig

Qubit Tracking Functionality
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. currentmodule:: pennylane.labs.estimator_beta

.. autosummary::
    :toctree: api

    ~Allocate
    ~Deallocate
    ~estimate_wires_from_circuit
    ~estimate_wires_from_resources
    ~MarkClean
    ~MarkQubits

State Preparation
~~~~~~~~~~~~~~~~~

.. currentmodule:: pennylane.labs.estimator_beta.templates

.. autosummary::
    :toctree: api

    ~LabsMottonenStatePreparation
    ~LabsCosineWindow
    ~LabsSumOfSlatersPrep

Alternate Decompositions
~~~~~~~~~~~~~~~~~~~~~~~~

.. currentmodule:: pennylane.labs.estimator_beta

.. autosummary::
    :toctree: api

    ~aqft_resource_decomp
    ~ch_resource_decomp
    ~ch_toffoli_based_resource_decomp
    ~hadamard_controlled_resource_decomp
    ~hadamard_toffoli_based_controlled_decomp
    ~mcx_many_clean_aux_resource_decomp
    ~mcx_one_clean_aux_resource_decomp
    ~mcx_one_dirty_aux_resource_decomp
    ~paulirot_controlled_resource_decomp
    ~qft_phase_grad_resource_decomp
    ~qrom_state_preparation_phase_grad_resource_decomp
    ~qrom_state_preparation_resource_decomp
    ~selectpaulirot_controlled_resource_decomp
    ~select_thc_controlled_resource_decomp
    ~select_thc_resource_decomp

Templates
~~~~~~~~~

.. currentmodule:: pennylane.labs.estimator_beta.templates

.. autosummary::
    :toctree: api

    ~OutOfPlaceIntegerComparator
    ~RegisterEquality
    ~LabsQROM
