---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/math/multi_dispatch.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/math/multi_dispatch.py
license: Apache-2.0
---

## Module `pennylane/math/multi_dispatch.py`

Multiple dispatch functions

## `array`

```python
def array(*args, like=None, **kwargs)
```

Creates an array or tensor object of the target framework.

If the PyTorch interface is specified, this method preserves the Torch device used.
If the JAX interface is specified, this method uses JAX numpy arrays, which do not cause issues with jit tracers.

Returns:
    tensor_like: the tensor_like object of the framework

## `eye`

```python
def eye(*args, like=None, **kwargs)
```

Creates an identity array or tensor object of the target framework.

This method preserves the Torch device used.

Returns:
    tensor_like: the tensor_like object of the framework

## `multi_dispatch`

```python
def multi_dispatch(argnum=None, tensor_list=None)
```

Decorator to dispatch arguments handled by the interface.

This helps simplify definitions of new functions inside PennyLane. We can
decorate the function, indicating the arguments that are tensors handled
by the interface:


>>> @qp.math.multi_dispatch(argnum=[0, 1])
... def some_function(tensor1, tensor2, option, like):
...     # the interface string is stored in `like`.
...     ...


Args:
    argnum (list[int]): A list of integers indicating the indices
        to dispatch (i.e., the arguments that are tensors handled by an interface).
        If ``None``, dispatch over all arguments.
    tensor_lists (list[int]): a list of integers indicating which indices
        in ``argnum`` are expected to be lists of tensors. If an argument
        marked as tensor list is not a ``tuple`` or ``list``, it is treated
        as if it was not marked as tensor list. If ``None``, this option is ignored.

Returns:
    func: A wrapped version of the function, which will automatically attempt
    to dispatch to the correct autodifferentiation framework for the requested
    arguments. Note that the ``like`` argument will be optional, but can be provided
    if an explicit override is needed.

.. seealso:: :func:`pennylane.math.multi_dispatch._multi_dispatch`

.. note::
    This decorator makes the interface argument "like" optional as it utilizes
    the utility function `_multi_dispatch` to automatically detect the appropriate
    interface based on the tensor types.

**Examples**

We can redefine external functions to be suitable for PennyLane. Here, we
redefine Autoray's ``stack`` function.

>>> stack = multi_dispatch(argnum=0, tensor_list=0)(autoray.numpy.stack)

We can also use the ``multi_dispatch`` decorator to dispatch
arguments of more more elaborate custom functions. Here is an example
of a ``custom_function`` that
computes :math:`c \\sum_i (v_i)^T v_i`, where :math:`v_i` are vectors in ``values`` and
:math:`c` is a fixed ``coefficient``. Note how ``argnum=0`` only points to the first argument ``values``,
how ``tensor_list=0`` indicates that said first argument is a list of vectors, and that ``coefficient`` is not
dispatched.

>>> @math.multi_dispatch(argnum=0, tensor_list=0)
>>> def custom_function(values, like, coefficient=10):
>>>     # values is a list of vectors
>>>     # like can force the interface (optional)
>>>     if like == "tensorflow":
>>>         # add interface-specific handling if necessary
>>>     return coefficient * np.sum([math.dot(v,v) for v in values])

We can then run

>>> values = [np.array([1, 2, 3]) for _ in range(5)]
>>> custom_function(values)
700

## `kron`

```python
def kron(*args, like=None, **kwargs)
```

The kronecker/tensor product of args.

## `block_diag`

```python
def block_diag(values, like=None)
```

Combine a sequence of 2D tensors to form a block diagonal tensor.

Args:
    values (Sequence[tensor_like]): Sequence of 2D arrays/tensors to form
        the block diagonal tensor.

Returns:
    tensor_like: the block diagonal tensor

**Example**

>>> t = [
...     np.array([[1, 2], [3, 4]]),
...     torch.tensor([[1, 2, 3], [-1, -6, -3]]),
...     torch.tensor([[5]])
... ]
>>> qp.math.block_diag(t)
tensor([[ 1,  2,  0,  0,  0,  0],
        [ 3,  4,  0,  0,  0,  0],
        [ 0,  0,  1,  2,  3,  0],
        [ 0,  0, -1, -6, -3,  0],
        [ 0,  0,  0,  0,  0,  5]])

## `concatenate`

```python
def concatenate(values, axis=0, like=None)
```

Concatenate a sequence of tensors along the specified axis.

.. warning::

    Tensors that are incompatible (such as Torch and TensorFlow tensors)
    cannot both be present.

