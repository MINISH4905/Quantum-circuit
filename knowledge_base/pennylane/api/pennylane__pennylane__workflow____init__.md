---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/workflow/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/__init__.py
license: Apache-2.0
---

## Module `pennylane/workflow/__init__.py`

This module contains the core objects for managing a PennyLane workflow.

.. currentmodule:: pennylane

Execution functions and utilities
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. autosummary::
    :toctree: api

    ~execute
    ~workflow.construct_tape
    ~workflow.construct_batch
    ~workflow.construct_execution_config
    ~workflow.get_transform_program
    ~workflow.get_compile_pipeline
    ~workflow.get_best_diff_method
    ~workflow.set_shots

Jacobian Product Calculation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. autosummary::
    :toctree: api

    ~workflow.jacobian_products.JacobianProductCalculator
    ~workflow.jacobian_products.TransformJacobianProducts
    ~workflow.jacobian_products.DeviceDerivatives
    ~workflow.jacobian_products.DeviceJacobianProducts

.. include:: ../../pennylane/workflow/return_types_spec.rst
