---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/random/__init__.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/random/__init__.py
license: Apache-2.0
---

## Module `qiskit/circuit/random/__init__.py`

==============================================
Random Circuits (:mod:`qiskit.circuit.random`)
==============================================

.. currentmodule:: qiskit.circuit.random

Overview
========

The :mod:`qiskit.circuit.random` module offers functions that can be used for generating
arbitrary circuits with gates randomly selected from a given set of gates.

These circuits can be used for benchmarking existing quantum hardware and estimating
the performance of quantum circuit transpilers and software infrastructure.
The functions below can generate bespoke quantum circuits respecting various properties
such as number of qubits, depth of the circuit, coupling map, gate set, etc.

Generating arbitrary circuits
------------------------------------

.. autofunction:: random_circuit


Generating arbitrary circuits respecting qubit-coupling
--------------------------------------------------------------

.. autofunction:: random_circuit_from_graph


Generating arbitrary circuits with clifford gates
--------------------------------------------------------

.. autofunction:: random_clifford_circuit