Args:
    values (Sequence[tensor_like]): Sequence of tensor-like objects to
        concatenate. The objects must have the same shape, except in the dimension corresponding
        to axis (the first, by default).
    axis (int): The axis along which the input tensors are concatenated. If axis is None,
        tensors are flattened before use. Default is 0.

Returns:
    tensor_like: The concatenated tensor.

**Example**

>>> x = tf.constant([0.6, 0.1, 0.6])
>>> y = tf.Variable([0.1, 0.2, 0.3])
>>> z = np.array([5., 8., 101.])
>>> concatenate([x, y, z])
<tf.Tensor: shape=(9,), dtype=float32, numpy=
array([6.00e-01, 1.00e-01, 6.00e-01, 1.00e-01, 2.00e-01, 3.00e-01,
       5.00e+00, 8.00e+00, 1.01e+02], dtype=float32)>

## `diag`

```python
def diag(values, k=0, like=None)
```

Construct a diagonal tensor from a list of scalars.

Args:
    values (tensor_like or Sequence[scalar]): sequence of numeric values that
        make up the diagonal
    k (int): The diagonal in question. ``k=0`` corresponds to the main diagonal.
        Use ``k>0`` for diagonals above the main diagonal, and ``k<0`` for
        diagonals below the main diagonal.

Returns:
    tensor_like: the 2D diagonal tensor

**Example**

>>> x = [1., 2., tf.Variable(3.)]
>>> qp.math.diag(x)
<tf.Tensor: shape=(3, 3), dtype=float32, numpy=
array([[1., 0., 0.],
       [0., 2., 0.],
       [0., 0., 3.]], dtype=float32)>
>>> y = tf.Variable([0.65, 0.2, 0.1])
>>> qp.math.diag(y, k=-1)
<tf.Tensor: shape=(4, 4), dtype=float32, numpy=
array([[0.  , 0.  , 0.  , 0.  ],
       [0.65, 0.  , 0.  , 0.  ],
       [0.  , 0.2 , 0.  , 0.  ],
       [0.  , 0.  , 0.1 , 0.  ]], dtype=float32)>
>>> z = torch.tensor([0.1, 0.2])
>>> qp.math.diag(z, k=1)
tensor([[0.0000, 0.1000, 0.0000],
        [0.0000, 0.0000, 0.2000],
        [0.0000, 0.0000, 0.0000]])

## `matmul`

```python
def matmul(tensor1, tensor2, like=None)
```

Returns the matrix product of two tensors.

## `dot`

```python
def dot(tensor1, tensor2, like=None)
```

Returns the matrix or dot product of two tensors.

* If either tensor is 0-dimensional, elementwise multiplication
  is performed and a 0-dimensional scalar or a tensor with the
  same dimensions as the other tensor is returned.

* If both tensors are 1-dimensional, the dot product is returned.

* If the first array is 2-dimensional and the second array 1-dimensional,
  the matrix-vector product is returned.

* If both tensors are 2-dimensional, the matrix product is returned.

* Finally, if the first array is N-dimensional and the second array
  M-dimensional, a sum product over the last dimension of the first array,
  and the second-to-last dimension of the second array is returned.

Args:
    tensor1 (tensor_like): input tensor
    tensor2 (tensor_like): input tensor

Returns:
    tensor_like: the matrix or dot product of two tensors

## `tensordot`

```python
def tensordot(tensor1, tensor2, axes=None, like=None)
```

Returns the tensor product of two tensors.
In general ``axes`` specifies either the set of axes for both
tensors that are contracted (with the first/second entry of ``axes``
giving all axis indices for the first/second tensor) or --- if it is
an integer --- the number of last/first axes of the first/second
tensor to contract over.
There are some non-obvious special cases:

* If both tensors are 0-dimensional, ``axes`` must be 0.
  and a 0-dimensional scalar is returned containing the simple product.

* If both tensors are 1-dimensional and ``axes=0``, the outer product
  is returned.

* Products between a non-0-dimensional and a 0-dimensional tensor are not
  supported in all interfaces.

Args:
    tensor1 (tensor_like): input tensor
    tensor2 (tensor_like): input tensor
    axes (int or list[list[int]]): Axes to contract over, see detail description.

Returns:
    tensor_like: the tensor product of the two input tensors

## `get_trainable_indices`

```python
def get_trainable_indices(values, like=None)
```

Returns a set containing the trainable indices of a sequence of
values.

Args:
    values (Iterable[tensor_like]): Sequence of tensor-like objects to inspect

Returns:
    set[int]: Set containing the indices of the trainable tensor-like objects
    within the input sequence.

**Example**

