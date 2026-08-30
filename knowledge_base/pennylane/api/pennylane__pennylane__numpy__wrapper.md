---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/numpy/wrapper.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/numpy/wrapper.py
license: Apache-2.0
---

## Module `pennylane/numpy/wrapper.py`

This module provides the PennyLane wrapper functions for modifying NumPy,
such that it accepts the PennyLane :class:`~.tensor` class.

## `extract_tensors`

```python
def extract_tensors(x)
```

Iterate through an iterable, and extract any PennyLane
tensors that appear.

Args:
    x (.tensor or Sequence): an input tensor or sequence

Yields:
    tensor: the next tensor in the sequence. If the input was a single
    tensor, than the tensor is yielded and the iterator completes.

**Example**

>>> from pennylane import numpy as np
>>> import numpy as onp
>>> iterator = np.extract_tensors([0.1, np.array(0.1), "string", onp.array(0.5)])
>>> list(iterator)
[tensor(0.1, requires_grad=True)]

## `tensor_wrapper`

```python
def tensor_wrapper(obj)
```

Decorator that wraps callable objects and classes so that they both accept
a ``requires_grad`` keyword argument, as well as returning a PennyLane
:class:`~.tensor`.

Only if the decorated object returns an ``ndarray`` is the
output converted to a :class:`~.tensor`; this avoids superfluous conversion
of scalars and other native-Python types.

.. note::

    This wrapper does *not* enable autodifferentiation of the wrapped function,
    it merely adds support for :class:`~pennylane.numpy.tensor` output.

Args:
    obj: a callable object or class

**Example**

By default, the ``ones`` function provided by Autograd
constructs standard ``ndarray`` objects, and does not
permit a ``requires_grad`` argument:

>>> from autograd.numpy import ones
>>> ones([2, 2])
array([[1., 1.],
    [1., 1.]])
>>> ones([2, 2], requires_grad=True)
Traceback (most recent call last):
    ...
TypeError: ones() got an unexpected keyword argument 'requires_grad'

``tensor_wrapper`` both enables construction of :class:`~pennylane.numpy.tensor`
objects, while also converting the output.

>>> from pennylane import numpy as np
>>> ones = np.tensor_wrapper(ones)
>>> ones([2, 2], requires_grad=True)
tensor([[1., 1.],
    [1., 1.]], requires_grad=True)

## `wrap_arrays`

```python
def wrap_arrays(old, new)
```

Loop through an object's symbol table,
wrapping each function with :func:`~pennylane.numpy.tensor_wrapper`.

This is useful if you would like to wrap **every** function
provided by an imported module.

Args:
    old (dict): The symbol table to be wrapped. Note that
        callable classes are ignored; only functions are wrapped.
    new (dict): The symbol table that contains the wrapped values.

.. seealso:: :func:`~pennylane.numpy.tensor_wrapper`

**Example**

This function is used to wrap the imported ``autograd.numpy``
module, to enable all functions to support ``requires_grad``
arguments, and to output :class:`~pennylane.numpy.tensor` objects:

>>> from autograd import numpy as _np
>>> wrap_arrays(_np.__dict__, globals())
