---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/control_flow/while_loop.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/control_flow/while_loop.py
license: Apache-2.0
---

## Module `pennylane/control_flow/while_loop.py`

While loop.

## `while_loop`

```python
def while_loop(cond_fn, allow_array_resizing: Literal['auto', True, False]='auto')
```

A :func:`~.qjit` compatible while-loop for PennyLane programs. When
used without :func:`~.qjit` or program capture, this function will fall back to a standard
Python while loop.

This decorator provides a functional version of the traditional while loop,
similar to `jax.lax.while_loop <https://jax.readthedocs.io/en/latest/_autosummary/jax.lax.while_loop.html>`__.
That is, any variables that are modified across iterations need to be provided as
inputs and outputs to the loop body function:

- Input arguments contain the value of a variable at the start of an
  iteration

- Output arguments contain the value at the end of the iteration. The
  outputs are then fed back as inputs to the next iteration.

The final iteration values are also returned from the transformed function.

The semantics of ``while_loop`` are given by the following Python pseudocode:

.. code-block:: python

    def while_loop(cond_fn, body_fn, *args):
        while cond_fn(*args):
            args = body_fn(*args)
        return args

Args:
    cond_fn (Callable): the condition function in the while loop
    allow_array_resizing (Literal["auto", True, False]): How to handle arrays
        with dynamic shapes that change between iterations. Defaults to `"auto"`.

Returns:
    Callable: A wrapper around the while-loop function.

Raises:
    CompileError: if the compiler is not installed

.. seealso:: :func:`~.for_loop`, :func:`~.qjit`

**Example**

.. code-block:: python

    dev = qp.device("lightning.qubit", wires=1)

    @qp.qnode(dev)
    def circuit(x: float):

        @qp.while_loop(lambda x: x < 2.0)
        def loop_rx(x):
            # perform some work and update (some of) the arguments
            qp.RX(x, wires=0)
            return x ** 2

        # apply the while loop
        loop_rx(x)

        return qp.expval(qp.Z(0))

>>> circuit(1.6)
-0.02919952

``while_loop`` is also :func:`~.qjit` compatible; when used with the
:func:`~.qjit` decorator, the while loop will not be unrolled, and instead
will be captured as-is during compilation and executed during runtime:

>>> qp.qjit(circuit)(1.6)
Array(-0.02919952, dtype=float64)

.. details::
    :title: Usage Details

    .. note::

        The following examples may yield different outputs depending on how the
        workflow function is executed. For instance, the function can be run
        directly as:

        >>> arg = 2
        >>> workflow(arg)

        Alternatively, the function can be traced with ``jax.make_jaxpr`` to produce a JAXPR representation,
        which captures the abstract computational graph for the given input and generates the abstract shapes.
        The resulting JAXPR can then be evaluated using ``qp.capture.eval_jaxpr``:

        >>> jaxpr = jax.make_jaxpr(workflow)(arg)
        >>> qp.capture.eval_jaxpr(jaxpr.jaxpr, jaxpr.consts, arg)

    A dynamically shaped array is an array whose shape depends on an abstract value. This is
    an experimental jax mode that can be turned on with:

    >>> import jax
    >>> import jax.numpy as jnp
    >>> jax.config.update("jax_dynamic_shapes", True)
    >>> qp.capture.enable()

    ``allow_array_resizing="auto"`` will try and choose between the following two possible modes.
    If the needed mode is ``allow_array_resizing=False``, then this will require re-capturing
    the loop, potentially taking more time.

    When working with dynamic shapes in a ``while_loop``, we have two possible
    options. ``allow_array_resizing=True`` treats every dynamic dimension as independent.

    .. code-block:: python

        @qp.while_loop(lambda a, b: jnp.sum(a) < 10, allow_array_resizing=True)
        def f(x, y):
            return jnp.hstack([x, y]), 2*y

        def workflow(i0):
            x0, y0 = jnp.ones(i0), jnp.ones(i0)
            return f(x0, y0)


    Even though ``x`` and ``y`` are initialized with the same shape, the shapes no longer match
    after one iteration. In this circumstance, ``x`` and ``y`` can no longer be combined
    with operations like ``x * y``, as they do not have matching shapes.

    With ``allow_array_resizing=False``, anything that starts with the same dynamic dimension
    must keep the same shape pattern throughout the loop.

    .. code-block:: python

        @qp.while_loop(lambda a, b: jnp.sum(a) < 10, allow_array_resizing=False)
        def f(x, y):
            return x * y, 2*y

        def workflow(i0):
            x0 = jnp.ones(i0)
            y0 = jnp.ones(i0)
            return f(x0, y0)


    Note that with ``allow_array_resizing=False``, all arrays can still be resized together, as
    long as the pattern still matches. For example, here both ``x`` and ``y`` start with the
    same shape, and keep the same shape as each other for each iteration.

    .. code-block:: python

        @qp.while_loop(lambda a, b: jnp.sum(a) < 10, allow_array_resizing=False)
        def f(x, y):
            x = jnp.hstack([x, y])
            return x, 2*x

        def workflow(i0):
            x0 = jnp.ones(i0)
            y0 = jnp.ones(i0)
            return f(x0, y0)

    Note that new dynamic dimensions cannot yet be created inside a loop.  Only things
    that already have a dynamic dimension can have that dynamic dimension change.
    For example, this is **not** a viable ``while_loop``, as ``x`` is initialized
    with an array with a concrete size.

    .. code-block:: python

        def w():
            @qp.while_loop(lambda i, x: i < 5)
            def f(i, x):
                return i + 1, jnp.append(x, i)

            return f(0, jnp.array([]))

## `WhileLoopCallable`

```python
class WhileLoopCallable
```

Base class to represent a while loop. This class
when called with an initial state will execute the while
loop via the Python interpreter.

Args:
     cond_fn (Callable): the condition function in the while loop
    body_fn (Callable): the function that is executed within the while loop
    allow_array_resizing (Literal["auto", True, False])
