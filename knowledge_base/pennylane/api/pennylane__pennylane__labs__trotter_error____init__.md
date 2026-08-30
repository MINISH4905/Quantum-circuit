---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/trotter_error/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/trotter_error/__init__.py
license: Apache-2.0
---

## Module `pennylane/labs/trotter_error/__init__.py`

Module containing functionality for computing Trotter error.

.. warning::

    This module is experimental. Frequent changes will occur,
    with no guarantees of stability or backwards compatibility.

.. currentmodule:: pennylane.labs.trotter_error

Trotter Base Classes
~~~~~~~~~~~~~~~~~~~~
Abstract classes specifying the methods needed for implementing fragments and states in the Trotter error workflow.

.. autosummary::
    :toctree: api

    ~AbstractState
    ~Fragment

Fragment Classes
~~~~~~~~~~~~~~~~
Classes representing fragments of different types of Hamiltonians.

.. autosummary::
    :toctree: api

    ~GenericFragment
    ~RealspaceMatrix
    ~RealspaceSum

Realspace Hamiltonian Classes
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Classes used to store representations of realspace Hamiltonians.

.. autosummary::
    :toctree: api

    ~RealspaceCoeffs
    ~RealspaceOperator

Fragment Functions
~~~~~~~~~~~~~~~~~~
Functions used to retrieve fragments of various Hamiltonians.

.. autosummary::
    :toctree: api

    ~generic_fragments
    ~vibrational_fragments
    ~vibronic_fragments
    ~sparse_fragments

Harmonic Oscillator Classes
~~~~~~~~~~~~~~~~~~~~~~~~~~~
Classes used to construct the representation of harmonic oscillator states.

.. autosummary::
    :toctree: api

    ~HOState
    ~VibronicHO

Error Estimation Functions
~~~~~~~~~~~~~~~~~~~~~~~~~~
Functions for computing Trotter error estimates.

.. autosummary::
    :toctree: api

    ~bch_expansion
    ~effective_hamiltonian
    ~perturbation_error

Product Formula Classes
~~~~~~~~~~~~~~~~~~~~~~~
Classes for representing product formulas.

.. autosummary::
    :toctree: api

    ~ProductFormula
