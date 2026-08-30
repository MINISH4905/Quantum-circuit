---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/preset_passmanagers/clifford_t.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/preset_passmanagers/clifford_t.py
license: Apache-2.0
---

## Module `qiskit/transpiler/preset_passmanagers/clifford_t.py`

Preset pass manager generation function for compiling into Clifford+T.

## `clifford_t_pass_manager`

```python
def clifford_t_pass_manager(pass_manager_config: PassManagerCliffordTConfig, optimization_level: int) -> StagedPassManager
```

Generate a staged pass manager for transpiling into Clifford+T basis.

This function is invoked by :func:`.generate_preset_pass_manager` when
the target basis consists of Clifford+T gates. It generates a specialized
transpilation pipeline consisting of the following stages:

* Initialization: Decompose larger gates into 1-qubit and 2-qubits gates and perform
  logical optimizations.
* Layout: Apply the default layout strategy used for continuous basis sets.
* Routing: Apply the default routing strategy used for continuous basis sets.
* RZ translation: Translate the circuit into Clifford+RZ basis.
* RZ optimization: Optimize the circuit within Clifford+RZ basis.
* T translation: Translate the circuit into Clifford+T basis.
* T optimization: Optimizes the circuit within Clifford+T basis.
* Scheduling: Apply the default scheduling strategy used for continuous basis sets.

For best results, consider including both :math:`T` and :math:`T^\dagger` into the specified
Clifford+T basis and as many Clifford gates as possible. For example::

    basis_gates = get_clifford_gate_names() + ["t", "tdg"]

.. note::

    These stages are still experimental and subject to change. In particular,
    they are not yet exposed as transpiler stage plugins (unlike the stages
    for continuous basis sets).

Args:
    pass_manager_config: Configuration of the pass manager.
    optimization_level: The optimization level. By default optimization level 2
        is used if this is not specified. This can be 0, 1, 2, or 3. Higher
        levels generate potentially more optimized circuits, at the expense
        of longer transpilation time.
Returns:
    Staged pass manager.

Raises:
    TranspilerError: if the passmanager config is invalid.

## `clifford_t_pass_manager_legacy`

```python
def clifford_t_pass_manager_legacy(pass_manager_config: PassManagerConfig, optimization_level: int) -> StagedPassManager
```

Generate a staged pass manager for transpiling into Clifford+T basis.

This function is invoked by :func:`.generate_preset_pass_manager` when
the target basis consists of Clifford+T gates. It generates a specialized
transpilation pipeline consisting of the six usual stages that can be
specified by the plugin interface.

* Initialization: Decompose larger gates into 1-qubit and 2-qubits gates and perform
  logical optimizations.
* Layout: Apply the default layout strategy used for continuous basis sets.
* Routing: Apply the default routing strategy used for continuous basis sets.
* Translation: Translate the circuit into Clifford+T basis.
* Optimization: Optimizes the circuit within Clifford+T basis.
* Scheduling: Apply the default scheduling strategy used for continuous basis sets.

For best results, consider including both :math:`T` and :math:`T^\dagger` into the specified
Clifford+T basis and as many Clifford gates as possible. For example::

    basis_gates = get_clifford_gate_names() + ["t", "tdg"]

Args:
    pass_manager_config: Configuration of the pass manager.
    optimization_level: The optimization level. By default optimization level 2
        is used if this is not specified. This can be 0, 1, 2, or 3. Higher
        levels generate potentially more optimized circuits, at the expense
        of longer transpilation time.
Returns:
    Staged pass manager.

Raises:
    TranspilerError: if the passmanager config is invalid.
