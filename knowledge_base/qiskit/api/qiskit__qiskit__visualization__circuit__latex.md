---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/circuit/latex.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/circuit/latex.py
license: Apache-2.0
---

## Module `qiskit/visualization/circuit/latex.py`

latex visualization backend.

## `QCircuitImage`

```python
class QCircuitImage
```

This class contains methods to create \LaTeX circuit images.

The class targets the \LaTeX package Q-circuit
(https://arxiv.org/pdf/quant-ph/0406003).

Thanks to Eric Sabo for the initial implementation for Qiskit.

### `__init__`

```python
def __init__(self, qubits, clbits, nodes, scale, style=None, reverse_bits=False, plot_barriers=True, initial_state=False, cregbundle=None, with_layout=False, circuit=None, barrier_label_len=16)
```

QCircuitImage initializer.

Args:
    qubits (list[Qubit]): list of qubits
    clbits (list[Clbit]): list of clbits
    nodes (list[list[DAGNode]]): list of circuit instructions, grouped by layer
    scale (float): image scaling
    style (dict or str): dictionary of style or file name of style file
    reverse_bits (bool): when True, reverse the bit ordering of the registers
    plot_barriers (bool): Enable/disable drawing barriers in the output
       circuit. Defaults to True.
    initial_state (bool): Optional. Adds |0> in the beginning of the line. Default: `False`.
    cregbundle (bool): Optional. If set True bundle classical registers.
    with_layout (bool): Optional. If set to True display the layout in the circuit.
    circuit (QuantumCircuit): the circuit that's being displayed
    barrier_label_len (int): Optional. The number of characters to display for
       barrier labels. If this number is exceeded, the string will be truncated.
Raises:
    ImportError: If pylatexenc is not installed

### `latex`

```python
def latex(self)
```

Return LaTeX string representation of circuit.
