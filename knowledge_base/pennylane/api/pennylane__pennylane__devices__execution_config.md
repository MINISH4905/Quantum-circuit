---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/execution_config.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/execution_config.py
license: Apache-2.0
---

## Module `pennylane/devices/execution_config.py`

Contains the :class:`ExecutionConfig` and :class:`MCMConfig` data classes.

## `FrozenMapping`

```python
class FrozenMapping(MutableMapping)
```

Custom immutable mapping.
Inherit from MutableMapping to ensure all mutable methods are implemented.

### `__hash__`

```python
def __hash__(self)
```

Makes the object hashable, allowing it to be used in sets and as a dict key.

### `copy`

```python
def copy(self)
```

Returns a standard, mutable shallow copy of the data.

### `__copy__`

```python
def __copy__(self)
```

Supports copy.copy() by returning a mutable dict.

### `__deepcopy__`

```python
def __deepcopy__(self, memo=None)
```

Supports copy.deepcopy() by returning a mutable dict with deep-copied contents.

## `MCM_METHOD`

```python
class MCM_METHOD(StrEnum)
```

Canonical set up supported mid-circuit measurement methods.

## `POSTSELECT_MODE`

```python
class POSTSELECT_MODE(StrEnum)
```

Canonical set up supported postselect modes.

## `MCMConfig`

```python
class MCMConfig
```

A class to store mid-circuit measurement configurations.

### `__post_init__`

```python
def __post_init__(self)
```

Validate the configured mid-circuit measurement options.

### `__repr__`

```python
def __repr__(self)
```

Custom __repr__ for displaying the MCMConfig.

## `ExecutionConfig`

```python
class ExecutionConfig
```

A class to configure the execution of a quantum circuit on a device.

See the Attributes section to learn more about the various configurable options.

### `__post_init__`

```python
def __post_init__(self)
```

Validate the configured execution options.

Note that this hook is automatically called after init via the dataclass integration.
