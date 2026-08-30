---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/preset_passmanagers/pbc/pass_manager.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/preset_passmanagers/pbc/pass_manager.py
license: Apache-2.0
---

## Module `qiskit/transpiler/preset_passmanagers/pbc/pass_manager.py`

Preset pass manager generation function for compiling into PBC.

## `pbc_pass_manager`

```python
def pbc_pass_manager(pass_manager_config: PassManagerPBCConfig, optimization_level: int) -> StagedPassManager
```

Generate a staged pass manager for transpiling into PBC.

This function is invoked by :func:`.generate_preset_pbc_pass_manager`.
It generates a specialized transpilation pipeline consisting of the following stages:

* Unrolling: Decompose circuit instructions into a basis consisting of
  standard gates and instructions, pauli product rotations and measurements, and
  control-flow operations.
* Optimization: Optimize unrolled circuits.
* PBC translation: Translate unrolled circuits with into Pauli-based circuits.
* PBC optimization: Optimize Pauli-based circuits.

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

## `generate_preset_pbc_pass_manager`

```python
def generate_preset_pbc_pass_manager(optimization_level: int=2, approximation_degree: float | None=1.0, seed_transpiler: int | None=None, unitary_synthesis_method: str='default', unitary_synthesis_plugin_config: dict | None=None, hls_config: HLSConfig | None=None, qubits_initially_zero: bool=True) -> StagedPassManager
```

Generate a preset PBC :class:`~.StagedPassManager`.

This function provides a convenient way to construct a preset pass manager for
PBC compilation.

Args:
    optimization_level: The optimization level to generate a
        :class:`~.StagedPassManager` for. By default optimization level 2
        is used if this is not specified. This can be 0, 1, 2, or 3. Higher
        levels generate potentially more optimized circuits, at the expense
        of potentially longer transpilation time.
    approximation_degree: Heuristic dial used for circuit approximation, where
        ``1.0`` means no approximation (up to numerical tolerance) and ``0.0``
        means the maximum approximation.
    seed_transpiler: Sets random seed for the stochastic parts of
        the transpiler. If it is not specified here it can also be specified via an environment
        variable: ``QISKIT_TRANSPILER_SEED`` or in a user configuration file. The priority
        order is: this argument, then the environment variable, and finally the user
        configuration option. So setting this argument will take precedence over the other
        methods of setting a seed.
    unitary_synthesis_method: The name of the unitary synthesis
        method to use. By default ``'default'`` is used. You can see a list of
        installed plugins with :func:`.unitary_synthesis_plugin_names`.
    unitary_synthesis_plugin_config: An optional configuration dictionary
        that will be passed directly to the unitary synthesis plugin. By
        default this setting will have no effect as the default unitary
        synthesis method does not take custom configuration. This should
        only be necessary when a unitary synthesis plugin is specified with
        the ``unitary_synthesis_method`` argument. As this is custom for each
        unitary synthesis plugin refer to the plugin documentation for how
        to use this option.
    hls_config: An optional configuration class :class:`~.HLSConfig`
        that will be passed directly to :class:`~.HighLevelSynthesis` transformation pass.
        This configuration class allows to specify for various high-level objects
        the lists of synthesis algorithms and their parameters.
    qubits_initially_zero: Indicates whether the input circuit is
        zero-initialized.

Returns:
    The preset pass manager for the given options.

Raises:
    TranspilerError: if an invalid value for ``optimization_level`` is passed in.
