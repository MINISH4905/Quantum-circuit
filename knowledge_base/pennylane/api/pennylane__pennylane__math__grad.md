---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/math/grad.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/math/grad.py
license: Apache-2.0
---

## Module `pennylane/math/grad.py`

This submodule defines grad and jacobian for differentiating circuits in an interface-independent way.

## `grad`

```python
def grad(f: Callable, argnums: Sequence[int] | int=0) -> Callable
```

Compute the gradient in a jax-like manner for any interface.

Args:
    f (Callable): a function with a single 0-D scalar output
    argnums (Sequence[int] | int ) = 0 : which arguments to differentiate

Returns:
    Callable: a function with the same signature as ``f`` that returns the gradient.

.. seealso:: :func:`pennylane.math.jacobian`

Note that this function follows the same design as jax. By default, the function will return the gradient
of the first argument, whether or not other arguments are trainable.

>>> import jax, torch, tensorflow as tf
>>> def f(x, y):
...     return  x * y
>>> qp.math.grad(f)(qp.numpy.array(2.0), qp.numpy.array(3.0))
tensor(3., requires_grad=True)
>>> qp.math.grad(f)(jax.numpy.array(2.0), jax.numpy.array(3.0))
Array(3., dtype=float32, weak_type=True)
>>> qp.math.grad(f)(torch.tensor(2.0, requires_grad=True), torch.tensor(3.0, requires_grad=True))
tensor(3.)
>>> qp.math.grad(f)(tf.Variable(2.0), tf.Variable(3.0))
<tf.Tensor: shape=(), dtype=float32, numpy=3.0>

``argnums`` can be provided to differentiate multiple arguments.

>>> qp.math.grad(f, argnums=(0,1))(torch.tensor(2.0, requires_grad=True), torch.tensor(3.0, requires_grad=True))
(tensor(3.), tensor(2.))

Note that the selected arguments *must* be of an appropriately trainable datatype, or an error may occur.

>>> qp.math.grad(f)(torch.tensor(1.0), torch.tensor(2.))
RuntimeError: element 0 of tensors does not require grad and does not have a grad_fn

## `jacobian`

```python
def jacobian(f: Callable, argnums: Sequence[int] | int=0) -> Callable
```

Compute the Jacobian in a jax-like manner for any interface.

Args:
    f (Callable): a function with a vector valued output
    argnums (Sequence[int] | int ) = 0 : which arguments to differentiate

Returns:
    Callable: a function with the same signature as ``f`` that returns the jacobian

.. seealso:: :func:`pennylane.math.grad`

Note that this function follows the same design as jax. By default, the function will return the gradient
of the first argument, whether or not other arguments are trainable.

>>> import jax, torch, tensorflow as tf
>>> def f(x, y):
...     return  x * y
>>> qp.math.jacobian(f)(qp.numpy.array([2.0, 3.0]), qp.numpy.array(3.0))
array([[3., 0.],
          [0., 3.]])
>>> qp.math.jacobian(f)(jax.numpy.array([2.0, 3.0]), jax.numpy.array(3.0))
Array([[3., 0.],
           [0., 3.]], dtype=float32)
>>> x_torch = torch.tensor([2.0, 3.0], requires_grad=True)
>>> y_torch = torch.tensor(3.0, requires_grad=True)
>>> qp.math.jacobian(f)(x_torch, y_torch)
tensor([[3., 0.],
            [0., 3.]])
>>> qp.math.jacobian(f)(tf.Variable([2.0, 3.0]), tf.Variable(3.0))
<tf.Tensor: shape=(2, 2), dtype=float32, numpy=
array([[3., 0.],
          [0., 3.]], dtype=float32)>

``argnums`` can be provided to differentiate multiple arguments.

>>> qp.math.jacobian(f, argnums=(0,1))(x_torch, y_torch)
(tensor([[3., 0.],
        [0., 3.]]),
tensor([2., 3.]))

While jax can handle taking jacobians of outputs with any pytree shape:

>>> def pytree_f(x):
...     return {"a": 2*x, "b": 3*x}
>>> qp.math.jacobian(pytree_f)(jax.numpy.array(2.0))
{'a': Array(2., dtype=float32, weak_type=True),
'b': Array(3., dtype=float32, weak_type=True)}

Torch can only differentiate arrays and tuples:

>>> def tuple_f(x):
...     return x**2, x**3
>>> qp.math.jacobian(tuple_f)(torch.tensor(2.0))
(tensor(4.), tensor(12.))
>>> qp.math.jacobian(pytree_f)(torch.tensor(2.0))
TypeError: The outputs of the user-provided function given to jacobian must be
either a Tensor or a tuple of Tensors but the given outputs of the user-provided
function has type <class 'dict'>.


But tensorflow and autograd can only handle array-valued outputs:

>>> qp.math.jacobian(tuple_f)(qp.numpy.array(2.0))
ValueError: autograd can only differentiate with respect to arrays, not <class 'tuple'>
>>> qp.math.jacobian(tuple_f)(tf.Variable(2.0))
ValueError: qp.math.jacobian does not work with tensorflow and non-tensor outputs.
Got (<tf.Tensor: shape=(), dtype=float32, numpy=4.0>,
<tf.Tensor: shape=(), dtype=float32, numpy=8.0>) of type <class 'tuple'>.
