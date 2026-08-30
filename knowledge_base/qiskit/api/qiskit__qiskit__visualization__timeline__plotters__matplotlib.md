---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/timeline/plotters/matplotlib.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/timeline/plotters/matplotlib.py
license: Apache-2.0
---

## Module `qiskit/visualization/timeline/plotters/matplotlib.py`

Matplotlib plotter API.

## `MplPlotter`

```python
class MplPlotter(BasePlotter)
```

Matplotlib API for pulse drawer.

This plotter arranges bits along y axis of 2D canvas with vertical offset.

### `__init__`

```python
def __init__(self, canvas: core.DrawerCanvas, axis: plt.Axes | None=None)
```

Create new plotter.

Args:
    canvas: Configured drawer canvas object. Canvas object should be updated
        with `.update` method before initializing the plotter.
    axis: Matplotlib axis object. When `axis` is provided, the plotter updates
        given axis instead of creating and returning new matplotlib figure.

### `initialize_canvas`

```python
def initialize_canvas(self)
```

Format appearance of matplotlib canvas.

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
def get_image(self, interactive: bool=False) -> matplotlib.pyplot.Figure
```

Get image data to return.
Args:
    interactive: When set `True` show the circuit in a new window.
        This depends on the matplotlib backend being used supporting this.
Returns:
    Matplotlib figure data.
