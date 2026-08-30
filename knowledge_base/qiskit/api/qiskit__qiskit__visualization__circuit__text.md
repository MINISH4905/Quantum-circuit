---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/circuit/text.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/circuit/text.py
license: Apache-2.0
---

## Module `qiskit/visualization/circuit/text.py`

A module for drawing circuits in ascii art or some other text representation

## `TextDrawerEncodingError`

```python
class TextDrawerEncodingError(VisualizationError)
```

A problem with encoding

## `DrawElement`

```python
class DrawElement
```

An element is an operation that needs to be drawn.

### `top`

```python
def top(self)
```

Constructs the top line of the element

### `mid`

```python
def mid(self)
```

Constructs the middle line of the element

### `bot`

```python
def bot(self)
```

Constructs the bottom line of the element

### `length`

```python
def length(self)
```

Returns the length of the element, including the box around.

### `width`

```python
def width(self)
```

Returns the width of the label, including padding

### `connect`

```python
def connect(self, wire_char, where, label=None)
```

Connects boxes and elements using wire_char and setting proper connectors.

Args:
    wire_char (char): For example '║' or '│'.
    where (list["top", "bot"]): Where the connector should be set.
    label (string): Some connectors have a label (see cu1, for example).

## `BoxOnClWire`

```python
class BoxOnClWire(DrawElement)
```

Draws a box on the classical wire.

::

    top: ┌───┐   ┌───┐
    mid: ╡ A ╞ ══╡ A ╞══
    bot: └───┘   └───┘

## `BoxOnQuWire`

```python
class BoxOnQuWire(DrawElement)
```

Draws a box on the quantum wire.

::

    top: ┌───┐   ┌───┐
    mid: ┤ A ├ ──┤ A ├──
    bot: └───┘   └───┘

## `MeasureTo`

```python
class MeasureTo(DrawElement)
```

The element on the classic wire to which the measure is performed.

::

    top:  ║     ║
    mid: ═╩═ ═══╩═══
    bot:

## `MeasureFrom`

```python
class MeasureFrom(BoxOnQuWire)
```

The element on the quantum wire in which the measure is performed.

::

    top: ┌─┐    ┌─┐
    mid: ┤M├ ───┤M├───
    bot: └╥┘    └╥┘

## `MultiBox`

```python
class MultiBox(DrawElement)
```

Elements that are drawn over multiple wires.

### `center_label`

```python
def center_label(self, input_length, order)
```

In multi-bit elements, the label is centered vertically.

Args:
    input_length (int): The amount of wires affected.
    order (int): Which middle element is this one?

### `width`

```python
def width(self)
```

Returns the width of the label, including padding

## `BoxOnQuWireTop`

```python
class BoxOnQuWireTop(MultiBox, BoxOnQuWire)
```

Draws the top part of a box that affects more than one quantum wire

## `BoxOnWireMid`

```python
class BoxOnWireMid(MultiBox)
```

A generic middle box

## `BoxOnQuWireMid`

```python
class BoxOnQuWireMid(BoxOnWireMid, BoxOnQuWire)
```

Draws the middle part of a box that affects more than one quantum wire

## `BoxOnQuWireBot`

```python
class BoxOnQuWireBot(MultiBox, BoxOnQuWire)
```

Draws the bottom part of a box that affects more than one quantum wire

## `FlowOnQuWire`

```python
class FlowOnQuWire(DrawElement)
```

Draws a box for a ControlFlowOp using a single qubit.

## `FlowOnQuWireTop`

```python
class FlowOnQuWireTop(MultiBox, BoxOnQuWire)
```

Draws the top of a box for a ControlFlowOp that uses more than one qubit.

## `FlowOnQuWireMid`

```python
class FlowOnQuWireMid(MultiBox, BoxOnQuWire)
```

Draws the middle of a box for a ControlFlowOp that uses more than one qubit.

## `FlowOnQuWireBot`

```python
class FlowOnQuWireBot(MultiBox, BoxOnQuWire)
```

Draws the bottom of a box for a ControlFlowOp that uses more than one qubit.

## `BoxOnClWireTop`

```python
class BoxOnClWireTop(MultiBox, BoxOnClWire)
```

Draws the top part of a conditional box that affects more than one classical wire

## `BoxOnClWireMid`

```python
class BoxOnClWireMid(BoxOnWireMid, BoxOnClWire)
```

