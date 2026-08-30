---
framework: pennylane
api_version: v0.45.1
doc_type: concept
source_path: doc/code/qp_spin.rst
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/doc/code/qp_spin.rst
license: Apache-2.0
---

qp.spin
=========

Overview
--------

This module contains functions and classes for creating and manipulating Hamiltonians for
spin models.

Hamiltonian functions
^^^^^^^^^^^^^^^^^^^^^

.. currentmodule:: pennylane.spin

.. autosummary::
    :toctree: api

    ~emery
    ~fermi_hubbard
    ~haldane
    ~heisenberg
    ~kitaev
    ~transverse_ising


Hamiltonian custom functions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. currentmodule:: pennylane.spin

.. autosummary::
    :toctree: api

    ~spin_hamiltonian


Lattice classes and functions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. currentmodule:: pennylane.spin

.. autosummary::
    :toctree: api

    ~Lattice
    ~generate_lattice
