---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/analysis/make_observable.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/analysis/make_observable.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/analysis/make_observable.py`

Helper functions for building dictionaries from matrices and lists.

## `make_dict_observable`

```python
def make_dict_observable(matrix_observable: list | np.ndarray) -> dict
```

Convert an observable in matrix form to dictionary form.

Takes in a diagonal observable as a matrix and converts it to a dictionary
form. Can also handle a list sorted of the diagonal elements.

Args:
    matrix_observable (list): The observable to be converted to dictionary
    form. Can be a matrix or just an ordered list of observed values

Returns:
    Dict: A dictionary with all observable states as keys, and corresponding
    values being the observed value for that state
