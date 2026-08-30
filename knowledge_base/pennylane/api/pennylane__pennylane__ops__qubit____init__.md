---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/qubit/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/qubit/__init__.py
license: Apache-2.0
---

## Module `pennylane/ops/qubit/__init__.py`

This module contains the discrete-variable quantum operations.

The operations are divided into the following files:

* ``arithmetic_ops.py``: Operations that perform arithmetic on the states.
* ``matrix_ops.py``: Generalized operations that accept a matrix parameter,
  either unitary or hermitian depending.
* ``non_parameteric_ops.py``: All operations with no parameters.
* ``observables.py``: Qubit observables excluding the Pauli gates, which are
  located in ``non_parameteric_ops.py`` instead.
* ``parametric_ops_single_qubit.py``: Core single qubit parametric operations.
* ``parametric_ops_multi_qubit.py``: Core multi-qubit parametric operations.
* ``qchem_ops.py``: Operations for quantum chemistry applications.
* ``state_preparation.py``: Operations that initialize the state.
* ``special_unitary.py``: The ``SpecialUnitary`` operation.
