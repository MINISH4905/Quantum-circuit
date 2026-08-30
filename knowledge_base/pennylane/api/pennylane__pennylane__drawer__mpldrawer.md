---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/drawer/mpldrawer.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/drawer/mpldrawer.py
license: Apache-2.0
---

## Module `pennylane/drawer/mpldrawer.py`

This module contains the MPLDrawer class for creating circuit diagrams with matplotlib

## `MPLDrawer`

```python
class MPLDrawer
```

Allows easy creation of graphics representing circuits with matplotlib

Args:
    n_layers (int): the number of layers
    wire_map (dict): the wires to be drawn. A dict mapping wire label to index (from top to bottom) in the figure

Keyword Args:
    c_wires=0 (int): the number of classical wires to leave space for.
    wire_options=None (dict): matplotlib configuration options for drawing the wire lines
    figsize=None (Iterable): Allows users to specify the size of the figure manually. Defaults
        to scale with the size of the circuit via ``n_layers`` and ``len(wire_map)``.
    fig=None (matplotlib Figure): Allows users to specify the figure window to plot to.
    starting_dots=False (bool): Adds dots after the wire labels. Can be used to denote this plot
        follows after another one.

**Example**

.. code-block:: python

    drawer = qp.drawer.MPLDrawer(wire_map={i: i for i in range(5)}, n_layers=6)

    drawer.label(["0", "a", r"$|\Psi\rangle$", r"$|\theta\rangle$", "aux"])

    drawer.box_gate(layer=0, wires=[0, 1, 2, 3, 4], text="Entangling Layers")
    drawer.box_gate(layer=1, wires=[0, 2, 3], text="U(θ)")

    drawer.box_gate(layer=1, wires=4, text="Z")

    drawer.SWAP(layer=2, wires=(3,4))
    drawer.CNOT(layer=2, wires=(0, 2))

    drawer.ctrl(layer=3, wires=[1, 3], control_values=[True, False])
    drawer.box_gate(
        layer=3, wires=2, text="H", box_options={"zorder": 4}, text_options={"zorder": 5}
    )

    drawer.ctrl(layer=4, wires=[1, 2])

    drawer.measure(layer=5, wires=0)

    drawer.fig.suptitle('My Circuit', fontsize='xx-large')

.. figure:: ../../_static/drawer/example_basic.png
        :align: center
        :width: 60%
        :target: javascript:void(0);

.. details::
    :title: Usage Details

**Matplotlib Integration**

This class relies on matplotlib. As such, users can extend this class via interacting with the figure
``drawer.fig`` and axes ``drawer.ax`` objects manually. For instance, the example circuit manipulates the
figure to set a title using ``drawer.fig.suptitle``. Users can save the image using ``plt.savefig`` or via
the figure method ``drawer.fig.savefig``.

As described in the next section, the figure supports both global styling and individual styling of
elements with matplotlib styles, configuration, and keywords.

**Formatting**

PennyLane has inbuilt styles for controlling the appearance of the circuit drawings.
All available styles can be determined by evaluating ``qp.drawer.available_styles()``.
Any available string can then be passed to ``qp.drawer.use_style``.

.. code-block:: python

    qp.drawer.use_style('black_white')

.. figure:: ../../_static/drawer/black_white_style.png
        :align: center
        :width: 60%
        :target: javascript:void(0);

You can also control the appearance with matplotlib's provided tools, see the
`matplotlib docs <https://matplotlib.org/stable/tutorials/introductory/customizing.html>`_ .
For example, we can customize ``plt.rcParams``:

.. code-block:: python

    plt.rcParams['patch.facecolor'] = 'mistyrose'
    plt.rcParams['patch.edgecolor'] = 'maroon'
    plt.rcParams['text.color'] = 'maroon'
    plt.rcParams['font.weight'] = 'bold'
    plt.rcParams['patch.linewidth'] = 4
    plt.rcParams['patch.force_edgecolor'] = True
    plt.rcParams['lines.color'] = 'indigo'
    plt.rcParams['lines.linewidth'] = 5
    plt.rcParams['figure.facecolor'] = 'ghostwhite'


.. figure:: ../../_static/drawer/example_rcParams.png
        :align: center
        :width: 60%
        :target: javascript:void(0);

