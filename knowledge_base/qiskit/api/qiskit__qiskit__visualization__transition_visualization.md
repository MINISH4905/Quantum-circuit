---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/transition_visualization.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/transition_visualization.py
license: Apache-2.0
---

## Module `qiskit/visualization/transition_visualization.py`

Visualization function for animation of state transitions by applying gates to single qubit.

## `visualize_transition`

```python
def visualize_transition(circuit, trace=False, saveas=None, fpg=100, spg=2)
```

Creates animation showing transitions between states of a single
qubit by applying quantum gates.

Args:
    circuit (QuantumCircuit): Qiskit single-qubit QuantumCircuit. Gates supported are
        h,x, y, z, rx, ry, rz, s, sdg, t, tdg and u1.
    trace (bool): Controls whether to display tracing vectors - history of 10 past vectors
        at each step of the animation.
    saveas (str): User can choose to save the animation as a video to their filesystem.
        This argument is a string of path with filename and extension (e.g. "movie.mp4" to
        save the video in current working directory).
    fpg (int): Frames per gate. Finer control over animation smoothness and computational
        needs to render the animation. Works well for tkinter GUI as it is, for jupyter GUI
        it might be preferable to choose fpg between 5-30.
    spg (int): Seconds per gate. How many seconds should animation of individual gate
        transitions take.

Returns:
    IPython.core.display.HTML:
        If arg jupyter is set to True. Otherwise opens tkinter GUI and returns
        after the GUI is closed.

Raises:
    MissingOptionalLibraryError: Must have Matplotlib (and/or IPython) installed.
    VisualizationError: Given gate(s) are not supported.
