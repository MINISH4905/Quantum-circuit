---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/control_flow/_loop_abstract_axes.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/control_flow/_loop_abstract_axes.py
license: Apache-2.0
---

## Module `pennylane/control_flow/_loop_abstract_axes.py`

Contains utilities for handling abstracted axes for for_loop and while_loop.

Note that these are located in the ``control_flow`` module and not the ``capture`` module
as they are specific to just ``for_loop`` and ``while_loop``.
``capture.determine_abstracted_axes`` applies to any higher order primitive.

## `promote_consts_to_inputs`

```python
def promote_consts_to_inputs(f)
```

This function extracts any closure variables with dynamic shapes from f.__closure__
and promotes them to being normal arguments. This produces a new function that
takes the original args and the new consts as explicit inputs. It also returns
the extracted consts.

## `add_abstract_shapes`

```python
def add_abstract_shapes(f, shape_locations: list[list[AbstractShapeLocation]])
```

Add the abstract shapes at the specified locations to the output of f.

Here we can see that the shapes at argument 0, shape index 0 and
argument 1, shape index 1 are returned alongside the results of ``f``.

.. code-block:: python
    import jax.numpy as jnp
    def f(x, y): return [x, y]

    loc1 = AbstractShapeLocation(arg_idx=0, shape_idx=0)
    loc2 = AbstractShapeLocation(arg_idx=1, shape_idx=1)
    repeat_loc = AbstractShapeLocation(arg_idx=0, shape_idx=1)
    locations = [[loc1, repeat_loc], [loc2]]

    add_abstract_shapes(f, locations)(jnp.zeros((1,1)), jnp.zeros((3,4)))

.. code-block::

    [1,
    4,
    Array([[0.]], dtype=float32),
    Array([[0., 0., 0., 0.],
            [0., 0., 0., 0.],
            [0., 0., 0., 0.]], dtype=float32)]

## `get_dummy_arg`

```python
def get_dummy_arg(arg)
```

If any axes are abstract, replace them with an empty numpy array.

Even if abstracted_axes specifies two dimensions as having different dynamic shapes,
if the dimension is the same tracer, jax will still treat them as the same shape.

.. code-block:: python

    def f(a, b): return 0

    def w(i0):
        a = jnp.arange(i0)
        b = jnp.arange(i0)
        jaxpr = jax.make_jaxpr(f, abstracted_axes=({0:0}, {0:1}))(a, b)
        print(jaxpr)

    _ = jax.make_jaxpr(w)(2)

.. code-block::

    { lambda ; a:i32[] b:i32[a] c:i32[a]. let  in (0,) }

So we need to override this behavior by not giving them any abstract shapes to focus on.
Instead, we just pass in an empty numpy array with all abstract dimensions replaced with ``2``.
We use numpy instead of jax so the creation of the array will not show up in the jaxpr.

## `validate_no_resizing_returns`

```python
def validate_no_resizing_returns(jaxpr: 'jax.extend.core.Jaxpr', locations: list[list[AbstractShapeLocation]], name: str='while_loop') -> str | None
```

Validate that all jaxpr outputs that should have the same shape as specified in ``locations``
continue to have the same shape.  Returns a string with an error message so we can
either decide to raise the error, or try again with different settings.

## `handle_jaxpr_error`

```python
def handle_jaxpr_error(e: ValueError, fns: tuple[Callable, ...], allow_array_resizing, name: str='while_loop')
```

Handle any ValueError's raised by the creation of the jaxpr, adding information to any error
about 'Incompatible shapes for broadcasting'.

## `loop_determine_abstracted_axes`

```python
def loop_determine_abstracted_axes(args, allow_array_resizing: bool=False) -> tuple[Any, list[TensorLike], list[list[AbstractShapeLocation]]]
```

Determine the abstract axes for arguments that will be used in a loop context.

Args:
    args (Any): Arguments to determine the abstracted axes for
    allow_array_resizing (bool): If True, each abstracted axis should be treated as
        an independent axis. Defaults to False.

Returns:
    abstracted_axes, abstract_shapes, locations for shapes

.. code-block:: python

    from pennylane.control_flow._loop_abstract_axes import loop_determine_abstracted_axes
    from functools import partial

    def f(*args, allow_array_resizing):
        abstracted_axes, abstract_shapes, locations = loop_determine_abstracted_axes(args, allow_array_resizing)
        print(abstracted_axes)
        print(abstract_shapes)
        print(locations)

    args = (0, jnp.ones(3), jnp.zeros((3, 3)))
    jax.make_jaxpr(partial(f, allow_array_resizing=False), abstracted_axes=({}, {0:"a"}, {1:"a"}))(*args)

.. code-block::

    ({}, {0: 0}, {1: 0})
    [Traced<ShapedArray(int32[], weak_type=True)>with<DynamicJaxprTrace(level=1/0)>]
    [[AbstractShapeLocation(arg_idx=1, shape_idx=0), AbstractShapeLocation(arg_idx=2, shape_idx=1)]]

Here we can verify that the output abstracted axes match what we put in. The returned ``abstract_shapes`` is the single
abstract shape that occurs in both variables.  The locations array tells us that we can locate the first
abstract shape in the ``1`` argument at shape position ``0``, and in the ``2`` argument at shape position ``1``.

If we instead specify ``allow_array_resizing=True``, we can see the difference.

... code-block:: python

    jax.make_jaxpr(partial(f, allow_array_resizing=True), abstracted_axes=({}, {0:"a"}, {1:"a"}))(*args)

.. code-block::

    ({}, {0: 0}, {1: 1})
    [Traced<ShapedArray(int32[], weak_type=True)>with<DynamicJaxprTrace(level=1/0)>, Traced<ShapedArray(int32[], weak_type=True)>with<DynamicJaxprTrace(level=1/0)>]
    [[AbstractShapeLocation(arg_idx=1, shape_idx=0)], [AbstractShapeLocation(arg_idx=2, shape_idx=1)]]

Now the abstracted axes treat the two abstracted axes as different, even though they are the same tracer in the input
arguments. The abstract shapes have two elements. By looking at the locations, we can see that we can find
the first abstract shape in argument ``1`` at shape position ``0``, and we can find the second abstract shape in
argument ``2`` at shape position ``1``.
