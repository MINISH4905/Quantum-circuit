---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/trotter_error/fragments/sparse_fragments.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/trotter_error/fragments/sparse_fragments.py
license: Apache-2.0
---

## Module `pennylane/labs/trotter_error/fragments/sparse_fragments.py`

Wrapper class for Scipy sparse matrices.

## `sparse_fragments`

```python
def sparse_fragments(fragments: Sequence[csr_array]) -> list[SparseFragment]
```

Instantiates :class:`~.pennylane.labs.trotter_error.SparseFragment` objects.

Args:
    fragments (Sequence[csr_array]): A sequence of sparse matrices to be used as fragments.

Returns:
    List[SparseFragment]: A list of :class:`~.pennylane.labs.trotter_error.SparseFragment` objects instantiated from `fragments`.


**Example**
This code example demonstrates building fragments from scipy sparse matrices.

>>> from pennylane.labs.trotter_error import sparse_fragments
>>> from scipy.sparse import csr_array
>>> matrices = [csr_array([[1, 0], [0, 1]]), csr_array([[0, 1], [1, 0]])]
>>> fragments = sparse_fragments(matrices)
>>> fragments
[SparseFragment(shape=(2, 2), dtype=int64), SparseFragment(shape=(2, 2), dtype=int64)]
>>> fragments[0].norm()
1.4142135623730951

## `SparseFragment`

```python
class SparseFragment(Fragment)
```

A wrapper class to allow scipy sparse matrices to be used in the Trotter error functions.

Args:
    fragment (csr_array): The `csr_array` to be used as a `~.pennylane.labs.trotter_error.abstract.Fragment`.

.. note:: :class:`~.pennylane.labs.trotter_error.SparseFragment` objects should be instantated through the ``~.pennylane.labs.trotter_error.sparse_fragments`` function.

**Example**

>>> from pennylane.labs.trotter_error import sparse_fragments
>>> from scipy.sparse import csr_array
>>> matrices = [csr_array([[1, 0], [0, 1]]), csr_array([[0, 1], [1, 0]])]
>>> sparse_fragments(matrices)
[SparseFragment(shape=(2, 2), dtype=int64), SparseFragment(shape=(2, 2), dtype=int64)]

## `SparseState`

```python
class SparseState(AbstractState)
```

A wrapper class to allow scipy sparse vectors to be used in the Trotter error esimation functions.
This class is intended to instantiate states to be used along with the `SparseFragment` class.

### `zero_state`

```python
def zero_state(cls, dim: int) -> SparseState
```

Return a representation of the zero state.

Returns:
    SparseState: an ``SparseState`` representation of the zero state

### `dot`

```python
def dot(self, other) -> complex
```

Compute the dot product of two states.

Args:
    other: the state to take the dot product with

Returns:
    complex: the dot product of self and other
