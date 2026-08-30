---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/containers/object_array.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/containers/object_array.py
license: Apache-2.0
---

## Module `qiskit/primitives/containers/object_array.py`

Object ND-array initialization function.

## `object_array`

```python
def object_array(arr: ArrayLike, order: str | None=None, copy: bool=True, list_types: Sequence[type] | None=()) -> np.ndarray
```

Convert an array-like of objects into an object array.

.. note::

    If the objects in the array like input define ``__array__`` methods
    this avoids calling them and will instead set the returned array values
    to the Python objects themselves.

Args:
    arr: An array-like input.
    order:  the order of the returned array (C, F, A, K). If None
           the default NumPy ordering of C is used.
    copy: If True make a copy of the input if it is already an array.
    list_types:  a sequence of types to treat as lists of array
        element objects when inferring the array shape from the input.

Returns:
    A NumPy ND-array with ``dtype=object``.

Raises:
    ValueError: If the input cannot be coerced into an object array.
