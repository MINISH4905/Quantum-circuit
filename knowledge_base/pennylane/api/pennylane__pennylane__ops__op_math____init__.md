---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/__init__.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/__init__.py`

This module contains classes and functions for Operator arithmetic.

Constructor Functions
~~~~~~~~~~~~~~~~~~~~~

.. currentmodule:: pennylane

.. autosummary::
    :toctree: api

    ~adjoint
    ~ctrl
    ~cond
    ~change_op_basis
    ~exp
    ~sum
    ~pow
    ~prod
    ~s_prod

Symbolic Classes
~~~~~~~~~~~~~~~~

.. currentmodule:: pennylane.ops.op_math

.. autosummary::
    :toctree: api

    ~Adjoint
    ~ChangeOpBasis
    ~CompositeOp
    ~Conditional
    ~Controlled
    ~ControlledOp
    ~Evolution
    ~Exp
    ~LinearCombination
    ~Pow
    ~Prod
    ~Sum
    ~SProd
    ~SymbolicOp
    ~ScalarSymbolicOp

Controlled Operator Classes
~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. currentmodule:: pennylane

.. autosummary::
    :toctree: api

    ~ControlledQubitUnitary
    ~CY
    ~CZ
    ~CH
    ~CCZ
    ~CSWAP
    ~CNOT
    ~Toffoli
    ~MultiControlledX
    ~CRX
    ~CRY
    ~CRZ
    ~CRot
    ~ControlledPhaseShift

Decompositions
~~~~~~~~~~~~~~

.. currentmodule:: pennylane.ops

.. autosummary::
    :toctree: api

    ~one_qubit_decomposition
    ~two_qubit_decomposition
    ~multi_qubit_decomposition
    ~sk_decomposition
    ~rs_decomposition

Control Decompositions
~~~~~~~~~~~~~~~~~~~~~~

.. currentmodule:: pennylane.ops.op_math

.. autosummary::
    :toctree: api

    ~ctrl_decomp_zyz
    ~ctrl_decomp_bisect
