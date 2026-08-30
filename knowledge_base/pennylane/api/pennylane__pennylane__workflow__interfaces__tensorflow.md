---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/workflow/interfaces/tensorflow.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/interfaces/tensorflow.py
license: Apache-2.0
---

## Module `pennylane/workflow/interfaces/tensorflow.py`

This module contains functions for adding the TensorFlow interface
to a PennyLane Device class.

**How to bind a custom derivative with TensorFlow.**

To bind a custom derivative with tensorflow, you:

1. Decorate the function with ``tf.custom_gradient``
2. Alter the return to include a function that computes the VJP.

.. code-block:: python

    @tf.custom_gradient
    def f(x):
        print("forward pass")
        y = x**2

        def vjp(*dy):
            print("In the VJP function with: ", dy)
            print("eager? ", tf.executing_eagerly())
            return dy[0] * 2 * x
        return y, vjp

>>> x = tf.Variable(0.1)
>>> with tf.GradientTape(persistent=True) as tape:
...         y = f(x)
forward pass
>>> tape.gradient(y, x)
In the VJP function with:  (<tf.Tensor: shape=(), dtype=float32, numpy=1.0>,)
eager?  True
<tf.Tensor: shape=(), dtype=float32, numpy=0.2>
>>> tape.jacobian(y, x)
In the VJP function with:  (<tf.Tensor 'gradient_tape/Reshape:0' shape=() dtype=float32>,)
eager?  False
<tf.Tensor: shape=(), dtype=float32, numpy=0.2>
>>> tape.jacobian(y, x, experimental_use_pfor=False)
In the VJP function with:  (<tf.Tensor: shape=(), dtype=float32, numpy=1.0>,)
eager?  True
<tf.Tensor: shape=(), dtype=float32, numpy=0.2>

You will note in this example that the we printed out whether or not tensorflow was
in eager mode execution inside the VJP function or not. Whether or not eager mode
is enabled will effect what we can and cannot do inside the VJP function. Non-eager mode
(tracing mode) is enabled when we are taking a jacobian and not explicitly setting
``experimental_use_pfor=False``.

For example, when eager mode is disabled, we cannot cast the relevant parameters to numpy.
To circumvent this, we convert the parameters to numpy outside the VJP function, and then
use those numbers instead.

Due to the fact that the ``dy`` must be converted to numpy
for it to be used with a device-provided VJP, we are restricting the use of device VJP's to
when the VJP calculation is strictly eager. If someone wishes to calculate a full Jacobian
with ``device_vjp=True``, they must set ``experimental_use_pfor=False``.

Alternatively, we could have calculated the VJP inside a ``tf.py_function`` or ``tf.numpy_function``.
Unfortunately, we then get an extra call to the vjp function.

.. code-block:: python

    @tf.custom_gradient
    def f(x):
        y = x**2

        @tf.py_function(Tout=x.dtype)
        def vjp(*dy):
            print("In the VJP function with: ", dy)
            print("eager? ", tf.executing_eagerly())
            return dy[0] * 2 * x

        return y, vjp

>>> x = tf.Variable(0.1)
>>> with tf.GradientTape(persistent=True) as tape:
...         y = f(x)
>>> tape.jacobian(y, x)
In the VJP function with:  (<tf.Tensor: shape=(), dtype=float32, numpy=1.0>,)
eager?  True
In the VJP function with:  (<tf.Tensor: shape=(), dtype=float32, numpy=1.0>,)
eager?  True
<tf.Tensor: shape=(), dtype=float32, numpy=0.2>

As you can see, we got 2 calls to ``vjp`` instead of 1, and the calls have identical ``dy``. We do not want
to have to perform this extra call.

## `set_parameters_on_copy`

```python
def set_parameters_on_copy(tapes, params)
```

Copy a set of tapes with operations and set parameters

## `tf_execute`

```python
def tf_execute(tapes, execute_fn, jpc, device=None, differentiable=False)
```

Execute a batch of tapes with TensorFlow parameters on a device.

Args:
    tapes (Sequence[.QuantumTape]): batch of tapes to execute
    execute_fn (Callable[[Sequence[.QuantumTape]], ResultBatch]): a function that turns a batch of circuits into results
    jpc (JacobianProductCalculator): a class that can compute the vector Jacobian product (VJP)
        for the input tapes.

Keyword Args:
    device=None: not used for tensorflow
    differentiable=False: whether or not the custom gradient vjp needs to be
        differentiable. Note that this keyword argument is unique to tensorflow.

Returns:
    TensorLike: A nested tuple of tape results. Each element in
    the returned tuple corresponds in order to the provided tapes.
