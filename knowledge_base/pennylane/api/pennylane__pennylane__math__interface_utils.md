---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/math/interface_utils.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/math/interface_utils.py
license: Apache-2.0
---

## Module `pennylane/math/interface_utils.py`

Functions related to interfaces

## `Interface`

```python
class Interface(Enum)
```

Canonical set of interfaces supported.

### `get_like`

```python
def get_like(self) -> str | None
```

Maps canonical set of interfaces to those known by autoray.

## `get_interface`

```python
def get_interface(*values)
```

Determines the correct framework to dispatch to given a tensor-like object or a
sequence of tensor-like objects.

Args:
    *values (tensor_like): variable length argument list with single tensor-like objects

Returns:
    str: the name of the interface

To determine the framework to dispatch to, the following rules
are applied:

* Tensors that are incompatible (such as Torch, TensorFlow and Jax tensors)
  cannot both be present.

* Autograd tensors *may* be present alongside Torch, TensorFlow and Jax tensors,
  but Torch, TensorFlow and Jax take precedence; the autograd arrays will
  be treated as non-differentiable NumPy arrays. A warning will be raised
  suggesting that vanilla NumPy be used instead.

* Vanilla NumPy arrays and SciPy sparse matrices can be used alongside other tensor objects;
  they will always be treated as non-differentiable constants.

.. warning::
    ``get_interface`` defaults to ``"numpy"`` whenever Python built-in objects are passed.
    I.e. a list or tuple of ``torch`` tensors will be identified as ``"numpy"``:

    >>> get_interface([torch.tensor([1]), torch.tensor([1])])
    "numpy"

    The correct usage in that case is to unpack the arguments ``get_interface(*[torch.tensor([1]), torch.tensor([1])])``.

## `get_deep_interface`

```python
def get_deep_interface(value)
```

Given a deep data structure with interface-specific scalars at the bottom, return their
interface name.

Args:
    value (list, tuple): A deep list-of-lists, tuple-of-tuples, or combination with
        interface-specific data hidden within it

Returns:
    str: The name of the interface deep within the value

**Example**

>>> x = [[jax.numpy.array(1), jax.numpy.array(2)], [jax.numpy.array(3), jax.numpy.array(4)]]
>>> get_deep_interface(x)
'jax'

This can be especially useful when converting to the appropriate interface:

>>> qp.math.asarray(x, like=qp.math.get_deep_interface(x))
Array([[1, 2],
       [3, 4]], dtype=int64)
