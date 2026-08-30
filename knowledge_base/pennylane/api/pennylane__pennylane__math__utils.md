---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/math/utils.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/math/utils.py
license: Apache-2.0
---

## Module `pennylane/math/utils.py`

Utility functions

## `allequal`

```python
def allequal(tensor1, tensor2, **kwargs)
```

Returns True if two tensors are element-wise equal along a given axis.

This function is equivalent to calling ``np.all(tensor1 == tensor2, **kwargs)``,
but allows for ``tensor1`` and ``tensor2`` to differ in type.

Args:
    tensor1 (tensor_like): tensor to compare
    tensor2 (tensor_like): tensor to compare
    **kwargs: Accepts any keyword argument that is accepted by ``np.all``,
        such as ``axis``, ``out``, and ``keepdims``. See the `NumPy documentation
        <https://numpy.org/doc/stable/reference/generated/numpy.all.html>`__ for
        more details.

Returns:
    ndarray, bool: If ``axis=None``, a logical AND reduction is applied to all elements
    and a boolean will be returned, indicating if all elements evaluate to ``True``. Otherwise,
    a boolean NumPy array will be returned.

**Example**

>>> a = torch.tensor([1, 2])
>>> b = np.array([1, 2])
>>> allequal(a, b)
True

## `allclose`

```python
def allclose(a, b, rtol=1e-05, atol=1e-08, **kwargs)
```

Wrapper around np.allclose, allowing tensors ``a`` and ``b``
to differ in type

## `cast`

```python
def cast(tensor, dtype)
```

Casts the given tensor to a new type.

Args:
    tensor (tensor_like): tensor to cast
    dtype (str, np.dtype): Any supported NumPy dtype representation; this can be
        a string (``"float64"``), a ``np.dtype`` object (``np.dtype("float64")``), or
        a dtype class (``np.float64``). If ``tensor`` is not a NumPy array, the
        **equivalent** dtype in the dispatched framework is used.

Returns:
    tensor_like: a tensor with the same shape and values as ``tensor`` and the
    same dtype as ``dtype``

**Example**

We can use NumPy dtype specifiers:

>>> x = torch.tensor([1, 2])
>>> cast(x, np.float64)
tensor([1., 2.], dtype=torch.float64)

We can also use strings:

>>> x = tf.Variable([1, 2])
>>> cast(x, "complex128")
<tf.Tensor: shape=(2,), dtype=complex128, numpy=array([1.+0.j, 2.+0.j])>

## `cast_like`

```python
def cast_like(tensor1, tensor2)
```

Casts a tensor to the same dtype as another.

Args:
    tensor1 (tensor_like): tensor to cast
    tensor2 (tensor_like): tensor with corresponding dtype to cast to

Returns:
    tensor_like: a tensor with the same shape and values as ``tensor1`` and the
    same dtype as ``tensor2``

**Example**

>>> x = torch.tensor([1, 2])
>>> y = torch.tensor([3., 4.])
>>> cast_like(x, y)
tensor([1., 2.])

## `convert_like`

```python
def convert_like(tensor1, tensor2)
```

Convert a tensor to the same type as another.

Args:
    tensor1 (tensor_like): tensor to convert
    tensor2 (tensor_like): tensor with corresponding type to convert to

Returns:
    tensor_like: a tensor with the same shape, values, and dtype as ``tensor1`` and the
    same type as ``tensor2``.

**Example**

>>> x = np.array([1, 2])
>>> y = tf.Variable([3, 4])
>>> convert_like(x, y)
<tf.Tensor: shape=(2,), dtype=int64, numpy=array([1, 2])>

## `is_abstract`

```python
def is_abstract(tensor, like=None)
```

Returns True if the tensor is considered abstract.

Abstract arrays have no internal value, and are used primarily when
tracing Python functions, for example, in order to perform just-in-time
(JIT) compilation.

Abstract tensors most commonly occur within a function that has been
decorated using ``@tf.function`` or ``@jax.jit``.

.. note::

    Currently Autograd tensors and Torch tensors will always return ``False``.
    This is because:

    - Autograd does not provide JIT compilation, and

    - ``@torch.jit.script`` is not currently compatible with QNodes.

Args:
    tensor (tensor_like): input tensor
    like (str): The name of the interface. Will be determined automatically
        if not provided.

Returns:
    bool: whether the tensor is abstract or not

**Example**

Consider the following JAX function:

.. code-block:: python

    import jax
    from jax import numpy as jnp

    def function(x):
        print("Value:", x)
        print("Abstract:", qp.math.is_abstract(x))
        return jnp.sum(x ** 2)

When we execute it, we see that the tensor is not abstract; it has known value:

