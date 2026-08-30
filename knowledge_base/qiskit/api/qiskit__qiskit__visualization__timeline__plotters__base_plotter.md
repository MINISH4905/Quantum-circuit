---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/timeline/plotters/base_plotter.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/timeline/plotters/base_plotter.py
license: Apache-2.0
---

## Module `qiskit/visualization/timeline/plotters/base_plotter.py`

Base plotter API.

## `BasePlotter`

```python
class BasePlotter(ABC)
```

Base class of Qiskit plotter.

### `__init__`

```python
def __init__(self, canvas: core.DrawerCanvas)
```

Create new plotter.
Args:
    canvas: Configured drawer canvas object.

### `initialize_canvas`

```python
def initialize_canvas(self)
```

Format appearance of the canvas.

### `draw`

```python
def draw(self)
```

Output drawings stored in canvas object.

### `save_file`

```python
def save_file(self, filename: str)
```

Save image to file.
Args:
    filename: File path to output image data.

### `get_image`

```python
def get_image(self, interactive: bool=False) -> Any
```

Get image data to return.
Args:
    interactive: When set `True` show the circuit in a new window.
        This depends on the matplotlib backend being used supporting this.
Returns:
    Image data. This depends on the plotter API.
