---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/capabilities.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/capabilities.py
license: Apache-2.0
---

## Module `pennylane/devices/capabilities.py`

Defines the DeviceCapabilities class, and tools to load it from a TOML file.

## `load_toml_file`

```python
def load_toml_file(file_path: str) -> dict
```

Loads a TOML file and returns the parsed dict.

## `ExecutionCondition`

```python
class ExecutionCondition(Enum)
```

The constraint on the support of something.

## `OperatorProperties`

```python
class OperatorProperties
```

Information about support for each operation.

## `DeviceCapabilities`

```python
class DeviceCapabilities
```

Capabilities of a quantum device.

### `__post_init__`

```python
def __post_init__(self)
```

Validate the device's capabilities.

### `filter`

```python
def filter(self, finite_shots: bool) -> 'DeviceCapabilities'
```

Returns the device capabilities conditioned on the given program features.

### `from_toml_file`

```python
def from_toml_file(cls, file_path: str, runtime_interface='pennylane') -> 'DeviceCapabilities'
```

Loads a DeviceCapabilities object from a TOML file.

Args:
    file_path (str): The path to the TOML file.
    runtime_interface (str): The runtime execution interface to get the capabilities for.
        Acceptable values are ``"pennylane"`` and ``"qjit"``. Use ``"pennylane"`` for capabilities of
        the device's implementation of `Device.execute`, and ``"qjit"`` for capabilities of
        the runtime execution function used by a qjit-compiled workflow.

### `gate_set`

```python
def gate_set(self, differentiable=False) -> set[str]
```

Get the names of the set of supported gates.

Args:
    differentiable (bool): Whether to include gates that are not differentiable.
        If True, gates that are not differentiable will be excluded.

Returns:
    set[str]: The target gate set.

### `supports_operation`

```python
def supports_operation(self, operation: str | Operator) -> bool
```

Checks if the given operation is supported by name.

### `supports_observable`

```python
def supports_observable(self, observable: str | Operator) -> bool
```

Checks if the given observable is supported by name.

## `parse_toml_document`

```python
def parse_toml_document(document: dict) -> DeviceCapabilities
```

Parses a TOML document into a DeviceCapabilities object.

This function will ignore sections that are specific to either runtime interface, such as
``"qjit.operators.gates"``. To include these sections, use :func:`update_device_capabilities`
on the capabilities object returned from this function.

## `update_device_capabilities`

```python
def update_device_capabilities(capabilities: DeviceCapabilities, document: dict, runtime_interface: str)
```

Updates the device capabilities objects with additions specific to the runtime interface.

## `observable_stopping_condition_factory`

```python
def observable_stopping_condition_factory(capabilities: DeviceCapabilities) -> Callable[[Operator], bool]
```

Returns a default observable validation check from a capabilities object.

The returned function checks if an observable is supported, for composite and nested
observables, check that the operands are supported.

## `validate_mcm_method`

```python
def validate_mcm_method(capabilities: DeviceCapabilities | None, mcm_method: str | None, shots_present: bool)
```

Validates an MCM method against the device's capabilities.
