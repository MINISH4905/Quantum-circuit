---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/timeline/drawings.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/timeline/drawings.py
license: Apache-2.0
---

## Module `qiskit/visualization/timeline/drawings.py`

Drawing objects for timeline drawer.

Drawing objects play two important roles:
    - Allowing unittests of visualization module. Usually it is hard for image files to be tested.
    - Removing program parser from each plotter interface. We can easily add new plotter.

This module is based on the structure of matplotlib as it is the primary plotter
of the timeline drawer. However this interface is agnostic to the actual plotter.

Design concept
~~~~~~~~~~~~~~
When we think about dynamically updating drawings, it will be most efficient to
update only the changed properties of drawings rather than regenerating entirely from scratch.
Thus the core :py:class:`~qiskit.visualization.timeline.core.DrawerCanvas` generates
all possible drawings in the beginning and then the canvas instance manages
visibility of each drawing according to the end-user request.

Data key
~~~~~~~~
In the abstract class ``ElementaryData`` common attributes to represent a drawing are
specified. In addition, drawings have the `data_key` property that returns an
unique hash of the object for comparison.
This key is generated from a data type, the location of the drawing in the canvas,
and associated qubit or classical bit objects.
See py:mod:`qiskit.visualization.timeline.types` for detail on the data type.
If a data key cannot distinguish two independent objects, you need to add a new data type.
The data key may be used in the plotter interface to identify the object.

Drawing objects
~~~~~~~~~~~~~~~
To support not only `matplotlib` but also multiple plotters, those drawings should be
universal and designed without strong dependency on modules in `matplotlib`.
This means drawings that represent primitive geometries are preferred.
It should be noted that there will be no unittest for each plotter API, which takes
drawings and outputs image data, we should avoid adding a complicated geometry
that has a context of the scheduled circuit program.

For example, a two qubit scheduled gate may be drawn by two rectangles that represent
time occupation of two quantum registers during the gate along with a line connecting
these rectangles to identify the pair. This shape can be represented with
two box-type objects with one line-type object instead of defining a new object dedicated
to the two qubit gate. As many plotters don't support an API that visualizes such
a linked-box shape, if we introduce such complex drawings and write a
custom wrapper function on top of the existing API,
it could be difficult to prevent bugs with the CI tools due to lack of
the effective unittest for image data.

Link between gates
~~~~~~~~~~~~~~~~~~
The ``GateLinkData`` is the special subclass of drawing that represents
a link between bits. Usually objects are associated to the specific bit,
but ``GateLinkData`` can be associated with multiple bits to illustrate relationship
between quantum or classical bits during a gate operation.

## `ElementaryData`

```python
class ElementaryData(ABC)
```

Base class of the scheduled circuit visualization object.

Note that drawings are mutable.

### `__init__`

```python
def __init__(self, data_type: str | Enum, xvals: np.ndarray | list[types.Coordinate], yvals: np.ndarray | list[types.Coordinate], bits: types.Bits | list[types.Bits] | None=None, meta: dict[str, Any] | None=None, styles: dict[str, Any] | None=None)
```

Create new drawing.

Args:
    data_type: String representation of this drawing.
    xvals: Series of horizontal coordinate that the object is drawn.
    yvals: Series of vertical coordinate that the object is drawn.
    bits: Qubit or Clbit object bound to this drawing.
    meta: Meta data dictionary of the object.
    styles: Style keyword args of the object. This conforms to `matplotlib`.

### `data_key`

```python
def data_key(self)
```

Return unique hash of this object.

## `LineData`

```python
class LineData(ElementaryData)
```

Drawing object that represents line shape.

### `__init__`

```python
def __init__(self, data_type: str | Enum, xvals: np.ndarray | list[types.Coordinate], yvals: np.ndarray | list[types.Coordinate], bit: types.Bits, meta: dict[str, Any] | None=None, styles: dict[str, Any] | None=None)
```

Create new line.

Args:
    data_type: String representation of this drawing.
    xvals: Series of horizontal coordinate that the object is drawn.
    yvals: Series of vertical coordinate that the object is drawn.
    bit: Bit associated to this object.
    meta: Meta data dictionary of the object.
    styles: Style keyword args of the object. This conforms to `matplotlib`.

## `BoxData`

```python
class BoxData(ElementaryData)
```

Drawing object that represents box shape.

### `__init__`

```python
def __init__(self, data_type: str | Enum, xvals: np.ndarray | list[types.Coordinate], yvals: np.ndarray | list[types.Coordinate], bit: types.Bits, meta: dict[str, Any] | None=None, styles: dict[str, Any] | None=None)
```

Create new box.

Args:
    data_type: String representation of this drawing.
    xvals: Left and right coordinate that the object is drawn.
    yvals: Top and bottom coordinate that the object is drawn.
    bit: Bit associated to this object.
    meta: Meta data dictionary of the object.
    styles: Style keyword args of the object. This conforms to `matplotlib`.

Raises:
    VisualizationError: When number of data points are not equals to 2.

## `TextData`

```python
class TextData(ElementaryData)
```

Drawing object that represents a text on canvas.

### `__init__`

```python
def __init__(self, data_type: str | Enum, xval: types.Coordinate, yval: types.Coordinate, bit: types.Bits, text: str, latex: str | None=None, meta: dict[str, Any] | None=None, styles: dict[str, Any] | None=None)
```

Create new text.

Args:
    data_type: String representation of this drawing.
    xval: Horizontal coordinate that the object is drawn.
    yval: Vertical coordinate that the object is drawn.
    bit: Bit associated to this object.
    text: A string to draw on the canvas.
    latex: If set this string is used instead of `text`.
    meta: Meta data dictionary of the object.
    styles: Style keyword args of the object. This conforms to `matplotlib`.

## `GateLinkData`

```python
class GateLinkData(ElementaryData)
```

A special drawing data type that represents bit link of multi-bit gates.

Note this object takes multiple bits and dedicates them to the bit link.
This may appear as a line on the canvas.

### `__init__`

```python
def __init__(self, xval: types.Coordinate, bits: list[types.Bits], styles: dict[str, Any] | None=None)
```

Create new bit link.

Args:
    xval: Horizontal coordinate that the object is drawn.
    bits: Bit associated to this object.
    styles: Style keyword args of the object. This conforms to `matplotlib`.
