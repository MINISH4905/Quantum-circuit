---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/containers/observables_array.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/containers/observables_array.py
license: Apache-2.0
---

## Module `qiskit/primitives/containers/observables_array.py`

ND-Array container class for Estimator observables.

## `ObservablesArray`

```python
class ObservablesArray(ShapedMixin)
```

An ND-array of Hermitian observables for an :class:`.Estimator` primitive.

### `__init__`

```python
def __init__(self, observables: ObservablesArrayLike, num_qubits: int | None=None, copy: bool=True, validate: bool=True)
```

Initialize an observables array.

Args:
    observables: An array-like of basis observable compatible objects.
    copy: Specify the ``copy`` kwarg of the :func:`.object_array` function
        when initializing observables.
    num_qubits: The number of qubits of the observables. If not specified, the number of
        qubits will be inferred from the observables. If specified, then the specified
        number of qubits must match the number of qubits in the observables.
    validate: If true, coerce entries into the internal format and validate them. If false,
        the input should already be an array-like.

Raises:
    ValueError: If ``validate=True`` and the input observables array is not valid.

### `tolist`

```python
def tolist(self) -> list | ObservableLike
```

Convert to a nested list.

Similar to Numpy's ``tolist`` method, the level of nesting
depends on the dimension of the observables array. In the
case of dimension 0 the method returns a single observable
(``dict`` in the case of a weighted sum of Paulis) instead of a list.

Examples::
    Return values for a one-element list vs one element:

        >>> from qiskit.primitives.containers.observables_array import ObservablesArray
        >>> oa = ObservablesArray.coerce(["Z"])
        >>> print(type(oa.tolist()))
        <class 'list'>
        >>> oa = ObservablesArray.coerce("Z")
        >>> print(type(oa.tolist()))
        <class 'dict'>

### `__array__`

```python
def __array__(self, dtype=None, copy=None) -> np.ndarray
```

Convert to a Numpy.ndarray with elements of type dict.

### `sparse_observables_array`

```python
def sparse_observables_array(self, copy: bool=False) -> np.ndarray
```

Convert to a :class:`numpy.ndarray` with elements of type :class:`~.SparseObservable`.

Args:
    copy: Whether to make a new array instance with new sparse observables as elements.

Returns:
    A :class:`numpy.ndarray` with elements of type :class:`~.SparseObservable`.

### `slice`

```python
def slice(self, args)
```

Take a slice of the observables in this array.

.. note::
   This method does not copy observables; modifying the returned observables will affect this
   instance.

Returns:
    A single :class:`~.SparseObservable` if an integer is given for every array axis, otherwise,
    a new :class:`~.ObservablesArray`.

### `reshape`

```python
def reshape(self, *shape: int | Iterable[int]) -> ObservablesArray
```

Return a new array with a different shape.

This results in a new view of the same arrays.

Args:
    shape: The shape of the returned array.

Returns:
    A new array.

### `ravel`

```python
def ravel(self) -> ObservablesArray
```

Return a new array with one dimension.

The returned array has a :attr:`shape` given by ``(size, )``, where
the size is the :attr:`~size` of this array.

Returns:
    A new flattened array.

### `num_qubits`

```python
def num_qubits(self) -> int
```

The number of qubits each observable acts on.

### `coerce_observable`

```python
def coerce_observable(cls, observable: ObservableLike) -> SparseObservable
```

Format an observable-like object into the internal format.

Args:
    observable: The observable-like to format.

Returns:
    The coerced observable.

Raises:
    TypeError: If the input cannot be formatted because its type is not valid.
    ValueError: If the input observable is invalid or empty.

### `coerce`

```python
def coerce(cls, observables: ObservablesArrayLike) -> ObservablesArray
```

Coerce ObservablesArrayLike into ObservableArray.

Args:
    observables: an object to be observables array.

Returns:
    A coerced observables array.

### `equivalent`

```python
def equivalent(self, other: ObservablesArray, tol: float=1e-08) -> bool
```

Compute whether the observable arrays are equal within a given tolerance.

Args:
    other: Another observables array to compare with.
    tol: The tolerance to provide to :attr:`~.SparseObservable.simplify` during checking.

Returns:
    Whether the two observables arrays have the same shape and number of qubits,
    and if so, whether they are equal within tolerance.

### `copy`

```python
def copy(self)
```

Return a deep copy of the array.

### `apply_layout`

```python
def apply_layout(self, layout: TranspileLayout | list[int] | None, num_qubits: int | None=None) -> ObservablesArray
```

Apply a transpiler layout to this :class:`~.ObservablesArray`.

Args:
    layout: Either a :class:`~.TranspileLayout`, a list of integers or None.
            If both layout and ``num_qubits`` are none, a deep copy of the array is
            returned.
    num_qubits: The number of qubits to expand the array to. If not
        provided then if ``layout`` is a :class:`~.TranspileLayout` the
        number of the transpiler output circuit qubits will be used by
        default. If ``layout`` is a list of integers the permutation
        specified will be applied without any expansion. If layout is
        None, the array will be expanded to the given number of qubits.

Returns:
    A new :class:`.ObservablesArray` with the provided layout applied.

Raises:
    QiskitError: ...

### `validate`

```python
def validate(self)
```

Validate the consistency in observables array.
