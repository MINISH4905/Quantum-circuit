---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/dagcircuit/__init__.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/dagcircuit/__init__.py
license: Apache-2.0
---

## Module `qiskit/dagcircuit/__init__.py`

=======================================
DAG Circuits (:mod:`qiskit.dagcircuit`)
=======================================

.. currentmodule:: qiskit.dagcircuit

Circuits as Directed Acyclic Graphs
===================================

.. autosummary::
   :toctree: ../stubs/

   DAGCircuit
   DAGNode
   DAGOpNode
   DAGInNode
   DAGOutNode
   DAGDepNode
   DAGDependency

Exceptions
==========

.. autoexception:: DAGCircuitError
.. autoexception:: DAGDependencyError

Utilities
=========

.. autosummary::
   :toctree: ../stubs/

   BlockCollapser
   BlockCollector
   BlockSplitter
