---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/gate_map.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/gate_map.py
license: Apache-2.0
---

## Module `qiskit/visualization/gate_map.py`

A module for visualizing device coupling maps

## `plot_gate_map`

```python
def plot_gate_map(backend, figsize=None, plot_directed=False, label_qubits=True, qubit_size=None, line_width=4, font_size=None, qubit_color=None, qubit_labels=None, line_color=None, font_color='white', ax=None, filename=None, qubit_coordinates=None)
```

Plots the gate map of a device.

Args:
    backend (Backend): The backend instance that will be used to plot the device
        gate map.
    figsize (tuple): Output figure size (wxh) in inches.
    plot_directed (bool): Plot directed coupling map.
    label_qubits (bool): Label the qubits.
    qubit_size (float): Size of qubit marker.
    line_width (float): Width of lines.
    font_size (int): Font size of qubit labels.
    qubit_color (list): A list of colors for the qubits
    qubit_labels (list): A list of qubit labels
    line_color (list): A list of colors for each line from coupling_map.
    font_color (str): The font color for the qubit labels.
    ax (Axes): A Matplotlib axes instance.
    filename (str): file path to save image to.
    qubit_coordinates (Sequence): An optional sequence input (list or array being the
        most common) of 2d coordinates for each qubit. The length of the
        sequence must match the number of qubits on the backend. The sequence
        should be the planar coordinates in a 0-based square grid where each
        qubit is located.

Returns:
    Figure: A Matplotlib figure instance.

Raises:
    QiskitError: If you tried to pass a simulator or the backend is None,
        but one of num_qubits, mpl_data, or cmap is None.
    MissingOptionalLibraryError: If matplotlib not installed.

Example:

    .. plot::
       :alt: Output from the previous code.
       :include-source:

       from qiskit.providers.fake_provider import GenericBackendV2
       from qiskit.visualization import plot_gate_map

       backend = GenericBackendV2(num_qubits=5)

       plot_gate_map(backend)

## `plot_coupling_map`

```python
def plot_coupling_map(num_qubits: int, qubit_coordinates: list[list[int]], coupling_map: list[list[int]], figsize=None, plot_directed=False, label_qubits=True, qubit_size=None, line_width=4, font_size=None, qubit_color=None, qubit_labels=None, line_color=None, font_color='white', ax=None, filename=None, *, planar=True)
```

Plots an arbitrary coupling map of qubits (embedded in a plane).

.. warning::
    This function will call the system Graphviz tool on a file involving user-controllable
    strings (such as qubit labels).  It is recommended to only call this function on trusted
    input.

Args:
    num_qubits (int): The number of qubits defined and plotted.
    qubit_coordinates (List[List[int]]): A list of two-element lists, with entries of each nested
        list being the planar coordinates in a 0-based square grid where each qubit is located.
    coupling_map (List[List[int]]): A list of two-element lists, with entries of each nested
        list being the qubit numbers of the bonds to be plotted.
    figsize (tuple): Output figure size (wxh) in inches.
    plot_directed (bool): Plot directed coupling map.
    label_qubits (bool): Label the qubits.
    qubit_size (float): Size of qubit marker.
    line_width (float): Width of lines.
    font_size (int): Font size of qubit labels.
    qubit_color (list): A list of colors for the qubits
    qubit_labels (list): A list of qubit labels
    line_color (list): A list of colors for each line from coupling_map.
    font_color (str): The font color for the qubit labels.
    ax (Axes): A Matplotlib axes instance.
    filename (str): file path to save image to.
    planar (bool): If the coupling map is planar or not. Default: ``True`` (i.e. it is planar)

Returns:
    Figure: A Matplotlib figure instance.

Raises:
    MissingOptionalLibraryError: If matplotlib or graphviz is not installed.
    QiskitError: If the length of qubit labels does not match the number of qubits.

Example:

    .. plot::
       :alt: Output from the previous code.
       :include-source:

        from qiskit.visualization import plot_coupling_map

        num_qubits = 8
        qubit_coordinates = [[0, 1], [1, 1], [1, 0], [1, 2], [2, 0], [2, 2], [2, 1], [3, 1]]
        coupling_map = [[0, 1], [1, 2], [2, 3], [3, 5], [4, 5], [5, 6], [2, 4], [6, 7]]
        plot_coupling_map(num_qubits, qubit_coordinates, coupling_map)

## `plot_circuit_layout`

```python
def plot_circuit_layout(circuit, backend, view='virtual', qubit_coordinates=None)
```

Plot the layout of a circuit transpiled for a given
target backend.

Args:
    circuit (QuantumCircuit): Input quantum circuit.
    backend (Backend): Target backend.
    view (str): How to label qubits in the layout. Options:

      - ``"virtual"``: Label each qubit with the index of the virtual qubit that
        mapped to it.
      - ``"physical"``: Label each qubit with the index of the physical qubit that it
        corresponds to on the device.

    qubit_coordinates (Sequence): An optional sequence input (list or array being the
        most common) of 2d coordinates for each qubit. The length of the
        sequence must match the number of qubits on the backend. The sequence
        should be the planar coordinates in a 0-based square grid where each
        qubit is located.

Returns:
    Figure: A matplotlib figure showing layout.

Raises:
    QiskitError: Invalid view type given.
    VisualizationError: Circuit has no layout attribute.

Example:
    .. plot::
       :alt: Output from the previous code.
       :include-source:

        from qiskit import QuantumCircuit, transpile
        from qiskit.providers.fake_provider import GenericBackendV2
        from qiskit.visualization import plot_circuit_layout

        ghz = QuantumCircuit(3, 3)
        ghz.h(0)
        for idx in range(1,3):
            ghz.cx(0,idx)
        ghz.measure(range(3), range(3))

        backend = GenericBackendV2(num_qubits=5)
        new_circ_lv3 = transpile(ghz, backend=backend, optimization_level=3)
        plot_circuit_layout(new_circ_lv3, backend)

## `plot_error_map`

```python
def plot_error_map(backend, figsize=(15, 12), show_title=True, qubit_coordinates=None)
```

Plots the error map of a given backend.

Args:
    backend (Backend): Given backend.
    figsize (tuple): Figure size in inches.
    show_title (bool): Show the title or not.
    qubit_coordinates (Sequence): An optional sequence input (list or array being the
        most common) of 2d coordinates for each qubit. The length of the
        sequence must match the number of qubits on the backend. The sequence
        should be the planar coordinates in a 0-based square grid where each
        qubit is located.

Returns:
    Figure: A matplotlib figure showing error map.

Raises:
    VisualizationError: The backend does not provide gate errors for the 'sx' gate.
    MissingOptionalLibraryError: If matplotlib or seaborn is not installed.

Example:
    .. plot::
       :alt: Output from the previous code.
       :include-source:

        from qiskit.visualization import plot_error_map
        from qiskit.providers.fake_provider import GenericBackendV2

        backend = GenericBackendV2(num_qubits=5)
        plot_error_map(backend)