You can also manually control the styles of individual plot elements via the drawer class.
All accept dictionaries of keyword-values pairs for matplotlib object
components. Acceptable keywords differ based on what's being drawn. For example, you cannot pass ``"fontsize"``
to the dictionary controlling how to format a rectangle. For the control-type gates ``CNOT`` and
``ctrl`` the options dictionary can only contain ``'linewidth'``, ``'color'``, or ``'zorder'`` keys.

This example demonstrates the different ways you can format the individual elements:

.. code-block:: python

    wire_options = {"color": "indigo", "linewidth": 4}
    drawer = MPLDrawer(wire_map={0: 0, 1: 1}, n_layers=4, wire_options=wire_options)

    label_options = {"fontsize": "x-large", 'color': 'indigo'}
    drawer.label(["0", "a"], text_options=label_options)

    box_options = {'facecolor': 'lightcoral', 'edgecolor': 'maroon', 'linewidth': 5}
    text_options = {'fontsize': 'xx-large', 'color': 'maroon'}
    drawer.box_gate(layer=0, wires=0, text="Z", box_options=box_options, text_options=text_options)

    swap_options = {'linewidth': 4, 'color': 'darkgreen'}
    drawer.SWAP(layer=1, wires=(0, 1), options=swap_options)

    ctrl_options = {'linewidth': 4, 'color': 'teal'}
    drawer.CNOT(layer=2, wires=(0, 1), options=ctrl_options)
    drawer.ctrl(layer=3, wires=(0, 1), options=ctrl_options)


    measure_box = {'facecolor': 'white', 'edgecolor': 'indigo'}
    measure_lines = {'edgecolor': 'indigo', 'facecolor': 'plum', 'linewidth': 2}
    for wire in range(2):
        drawer.measure(layer=4, wires=wire, box_options=measure_box, lines_options=measure_lines)

    drawer.fig.suptitle('My Circuit', fontsize='xx-large')

.. figure:: ../../_static/drawer/example_formatted.png
        :align: center
        :width: 60%
        :target: javascript:void(0);

**Positioning**

Each gate takes arguments in order of ``layer`` followed by ``wires``. These translate to ``x`` and
``y`` coordinates in the graph. Layer number (``x``) increases as you go right, and wire number
(``y``) increases as you go down; the y-axis is inverted. You can pass non-integer values to either keyword.
If you have a long label, the gate can span multiple layers and have extra width:

.. code-block:: python

    drawer = MPLDrawer(2, {0:0, 1:1})
    drawer.box_gate(layer=0, wires=1, text="X")
    drawer.box_gate(layer=1, wires=1, text="Y")

    # Gate between two layers
    drawer.box_gate(layer=0.5, wires=0, text="Big Gate", extra_width=0.5)

.. figure:: ../../_static/drawer/float_layer.png
        :align: center
        :width: 60%
        :target: javascript:void(0);

### `fig`

```python
def fig(self)
```

Matplotlib figure

### `ax`

```python
def ax(self)
```

Matplotlib axes

### `fontsize`

```python
def fontsize(self)
```

Default fontsize for text. Defaults to 14.

### `fontsize`

```python
def fontsize(self, value)
```

Set ``fontsize`` property as provided value.

### `label`

```python
def label(self, labels, text_options=None)
```

Label each wire.

Args:
    labels (Iterable[str]): Iterable of labels for the wires

Keyword Args:
    text_options (dict): any matplotlib keywords for a text object, such as font or size

**Example**

.. code-block:: python

    drawer = MPLDrawer(wire_map={0:0, 1:1}, n_layers=1)
    drawer.label(["a", "b"])

.. figure:: ../../_static/drawer/labels.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

You can also pass any
`Matplotlib Text keywords <https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.text.html>`_
as a dictionary to the ``text_options`` keyword:

.. code-block:: python

    drawer = MPLDrawer(wire_map={0:0, 1:1}, n_layers=1)
    drawer.label(["a", "b"], text_options={"color": "indigo", "fontsize": "xx-large"})

.. figure:: ../../_static/drawer/labels_formatted.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

### `erase_wire`

```python
def erase_wire(self, layer: int, wire: int, length: int) -> None
```

Erases a portion of a wire by adding a rectangle that matches the background.

Args:
    layer (int): starting x coordinate for erasing the wire
    wire (int): y location to erase the wire from
    length (float, int): horizontal distance from ``layer`` to erase the background.