>>> from pennylane import numpy as np
>>> def cost_fn(params):
...     print("Trainable:", qp.math.get_trainable_indices(params))
...     return np.sum(np.sin(params[0] * params[1]))
>>> values = [np.array([0.1, 0.2], requires_grad=True),
... np.array([0.5, 0.2], requires_grad=False)]
>>> cost_fn(values)
Trainable: {0}
tensor(0.0899685, requires_grad=True)

## `ones_like`

```python
def ones_like(tensor, dtype=None)
```

Returns a tensor of all ones with the same shape and dtype
as the input tensor.

Args:
    tensor (tensor_like): input tensor
    dtype (str, np.dtype, None): The desired output datatype of the array. If not provided, the dtype of
        ``tensor`` is used. This argument can be any supported NumPy dtype representation, including
        a string (``"float64"``), a ``np.dtype`` object (``np.dtype("float64")``), or
        a dtype class (``np.float64``). If ``tensor`` is not a NumPy array, the
        **equivalent** dtype in the dispatched framework is used.

Returns:
    tensor_like: an all-ones tensor with the same shape and
    size as ``tensor``

**Example**

>>> x = torch.tensor([1., 2.])
>>> ones_like(x)
tensor([1., 1.])
>>> y = tf.Variable([[0], [5]])
>>> ones_like(y, dtype=np.complex128)
<tf.Tensor: shape=(2, 1), dtype=complex128, numpy=
array([[1.+0.j],
       [1.+0.j]])>

## `stack`

```python
def stack(values, axis=0, like=None)
```

Stack a sequence of tensors along the specified axis.

.. warning::

    Tensors that are incompatible (such as Torch and TensorFlow tensors)
    cannot both be present.

Args:
    values (Sequence[tensor_like]): Sequence of tensor-like objects to
        stack. Each object in the sequence must have the same size in the given axis.
    axis (int): The axis along which the input tensors are stacked. ``axis=0`` corresponds
        to vertical stacking.

Returns:
    tensor_like: The stacked array. The stacked array will have one additional dimension
    compared to the unstacked tensors.

**Example**

>>> x = tf.constant([0.6, 0.1, 0.6])
>>> y = tf.Variable([0.1, 0.2, 0.3])
>>> z = np.array([5., 8., 101.])
>>> stack([x, y, z])
<tf.Tensor: shape=(3, 3), dtype=float32, numpy=
array([[6.00e-01, 1.00e-01, 6.00e-01],
       [1.00e-01, 2.00e-01, 3.00e-01],
       [5.00e+00, 8.00e+00, 1.01e+02]], dtype=float32)>

## `einsum`

```python
def einsum(indices, *operands, like=None, optimize=None)
```

Evaluates the Einstein summation convention on the operands.

Args:
    indices (str): Specifies the subscripts for summation as comma separated list of
        subscript labels. An implicit (classical Einstein summation) calculation is
        performed unless the explicit indicator ‘->’ is included as well as subscript
        labels of the precise output form.
    *operands (tuple[tensor_like]): The tensors for the operation.

Returns:
    tensor_like: The calculation based on the Einstein summation convention.

**Examples**

>>> a = np.arange(25).reshape(5,5)
>>> b = np.arange(5)
>>> c = np.arange(6).reshape(2,3)

Trace of a matrix:

>>> qp.math.einsum('ii', a)
60

Extract the diagonal (requires explicit form):

>>> qp.math.einsum('ii->i', a)
array([ 0,  6, 12, 18, 24])

Sum over an axis (requires explicit form):

>>> qp.math.einsum('ij->i', a)
array([ 10,  35,  60,  85, 110])

Compute a matrix transpose, or reorder any number of axes:

>>> np.einsum('ij->ji', c)
array([[0, 3],
       [1, 4],
       [2, 5]])

Matrix vector multiplication:

>>> np.einsum('ij,j', a, b)
array([ 30,  80, 130, 180, 230])

## `where`

```python
def where(condition, x=None, y=None)
```

Returns elements chosen from x or y depending on a boolean tensor condition,
or the indices of entries satisfying the condition.

The input tensors ``condition``, ``x``, and ``y`` must all be broadcastable to the same shape.

Args:
    condition (tensor_like[bool]): A boolean tensor. Where ``True`` , elements from
        ``x`` will be chosen, otherwise ``y``. If ``x`` and ``y`` are ``None`` the
        indices where ``condition==True`` holds will be returned.
    x (tensor_like): values from which to choose if the condition evaluates to ``True``
    y (tensor_like): values from which to choose if the condition evaluates to ``False``

