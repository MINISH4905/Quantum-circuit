---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/dag/dagstyle.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/dag/dagstyle.py
license: Apache-2.0
---

## Module `qiskit/visualization/dag/dagstyle.py`

Matplotlib circuit visualization style.

## `DAGStyleDict`

```python
class DAGStyleDict(StyleDict)
```

A dictionary for graphviz styles.

Defines additional abbreviations for key accesses, such as allowing
``"ec"`` instead of writing ``"edgecolor"``.

## `DAGDefaultStyle`

```python
class DAGDefaultStyle(DefaultStyle)
```

Creates a Default Style dictionary

The style dict contains numerous options that define the style of the
output circuit visualization. The style dict is used by the `graphviz`
output. The options available in the style dict are defined below:

Attributes:
    name (str): The name of the style.
    fontsize (str): The font size to use for text.
    bgcolor (str): The color name to use for the background ('red', 'green', etc.).
    nodecolor (str): The color to use for all nodes.
    dpi (int): The DPI to use for the output image.
    pad (int): A number to adjust padding around output
        graph.
    inputnodecolor (str): The color to use for incoming wire nodes. Overrides
        nodecolor for those nodes.
    inputnodefontcolor (str): The font color to use for incoming wire nodes.
        Overrides nodecolor for those nodes.
    outputnodecolor (str): The color to use for output wire nodes. Overrides
        nodecolor for those nodes.
    outputnodefontcolor (str): The font color to use for output wire nodes.
        Overrides nodecolor for those nodes.
    opnodecolor (str): The color to use for Instruction nodes. Overrides
        nodecolor for those nodes.
    opnodefontcolor (str): The font color to use for Instruction nodes.
        Overrides nodecolor for those nodes.

    qubitedgecolor (str): The edge color for qubits. Overrides edgecolor for these edges.
    clbitedgecolor (str): The edge color for clbits. Overrides edgecolor for these edges.