### `box_gate`

```python
def box_gate(self, layer, wires, text='', box_options=None, text_options=None, **kwargs)
```

Draws a box and adds label text to its center.

Args:
    layer (int): x coordinate for the box center
    wires (Union[int, Iterable[int]]): y locations to include inside the box. Only min and max
        of an Iterable affect the output
    text (str): string to print at the box's center

Keyword Args:
    box_options=None (dict): any matplotlib keywords for the ``plt.Rectangle`` patch
    text_options=None (dict): any matplotlib keywords for the text
    extra_width (float): extra box width
    autosize (bool): whether to rotate and shrink text to fit within the box
    active_wire_notches (bool): whether or not to add notches indicating active wires.
        Defaults to ``True``.

**Example**

.. code-block:: python

    drawer = MPLDrawer(wire_map={0:0, 1:1}, n_layers=1)

    drawer.box_gate(layer=0, wires=(0, 1), text="CY")

.. figure:: ../../_static/drawer/box_gates.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

.. details::
    :title: Usage Details

This method can accept two different sets of design keywords. ``box_options`` takes
`Rectangle keywords <https://matplotlib.org/stable/api/_as_gen/matplotlib.patches.Rectangle.html>`_
, and ``text_options`` accepts
`Matplotlib Text keywords <https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.text.html>`_ .

.. code-block:: python

    box_options = {'facecolor': 'lightcoral', 'edgecolor': 'maroon', 'linewidth': 5}
    text_options = {'fontsize': 'xx-large', 'color': 'maroon'}

    drawer = MPLDrawer(wire_map={0:0, 1:1}, n_layers=1)

    drawer.box_gate(layer=0, wires=(0, 1), text="CY",
        box_options=box_options, text_options=text_options)

.. figure:: ../../_static/drawer/box_gates_formatted.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

By default, text is rotated and/or shrunk to fit within the box. This behaviour can be turned off
with the ``autosize=False`` keyword.

.. code-block:: python

    drawer = MPLDrawer(n_layers=4, wire_map={0:0, 1:1})

    drawer.box_gate(layer=0, wires=0, text="A longer label")
    drawer.box_gate(layer=0, wires=1, text="Label")

    drawer.box_gate(layer=1, wires=(0,1), text="long multigate label")

    drawer.box_gate(layer=3, wires=(0,1), text="Not autosized label", autosize=False)

.. figure:: ../../_static/drawer/box_gates_autosized.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

### `ctrl`

```python
def ctrl(self, layer, wires, wires_target=None, control_values=None, options=None)
```

Add an arbitrary number of control wires

Args:
    layer (int): the layer to draw the object in
    wires (Union[int, Iterable[int]]): set of wires to control on

Keyword Args:
    wires_target=None (Union[int, Iterable[int]]): target wires. Used to determine min
        and max wires for the vertical line
    control_values=None (Union[bool, Iterable[bool]]): for each control wire, denotes whether to control
        on ``False=0`` or ``True=1``
    options=None (dict): Matplotlib keywords. The only supported keys are ``'color'``, ``'linewidth'``,
        and ``'zorder'``.

**Example**

.. code-block:: python

    drawer = MPLDrawer(wire_map={0:0, 1:1}, n_layers=3)

    drawer.ctrl(layer=0, wires=0, wires_target=1)
    drawer.ctrl(layer=1, wires=(0, 1), control_values=[0, 1])

    options = {'color': "indigo", 'linewidth': 4}
    drawer.ctrl(layer=2, wires=(0, 1), control_values=[1, 0], options=options)

.. figure:: ../../_static/drawer/ctrl.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

### `CNOT`

```python
def CNOT(self, layer, wires, control_values=None, options=None)
```

Draws a CNOT gate.

Args:
    layer (int): layer to draw in
    control_values=None (Union[bool, Iterable[bool]]): for each control wire, denotes whether to control
        on ``False=0`` or ``True=1``
    wires (Union[int, Iterable[int]]): wires to use. Last wire is the target.

Keyword Args:
    options=None: Matplotlib options. The only supported keys are ``'color'``, ``'linewidth'``,
        and ``'zorder'``.

**Example**

.. code-block:: python

    drawer = MPLDrawer(wire_map={0:0, 1:1}, n_layers=2)

    drawer.CNOT(0, (0, 1))

    options = {'color': 'indigo', 'linewidth': 4}
    drawer.CNOT(1, (1, 0), options=options)

