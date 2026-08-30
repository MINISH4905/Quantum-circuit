---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/mid_measure/measurement_value.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/mid_measure/measurement_value.py
license: Apache-2.0
---

## Module `pennylane/ops/mid_measure/measurement_value.py`

Defines the MeasurementValue class

## `no_processing`

```python
def no_processing(results)
```

A postprocessing function with no effect.

## `MeasurementValue`

```python
class MeasurementValue
```

A class representing unknown measurement outcomes in the qubit model.

Args:
    measurements (list[MidMeasure | PauliMeasure]): The measurement(s) that this object depends on.
    processing_fn (callable | None): A lazy transformation applied to the measurement values.

### `has_processing`

```python
def has_processing(self) -> bool
```

Whether or not classical processing is applied to the measurement value.

### `processing_fn`

```python
def processing_fn(self) -> Callable
```

A lazy transformation applied to the measurement values.

### `items`

```python
def items(self) -> Generator
```

A generator representing all the possible outcomes of the MeasurementValue.

### `postselected_items`

```python
def postselected_items(self) -> Generator
```

A generator representing all the possible outcomes of the MeasurementValue,
taking postselection into account.

### `wires`

```python
def wires(self)
```

Returns a list of wires corresponding to the mid-circuit measurements.

### `branches`

```python
def branches(self)
```

A dictionary representing all possible outcomes of the MeasurementValue.

### `map_wires`

```python
def map_wires(self, wire_map)
```

Returns a copy of the current ``MeasurementValue`` with the wires of each measurement changed
according to the given wire map.

Args:
    wire_map (dict): dictionary containing the old wires as keys and the new wires as values

Returns:
    MeasurementValue: new ``MeasurementValue`` instance with measurement wires mapped

### `__invert__`

```python
def __invert__(self)
```

Return a copy of the measurement value with an inverted control
value.

### `concretize`

```python
def concretize(self, measurements: dict)
```

Returns a concrete value from a dictionary of hashes with concrete values.
