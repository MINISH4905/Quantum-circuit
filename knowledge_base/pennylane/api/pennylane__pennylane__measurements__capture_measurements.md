---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/measurements/capture_measurements.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/measurements/capture_measurements.py
license: Apache-2.0
---

## Module `pennylane/measurements/capture_measurements.py`

This submodule defines the abstract classes and primitives for capturing measurements.

## `create_measurement_obs_primitive`

```python
def create_measurement_obs_primitive(measurement_type: type['qp.measurements.MeasurementProcess'], name: str) -> Optional['jax.extend.core.Primitive']
```

Create a primitive corresponding to the input type where the abstract inputs are an operator.

Called by default when defining any class inheriting from :class:`~.MeasurementProcess`, and is used to
set the ``MeasurementProcesss._obs_primitive`` property.

Args:
    measurement_type (type): a subclass of :class:`~.MeasurementProcess`
    name (str): the preferred string name for the class. For example, ``"expval"``.
        ``"_obs"`` is appended to this name for the name of the primitive.

Returns:
    Optional[jax.extend.core.Primitive]: A new jax primitive. ``None`` is returned if jax is not available.

## `create_measurement_mcm_primitive`

```python
def create_measurement_mcm_primitive(measurement_type: type['qp.measurements.MeasurementProcess'], name: str) -> Optional['jax.extend.core.Primitive']
```

Create a primitive corresponding to the input type where the abstract inputs are classical
mid circuit measurement results.

Called by default when defining any class inheriting from :class:`~.MeasurementProcess`, and is used to
set the ``MeasurementProcesss._mcm_primitive`` property.

Args:
    measurement_type (type): a subclass of :class:`~.MeasurementProcess`
    name (str): the preferred string name for the class. For example, ``"expval"``.
        ``"_mcm"`` is appended to this name for the name of the primitive.

Returns:
    Optional[jax.extend.core.Primitive]: A new jax primitive. ``None`` is returned if jax is not available.

## `create_measurement_wires_primitive`

```python
def create_measurement_wires_primitive(measurement_type: type, name: str) -> Optional['jax.extend.core.Primitive']
```

Create a primitive corresponding to the input type where the abstract inputs are the wires.

Called by default when defining any class inheriting from :class:`~.MeasurementProcess`, and is used to
set the ``MeasurementProcesss._wires_primitive`` property.

Args:
    measurement_type (type): a subclass of :class:`~.MeasurementProcess`
    name (str): the preferred string name for the class. For example, ``"expval"``.
        ``"_wires"`` is appended to this name for the name of the primitive.

Returns:
    Optional[jax.extend.core.Primitive]: A new jax primitive. ``None`` is returned if jax is not available.
