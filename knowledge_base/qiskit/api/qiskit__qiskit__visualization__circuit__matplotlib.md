---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/circuit/matplotlib.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/circuit/matplotlib.py
license: Apache-2.0
---

## Module `qiskit/visualization/circuit/matplotlib.py`

mpl circuit visualization backend.

## `MatplotlibDrawer`

```python
class MatplotlibDrawer
```

Matplotlib drawer class called from circuit_drawer

### `draw`

```python
def draw(self, filename=None)
```

Main entry point to 'matplotlib' ('mpl') drawer. Called from
``visualization.circuit_drawer`` and from ``QuantumCircuit.draw`` through circuit_drawer.

## `NodeData`

```python
class NodeData
```

Class containing drawing data on a per node basis
