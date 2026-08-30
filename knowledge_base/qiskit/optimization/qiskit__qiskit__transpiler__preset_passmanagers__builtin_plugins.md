---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/preset_passmanagers/builtin_plugins.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/preset_passmanagers/builtin_plugins.py
license: Apache-2.0
---

## Module `qiskit/transpiler/preset_passmanagers/builtin_plugins.py`

Built-in transpiler stage plugins for preset pass managers.

## `DefaultInitPassManager`

```python
class DefaultInitPassManager(PassManagerStagePlugin)
```

Plugin class for default init stage.

## `DefaultTranslationPassManager`

```python
class DefaultTranslationPassManager(PassManagerStagePlugin)
```

Plugin class for the default-method translation stage.

## `BasisTranslatorPassManager`

```python
class BasisTranslatorPassManager(PassManagerStagePlugin)
```

Plugin class for translation stage with :class:`~.BasisTranslator`

## `UnitarySynthesisPassManager`

```python
class UnitarySynthesisPassManager(PassManagerStagePlugin)
```

Plugin class for translation stage with :class:`~.UnitarySynthesis`

## `DefaultRoutingPassManager`

```python
class DefaultRoutingPassManager(PassManagerStagePlugin)
```

Plugin class for the "default" routing stage implementation.

## `BasicSwapPassManager`

```python
class BasicSwapPassManager(PassManagerStagePlugin)
```

Plugin class for routing stage with :class:`~.BasicSwap`

### `pass_manager`

```python
def pass_manager(self, pass_manager_config, optimization_level=None) -> PassManager
```

Build routing stage PassManager.

## `LookaheadSwapPassManager`

```python
class LookaheadSwapPassManager(PassManagerStagePlugin)
```

Plugin class for routing stage with :class:`~.LookaheadSwap`

### `pass_manager`

```python
def pass_manager(self, pass_manager_config, optimization_level=None) -> PassManager
```

Build routing stage PassManager.

## `SabreSwapPassManager`

```python
class SabreSwapPassManager(PassManagerStagePlugin)
```

Plugin class for routing stage with :class:`~.SabreSwap`

### `pass_manager`

```python
def pass_manager(self, pass_manager_config, optimization_level=None) -> PassManager
```

Build routing stage PassManager.

## `NoneRoutingPassManager`

```python
class NoneRoutingPassManager(PassManagerStagePlugin)
```

Plugin class for routing stage with error on routing.

### `pass_manager`

```python
def pass_manager(self, pass_manager_config, optimization_level=None) -> PassManager
```

Build routing stage PassManager.

## `OptimizationPassManager`

```python
class OptimizationPassManager(PassManagerStagePlugin)
```

Plugin class for optimization stage

### `pass_manager`

```python
def pass_manager(self, pass_manager_config, optimization_level=None)
```

Build pass manager for optimization stage.

## `AlapSchedulingPassManager`

```python
class AlapSchedulingPassManager(PassManagerStagePlugin)
```

Plugin class for alap scheduling stage.

### `pass_manager`

```python
def pass_manager(self, pass_manager_config, optimization_level=None) -> PassManager
```

Build scheduling stage PassManager

## `AsapSchedulingPassManager`

```python
class AsapSchedulingPassManager(PassManagerStagePlugin)
```

Plugin class for asap scheduling stage.

### `pass_manager`

```python
def pass_manager(self, pass_manager_config, optimization_level=None) -> PassManager
```

Build scheduling stage PassManager

## `DefaultSchedulingPassManager`

```python
class DefaultSchedulingPassManager(PassManagerStagePlugin)
```

Plugin class for default scheduling stage.

### `pass_manager`

```python
def pass_manager(self, pass_manager_config, optimization_level=None) -> PassManager
```

Build scheduling stage PassManager

## `DefaultLayoutPassManager`

```python
class DefaultLayoutPassManager(PassManagerStagePlugin)
```

Plugin class for default layout stage.

## `TrivialLayoutPassManager`

```python
class TrivialLayoutPassManager(PassManagerStagePlugin)
```

Plugin class for trivial layout stage.

## `DenseLayoutPassManager`

```python
class DenseLayoutPassManager(PassManagerStagePlugin)
```

Plugin class for dense layout stage.

## `SabreLayoutPassManager`

```python
class SabreLayoutPassManager(PassManagerStagePlugin)
```

Plugin class for sabre layout stage.

## `CliffordTInitPassManager`

```python
class CliffordTInitPassManager(PassManagerCliffordTStagePlugin)
```

Clifford+T transpilation stage, which decomposes larger gates into 1-qubit
and 2-qubits gates and performs logical optimizations.

## `TranslateToCliffordRZPassManager`

```python
class TranslateToCliffordRZPassManager(PassManagerCliffordTStagePlugin)
```

Clifford+T transpilation stage, which translates circuits into Clifford+RZ+T basis set.

## `OptimizeCliffordRZPassManager`

```python
class OptimizeCliffordRZPassManager(PassManagerCliffordTStagePlugin)
```

Clifford+T transpilation stage, which optimizes Clifford+RZ+T circuits.

### `pass_manager`

```python
def pass_manager(self, pass_manager_config: PassManagerCliffordTConfig, optimization_level: int | None=None)
```

Build pass manager for optimization stage.

## `TranslateToCliffordTPassManager`

```python
class TranslateToCliffordTPassManager(PassManagerCliffordTStagePlugin)
```

Clifford+T transpilation stage, which translates Clifford+RZ+T circuits
into Clifford+T circuits.

## `OptimizeCliffordTPassManager`

```python
class OptimizeCliffordTPassManager(PassManagerCliffordTStagePlugin)
```

Clifford+T transpilation stage, which optimizes Clifford+T circuits.
