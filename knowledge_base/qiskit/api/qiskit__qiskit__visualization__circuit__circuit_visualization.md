---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/circuit/circuit_visualization.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/circuit/circuit_visualization.py
license: Apache-2.0
---

## Module `qiskit/visualization/circuit/circuit_visualization.py`

Module for the primary interface to the circuit drawers.

This module contains the end user facing API for drawing quantum circuits.
There are 3 available drawer backends:

 0. ASCII art
 1. LaTeX
 2. Matplotlib

This provides a single function entry point to drawing a circuit object with
any of the backends.

## `circuit_drawer`

```python
def circuit_drawer(circuit: QuantumCircuit, scale: float | None=None, filename: str | None=None, style: dict | str | None=None, output: str | None=None, interactive: bool=False, plot_barriers: bool=True, reverse_bits: bool | None=None, justify: str | None=None, vertical_compression: str | None='medium', idle_wires: bool | str | None=None, with_layout: bool=True, fold: int | None=None, ax: Any | None=None, initial_state: bool=False, cregbundle: bool | None=None, wire_order: list[int] | None=None, expr_len: int=30, measure_arrows: bool | None=None, barrier_label_len: int=16)
```

Draw the quantum circuit. Use the output parameter to choose the drawing format:

``text``
    ASCII art TextDrawing that can be printed in the console.

``mpl``
    Images with color rendered purely in Python using matplotlib.

``latex``
    High-quality images compiled via LaTeX.

    .. warning::
        This will call an installed system version of ``pdflatex`` on arbitrary user input by
        design (such as to render custom code in :attr:`.Instruction.label`), so should only be
        used on trusted data.

``latex_source``
    Raw uncompiled LaTeX output.  This is the source of what would be rendered by the
    ``latex`` drawer.

.. warning::

    Support for :class:`~.expr.Expr` nodes in conditions and :attr:`.SwitchCaseOp.target`
    fields is preliminary and incomplete.  The ``text`` and ``mpl`` drawers will make a
    best-effort attempt to show data dependencies, but the LaTeX-based drawers will skip
    these completely.

