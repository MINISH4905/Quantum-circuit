---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/preset_passmanagers/__init__.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/preset_passmanagers/__init__.py
license: Apache-2.0
---

## Module `qiskit/transpiler/preset_passmanagers/__init__.py`

==================================================================
Preset Passmanagers (:mod:`qiskit.transpiler.preset_passmanagers`)
==================================================================

.. currentmodule:: qiskit.transpiler.preset_passmanagers

This module contains functions for generating the preset pass managers
for the transpiler. The preset pass managers are instances of
:class:`~.StagedPassManager` which are used to execute the circuit
transformations as part of Qiskit's compiler inside the
:func:`~.transpile` function at the different optimization levels, but
can also be used in a standalone manner.
The functionality here is divided into two parts. The first includes the
functions used to generate the entire pass manager, which is used by
:func:`~.transpile` (:ref:`preset_pass_manager_generators`), and the
second includes functions that are used to build (either entirely or in
part) the stages that comprise the preset pass managers
(:ref:`stage_generators`).

.. _preset_pass_manager_generators:

Low-level preset pass manager generation
----------------------------------------

.. rubric:: Continuous basis sets

.. autofunction:: level_0_pass_manager
.. autofunction:: level_1_pass_manager
.. autofunction:: level_2_pass_manager
.. autofunction:: level_3_pass_manager

.. rubric:: Clifford+T basis sets

.. autofunction:: clifford_t_pass_manager

..
    `generate_preset_pass_manager` is not documented here because it's documented to be at the root
    of `qiskit.transpiler`.

.. _stage_generators:

Stage generator functions
-------------------------

.. autofunction:: generate_control_flow_options_check
.. autofunction:: generate_error_on_control_flow
.. autofunction:: generate_unroll_3q
.. autofunction:: generate_embed_passmanager
.. autofunction:: generate_routing_passmanager
.. autofunction:: generate_pre_op_passmanager
.. autofunction:: generate_translation_passmanager
.. autofunction:: generate_scheduling
