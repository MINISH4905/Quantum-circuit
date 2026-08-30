---
framework: pennylane
api_version: v0.45.1
doc_type: concept
source_path: doc/code/qp_ftqc.rst
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/doc/code/qp_ftqc.rst
license: Apache-2.0
---

qp.ftqc
========

.. currentmodule:: pennylane.ftqc

.. warning::

    This module is currently experimental and will not maintain API stability between releases.

.. automodapi:: pennylane.ftqc
    :no-heading:
    :include-all-objects:

Overview
--------

Pauli Tracker
^^^^^^^^^^^^^

This module contains functions for tracking, commuting Pauli operations in a Clifford circuit as well as getting measurement corrections.

.. currentmodule:: pennylane.ftqc

.. autosummary::
    :toctree: api

    ~pauli_to_xz
    ~xz_to_pauli
    ~pauli_prod
    ~commute_clifford_op
    ~get_byproduct_corrections