Returns:
    tensor_like or tuple[tensor_like]: If ``x is None`` and ``y is None``, a tensor
    or tuple of tensors with the indices where ``condition`` is ``True`` .
    Else, a tensor with elements from ``x`` where the ``condition`` is ``True``,
    and ``y`` otherwise. In this case, the output tensor has the same shape as
    the input tensors.

**Example with three arguments**

>>> a = torch.tensor([0.6, 0.23, 0.7, 1.5, 1.7], requires_grad=True)
>>> b = torch.tensor([-1., -2., -3., -4., -5.], requires_grad=True)
>>> math.where(a < 1, a, b)
tensor([ 0.6000,  0.2300,  0.7000, -4.0000, -5.0000], grad_fn=<SWhereBackward>)

.. warning::

    The output format for ``x=None`` and ``y=None`` follows the respective
    interface and differs between TensorFlow and all other interfaces:
    For TensorFlow, the output is a tensor with shape
    ``(len(condition.shape), num_true)`` where ``num_true`` is the number
    of entries in ``condition`` that are ``True`` .
    For all other interfaces, the output is a tuple of tensor-like objects,
    with the ``j``\ th object indicating the ``j``\ th entries of all indices.
    Also see the examples below.

**Example with single argument**

For Torch, Autograd, JAX and NumPy, the output formatting is as follows:

>>> a = [[0.6, 0.23, 1.7],[1.5, 0.7, -0.2]]
>>> math.where(torch.tensor(a) < 1)
(tensor([0, 0, 1, 1]), tensor([0, 1, 1, 2]))

This is not a single tensor-like object but corresponds to the shape
``(2, 4)`` . For TensorFlow, on the other hand:

>>> math.where(tf.constant(a) < 1)
<tf.Tensor: shape=(2, 4), dtype=int64, numpy=
array([[0, 0, 1, 1],
       [0, 1, 1, 2]])>

Note that the number of dimensions of the output does *not* depend on the input
shape, it is always two-dimensional.

## `frobenius_inner_product`

```python
def frobenius_inner_product(A, B, normalize=False, like=None)
```

Frobenius inner product between two matrices.

.. math::

    \langle A, B \rangle_F = \sum_{i,j=1}^n A_{ij} B_{ij} = \operatorname{tr} (A^T B)

The Frobenius inner product is equivalent to the Hilbert-Schmidt inner product for
matrices with real-valued entries.

Args:
    A (tensor_like[float]): First matrix, assumed to be a square array.
    B (tensor_like[float]): Second matrix, assumed to be a square array.
    normalize (bool): If True, divide the inner product by the Frobenius norms of A and B.

Returns:
    float: Frobenius inner product of A and B

**Example**

>>> A = np.random.random((3,3))
>>> B = np.random.random((3,3))
>>> qp.math.frobenius_inner_product(A, B)
3.091948202943376

## `scatter`

```python
def scatter(indices, array, new_dims, like=None)
```

Scatters an array into a tensor of shape new_dims according to indices.

This operation is similar to scatter_element_add, except that the tensor
is zero-initialized. Calling scatter(indices, array, new_dims) is identical
to calling scatter_element_add(np.zeros(new_dims), indices, array)

Args:
    indices (tensor_like[int]): Indices to update
    array (tensor_like[float]): Values to assign to the new tensor
    new_dims (int or tuple[int]): The shape of the new tensor
    like (str): Manually chosen interface to dispatch to.
Returns:
    tensor_like[float]: The tensor with the values modified the given indices.

**Example**

>>> indices = np.array([4, 3, 1, 7])
>>> updates = np.array([9, 10, 11, 12])
>>> shape = 8
>>> qp.math.scatter(indices, updates, shape)
array([ 0, 11,  0, 10,  9,  0,  0, 12])

## `scatter_element_add`

```python
def scatter_element_add(tensor, index, value, like=None, *, indices_are_sorted=False, unique_indices=False)
```

In-place addition of a multidimensional value over various
indices of a tensor.

Args:
    tensor (tensor_like[float]): Tensor to add the value to
    index (tuple or list[tuple]): Indices to which to add the value
    value (float or tensor_like[float]): Value to add to ``tensor``
    like (str): Manually chosen interface to dispatch to.

Keyword Args:
    indices_are_sorted=False (bool): If ``True``, jax will assume that the indices are in
        ascending order. Required to be ``True`` with catalyst.
    unique_indices=False (bool): If ``True``, jax will assume each index is unique.
        Required to be ``True`` with catalyst.

Returns:
    tensor_like[float]: The tensor with the value added at the given indices.

**Example**

