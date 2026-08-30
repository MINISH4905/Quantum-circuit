---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/timeline/core.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/timeline/core.py
license: Apache-2.0
---

## Module `qiskit/visualization/timeline/core.py`

Core module of the timeline drawer.

This module provides the `DrawerCanvas` which is a collection of drawings.
The canvas instance is not just a container of drawing objects, as it also performs
data processing like binding abstract coordinates.


Initialization
~~~~~~~~~~~~~~
The `DataCanvas` is not exposed to users as they are implicitly initialized in the
interface function. It is noteworthy that the data canvas is agnostic to plotters.
This means once the canvas instance is initialized we can reuse this data
among multiple plotters. The canvas is initialized with a stylesheet.

    ```python
    canvas = DrawerCanvas(stylesheet=stylesheet)
    canvas.load_program(sched)
    canvas.update()
    ```

Once all properties are set, `.update` method is called to apply changes to drawings.

Update
~~~~~~
To update the image, a user can set new values to canvas and then call the `.update` method.

    ```python
    canvas.set_time_range(2000, 3000)
    canvas.update()
    ```

All stored drawings are updated accordingly. The plotter API can access to
drawings with `.collections` property of the canvas instance. This returns
an iterator of drawings with the unique data key.
If a plotter provides object handler for plotted shapes, the plotter API can manage
the lookup table of the handler and the drawings by using this data key.

## `DrawerCanvas`

```python
class DrawerCanvas
```

Data container for drawings.

### `__init__`

```python
def __init__(self, stylesheet: QiskitTimelineStyle)
```

Create new data container.

### `time_range`

```python
def time_range(self) -> tuple[int, int]
```

Return current time range to draw.

Calculate net duration and add side margin to edge location.

Returns:
    Time window considering side margin.

### `time_range`

```python
def time_range(self, new_range: tuple[int, int])
```

Update time range to draw.

### `collections`

```python
def collections(self) -> Iterator[tuple[str, drawings.ElementaryData]]
```

Return currently active entries from drawing data collection.

The object is returned with unique name as a key of an object handler.
When the horizontal coordinate contains `AbstractCoordinate`,
the value is substituted by current time range preference.

### `add_data`

```python
def add_data(self, data: drawings.ElementaryData)
```

Add drawing to collections.

If the given object already exists in the collections,
this interface replaces the old object instead of adding new entry.

Args:
    data: New drawing to add.

### `load_program`

```python
def load_program(self, program: circuit.QuantumCircuit, target: Target | None=None)
```

Load quantum circuit and create drawing..

.. deprecated:: 1.3
   Visualization of unscheduled circuits with the timeline drawer has been
   deprecated in Qiskit 1.3.
   This circuit should be transpiled with a scheduler, despite having instructions
   with explicit durations.

.. deprecated:: 1.3
   Targets with duration-less operations are going to error in Qiskit 2.0.

Args:
    program: Scheduled circuit object to draw.
    target: The target the circuit is scheduled for. This contains backend information
        including the instruction durations used in scheduling.

Raises:
   VisualizationError: When circuit is not scheduled.

### `set_time_range`

```python
def set_time_range(self, t_start: int, t_end: int)
```

Set time range to draw.

Args:
    t_start: Left boundary of drawing in units of cycle time.
    t_end: Right boundary of drawing in units of cycle time.

### `set_disable_bits`

```python
def set_disable_bits(self, bit: types.Bits, remove: bool=True)
```

Interface method to control visibility of bits.

Specified object in the blocked list will not be shown.

Args:
    bit: A qubit or classical bit object to disable.
    remove: Set `True` to disable, set `False` to enable.

### `set_disable_type`

```python
def set_disable_type(self, data_type: types.DataTypes, remove: bool=True)
```

Interface method to control visibility of data types.

Specified object in the blocked list will not be shown.

Args:
    data_type: A drawing data type to disable.
    remove: Set `True` to disable, set `False` to enable.

### `update`

```python
def update(self)
```

Update all collections.

This method should be called before the canvas is passed to the plotter.
