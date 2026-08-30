---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/array.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/array.py
license: Apache-2.0
---

## Module `qiskit/visualization/array.py`

Tools to create LaTeX arrays.

## `array_to_latex`

```python
def array_to_latex(array, precision=10, prefix='', source=False, max_size=8)
```

Latex representation of a complex numpy array (with dimension 1 or 2)

Args:
    array (ndarray): The array to be converted to latex, must have dimension 1 or 2 and
                     contain only numerical data.
    precision (int): For numbers not close to integers or common terms, the number of
                     decimal places to round to.
    prefix (str): Latex string to be prepended to the latex, intended for labels.
    source (bool): If ``False``, will return IPython.display.Latex object. If display is
                   ``True``, will instead return the LaTeX source string.
    max_size (list(int) or int): The maximum size of the output Latex array.

        * If list(``int``), then the 0th element of the list specifies the maximum
          width (including dots characters) and the 1st specifies the maximum height
          (also inc. dots characters).
        * If a single ``int`` then this value sets the maximum width _and_ maximum
          height.

Returns:
    str or IPython.display.Latex: If ``source`` is ``True``, a ``str`` of the LaTeX
        representation of the array, else an ``IPython.display.Latex`` representation of
        the array.

Raises:
    TypeError: If array can not be interpreted as a numerical numpy array.
    ValueError: If the dimension of array is not 1 or 2.
    MissingOptionalLibraryError: If ``source`` is ``False`` and ``IPython.display.Latex`` cannot be
                 imported. Or if sympy is not installed.
