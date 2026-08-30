---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/providers/basic_provider/__init__.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/providers/basic_provider/__init__.py
license: Apache-2.0
---

## Module `qiskit/providers/basic_provider/__init__.py`

================================================================================
BasicProvider: Python-based Simulators (:mod:`qiskit.providers.basic_provider`)
================================================================================

.. currentmodule:: qiskit.providers.basic_provider

A module of Python-based quantum simulators. Simulators can be accessed
via the `BasicProvider` provider, e.g.:

.. plot::
   :include-source:
   :nofigs:

   from qiskit.providers.basic_provider import BasicProvider

   backend = BasicProvider().get_backend('basic_simulator')


Classes
=======

.. autosummary::
   :toctree: ../stubs/

   BasicSimulator
   BasicProvider
   BasicProviderJob
   BasicProviderError
