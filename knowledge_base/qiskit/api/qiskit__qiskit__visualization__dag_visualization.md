---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/dag_visualization.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/dag_visualization.py
license: Apache-2.0
---

## Module `qiskit/visualization/dag_visualization.py`

Visualization function for DAG circuit representation.

## `dag_drawer`

```python
def dag_drawer(dag, scale=0.7, filename=None, style='color')
```

Plot the directed acyclic graph (dag) to represent operation dependencies
in a quantum circuit.

This function calls the :func:`~rustworkx.visualization.graphviz_draw` function from the
``rustworkx`` package to draw the DAG.

.. warning::
    This function will call the system Graphviz tool on a file involving user-controllable
    strings (such as operation labels).  It is recommended to only call this function on trusted
    input.

Args:
    dag (DAGCircuit or DAGDependency): The dag to draw.
    scale (float): scaling factor
    filename (str): file path to save image to (format inferred from name)
    style (dict or str): Style name, file name of style JSON file, or a
        dictionary specifying the style.

        * The supported style names are 'plain': B&W graph, 'color' (default):
            (color input/output/op nodes)
        * If given a JSON file, e.g. ``my_style.json`` or ``my_style`` (the ``.json``
            extension may be omitted), this function attempts to load the style dictionary
            from that location. Note, that the JSON file must completely specify the
            visualization specifications. The file is searched for in
            ``qiskit/visualization/circuit/styles``, the current working directory, and
            the location specified in ``~/.qiskit/settings.conf``.
        * If ``None`` the default style ``"color"`` is used or, if given, the default style
            specified in ``~/.qiskit/settings.conf``.

Returns:
    PIL.Image: if in Jupyter notebook and not saving to file,
        otherwise None.

Raises:
    VisualizationError: when style is not recognized.
    InvalidFileError: when filename provided is not valid
    ValueError: If the file extension for ``filename`` is not an image
        type supported by Graphviz.

Example:
    .. plot::
        :include-source:
        :nofigs:

        from qiskit import QuantumRegister, ClassicalRegister, QuantumCircuit
        from qiskit.converters import circuit_to_dag
        from qiskit.visualization import dag_drawer

        q = QuantumRegister(3, 'q')
        c = ClassicalRegister(3, 'c')
        circ = QuantumCircuit(q, c)
        circ.h(q[0])
        circ.cx(q[0], q[1])
        circ.measure(q[0], c[0])
        with circ.if_test((c, 2)):
            circ.rz(0.5, q[1])

        dag = circuit_to_dag(circ)

        style = {
            "inputnodecolor": "pink",
            "outputnodecolor": "lightblue",
            "opnodecolor": "red",
        }

        dag_drawer(dag, style=style)
