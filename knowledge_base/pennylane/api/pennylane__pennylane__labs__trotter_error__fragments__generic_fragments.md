---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/trotter_error/fragments/generic_fragments.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/trotter_error/fragments/generic_fragments.py
license: Apache-2.0
---

## Module `pennylane/labs/trotter_error/fragments/generic_fragments.py`

Wrapper class for generic fragment objects

## `generic_fragments`

```python
def generic_fragments(fragments: Sequence[Any], norm_fn: Callable=None) -> list[GenericFragment]
```

Instantiates :class:`~.pennylane.labs.trotter_error.GenericFragment` objects.

Args:
    fragments (Sequence[Any]): A sequence of objects of the same type. The type is assumed to implement ``__add__``, ``__mul__``, and ``__matmul__``.
    norm_fn (Callable): A function that computes the norm of the fragments.

Returns:
    List[GenericFragment]: A list of :class:`~.pennylane.labs.trotter_error.GenericFragment` objects instantiated from `fragments`.


**Example**

This code example demonstrates building fragments from numpy matrices.

>>> from pennylane.labs.trotter_error import generic_fragments
>>> import numpy as np
>>> matrices = [np.array([[1, 0], [0, 1]]), np.array([[0, 1], [1, 0]])]
>>> fragments = generic_fragments(matrices, norm_fn=np.linalg.norm)
>>> fragments
[GenericFragment(type=<class 'numpy.ndarray'>), GenericFragment(type=<class 'numpy.ndarray'>)]
>>> fragments[0].norm()
1.4142135623730951

## `GenericFragment`

```python
class GenericFragment(Fragment)
```

Abstract class used to define a generic fragment object for product formula error estimation.

This class allows using any object implementing arithmetic dunder methods to be used
for product formula error estimation.

Args:
    fragment (Any): An object that implements the following arithmetic methods:
        ``__add__``, ``__mul__``, and ``__matmul__``.
    norm_fn (optional, Callable): A function used to compute the norm of ``fragment``.

.. note:: :class:`~.pennylane.labs.trotter_error.GenericFragment` objects should be instantated through the ``generic_fragments`` function.

**Example**

>>> from pennylane.labs.trotter_error import generic_fragments
>>> import numpy as np
>>> matrices = [np.array([[1, 0], [0, 1]]), np.array([[0, 1], [1, 0]])]
>>> generic_fragments(matrices)
[GenericFragment(type=<class 'numpy.ndarray'>), GenericFragment(type=<class 'numpy.ndarray'>)]

### `apply`

```python
def apply(self, state: Any) -> Any
```

Apply the fragment to a state using the underlying object's ``__matmul__`` method.

### `expectation`

```python
def expectation(self, left: Any, right: Any) -> float
```

Compute the expectation value using the underlying object's ``__matmul__`` method.

### `norm`

```python
def norm(self, params: dict=None) -> float
```

Compute the norm of the fragment.
