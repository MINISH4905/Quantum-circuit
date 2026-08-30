---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/containers/bindings_array.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/containers/bindings_array.py
license: Apache-2.0
---

## Module `qiskit/primitives/containers/bindings_array.py`

Bindings array class

## `BindingsArray`

```python
class BindingsArray(ShapedMixin)
```

Stores parameter binding value sets for a :class:`qiskit.QuantumCircuit`.

A single parameter binding set provides numeric values to bind to a circuit with free
:class:`qiskit.circuit.Parameter`\s. An instance of this class stores an array-valued collection
of such sets. The simplest example is a 0-d array consisting of a single parameter binding set,
whereas an n-d array of parameter binding sets represents an n-d sweep over values.

The storage format is a dictionary of arrays attached to parameters,
``{params_0: values_0,...}``. A convention is used where the last dimension of each array
indexes (a subset of) circuit parameters. For example, if the last dimension of ``values_0`` is
25, then it represents an array of possible binding values for the 25 distinct parameters
``params_0``, where its leading shape is the array :attr:`~.shape` of its binding array. This
allows flexibility about whether values for different parameters are stored in one big array, or
across several smaller arrays.

.. plot::
   :include-source:
   :nofigs:

   import numpy as np
   from qiskit.primitives import BindingsArray

   # 0-d array (i.e. only one binding)
   BindingsArray({"a": 4, ("b", "c"): [5, 6]})

   # single array, last index is parameters
   parameters = tuple(f"a{idx}" for idx in range(100))
   BindingsArray({parameters: np.ones((10, 10, 100))})

   # multiple arrays, where each last index is parameters. notice that it's smart enough to
   # figure out that a missing last dimension corresponds to a single parameter.
   BindingsArray(
       {("c", "a"): np.zeros((10, 10, 2)), "b": np.ones((10, 10))}
   )

### `__init__`

```python
def __init__(self, data: BindingsArrayLike | None=None, shape: ShapeInput | None=None)
```

Initialize a :class:`~.BindingsArray`.

The ``shape`` argument does not need to be provided whenever it can unambiguously
be inferred from the provided arrays. Ambiguity arises whenever the key of an entry of
``data`` contains only one parameter and the corresponding array's shape ends in a one.
In this case, it can't be decided whether that one is an index over parameters, or whether
it should be incorporated in :attr:`~shape`.

Since :class:`~.Parameter` objects are only allowed to represent float values, this
class casts all given values to float. If an incompatible dtype is given, such as complex
numbers, a ``TypeError`` will be raised.

Args:
    data: A mapping from one or more parameters to arrays of values to bind
        them to, where the last axis is over parameters.
    shape: The leading shape of every array in these bindings.

Raises:
    ValueError: If all inputs are ``None``.
    ValueError: If the shape cannot be automatically inferred from the arrays, or if there
        is some inconsistency in the shape of the given arrays.
    TypeError: If some of the values can't be cast to a float type.

### `data`

```python
def data(self) -> dict[tuple[str, ...], np.ndarray]
```

The keyword values of this array.

### `num_parameters`

```python
def num_parameters(self) -> int
```

The total number of parameters.

### `as_array`

```python
def as_array(self, parameters: Iterable[ParameterLike] | None=None) -> np.ndarray
```

Return the contents of this bindings array as a single NumPy array.

The parameters are indexed along the last dimension of the returned array.

Args:
    parameters: Optional parameters that determine the order of the output.

Returns:
    This bindings array as a single NumPy array.

Raises:
    ValueError: If ``parameters`` are provided, but do not match those found in ``data``.

### `bind`

```python
def bind(self, circuit: QuantumCircuit, loc: tuple[int, ...]) -> QuantumCircuit
```

Return a new circuit bound to the values at the provided index.

Args:
    circuit: The circuit to bind.
    loc: A tuple of indices, one for each dimension of this array.

Returns:
    The bound circuit.

Raises:
    ValueError: If the index doesn't have the right number of values.

### `bind_all`

```python
def bind_all(self, circuit: QuantumCircuit) -> np.ndarray
```

Return an object array of bound circuits with the same shape.

Args:
    circuit: The circuit to bind.

Returns:
    An object array of the same shape containing all bound circuits.

### `ravel`

```python
def ravel(self) -> BindingsArray
```

Return a new :class:`~BindingsArray` with one dimension.

The returned bindings array has a :attr:`shape` given by ``(size, )``, where the size is the
:attr:`~size` of this bindings array.

Returns:
    A new bindings array.

### `reshape`

```python
def reshape(self, *shape: int | Iterable[int]) -> BindingsArray
```

Return a new :class:`~BindingsArray` with a different shape.

This results in a new view of the same arrays.

Args:
    shape: The shape of the returned bindings array.

Returns:
    A new bindings array.

Raises:
    ValueError: If the provided shape has a different product than the current size.

### `coerce`

```python
def coerce(cls, bindings_array: BindingsArrayLike) -> BindingsArray
```

Coerce an input that is :class:`~BindingsArrayLike` into a new :class:`~BindingsArray`.

Args:
    bindings_array: An object to be bindings array.

Returns:
    A new bindings array.

### `validate`

```python
def validate(self)
```

Validate the consistency in bindings_array.
