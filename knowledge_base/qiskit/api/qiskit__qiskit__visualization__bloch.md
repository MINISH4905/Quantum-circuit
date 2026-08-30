---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/bloch.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/bloch.py
license: Apache-2.0
---

## Module `qiskit/visualization/bloch.py`

Bloch sphere

## `Arrow3D`

```python
class Arrow3D(Patch3D, FancyArrowPatch)
```

Makes a fancy arrow

## `Bloch`

```python
class Bloch
```

Class for plotting data on the Bloch sphere.  Valid data can be
either points or vectors.

Attributes:
    axes (instance):
        User supplied Matplotlib axes for Bloch sphere animation.
    fig (instance):
        User supplied Matplotlib Figure instance for plotting Bloch sphere.
    font_color (str):
        Color of font used for Bloch sphere labels.
    font_size (int):
        Size of font used for Bloch sphere labels.
    frame_alpha (float):
        Sets transparency of Bloch sphere frame.
    frame_color (str):
        Color of sphere wireframe.
    frame_width (int):
        Width of wireframe.
    point_color (list):
        List of colors for Bloch sphere point markers to cycle through.
        i.e. By default, points 0 and 4 will both be blue ('b').
    point_marker (list):
        List of point marker shapes to cycle through.
    point_size (list):
        List of point marker sizes. Note, not all point markers look
        the same size when plotted!
    sphere_alpha (float):
        Transparency of Bloch sphere itself.
    sphere_color (str):
        Color of Bloch sphere.
    figsize (list):
        Figure size of Bloch sphere plot.  Best to have both numbers the same;
        otherwise you will have a Bloch sphere that looks like a football.
    vector_color (list):
        List of vector colors to cycle through.
    vector_width (int):
        Width of displayed vectors.
    vector_style (str):
        Vector arrowhead style (from matplotlib's arrow style).
    vector_mutation (int):
        Width of vectors arrowhead.
    view (list):
        Azimuthal and Elevation viewing angles.
    xlabel (list):
        List of strings corresponding to +x and -x axes labels, respectively.
    xlpos (list):
        Positions of +x and -x labels respectively.
    ylabel (list):
        List of strings corresponding to +y and -y axes labels, respectively.
    ylpos (list):
        Positions of +y and -y labels respectively.
    zlabel (list):
        List of strings corresponding to +z and -z axes labels, respectively.
    zlpos (list):
        Positions of +z and -z labels respectively.

### `set_label_convention`

```python
def set_label_convention(self, convention)
```

Set x, y and z labels according to one of conventions.

Args:
    convention (str):
        One of the following:
            - "original"
            - "xyz"
            - "sx sy sz"
            - "01"
            - "polarization jones"
            - "polarization jones letters"
            see also: https://en.wikipedia.org/wiki/Jones_calculus
            - "polarization stokes"
            see also: https://en.wikipedia.org/wiki/Stokes_parameters
Raises:
    Exception: If convention is not valid.

### `clear`

```python
def clear(self)
```

Resets Bloch sphere data sets to empty.

### `add_points`

```python
def add_points(self, points, meth='s')
```

Add a list of data points to Bloch sphere.

Args:
    points (array_like):
        Collection of data points.
    meth (str):
        Type of points to plot, use 'm' for multicolored, 'l' for points
        connected with a line.

### `add_vectors`

```python
def add_vectors(self, vectors)
```

Add a list of vectors to Bloch sphere.

Args:
    vectors (array_like):
        Array with vectors of unit length or smaller.

### `add_annotation`

```python
def add_annotation(self, state_or_vector, text, **kwargs)
```

Add a text or LaTeX annotation to Bloch sphere,
parameterized by a qubit state or a vector.

Args:
    state_or_vector (array_like):
        Position for the annotation.
        Qobj of a qubit or a vector of 3 elements.
    text (str):
        Annotation text.
        You can use LaTeX, but remember to use raw string
        e.g. r"$\langle x \rangle$"
        or escape backslashes
        e.g. "$\\langle x \\rangle$".
    **kwargs:
        Options as for mplot3d.axes3d.text, including:
        fontsize, color, horizontalalignment, verticalalignment.
Raises:
    Exception: If input not array_like or tuple.

### `make_sphere`

```python
def make_sphere(self)
```

Plots Bloch sphere and data sets.

### `render`

```python
def render(self, title='')
```

Render the Bloch sphere and its data sets in on given figure and axes.

### `plot_back`

```python
def plot_back(self)
```

back half of sphere

### `plot_front`

```python
def plot_front(self)
```

front half of sphere

### `plot_axes`

```python
def plot_axes(self)
```

axes

### `plot_axes_labels`

```python
def plot_axes_labels(self)
```

axes labels

### `plot_vectors`

```python
def plot_vectors(self)
```

Plot vector

### `plot_points`

```python
def plot_points(self)
```

Plot points

### `plot_annotations`

```python
def plot_annotations(self)
```

Plot annotations

### `show`

```python
def show(self, title='')
```

Display Bloch sphere and corresponding data sets.

### `save`

```python
def save(self, name=None, output='png', dirc=None)
```

Saves Bloch sphere to file of type ``format`` in directory ``dirc``.

Args:
    name (str):
        Name of saved image. Must include path and format as well.
        i.e. '/Users/Paul/Desktop/bloch.png'
        This overrides the 'format' and 'dirc' arguments.
    output (str):
        Format of output image.
    dirc (str):
        Directory for output images. Defaults to current working directory.
