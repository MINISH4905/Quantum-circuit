---
framework: pennylane
api_version: v0.45.1
doc_type: concept
source_path: doc/code/qp_io.rst
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/doc/code/qp_io.rst
license: Apache-2.0
---

qp.io
======

Overview
--------

This module contains functions and classes for translating quantum objects from external frameworks
into PennyLane circuits and operators.

.. currentmodule:: pennylane

Functions
^^^^^^^^^

.. autosummary::
    :toctree: api

    ~bloq_registers
    ~from_pyquil
    ~from_qasm
    ~from_qasm3
    ~from_qiskit
    ~from_qiskit_noise
    ~from_qiskit_op
    ~from_quil
    ~from_quil_file
    ~to_bloq
    ~to_openqasm

Classes
^^^^^^^

.. autosummary::
    :toctree: api

    ~FromBloq
    ~io.ToBloq
