---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/preset_passmanagers/pbc/plugins.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/preset_passmanagers/pbc/plugins.py
license: Apache-2.0
---

## Module `qiskit/transpiler/preset_passmanagers/pbc/plugins.py`

Built-in transpiler stage plugins for PBC transpilation.

## `PassManagerPBCConfig`

```python
class PassManagerPBCConfig
```

Pass Manager Configuration for PBC transpilation.

### `__init__`

```python
def __init__(self, approximation_degree: float | None=None, seed_transpiler: int | None=None, unitary_synthesis_method: str='default', unitary_synthesis_plugin_config: dict | None=None, hls_config: HLSConfig | None=None, qubits_initially_zero: bool=True)
```

Args:
    approximation_degree: Heuristic dial used for circuit approximation, where
        ``1.0`` means no approximation (up to numerical tolerance) and ``0.0``
        means the maximum approximation. The value of ``None`` is treated
        as ``1.0``.
    seed_transpiler: Sets random seed for the stochastic parts of
        the transpiler.
    unitary_synthesis_method: The string method to use for the
        :class:`~qiskit.transpiler.passes.UnitarySynthesis` pass. Will
        search installed plugins for a valid method. You can see a list of
        installed plugins with :func:`.unitary_synthesis_plugin_names`.
    unitary_synthesis_plugin_config: The configuration dictionary that will
        be passed to the specified unitary synthesis plugin. Refer to
        the plugin documentation for how to use this.
    hls_config: An optional configuration class to use for
        :class:`~qiskit.transpiler.passes.HighLevelSynthesis` pass.
        Specifies how to synthesize various high-level objects.
    qubits_initially_zero: Indicates whether the input circuit is
        zero-initialized.

## `PassManagerPBCStagePlugin`

```python
class PassManagerPBCStagePlugin(abc.ABC)
```

A ``PassManagerPBCStagePlugin`` is a plugin interface object for defining
stages in :func:`~.generate_preset_pbc_pass_manager`.

### `pass_manager`

```python
def pass_manager(self, pass_manager_config: PassManagerPBCConfig, optimization_level: int | None=None) -> PassManager | None
```

This method is designed to return a :class:`~.PassManager` for the stage this implements

Args:
    pass_manager_config: A configuration object that defines all the target device
        specifications and any user specified options to
        :func:`~.generate_preset_pbc_pass_manager`.
    optimization_level: The optimization level of the transpilation, if set this
        should be used to set values for any tunable parameters to trade off runtime
        for potential optimization. Valid values should be ``0``, ``1``, ``2``, or ``3``
        and the higher the number the more optimization is expected.

Returns:
    the :class:`.PassManager` to run, or ``None`` if nothing is needed for this
    configuration (for example, an optimization plugin might return ``None`` at
    ``optimization_level=0``).

## `UnrollPassManager`

```python
class UnrollPassManager(PassManagerPBCStagePlugin)
```

PBC transpilation stage, which decomposes circuit instruction into standard gates and instructions.

## `OptimizePassManager`

```python
class OptimizePassManager(PassManagerPBCStagePlugin)
```

PBC transpilation stage, which optimizes circuits with standard gates and instructions.

## `TranslateToPBCPassManager`

```python
class TranslateToPBCPassManager(PassManagerPBCStagePlugin)
```

PBC transpilation stage, which translates circuits with standard gates and instructions
into Pauli-based circuits.

## `OptimizePBCPassManager`

```python
class OptimizePBCPassManager(PassManagerPBCStagePlugin)
```

PBC transpilation stage, which optimizes Pauli-based circuits.
