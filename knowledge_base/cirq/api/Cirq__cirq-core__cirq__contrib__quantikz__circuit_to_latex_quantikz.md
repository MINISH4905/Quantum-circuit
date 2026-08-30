---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/quantikz/circuit_to_latex_quantikz.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/quantikz/circuit_to_latex_quantikz.py
license: Apache-2.0
---

## Module `cirq-core/cirq/contrib/quantikz/circuit_to_latex_quantikz.py`

Converts Cirq circuits to Quantikz LaTeX (using modern quantikz syntax).

This module provides a class, `CircuitToQuantikz`, to translate `cirq.Circuit`
objects into LaTeX code using the `quantikz` package. It aims to offer
flexible customization for gate styles, wire labels, and circuit folding.

Example:
    >>> import cirq
    >>> from cirq.contrib.quantikz import CircuitToQuantikz
    >>> q0, q1 = cirq.LineQubit.range(2)
    >>> circuit = cirq.Circuit(
    ...     cirq.H(q0),
    ...     cirq.CNOT(q0, q1),
    ...     cirq.measure(q0, key='m0'),
    ...     cirq.Rx(rads=0.5).on(q1)
    ... )
    >>> converter = CircuitToQuantikz(circuit, fold_at=2)
    >>> latex_code = converter.generate_latex_document()
    >>> print(latex_code)
    \documentclass[preview, border=2pt]{standalone}
    % Core drawing packages
    \usepackage{tikz}
    \usetikzlibrary{quantikz} % Loads the quantikz library (latest installed version)
    % Optional useful TikZ libraries
    \usetikzlibrary{fit, arrows.meta, decorations.pathreplacing, calligraphy}
    % Font encoding and common math packages
    \usepackage[T1]{fontenc}
    \usepackage{amsmath}
    \usepackage{amsfonts}
    \usepackage{amssymb}
    % --- Custom Preamble Injection Point ---
    % --- End Custom Preamble ---
    \begin{document}
    \begin{quantikz}
    \lstick{$q(0)$} & \gate[style={fill=yellow!20}]{H} & \qw & \rstick{$q(0)$} \\
    \lstick{$q(1)$} & \qw & \qw & \rstick{$q(1)$}
    \end{quantikz}
    <BLANKLINE>
    \vspace{1em}
    <BLANKLINE>
    \begin{quantikz}
    \lstick{$q(0)$} & \ctrl{1} & \meter[style={fill=gray!20}]{m0} & \qw & \rstick{$q(0)$} \\
    \lstick{$q(1)$} & \targ{} & \gate[style={fill=green!20}]{R_{X}(0.159\pi)} & \qw & \rstick{$q(1)$}
    \end{quantikz}
    \end{document}

## `CircuitToQuantikz`

```python
class CircuitToQuantikz
```

Converts a Cirq Circuit object to a Quantikz LaTeX string.

This class facilitates the conversion of a `cirq.Circuit` into a LaTeX
representation using the `quantikz` package. It handles various gate types,
qubit mapping, and provides options for customizing the output, such as
gate styling, circuit folding, and parameter display.

Args:
    circuit: The `cirq.Circuit` object to be converted.
    gate_styles: An optional dictionary mapping gate names (strings) to
        Quantikz style options (strings). These styles are applied to
        the generated gates. If `None`, `GATE_STYLES_COLORFUL` is used.
    quantikz_options: An optional string of global options to pass to the
        `quantikz` environment (e.g., `"[row sep=0.5em]"`).
    fold_at: An optional integer specifying the number of moments after
        which the circuit should be folded into a new line in the LaTeX
        output. If `None`, the circuit is not folded.
    custom_preamble: An optional string containing custom LaTeX code to be
        inserted into the document's preamble.
    custom_postamble: An optional string containing custom LaTeX code to be
        inserted just before `\end{document}`.
    wire_labels: A string specifying how qubit wire labels should be
        rendered.
        - `"q"`: Labels as $q_0, q_1, \dots$
        - `"index"`: Labels as $0, 1, \dots$
        - `"qid"`: Labels as the string representation of the `cirq.Qid`
        - Any other value defaults to `"qid"`.
    show_parameters: A boolean indicating whether gate parameters (e.g.,
        exponents for `XPowGate`, angles for `Rx`) should be displayed
        in the gate labels.
    gate_name_map: An optional dictionary mapping Cirq gate names (strings)
        to custom LaTeX strings for rendering. This allows renaming gates
        in the output.
    float_precision_exps: An integer specifying the number of decimal
        places for formatting floating-point exponents.
    float_precision_angles: An integer specifying the number of decimal
        places for formatting floating-point angles. (Note: Not fully
        implemented in current version for all angle types).
    qubit_order:  Determines how qubits are ordered in the diagram.

Raises:
    ValueError: If the input `circuit` is empty or contains no qubits.

### `generate_latex_document`

```python
def generate_latex_document(self, preamble_template: str | None=None) -> str
```

Generates the complete LaTeX document string for the circuit.

Combines the preamble, custom preamble, generated circuit body,
and custom postamble into a single LaTeX document string.

Args:
    preamble_template: An optional string to use as the base LaTeX
        preamble. If `None`, `DEFAULT_PREAMBLE_TEMPLATE` is used.

Returns:
    A string containing the full LaTeX document, ready to be compiled.