Draws the middle part of a conditional box that affects more than one classical wire

## `BoxOnClWireBot`

```python
class BoxOnClWireBot(MultiBox, BoxOnClWire)
```

Draws the bottom part of a conditional box that affects more than one classical wire

## `DirectOnQuWire`

```python
class DirectOnQuWire(DrawElement)
```

Element to the wire (without the box).

## `Barrier`

```python
class Barrier(DirectOnQuWire)
```

Draws a barrier with a label at the top if there is one.

::

    top:  ░   label
    mid: ─░─ ───░───
    bot:  ░     ░

## `Ex`

```python
class Ex(DirectOnQuWire)
```

Draws an X (usually with a connector). E.g. the top part of a swap gate.

::

    top:
    mid: ─X─ ───X───
    bot:  │     │

## `ResetDisplay`

```python
class ResetDisplay(DirectOnQuWire)
```

Draws a reset gate

## `Bullet`

```python
class Bullet(DirectOnQuWire)
```

Draws a bullet (usually with a connector). E.g. the top part of a CX gate.

::

    top:
    mid: ─■─  ───■───
    bot:  │      │

## `OpenBullet`

```python
class OpenBullet(DirectOnQuWire)
```

Draws an open bullet (usually with a connector). E.g. the top part of a CX gate.

::

    top:
    mid: ─o─  ───o───
    bot:  │      │

## `DirectOnClWire`

```python
class DirectOnClWire(DrawElement)
```

Element to the classical wire (without the box).

## `ClBullet`

```python
class ClBullet(DirectOnClWire)
```

Draws a bullet on classical wire (usually with a connector). E.g. the top part of a CX gate.

::

    top:
    mid: ═■═  ═══■═══
    bot:  │      │

## `ClOpenBullet`

```python
class ClOpenBullet(DirectOnClWire)
```

Draws an open bullet on classical wire (usually with a connector). E.g. the top part of a CX gate.

::

    top:
    mid: ═o═  ═══o═══
    bot:  │      │

## `EmptyWire`

```python
class EmptyWire(DrawElement)
```

This element is just the wire, with no operations.

### `fillup_layer`

```python
def fillup_layer(layer, first_clbit)
```

Given a layer, replace the Nones in it with EmptyWire elements.

Args:
    layer (list): The layer that contains Nones.
    first_clbit (int): The first wire that is classic.

Returns:
    list: The new layer, with no Nones.

## `BreakWire`

```python
class BreakWire(DrawElement)
```

This element is used to break the drawing in several pages.

### `fillup_layer`

```python
def fillup_layer(layer_length, arrow_char)
```

Creates a layer with BreakWire elements.

Args:
    layer_length (int): The length of the layer to create
    arrow_char (char): The char used to create the BreakWire element.

Returns:
    list: The new layer.

## `InputWire`

```python
class InputWire(DrawElement)
```

This element is the label and the initial value of a wire.

### `fillup_layer`

```python
def fillup_layer(names)
```

Creates a layer with InputWire elements.

Args:
    names (list): List of names for the wires.

Returns:
    list: The new layer

## `TextDrawing`

```python
class TextDrawing
```

The text drawing

### `single_string`

```python
def single_string(self)
```

Creates a long string with the ascii art.
Returns:
    str: The lines joined by a newline (``\n``)

### `dump`

```python
def dump(self, filename, encoding=None)
```

Dumps the ascii art in the file.

Args:
    filename (str): File to dump the ascii art.
    encoding (str): Optional. Force encoding, instead of self.encoding.

### `lines`

```python
def lines(self, line_length=None)
```

Generates a list with lines. These lines form the text drawing.

Args:
    line_length (int): Optional. Breaks the circuit drawing to this length. This is
                       useful when the drawing does not fit in the console. If
                       None (default), it will try to guess the console width using
                       shutil.get_terminal_size(). If you don't want pagination
                       at all, set line_length=-1.

Returns:
    list: A list of lines with the text drawing.

### `wire_names`

```python
def wire_names(self, with_initial_state=False)
```

Returns a list of names for each wire.

Args:
    with_initial_state (bool): Optional (Default: False). If true, adds
        the initial value to the name.

Returns:
    List: The list of wire names.

### `should_compress`

```python
def should_compress(self, top_line, bot_line)
```

Decides if the top_line and bot_line should be merged,
based on `self.vertical_compression`.

