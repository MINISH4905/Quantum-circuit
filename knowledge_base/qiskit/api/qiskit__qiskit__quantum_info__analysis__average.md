---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/analysis/average.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/analysis/average.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/analysis/average.py`

A collection of useful functions for post processing results.

## `average_data`

```python
def average_data(counts: dict, observable: dict | np.ndarray | list) -> float
```

Compute the mean value of a diagonal observable.

Takes in a diagonal observable in dictionary, list or matrix format and then
calculates the sum_i value(i) P(i) where value(i) is the value of the
observable for state i.

Args:
    counts (dict): a dict of outcomes from an experiment
    observable (dict or matrix or list): The observable to be averaged over.
    As an example, ZZ on qubits can be given as:
    * dict: {"00": 1, "11": 1, "01": -1, "10": -1}
    * matrix: [[1, 0, 0, 0], [0, -1, 0, 0, ], [0, 0, -1, 0], [0, 0, 0, 1]]
    * matrix diagonal (list): [1, -1, -1, 1]

Returns:
    Double: Average of the observable
