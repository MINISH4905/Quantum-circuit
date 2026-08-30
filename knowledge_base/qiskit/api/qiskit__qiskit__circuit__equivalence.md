---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/equivalence.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/equivalence.py
license: Apache-2.0
---

## Module `qiskit/circuit/equivalence.py`

Gate equivalence library.

## `EquivalenceLibrary`

```python
class EquivalenceLibrary(BaseEquivalenceLibrary)
```

A library providing a one-way mapping of Gates to their equivalent
implementations as QuantumCircuits.

### `draw`

```python
def draw(self, filename=None)
```

Draws the equivalence relations available in the library.

.. warning::
    This function will call the system Graphviz tool on a file involving user-controllable
    strings (such as gate names).  It is recommended to only call this function on trusted
    input.

Args:
    filename (str): An optional path to write the output image to.  If unspecified, the
        image will instead be returned.

Returns:
    PIL.Image: If ``filename`` is ``None``, then the rendered image.

Raises:
    InvalidFileError: if filename is not valid.