.. figure:: ../../_static/drawer/cnot.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

### `SWAP`

```python
def SWAP(self, layer, wires, options=None)
```

Draws a SWAP gate

Args:
    layer (int): layer to draw on
    wires (Tuple[int, int]): two wires the SWAP acts on

Keyword Args:
    options=None (dict): matplotlib keywords for ``Line2D`` objects

**Example**

The ``options`` keyword can accept any
`Line2D compatible keywords <https://matplotlib.org/stable/api/_as_gen/matplotlib.lines.Line2D.html#matplotlib.lines.Line2D>`_
in a dictionary.

.. code-block:: python

    drawer = MPLDrawer(wire_map={0:0, 1:1}, n_layers=2)

    drawer.SWAP(0, (0, 1))

    swap_options = {"linewidth": 2, "color": "indigo"}
    drawer.SWAP(1, (0, 1), options=swap_options)

.. figure:: ../../_static/drawer/SWAP.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

### `measure`

```python
def measure(self, layer, wires, text=None, box_options=None, lines_options=None)
```

Draw a Measurement graphic at designated layer, wire combination.

Args:
    layer (int): layer to draw on
    wires (int): wire to draw on

Keyword Args:
    text=None (str): an annotation for the lower right corner.
    box_options=None (dict): dictionary to format a matplotlib rectangle
    lines_options=None (dict): dictionary to format matplotlib arc and arrow

**Example**

This method accepts two different formatting dictionaries. ``box_options`` edits the rectangle
while ``lines_options`` edits the arc and arrow.

.. code-block:: python

    drawer = MPLDrawer(wire_map={0:0, 1:1}, n_layers=1)
    drawer.measure(layer=0, wires=0)

    measure_box = {'facecolor': 'white', 'edgecolor': 'indigo'}
    measure_lines = {'edgecolor': 'indigo', 'facecolor': 'plum', 'linewidth': 2}
    drawer.measure(layer=0, wires=1, box_options=measure_box, lines_options=measure_lines)

.. figure:: ../../_static/drawer/measure.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

### `pauli_measure`

```python
def pauli_measure(self, layer, pauli_word, wires, postselect=None, **kwargs)
```

Draw a PauliMeasure at the designated layer.

### `ppm_offset`

```python
def ppm_offset(self) -> float
```

Gets the x-offset for drawing the control wire of a PauliMeasure.

### `classical_wire`

```python
def classical_wire(self, layers, wires) -> None
```

Draw a classical control line.

Args:
    layers: a list of x coordinates for the classical wire
    wires: a list of y coordinates for the classical wire. Wire numbers
        greater than the number of quantum wires will be scaled as classical wires.

### `cwire_join`

```python
def cwire_join(self, layer, wire, erase_right=False)
```

Erase the horizontal edges of an intersection between classical wires. By default, erases
only the left edge.

Args:
    layer: the x-coordinate for the classical wire intersection
    wire: the classical wire y-coordinate for the intersection
    erase_right=False(bool):  whether or not to erase the right side of the intersection
        in addition to the left.

### `cond`

```python
def cond(self, layer, measured_layer, wires, wires_target, options=None)
```

Add classical communication double-lines for conditional operations

Args:
    layer (int): the layer to draw vertical lines in, containing the target operation
    measured_layer (int): the layer where the mid-circuit measurements are
    wires (Union[int, Iterable[int]]): set of wires to control on
    wires_target (Union[int, Iterable[int]]): target wires. Used to determine where to
        terminate the vertical double-line

Keyword Args:
    options=None (dict): Matplotlib keywords passed to ``plt.Line2D``

**Example**

.. code-block:: python

    drawer = MPLDrawer(wire_map={0:0, 1:1, 2:2}, n_layers=4)

    drawer.cond(layer=1, measured_layer=0, wires=[0], wires_target=[1])

    options = {'color': "indigo", 'linewidth': 1.5}
    drawer.cond(layer=3, measured_layer=2, wires=(1,), wires_target=(2,), options=options)

.. figure:: ../../_static/drawer/cond.png
    :align: center
    :width: 60%
    :target: javascript:void(0);

### `crop_wire_labels`

```python
def crop_wire_labels(self)
```

Crop away the wire labels and resize figure accordingly.
