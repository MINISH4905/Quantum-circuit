---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/result/__init__.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/result/__init__.py
license: Apache-2.0
---

## Module `qiskit/result/__init__.py`

=========================================
Experiment Results (:mod:`qiskit.result`)
=========================================

.. currentmodule:: qiskit.result

Core classes
============

.. autosummary::
   :toctree: ../stubs/

   Result
   ResultError
   Counts

Marginalization
===============

.. autofunction:: marginal_counts
.. autofunction:: marginal_distribution
.. autofunction:: marginal_memory

Distributions
=============

.. autosummary::
   :toctree: ../stubs/

   ProbDistribution
   QuasiDistribution

Expectation values
==================

.. autofunction:: sampled_expectation_value
