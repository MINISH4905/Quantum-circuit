---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/pass_manager_visualization.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/pass_manager_visualization.py
license: Apache-2.0
---

## Module `qiskit/visualization/pass_manager_visualization.py`

Visualization function for a pass manager. Passes are grouped based on their
flow controller, and coloured based on the type of pass.

## `pass_manager_drawer`

```python
def pass_manager_drawer(pass_manager, filename=None, style=None, raw=False)
```

Draws the pass manager.

This function needs `pydot <https://github.com/pydot/pydot>`__, which in turn needs
`Graphviz <https://www.graphviz.org/>`__ to be installed.

.. warning::
    This function will call the system Graphviz tool on a file involving user-controllable
    strings (such as pass names).  It is recommended to only call this function on trusted
    input.

Args:
    pass_manager (PassManager): the pass manager to be drawn
    filename (str): file path to save image to
    style (dict or OrderedDict): keys are the pass classes and the values are
        the colors to make them. An example can be seen in the DEFAULT_STYLE. An ordered
        dict can be used to ensure a priority coloring when pass falls into multiple
        categories. Any values not included in the provided dict will be filled in from
        the default dict
    raw (Bool) : True if you want to save the raw Dot output not an image. The
        default is False.
Returns:
    PIL.Image or None: an in-memory representation of the pass manager. Or None if
    no image was generated or PIL is not installed.
Raises:
    MissingOptionalLibraryError: when nxpd or pydot not installed.
    VisualizationError: If raw=True and filename=None.

Example:
    .. plot::
        :include-source:
        :nofigs:

        from qiskit import QuantumCircuit
        from qiskit.transpiler import generate_preset_pass_manager
        from qiskit.visualization import pass_manager_drawer

        pm = generate_preset_pass_manager(optimization_level=0)
        pass_manager_drawer(pm)

## `staged_pass_manager_drawer`

```python
def staged_pass_manager_drawer(pass_manager, filename=None, style=None, raw=False)
```

Draws the staged pass manager.

    This function needs `pydot <https://github.com/erocarrera/pydot>`__, which in turn needs
`Graphviz <https://www.graphviz.org/>`__ to be installed.

.. warning::
    This function will call the system Graphviz tool on a file involving user-controllable
    strings (such as pass names).  It is recommended to only call this function on trusted
    input.

Args:
    pass_manager (StagedPassManager): the staged pass manager to be drawn
    filename (str): file path to save image to
    style (dict or OrderedDict): keys are the pass classes and the values are
        the colors to make them. An example can be seen in the DEFAULT_STYLE. An ordered
        dict can be used to ensure a priority coloring when pass falls into multiple
        categories. Any values not included in the provided dict will be filled in from
        the default dict
    raw (Bool) : True if you want to save the raw Dot output not an image. The
        default is False.
Returns:
    PIL.Image or None: an in-memory representation of the pass manager. Or None if
    no image was generated or PIL is not installed.
Raises:
    MissingOptionalLibraryError: when nxpd or pydot not installed.
    VisualizationError: If raw=True and filename=None.

Example:
    .. plot::
       :include-source:
       :nofigs:

        %matplotlib inline
        from qiskit.providers.fake_provider import GenericBackendV2
        from qiskit.transpiler.preset_passmanagers import generate_preset_pass_manager

        pass_manager = generate_preset_pass_manager(3, GenericBackendV2(num_qubits=5))
        pass_manager.draw()

## `draw_subgraph`

```python
def draw_subgraph(controller_group, component_id, style, prev_node, idx)
```

Draw subgraph.

## `make_output`

```python
def make_output(graph, raw, filename)
```

Produce output for pass_manager.
