---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/control_flow/for_loop.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/control_flow/for_loop.py
license: Apache-2.0
---

## Module `pennylane/control_flow/for_loop.py`

For loop.

## `for_loop`

```python
def for_loop(start, stop=None, step=1, *, allow_array_resizing: Literal['auto', True, False]='auto')
```

for_loop([start, ]stop[, step])
A :func:`~.qjit` compatible for-loop for PennyLane programs. When
used without :func:`~.qjit`, this function will fall back to a standard
Python for loop.

This decorator provides a functional version of the traditional
for-loop, similar to `jax.cond.fori_loop <https://jax.readthedocs.io/en/latest/_autosummary/jax.lax.fori_loop.html>`__.
That is, any variables that are modified across iterations need to be provided
as inputs/outputs to the loop body function:

- Input arguments contain the value of a variable at the start of an
  iteration.

- output arguments contain the value at the end of the iteration. The
  outputs are then fed back as inputs to the next iteration.

The final iteration values are also returned from the transformed
function.

The semantics of ``for_loop`` are given by the following Python pseudo-code:

.. code-block:: python

    def for_loop(start, stop, step, loop_fn, *args):
        for i in range(start, stop, step):
            args = loop_fn(i, *args)
        return args

Unlike ``jax.cond.fori_loop``, the step can be negative if it is known at tracing time
(i.e., constant). If a non-constant negative step is used, the loop will produce no iterations.

.. note::

    This function can be used in the following different ways:

    1. ``for_loop(stop)``:  Values are generated within the interval ``[0, stop)``
    2. ``for_loop(start, stop)``: Values are generated within the interval ``[start, stop)``
    3. ``for_loop(start, stop, step)``: Values are generated within the interval ``[start, stop)``,
       with spacing between the values given by ``step``

Args:
    start (int, optional): starting value of the iteration index.
        The default start value is ``0``
    stop (int): upper bound of the iteration index
    step (int, optional): increment applied to the iteration index at the end of
        each iteration. The default step size is ``1``

Keyword Args:
    allow_array_resizing (Literal["auto", True, False]): How to handle arrays
        with dynamic shapes that change between iterations

Returns:
    Callable[[int, ...], ...]: A wrapper around the loop body function.
    Note that the loop body function must always have the iteration index as its first
    argument, which can be used arbitrarily inside the loop body. As the value of the index
    across iterations is handled automatically by the provided loop bounds, it must not be
    returned from the function.

.. seealso:: :func:`~.while_loop`, :func:`~.qjit`

**Example**

.. code-block:: python

    dev = qp.device("lightning.qubit", wires=1)

    @qp.qnode(dev)
    def circuit(n: int, x: float):

        @qp.for_loop(0, n, 1)
        def loop_rx(i, x):
            # perform some work and update (some of) the arguments
            qp.RX(x, wires=0)

            # update the value of x for the next iteration
            return jnp.sin(x)

        # apply the for loop
        final_x = loop_rx(x)

        return qp.expval(qp.Z(0))

>>> circuit(7, 1.6)
array(0.97926626)

``for_loop`` is also :func:`~.qjit` compatible; when used with the
:func:`~.qjit` decorator, the for loop will not be unrolled, and instead
will be captured as-is during compilation and executed during runtime:

>>> qp.qjit(circuit)(7, 1.6)
Array(0.97926626, dtype=float64)

.. note::

    Please see the Catalyst :doc:`quickstart guide <catalyst:dev/quick_start>`,
    as well as the :doc:`sharp bits and debugging tips <catalyst:dev/sharp_bits>`
    page for an overview of using quantum just-in-time compilation.

.. details::
    :title: Usage Details

    .. note::

        The following examples may yield different outputs depending on how the
        workflow function is executed. For instance, the function can be run
        directly as:

        >>> arg = 2
        >>> workflow(arg)

        Alternatively, the function can be traced with ``jax.make_jaxpr`` to produce a JAXPR representation,
        which captures the abstract computational graph and generates the abstract shapes.
        The resulting JAXPR can then be evaluated using ``qp.capture.eval_jaxpr``:

        >>> jaxpr = jax.make_jaxpr(workflow)(arg)
        >>> qp.capture.eval_jaxpr(jaxpr.jaxpr, jaxpr.consts, arg)

    The following discussion applies to the experimental capture infrastructure, which can be
    turned on with ``qp.qjit(capture=True)`` when using Catalyst.
    See the ``capture`` module for more information.

    A dynamically shaped array is an array whose shape depends on an abstract value. This is
    an experimental jax mode that can be turned on with:

    >>> import jax
    >>> import jax.numpy as jnp
    >>> jax.config.update("jax_dynamic_shapes", True)
    >>> qp.capture.enable()

    ``allow_array_resizing="auto"`` will try and choose between the following two possible modes.
    If the needed mode is ``allow_array_resizing=True``, then this will require re-capturing
    the loop, potentially taking more time.

    When working with dynamic shapes in a ``for_loop``, we have two possible
    options. ``allow_array_resizing=True`` treats every dynamic dimension as independent.

    .. code-block:: python

        @qp.for_loop(3, allow_array_resizing=True)
        def f(i, x, y):
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

        @qp.for_loop(3, allow_array_resizing=False)
        def f(i, x, y):
            return x * y, 2*y

        def workflow(i0):
            x0 = jnp.ones(i0)
            y0 = jnp.ones(i0)
            return f(x0, y0)


    Note that with ``allow_array_resizing=False``, all arrays can still be resized together, as
    long as the pattern still matches. For example, here both ``x`` and ``y`` start with the
    same shape, and keep the same shape as each other for each iteration.

    .. code-block:: python

        @qp.for_loop(3, allow_array_resizing=False)
        def f(i, x, y):
            x = jnp.hstack([x, y])
            return x, 2*x

        def workflow(i0):
            x0 = jnp.ones(i0)
            y0 = jnp.ones(i0)
            return f(x0, y0)

    Note that new dynamic dimensions cannot yet be created inside a loop.  Only things
    that already have a dynamic dimension can have that dynamic dimension change.
    For example, this is **not** a viable ``for_loop``, as ``x`` is initialized
    with an array with a concrete size. Note that while this example does not currently
    error out, similar code will likely cause XLA lowering errors.

    .. code-block:: python

        def w():
            @qp.for_loop(3)
            def f(i, x):
                return jax.numpy.append(x, i)

            return f(jnp.array([]))

## `ForLoopCallable`

```python
class ForLoopCallable
```

Base class to represent a for loop. This class
when called with an initial state will execute the while
loop via the Python interpreter.

Args:
    start (int): starting value of the iteration index
    stop (int): (exclusive) upper bound of the iteration index
    step (int): increment applied to the iteration index at the end of each iteration
    body_fn (Callable): The function called within the for loop. Note that the loop body
        function must always have the iteration index as its first
        argument, which can be used arbitrarily inside the loop body. As the value of the index
        across iterations is handled automatically by the provided loop bounds, it must not be
        returned from the function.

Keyword Args:
    allow_array_resizing (Literal["auto", True, False]): How to handle arrays
        with dynamic shapes that change between iterations
