---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/workflow/interfaces/jax.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/interfaces/jax.py
license: Apache-2.0
---

## Module `pennylane/workflow/interfaces/jax.py`

This module contains functions for binding JVP's or VJP's to the JAX interface.

See JAX documentation on this process `here <https://jax.readthedocs.io/en/latest/notebooks/Custom_derivative_rules_for_Python_code.html>`_ .

**Basic examples:**

.. code-block:: python

    jax.config.update("jax_enable_x64", True)

    def f(x):
        return x**2

    def f_and_jvp(primals, tangents):
        x = primals[0]
        dx = tangents[0]
        print("in custom jvp function: ", x, dx)
        return x**2, 2*x*dx

    registered_f_jvp = jax.custom_jvp(f)

    registered_f_jvp.defjvp(f_and_jvp)

>>> jax.grad(registered_f_jvp)(jax.numpy.array(2.0))
in custom jvp function:  2.0 Traced<~float64[]:JaxprTrace>
Array(4., dtype=float64, weak_type=True)


We can do something similar for the VJP as well:

.. code-block:: python

    jax.config.update("jax_enable_x64", True)

    def f_fwd(x):
        print("in forward pass: ", x)
        return f(x), x

    def f_bwd(residual, dy):
        print("in backward pass: ", residual, dy)
        return (dy*2*residual,)

    registered_f_vjp = jax.custom_vjp(f)
    registered_f_vjp.defvjp(f_fwd, f_bwd)

>>> jax.grad(registered_f_vjp)(jax.numpy.array(2.0))
in forward pass:  2.0
in backward pass:  2.0 1.0
Array(4., dtype=float64, weak_type=True)

**JVP versus VJP:**

When JAX can trace the product between the Jacobian and the cotangents, it can turn the JVP calculation into a VJP calculation. Through this
process, JAX can support both JVP and VJP calculations by registering only the JVP.

Unfortunately, :meth:`~pennylane.devices.Device.compute_jvp` uses pure numpy to perform the Jacobian product and cannot
be traced by JAX.

For example, if we replace the definition of ``f_and_jvp`` from above with one that breaks tracing,

.. code-block:: python

    jax.config.update("jax_enable_x64", True)

    def bad_f_and_jvp(primals, tangents):
        x = primals[0]
        dx = qp.math.unwrap(tangents[0]) # This line breaks tracing
        return x**2, 2*x*dx

>>> bad_f = jax.custom_jvp(f)
>>> bad_f.defjvp(bad_f_and_jvp)
<function bad_f_and_jvp at 0x...>
>>> jax.grad(bad_f)(jax.numpy.array(2.0))
Traceback (most recent call last):
    ...
ValueError: Converting a JAX array to a NumPy array not supported when using the JAX JIT.
...

Note that the comment about ``JIT`` is generally a comment about not being able to trace code.

But if we used the VJP instead:

.. code-block:: python

    def f_bwd(residual, dy):
        dy = qp.math.unwrap(dy)
        return (dy*2*residual,)

We would be able to calculate the gradient without error.

Since the VJP calculation offers access to ``jax.grad`` and ``jax.jacobian``, we register the VJP when we have to choose
between either the VJP or the JVP.

**Pytrees and Non-diff argnums:**

The trainable arguments for the registered functions can be any valid pytree.

.. code-block:: python

    jax.config.update("jax_enable_x64", True)

    def f(x):
        return x['a']**2

    def f_and_jvp(primals, tangents):
        x = primals[0]
        dx = tangents[0]
        print("in custom jvp function: ", x, dx)
        return x['a']**2, 2*x['a']*dx['a']

    registered_f_jvp = jax.custom_jvp(f)

    registered_f_jvp.defjvp(f_and_jvp)

>>> jax.grad(registered_f_jvp)({'a': jax.numpy.array(2.0)})
in custom jvp function:  {'a': Array(2., dtype=float64, weak_type=True)} {'a': Traced<~float64[]:JaxprTrace>}
{'a': Array(4., dtype=float64, weak_type=True)}

As we can see here, the tangents are packed into the same pytree structure as the trainable arguments.

Currently, :class:`~.QuantumScript` is a valid pytree *most* of the time. Once it is a valid pytree *all* of the
time and can store tangents in place of the variables, we can use a batch of tapes as our trainable argument. Until then, the tapes
must be a non-pytree non-differentiable argument that accompanies the tree leaves.

## `set_parameters_on_copy_and_unwrap`

```python
def set_parameters_on_copy_and_unwrap(tapes, params, unwrap=True)
```

Copy a set of tapes with operations and set parameters

## `jax_jvp_execute`

```python
def jax_jvp_execute(tapes: QuantumScriptBatch, execute_fn: ExecuteFn, jpc, device=None)
```

Execute a batch of tapes with JAX parameters using JVP derivatives.

Args:
    tapes (Sequence[.QuantumTape]): batch of tapes to execute
    execute_fn (Callable[[Sequence[.QuantumTape]], ResultBatch]): a function that turns a batch of circuits into results
    jpc (JacobianProductCalculator): a class that can compute the Jacobian vector product (JVP)
        for the input tapes.

Returns:
    TensorLike: A nested tuple of tape results. Each element in
    the returned tuple corresponds in order to the provided tapes.
