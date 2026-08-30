---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/labs/transforms/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/transforms/__init__.py
license: Apache-2.0
---

## Module `pennylane/labs/transforms/__init__.py`

This subpackage contains experimental PennyLane transforms and their building blocks.

.. currentmodule:: pennylane.labs.transforms

Transforms
~~~~~~~~~~

.. autosummary::
    :toctree: api

    ~select_pauli_rot_phase_gradient

Custom decomposition rules
~~~~~~~~~~~~~~~~~~~~~~~~~~

.. autosummary::
    :toctree: api

    ~make_rz_to_phase_gradient_decomp
    ~make_selectpaulirot_to_phase_gradient_decomp
