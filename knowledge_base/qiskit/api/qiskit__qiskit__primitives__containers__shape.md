---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/containers/shape.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/containers/shape.py
license: Apache-2.0
---

## Module `qiskit/primitives/containers/shape.py`

Array shape related classes and functions

## `Shaped`

```python
class Shaped(Protocol)
```

Protocol that defines what it means to be a shaped object.

Note that static type checkers will classify ``numpy.ndarray`` as being :class:`Shaped`.
Moreover, since this protocol is runtime-checkable, we will even have
``isinstance(<numpy.ndarray instance>, Shaped) == True``.

### `shape`

```python
def shape(self) -> tuple[int, ...]
```

The array shape of this object.

### `ndim`

```python
def ndim(self) -> int
```

The number of array dimensions of this object.

### `size`

```python
def size(self) -> int
```

The total dimension of this object, i.e. the product of the entries of :attr:`~shape`.

## `ShapedMixin`

```python
class ShapedMixin(Shaped)
```

Mixin class to create :class:`~Shaped` types by only providing :attr:`_shape` attribute.

## `array_coerce`

```python
def array_coerce(arr: ArrayLike | Shaped) -> NDArray | Shaped
```

Coerce the input into an object with a shape attribute.

Copies are avoided.

Args:
    arr: The object to coerce.

Returns:
    Something that is :class:`~Shaped`, and always ``numpy.ndarray`` if the input is not
    already :class:`~Shaped`.

## `shape_tuple`

```python
def shape_tuple(*shapes: ShapeInput) -> tuple[int, ...]
```

Flatten the input into a single tuple of integers, preserving order.

Args:
    shapes: Integers or iterables of integers, possibly nested.

Returns:
    A tuple of integers.

Raises:
    ValueError: If some member of ``shapes`` is not an integer or iterable.