>>> tensor = torch.tensor([[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]])
>>> index = (1, 2)
>>> value = -3.1
>>> qp.math.scatter_element_add(tensor, index, value)
tensor([[ 0.1000,  0.2000,  0.3000],
        [ 0.4000,  0.5000, -2.5000]])

If multiple indices are given, in the form of a list of tuples, the
``k`` th tuple is interpreted to contain the ``k`` th entry of all indices:

>>> indices = [(1, 0), (2, 1)] # This will modify the entries (1, 2) and (0, 1)
>>> values = torch.tensor([10, 20])
>>> qp.math.scatter_element_add(tensor, indices, values)
tensor([[ 0.1000, 20.2000,  0.3000],
        [ 0.4000,  0.5000, 10.6000]])

## `unwrap`

```python
def unwrap(values, max_depth=None)
```

Unwrap a sequence of objects to NumPy arrays.

Note that tensors on GPUs will automatically be copied
to the CPU.

Args:
    values (Sequence[tensor_like]): sequence of tensor-like objects to unwrap
    max_depth (int): Positive integer indicating the depth of unwrapping to perform
        for nested tensor-objects. This argument only applies when unwrapping
        Autograd ``ArrayBox`` objects.

**Example**

>>> values = [np.array([0.1, 0.2]), torch.tensor(0.1, dtype=torch.float64), torch.tensor([0.5, 0.2])]
>>> math.unwrap(values)
[array([0.1, 0.2]), 0.1, array([0.5, 0.2], dtype=float32)]

This function will continue to work during backpropagation:

>>> def cost_fn(params):
...     unwrapped_params = math.unwrap(params)
...     print("Unwrapped:", [(i, type(i)) for i in unwrapped_params])
...     return np.sum(np.sin(params))
>>> params = np.array([0.1, 0.2, 0.3])
>>> grad = autograd.grad(cost_fn)(params)
Unwrapped: [(0.1, <class 'numpy.float64'>), (0.2, <class 'numpy.float64'>), (0.3, <class 'numpy.float64'>)]
>>> print(grad)
[0.99500417 0.98006658 0.95533649]

## `add`

```python
def add(*args, like=None, **kwargs)
```

Add arguments element-wise.

## `iscomplex`

```python
def iscomplex(tensor, like=None)
```

Return True if the tensor has a non-zero complex component.

## `expm`

```python
def expm(tensor, like=None)
```

Compute the matrix exponential of an array :math:`e^{X}`.

..note::
    This function is not differentiable with Autograd, as it
    relies on the scipy implementation.

## `norm`

```python
def norm(tensor, like=None, **kwargs)
```

Compute the norm of a tensor in each interface.

## `svd`

```python
def svd(tensor, like=None, **kwargs)
```

Compute the singular value decomposition of a tensor in each interface.

The singular value decomposition for a matrix :math:`A` consist of three matrices :math:`S`,
:math:`U` and :math:`V_h`, such that:

.. math::

    A = U \cdot Diag(S) \cdot V_h

Args:
    tensor (tensor_like): input tensor
    compute_uv (bool):  if ``True``, the full decomposition is returned


Returns:
    :math:`S`, :math:`U` and :math:`V_h` or :math:`S`: full decomposition
    if ``compute_uv`` is ``True`` or ``None``, or only the singular values
    if ``compute_uv`` is ``False``

## `gammainc`

```python
def gammainc(m, t, like=None)
```

Return the lower incomplete Gamma function.

The lower incomplete Gamma function is defined in scipy as

.. math::

    \gamma(m, t) = \frac{1}{\Gamma(m)} \int_{0}^{t} x^{m-1} e^{-x} dx,

where :math:`\Gamma` denotes the Gamma function.

 Args:
    m (float): exponent of the incomplete Gamma function
    t (array[float]): upper limit of the incomplete Gamma function

Returns:
    (array[float]): value of the incomplete Gamma function

## `detach`

```python
def detach(tensor, like=None)
```

Detach a tensor from its trace and return just its numerical values.

Args:
    tensor (tensor_like): Tensor to detach
    like (str): Manually chosen interface to dispatch to.

Returns:
    tensor_like: A tensor in the same interface as the input tensor but
    with a stopped gradient.

## `set_index`

```python
def set_index(array, idx, val, like=None)
```

Set the value at a specified index in an array.
Calls ``array[idx]=val`` and returns the updated array unless JAX or Tensorflow.

Args:
    array (tensor_like): array to be modified
    idx (int, tuple): index to modify
    val (int, float): value to set

Returns:
    a new copy of the array with the specified index updated to ``val``.

Whether the original array is modified is interface-dependent.
