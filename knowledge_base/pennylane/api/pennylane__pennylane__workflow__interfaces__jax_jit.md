---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/workflow/interfaces/jax_jit.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/interfaces/jax_jit.py
license: Apache-2.0
---

## Module `pennylane/workflow/interfaces/jax_jit.py`

This module contains functions for binding JVPs or VJPs to JAX when using JIT.

For information on registering VJPs and JVPs, please see the module documentation for ``jax.py``.

When using JAX-JIT, we cannot convert arrays to numpy or act on their concrete values without
using ``jax.pure_callback``.

For example:

>>> def f(x):
...     return qp.math.unwrap(x)
>>> x = jax.numpy.array(1.0)
>>> jax.jit(f)(x)
Traceback (most recent call last):
    ...
ValueError: Converting a JAX array to a NumPy array not supported when using the JAX JIT.
--------------------
For simplicity, JAX has removed its internal frames from the traceback of the following exception. Set JAX_TRACEBACK_FILTERING=off to include these.
>>> jax.config.update("jax_enable_x64", True)
>>> def g(x):
...     expected_output_shape = jax.ShapeDtypeStruct((), jax.numpy.float64)
...     return jax.pure_callback(f, expected_output_shape, x, vmap_method="sequential")
>>> x = jax.numpy.array(1.0)
>>> jax.jit(g)(x)
Array(1., dtype=float64)

Note that we must provide the expected output shape for the function to use pure callbacks.

## `jax_jit_jvp_execute`

```python
def jax_jit_jvp_execute(tapes, execute_fn, jpc, device)
```

Execute a batch of tapes with JAX parameters using JVP derivatives.

Args:
    tapes (Sequence[.QuantumTape]): batch of tapes to execute
    execute_fn (Callable[[Sequence[.QuantumTape]], ResultBatch]): a function that turns a batch of circuits into results
    jpc (JacobianProductCalculator): a class that can compute the Jacobian for the input tapes.
    device (pennylane.devices.Device): The device used for execution. Used to determine the shapes of outputs for
        pure callback calls.

Returns:
    TensorLike: A nested tuple of tape results. Each element in
    the returned tuple corresponds in order to the provided tapes.

## `jax_jit_vjp_execute`

```python
def jax_jit_vjp_execute(tapes, execute_fn, jpc, device=None)
```

Execute a batch of tapes with JAX parameters using VJP derivatives.

Args:
    tapes (Sequence[.QuantumTape]): batch of tapes to execute
    execute_fn (Callable[[Sequence[.QuantumTape]], ResultBatch]): a function that turns a batch of circuits into results
    jpc (JacobianProductCalculator): a class that can compute the vector Jacobian product (VJP)
        for the input tapes.
    device (pennylane.devices.Device): The device used for execution. Used to determine the shapes of outputs for
        pure callback calls.

Returns:
    TensorLike: A nested tuple of tape results. Each element in
    the returned tuple corresponds in order to the provided tapes.
