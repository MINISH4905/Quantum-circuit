---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/fourier/visualize.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/fourier/visualize.py
license: Apache-2.0
---

## Error surface of `pennylane/fourier/visualize.py`

### Validation

## `_validate_coefficients`

```python
def _validate_coefficients(coeffs, n_inputs, can_be_list=True)
```

Helper function to validate input coefficients of plotting functions.

Args:
    coeffs (array[complex]): A set (or list of sets) of Fourier coefficients of a
        n_inputs-dimensional function.
    n_inputs (int): The number of inputs (dimension) of the function the coefficients are for.
    can_be_list (bool): Whether or not the plotting function accepts a list of
        coefficients, or only a single set.

Raises:
    TypeError: If the coefficients are not a list or array.
    ValueError: if the coefficients are not a suitable type for the plotting function.
