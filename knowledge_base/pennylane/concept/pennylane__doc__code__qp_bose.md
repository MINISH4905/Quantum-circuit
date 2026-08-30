---
framework: pennylane
api_version: v0.45.1
doc_type: concept
source_path: doc/code/qp_bose.rst
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/doc/code/qp_bose.rst
license: Apache-2.0
---

qp.bose
=========

Overview
--------

This module contains functions and classes for creating and manipulating bosonic operators.


BoseWord and BoseSentence
---------------------------

.. currentmodule:: pennylane

.. autosummary::
    :toctree: api

    ~BoseWord
    ~BoseSentence

Mapping to qubit operators
--------------------------

.. currentmodule:: pennylane.bose

.. autosummary::
    :toctree: api

    ~binary_mapping
    ~unary_mapping
    ~christiansen_mapping
