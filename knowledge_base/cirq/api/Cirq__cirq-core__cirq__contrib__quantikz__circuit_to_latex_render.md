---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/quantikz/circuit_to_latex_render.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/quantikz/circuit_to_latex_render.py
license: Apache-2.0
---

## Module `cirq-core/cirq/contrib/quantikz/circuit_to_latex_render.py`

Provides tools for rendering Cirq circuits as Quantikz LaTeX diagrams.

This module offers a high-level interface for converting `cirq.Circuit` objects
into visually appealing quantum circuit diagrams using the `quantikz` LaTeX package.
It extends the functionality of `CircuitToQuantikz` by handling the full rendering
pipeline: generating LaTeX, compiling it to PDF using `pdflatex`, and converting
the PDF to a PNG image using `pdftoppm`.

The primary function, `render_circuit`, streamlines this process, allowing users
to easily generate and optionally display circuit diagrams in environments like
Jupyter notebooks. It provides extensive customization options for the output
format, file paths, and rendering parameters, including direct control over
gate styling, circuit folding, and qubit labeling through arguments passed
to the underlying `CircuitToQuantikz` converter.

Note: the creation of PDF or PNG output is done by invoking external software
that must be installed separately on the user's system. The programs are
`pdflatex` (included in many TeX distributions) and `pdftoppm` (part of the
"poppler-utils" software package).

## `render_circuit`

```python
def render_circuit(circuit: circuits.Circuit, output_png_path: pathlib.Path | str | None=None, output_pdf_path: pathlib.Path | str | None=None, output_tex_path: pathlib.Path | str | None=None, dpi: int=300, run_pdflatex: bool=True, run_pdftoppm: bool=True, display_png_jupyter: bool=True, cleanup: bool=True, debug: bool=False, timeout: int=120, gate_styles: dict[str, str] | None=None, quantikz_options: str | None=None, fold_at: int | None=None, wire_labels: str='qid', show_parameters: bool=True, gate_name_map: dict[str, str] | None=None, float_precision_exps: int=2, qubit_order: ops.QubitOrderOrList=ops.QubitOrder.DEFAULT, **kwargs: Any) -> str | Image | None
```

Renders a Cirq circuit to a LaTeX diagram, compiles it, and optionally displays it.

This function takes a `cirq.Circuit` object, converts it into a Quantikz
LaTeX string, compiles the LaTeX into a PDF, and then converts the PDF
into a PNG image. It can optionally save these intermediate and final
files and display the PNG in a Jupyter environment.

Args:
    circuit: The `cirq.Circuit` object to be rendered.
    output_png_path: Optional path to save the generated PNG image. If
        `None`, the PNG is only kept in a temporary directory (if
        `cleanup` is `True`) or not generated if `run_pdftoppm` is `False`.
    output_pdf_path: Optional path to save the generated PDF document.
    output_tex_path: Optional path to save the generated LaTeX source file.
    dpi: The DPI (dots per inch) for the output PNG image. Higher DPI
        results in a larger and higher-resolution image.
    run_pdflatex: If `True`, `pdflatex` is executed to compile the LaTeX
        file into a PDF. Requires `pdflatex` to be installed and in PATH.
    run_pdftoppm: If `True`, `pdftoppm` (from poppler-utils) is executed
        to convert the PDF into a PNG image. Requires `pdftoppm` to be
        installed and in PATH. This option is ignored if `run_pdflatex`
        is `False`.
    display_png_jupyter: If `True` and running in a Jupyter environment,
        the generated PNG image will be displayed directly in the output
        cell.
    cleanup: If `True`, temporary files and directories created during
        the process (LaTeX, log, aux, PDF, temporary PNGs) will be removed.
        If `False`, they are kept for debugging.
    debug: If `True`, prints additional debugging information to the console.
    timeout: Maximum time in seconds to wait for `pdflatex` and `pdftoppm`
        commands to complete.
    gate_styles: An optional dictionary mapping gate names (strings) to
        Quantikz style options (strings). These styles are applied to
        the generated gates. If `None`, `GATE_STYLES_COLORFUL1` is used.
        Passed to `CircuitToQuantikz`.
    quantikz_options: An optional string of global options to pass to the
        `quantikz` environment (e.g., `"[row sep=0.5em]"`). Passed to
        `CircuitToQuantikz`.
    fold_at: An optional integer specifying the number of moments after
        which the circuit should be folded into a new line in the LaTeX
        output. If `None`, the circuit is not folded. Passed to `CircuitToQuantikz`.
    wire_labels: A string specifying how qubit wire labels should be
        rendered. Passed to `CircuitToQuantikz`.
    show_parameters: A boolean indicating whether gate parameters (e.g.,
        exponents for `XPowGate`, angles for `Rx`) should be displayed
        in the gate labels. Passed to `CircuitToQuantikz`.
    gate_name_map: An optional dictionary mapping Cirq gate names (strings)
        to custom LaTeX strings for rendering. This allows renaming gates
        in the output. Passed to `CircuitToQuantikz`.
    float_precision_exps: An integer specifying the number of decimal
        places for formatting floating-point exponents. Passed to `CircuitToQuantikz`.
    qubit_order: The order of the qubit lines in the rendered diagram.
    **kwargs: Additional keyword arguments passed directly to the
        `CircuitToQuantikz` constructor. Refer to `CircuitToQuantikz` for
        available options. Note that explicit arguments in `render_circuit`
        will override values provided via `**kwargs`.

Returns:
    An `IPython.display.Image` object if `display_png_jupyter` is `True`
    and running in a Jupyter environment, and the PNG was successfully
    generated. Otherwise, returns the string path to the saved PNG if
    `output_png_path` was provided and successful, or `None` if no PNG
    was generated or displayed.

Raises:
    warnings.warn: If `pdflatex` or `pdftoppm` executables are not found
        when their respective `run_` flags are `True`.

Example:
    >>> import cirq
    >>> import numpy as np
    >>> from cirq.contrib.quantikz import render_circuit
    >>> q0, q1, q2 = cirq.LineQubit.range(3)
    >>> circuit = cirq.Circuit(
    ...     cirq.H(q0),
    ...     cirq.CNOT(q0, q1),
    ...     cirq.rx(0.25*np.pi).on(q1),
    ...     cirq.measure(q0, q1, key='result')
    ... )
    >>> # Render and display in Jupyter (if available), also save to a file
    >>> img_or_path = render_circuit(
    ...     circuit,
    ...     output_png_path="my_circuit.png",
    ...     fold_at=2,
    ...     wire_labels="qid",
    ...     quantikz_options="column sep=0.7em",
    ...     show_parameters=False # Example of new parameter
    ... )
    >>> # To view the saved PNG outside Jupyter:
    >>> # import matplotlib.pyplot as plt
    >>> # import matplotlib.image as mpimg
    >>> # img = mpimg.imread('my_circuit.png')
    >>> # plt.imshow(img)
    >>> # plt.axis('off')
    >>> # plt.show()
