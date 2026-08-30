---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/__init__.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/__init__.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/__init__.py`

================================================
Quantum Information (:mod:`qiskit.quantum_info`)
================================================

.. currentmodule:: qiskit.quantum_info

.. _quantum_info_operators:

Operators
=========

.. autosummary::
   :toctree: ../stubs/

   Operator
   Pauli
   Clifford
   ScalarOp
   SparseObservable
   SparsePauliOp
   PauliLindbladMap
   QubitSparsePauli
   QubitSparsePauliList
   PhasedQubitSparsePauli
   PhasedQubitSparsePauliList
   CNOTDihedral
   PauliList
   pauli_basis
   get_clifford_gate_names

.. _quantum_info_states:

States
======

.. autosummary::
   :toctree: ../stubs/

   Statevector
   DensityMatrix
   StabilizerState

Channels
========
.. autosummary::
   :toctree: ../stubs/

   Choi
   SuperOp
   Kraus
   Stinespring
   Chi
   PTM

Measures
========

.. autofunction:: average_gate_fidelity
.. autofunction:: process_fidelity
.. autofunction:: gate_error
.. autofunction:: diamond_norm
.. autofunction:: state_fidelity
.. autofunction:: purity
.. autofunction:: concurrence
.. autofunction:: entropy
.. autofunction:: entanglement_of_formation
.. autofunction:: mutual_information

Utility Functions
=================

.. autosummary::
   :toctree: ../stubs/

   Quaternion

.. autofunction:: partial_trace
.. autofunction:: schmidt_decomposition
.. autofunction:: shannon_entropy
.. autofunction:: commutator
.. autofunction:: anti_commutator
.. autofunction:: double_commutator

Random
======

.. autofunction:: random_statevector
.. autofunction:: random_density_matrix
.. autofunction:: random_unitary
.. autofunction:: random_hermitian
.. autofunction:: random_pauli
.. autofunction:: random_clifford
.. autofunction:: random_quantum_channel
.. autofunction:: random_cnotdihedral
.. autofunction:: random_pauli_list

Analysis
=========

.. autofunction:: hellinger_distance
.. autofunction:: hellinger_fidelity

.. autosummary::
   :toctree: ../stubs/

   Z2Symmetries