Args:
    circuit: The circuit to visualize.
    scale: Scale of image to draw (shrink if ``< 1.0``). Only used by
        the ``mpl``, ``latex`` and ``latex_source`` outputs. Defaults to ``1.0``.
    filename: File path to save image to. Defaults to ``None`` (result not saved in a file).
    style: Style name, file name of style JSON file, or a dictionary specifying the style.

        * The supported style names are ``"iqp"`` (default), ``"iqp-dark"``, ``"clifford"``,
            ``"textbook"`` and ``"bw"``.
        * If given a JSON file, e.g. ``my_style.json`` or ``my_style`` (the ``.json``
            extension may be omitted), this function attempts to load the style dictionary
            from that location. Note, that the JSON file must completely specify the
            visualization specifications. The file is searched for in
            ``qiskit/visualization/circuit/styles``, the current working directory, and
            the location specified in ``~/.qiskit/settings.conf``.
        * If a dictionary, every entry overrides the default configuration. If the
            ``"name"`` key is given, the default configuration is given by that style.
            For example, ``{"name": "textbook", "subfontsize": 5}`` loads the ``"textbook"``
            style and sets the subfontsize (e.g. the gate angles) to ``5``.
        * If ``None`` the default style ``"iqp"`` is used or, if given, the default style
            specified in ``~/.qiskit/settings.conf``.

    output: Select the output method to use for drawing the circuit.
        Valid choices are ``text``, ``mpl``, ``latex``, ``latex_source``.
        By default, the ``text`` drawer is used unless the user config file
        (usually ``~/.qiskit/settings.conf``) has an alternative backend set
        as the default. For example, ``circuit_drawer = latex``. If the output
        kwarg is set, that backend will always be used over the default in
        the user config file.
    interactive: When set to ``True``, show the circuit in a new window
        (for ``mpl`` this depends on the matplotlib backend being used
        supporting this). Note when used with either the `text` or the
        ``latex_source`` output type this has no effect and will be silently
        ignored. Defaults to ``False``.
    reverse_bits: When set to ``True``, reverse the bit order inside
        registers for the output visualization. Defaults to ``False`` unless the
        user config file (usually ``~/.qiskit/settings.conf``) has an
        alternative value set. For example, ``circuit_reverse_bits = True``.
    plot_barriers: Enable/disable drawing barriers in the output
        circuit. Defaults to ``True``.
    justify: Options are ``"left"``, ``"right"`` or ``"none"`` (str).
        If anything else is supplied, left justified will be used instead.
        It refers to where gates should be placed in the output circuit if
        there is an option. ``none`` results in each gate being placed in
        its own column. Defaults to ``left``.
    vertical_compression: ``high``, ``medium`` or ``low``. It
        merges the lines generated by the `text` output so the drawing
        will take less vertical room.  Default is ``medium``. Only used by
        the ``text`` output, will be silently ignored otherwise.
    idle_wires: Include (or not) idle wires (wires with no circuit elements)
        in output visualization. The string ``"auto"`` is also possible, in which
        case idle wires are show except that the circuit has a layout attached.
        Default is ``"auto"`` unless the
        user config file (usually ``~/.qiskit/settings.conf``) has an
        alternative value set. For example, ``circuit_idle_wires = False``.
    with_layout: Include layout information, with labels on the
        physical layout. Default is ``True``.
    fold: Sets pagination. It can be disabled using -1. In ``text``,
        sets the length of the lines. This is useful when the drawing does
        not fit in the console. If None (default), it will try to guess the
        console width using ``shutil.get_terminal_size()``. However, if
        running in jupyter, the default line length is set to 80 characters.
        In ``mpl``, it is the number of (visual) layers before folding.
        Default is 25.
    ax: Only used by the `mpl` backend. An optional ``matplotlib.axes.Axes``
        object to be used for the visualization output. If none is
        specified, a new matplotlib Figure will be created and used.
        Additionally, if specified there will be no returned Figure since
        it is redundant.
    initial_state: Adds :math:`|0\rangle` in the beginning of the qubit wires and
        :math:`0` to classical wires. Default is ``False``.
    cregbundle: If set to ``True``, bundle classical registers.
        Default is ``True``, except for when ``output`` is set to  ``"text"``.
    wire_order: A list of integers used to reorder the display
        of the bits. The list must have an entry for every bit with the bits
        in the range 0 to (``num_qubits`` + ``num_clbits``).
    expr_len: The number of characters to display if an :class:`~.expr.Expr`
        is used for the condition in a :class:`.ControlFlowOp`. If this number is exceeded,
        the string will be truncated at that number and '...' added to the end.
    measure_arrows: If True, draw an arrow from each measure box down to the classical bit
        or register where the measure value is placed. If False, do not draw arrow, but
        instead place the name of the bit or register in the measure box.
        Default is ``True`` unless the user config file (usually ``~/.qiskit/settings.conf``)
        has an alternative value set. For example, ``circuit_measure_arrows = False``.
    barrier_label_len: The number of characters to display for
        :class:`.Barrier` labels in the output circuit. If this number is exceeded,
        the string will be truncated at that number and '...' added to the end.

Returns:
    :class:`.TextDrawing` or :class:`matplotlib.figure` or :class:`PIL.Image` or
    :class:`str`:

    * ``TextDrawing`` (if ``output='text'``)
        A drawing that can be printed as ascii art.
    * ``matplotlib.figure.Figure`` (if ``output='mpl'``)
        A matplotlib figure object for the circuit diagram.
    * ``PIL.Image`` (if ``output='latex``')
        An in-memory representation of the image of the circuit diagram.
    * ``str`` (if ``output='latex_source'``)
        The LaTeX source code for visualizing the circuit diagram.

Raises:
    VisualizationError: when an invalid output method is selected
    ImportError: when the output methods requires non-installed libraries.

Example:
    .. plot::
        :alt: Circuit diagram output by the previous code.
        :include-source:

        from qiskit import QuantumCircuit
        from qiskit.visualization import circuit_drawer
        qc = QuantumCircuit(1, 1)
        qc.h(0)
        qc.measure(0, 0)
        circuit_drawer(qc, output="mpl", style={"backgroundcolor": "#EEEEEE"})