### `draw_wires`

```python
def draw_wires(self, wires)
```

Given a list of wires, creates a list of lines with the text drawing.

Args:
    wires (list): A list of wires with nodes.
Returns:
    list: A list of lines with the text drawing.

### `special_label`

```python
def special_label(node)
```

Some instructions have special labels

### `merge_lines`

```python
def merge_lines(top, bot, icod='top')
```

Merges two lines (top and bot) in a way that the overlapping makes sense.

Args:
    top (str): the top line
    bot (str): the bottom line
    icod (top or bot): in case of doubt, which line should have priority? Default: "top".
Returns:
    str: The merge of both lines.

### `normalize_width`

```python
def normalize_width(layer)
```

When the elements of the layer have different widths, sets the width to the max elements.

Args:
    layer (list): A list of elements.

### `controlled_wires`

```python
def controlled_wires(node, wire_map, ctrl_text, conditional, mod_control)
```

Analyzes the node in the layer and checks if the controlled arguments are in
the box or out of the box.

Args:
    node (DAGNode): node to analyse
    wire_map (dict): map of qubits/clbits to position
    ctrl_text (str): text for a control label
    conditional (bool): is this a node with a condition
    mod_control (ControlModifier): an instance of a modifier for an
        AnnotatedOperation

Returns:
    Tuple(list, list, list):
      - tuple: controlled arguments on top of the "node box", and its status
      - tuple: controlled arguments on bottom of the "node box", and its status
      - tuple: controlled arguments in the "node box", and its status
      - the rest of the arguments

### `build_layers`

```python
def build_layers(self)
```

Constructs layers.
Returns:
    list: List of DrawElements.
Raises:
    VisualizationError: When the drawing is, for some reason, impossible to be drawn.

### `add_control_flow`

```python
def add_control_flow(self, node, layers, wire_map)
```

Add control flow ops to the circuit drawing.

### `draw_flow_box`

```python
def draw_flow_box(self, node, flow_wire_map, section, circ_num=0, conditional=False)
```

Draw the left, middle, or right of a control flow box

## `Layer`

```python
class Layer
```

A layer is the "column" of the circuit.

### `full_layer`

```python
def full_layer(self)
```

Returns the composition of qubits and classic wires.
Returns:
    String: self.qubit_layer + self.clbit_layer

### `set_qubit`

```python
def set_qubit(self, qubit, element)
```

Sets the qubit to the element.

Args:
    qubit (qbit): Element of self.qubits.
    element (DrawElement): Element to set in the qubit

### `set_clbit`

```python
def set_clbit(self, clbit, element)
```

Sets the clbit to the element.

Args:
    clbit (cbit): Element of self.clbits.
    element (DrawElement): Element to set in the clbit

### `set_cl_multibox`

```python
def set_cl_multibox(self, condition, wire_map, top_connect='┴')
```

Sets the multi clbit box.

Args:
    condition (list[Union(Clbit, ClassicalRegister), int]): The condition
    wire_map (dict): Map of bits to indices
    top_connect (char): The char to connect the box on the top.

Returns:
    List: list of tuples of connections between clbits for multi-bit conditions

### `set_cond_bullets`

```python
def set_cond_bullets(self, label, val_bits, clbits, wire_map)
```

Sets bullets for classical conditioning when cregbundle=False.

Args:
    label (str): String to display below the condition
    val_bits (list(int)): A list of bit values
    clbits (list[Clbit]): The list of classical bits on
        which the instruction is conditioned.
    wire_map (dict): Map of bits to indices

Returns:
    List: list of tuples of open or closed bullets for condition bits

### `set_qu_multibox`

```python
def set_qu_multibox(self, bits, label, top_connect=None, bot_connect=None, conditional=False, controlled_edge=None)
```

Sets the multi qubit box.

Args:
    bits (list[int]): A list of affected bits.
    label (string): The label for the multi qubit box.
    top_connect (char): None or a char connector on the top
    bot_connect (char): None or a char connector on the bottom
    conditional (bool): If the box has a conditional
    controlled_edge (list): A list of bit that are controlled (to draw them at the edge)
Return:
    List: A list of indexes of the box.

### `connect_with`

```python
def connect_with(self, wire_char)
```

Connects the elements in the layer using wire_char.

Args:
    wire_char (char): For example '║' or '│'.
