---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/utils.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/utils.py
license: Apache-2.0
---

## Module `qiskit/visualization/utils.py`

Common visualization utilities.

## `matplotlib_close_if_inline`

```python
def matplotlib_close_if_inline(figure)
```

Close the given matplotlib figure if the backend in use draws figures inline.

If the backend does not draw figures inline, this does nothing.  This function is to prevent
duplicate images appearing; the inline backends will capture the figure in preparation and
display it as well, whereas the drawers want to return the figure to be displayed.