>>> x = jnp.array([0.5, 0.1])
>>> function(x)
Value: [0.5, 0.1]
Abstract: False
Array(0.26, dtype=float32)

However, if we use the ``@jax.jit`` decorator, the tensor will now be abstract:

>>> x = jnp.array([0.5, 0.1])
>>> jax.jit(function)(x)
Value: Traced<ShapedArray(float32[2])>with<DynamicJaxprTrace(level=0/1)>
Abstract: True
Array(0.26, dtype=float32)

Note that JAX uses an abstract *shaped* array, so although we won't be able to
include conditionals within our function that depend on the value of the tensor,
we *can* include conditionals that depend on the shape of the tensor.

Similarly, consider the following TensorFlow function:

.. code-block:: python

    import tensorflow as tf

    def function(x):
        print("Value:", x)
        print("Abstract:", qp.math.is_abstract(x))
        return tf.reduce_sum(x ** 2)

>>> x = tf.Variable([0.5, 0.1])
>>> function(x)
Value: <tf.Variable 'Variable:0' shape=(2,) dtype=float32, numpy=array([0.5, 0.1], dtype=float32)>
Abstract: False
<tf.Tensor: shape=(), dtype=float32, numpy=0.26>

If we apply the ``@tf.function`` decorator, the tensor will now be abstract:

>>> tf.function(function)(x)
Value: <tf.Variable 'Variable:0' shape=(2,) dtype=float32>
Abstract: True
<tf.Tensor: shape=(), dtype=float32, numpy=0.26>

## `import_should_record_backprop`

```python
def import_should_record_backprop()
```

Return should_record_backprop or an equivalent function from TensorFlow.

## `requires_grad`

```python
def requires_grad(tensor, interface=None)
```

Returns True if the tensor is considered trainable.

.. warning::

    The implementation depends on the contained tensor type, and
    may be context dependent.

    For example, Torch tensors and PennyLane tensors track trainability
    as a property of the tensor itself. TensorFlow, on the other hand,
    only tracks trainability if being watched by a gradient tape.

Args:
    tensor (tensor_like): input tensor
    interface (str): The name of the interface. Will be determined automatically
        if not provided.

Returns:
    bool: whether the tensor is trainable or not.

**Example**

Calling this function on a PennyLane NumPy array:

>>> x = np.array([1., 5.], requires_grad=True)
>>> requires_grad(x)
True
>>> x.requires_grad = False
>>> requires_grad(x)
False

PyTorch has similar behaviour.

With TensorFlow, the output is dependent on whether the tensor
is currently being watched by a gradient tape:

>>> x = tf.Variable([0.6, 0.1])
>>> requires_grad(x)
False
>>> with tf.GradientTape() as tape:
...     print(requires_grad(x))
True

While TensorFlow constants are by default not trainable, they can be
manually watched by the gradient tape:

>>> x = tf.constant([0.6, 0.1])
>>> with tf.GradientTape() as tape:
...     print(requires_grad(x))
False
>>> with tf.GradientTape() as tape:
...     tape.watch([x])
...     print(requires_grad(x))
True

## `in_backprop`

```python
def in_backprop(tensor, interface=None)
```

Returns True if the tensor is considered to be in a backpropagation environment, it works for Autograd,
TensorFlow and Jax. It is not only checking the differentiability of the tensor like :func:`~.requires_grad`, but
rather checking if the gradient is actually calculated.

Args:
    tensor (tensor_like): input tensor
    interface (str): The name of the interface. Will be determined automatically
        if not provided.

Returns:
    bool: whether the tensor is in a backpropagation environment or not.

**Example**

>>> x = tf.Variable([0.6, 0.1])
>>> requires_grad(x)
False
>>> with tf.GradientTape() as tape:
...     print(requires_grad(x))
True

.. seealso:: :func:`~.requires_grad`

## `ceil_log2`

```python
def ceil_log2(n: int) -> int
```

Compute the ceiling of the base-2 logarithm of an integer, with integer as output data type.

Args:
    n (int): Integer to compute the rounded-up base-2 logarithm of.

Returns:
    int: Rounded-up base-2 logarithm of ``n``.

**Example**

On powers of two, ``ceil_log2`` simply acts like ``np.log2`` whose result was converted to
an ``int``:

>>> qp.math.ceil_log2(8)
3

On other numbers, the rounding of the logarithm becomes visible:

>>> qp.math.log2(14)
3.807354922057604
>>> qp.math.ceil_log2(14)
4

Note that we always round up:

>>> qp.math.round(qp.math.log2(9))
3.0
>>> qp.math.ceil_log2(9)
4
