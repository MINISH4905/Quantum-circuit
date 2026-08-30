---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/numpy/tensor.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/numpy/tensor.py
license: Apache-2.0
---

## Module `pennylane/numpy/tensor.py`

This module provides the PennyLane :class:`~.tensor` class.

## `asarray`

```python
def asarray(vals, *args, **kwargs)
```

Gradient supporting autograd asarray

## `asarray_gradmaker`

```python
def asarray_gradmaker(ans, *args, **kwargs)
```

Gradient maker for asarray

## `tensor`

```python
class tensor(_np.ndarray)
```

Constructs a PennyLane tensor for use with Autograd QNodes.

The ``tensor`` class is a subclass of ``numpy.ndarray``,
providing the same multidimensional, homogeneous data-structure
of fixed-size items, with an additional flag to indicate to PennyLane
whether the contained data is differentiable or not.

.. warning::

    PennyLane ``tensor`` objects are only used as part of the Autograd QNode
    interface. If using another machine learning library such as PyTorch or
    TensorFlow, use their built-in ``tf.Variable`` and ``torch.tensor`` classes
    instead.

.. warning::

    Tensors should be constructed using standard array construction functions
    provided as part of PennyLane's NumPy implementation, including
    ``np.array``, ``np.zeros`` or ``np.empty``.

    The parameters given here refer to a low-level class
    for instantiating tensors.


Args:
    input_array (array_like): Any data structure in any form that can be converted to
        an array. This includes lists, lists of tuples, tuples, tuples of tuples,
        tuples of lists and ndarrays.
    requires_grad (bool): whether the tensor supports differentiation

**Example**

The trainability of a tensor can be set on construction via the
``requires_grad`` keyword argument,

>>> from pennylane import numpy as np
>>> x = np.array([0, 1, 2], requires_grad=True)
>>> x
tensor([0, 1, 2], requires_grad=True)

or in-place by modifying the ``requires_grad`` attribute:

>>> x.requires_grad = False
>>> x
tensor([0, 1, 2], requires_grad=False)

Since tensors are subclasses of ``np.ndarray``, they can be provided as arguments
to any PennyLane-wrapped NumPy function:

>>> np.sin(x)
tensor([0.        , 0.84147098, 0.90929743], requires_grad=False)

When composing functions of multiple tensors, if at least one input tensor is differentiable,
then the output will also be differentiable:

>>> x = np.array([0, 1, 2], requires_grad=False)
>>> y = np.zeros([3], requires_grad=True)
>>> np.vstack([x, y])
tensor([[0., 1., 2.],
    [0., 0., 0.]], requires_grad=True)

### `unwrap`

```python
def unwrap(self)
```

Converts the tensor to a standard, non-differentiable NumPy ndarray or Python scalar if
the tensor is 0-dimensional.

All information regarding differentiability of the tensor will be lost.

.. warning::

    The returned array is a new view onto the **same data**. That is,
    the tensor and the returned ``ndarray`` share the same underlying storage.
    Changes to the tensor object will be reflected within the returned array,
    and vice versa.

**Example**

>>> from pennylane import numpy as np
>>> x = np.array([1, 2], requires_grad=True)
>>> x
tensor([1, 2], requires_grad=True)
>>> x.unwrap()
array([1, 2])

Zero dimensional array are converted to Python scalars:

>>> x = np.array(1.543, requires_grad=False)
>>> x.unwrap()
1.543
>>> type(x.unwrap())
<class 'float'>

The underlying data is **not** copied:

>>> x = np.array([1, 2], requires_grad=True)
>>> y = x.unwrap()
>>> x[0] = 5
>>> y
array([5, 2])
>>> y[1] = 7
>>> x
tensor([5, 7], requires_grad=True)


To create a copy, the ``copy()`` method can be used:

>>> x = np.array([1, 2], requires_grad=True)
>>> y = x.unwrap().copy()
>>> x[0] = 5
>>> y
array([1, 2])

### `numpy`

```python
def numpy(self)
```

Converts the tensor to a standard, non-differentiable NumPy ndarray or Python scalar if
the tensor is 0-dimensional.

This method is an alias for :meth:`~.unwrap`. See :meth:`~.unwrap` for more details.

## `tensor_to_arraybox`

```python
def tensor_to_arraybox(x, *args)
```

Convert a :class:`~.tensor` to an Autograd ``ArrayBox``.

Args:
    x (array_like): Any data structure in any form that can be converted to
        an array. This includes lists, lists of tuples, tuples, tuples of tuples,
        tuples of lists and ndarrays.

Returns:
    autograd.numpy.numpy_boxes.ArrayBox: Autograd ArrayBox instance of the array

Raises:
    NonDifferentiableError: if the provided tensor is non-differentiable
