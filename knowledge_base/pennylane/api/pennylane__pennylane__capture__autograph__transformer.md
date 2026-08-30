---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/capture/autograph/transformer.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/capture/autograph/transformer.py
license: Apache-2.0
---

## Module `pennylane/capture/autograph/transformer.py`

AutoGraph is a source-to-source transformation system for converting imperative code into
traceable code for compute graph generation. The system is implemented in the Diastatic-Malt
package (originally from TensorFlow).
Here, we integrate AutoGraph into PennyLane to improve the UX and allow programmers to use built-in
Python control flow and other imperative expressions rather than the functional equivalents provided
by PennyLane.

## `PennyLaneTransformer`

```python
class PennyLaneTransformer(PyToPy)
```

A source-to-source transformer to convert imperative style control flow into a function style
suitable for tracing.

### `transform`

```python
def transform(self, obj, user_context)
```

Launch the transformation process. Typically, this only works on function objects.
Here we also allow QNodes to be transformed.

### `get_extra_locals`

```python
def get_extra_locals(self)
```

Here we can provide any extra names that the converted function should have access to.
At a minimum we need to provide the module with definitions for AutoGraph primitives.

### `has_cache`

```python
def has_cache(self, fn)
```

Check for the presence of the given function in the cache. Functions to be converted are
cached by the function object itself as well as the conversion options.

### `get_cached_function`

```python
def get_cached_function(self, fn)
```

Retrieve a Python function object for a previously converted function.
Note that repeatedly calling this function with the same arguments will result in new
function objects every time, however their source code should be identical except for
the auto-generated names.

## `run_autograph`

```python
def run_autograph(fn)
```

Decorator that converts the given function into graph form.

AutoGraph can be used in PennyLane's capture workflow to convert Pythonic control flow to PennyLane
native control flow. This requires the ``diastatic-malt`` package, a standalone fork of the AutoGraph
module in TensorFlow (`official documentation <https://github.com/PennyLaneAI/diastatic-malt/blob/main/g3doc/reference/index.md>`_
).

Args:
    fn (Callable): The callable to be converted. This could be a function, a QNode, or another callable object.
        For a QNode, the ``QNode.func`` will be converted. For another callable object, a function calling the
        object will be converted.

Returns:
    Callable: For a function, the converted function is returned directly.
    For a QNode, a copy of the QNode will be returned with ``QNode.func`` replaced with the converted version of ``func``.
    For any other callable ``obj``, the returned function will be a converted version of
    ``lambda *args, **kwargs: obj(*args, **kwargs)``

.. note::

    There are some limitations and sharp bits regarding AutoGraph; to better understand
    supported behaviour and limitations, see :doc:`/development/autograph`.

.. warning::

    Nested functions are only lazily converted by AutoGraph. If the input includes nested
    functions, these won't be converted until the first time the function is traced.

**Example**

Consider the following function including Pythonic control flow, which can't be captured directly:

>>> def f(x, n):
...     for i in range(n):
...          x += 1
...     return x
>>> jax.make_jaxpr(f)(2, 4)
TracerIntegerConversionError: The __index__() method was called on traced array with shape int64[].
The error occurred while tracing the function f at /var/folders/61/wr1fxnf95tg9k56bz1_7g29r0000gq/T/ipykernel_23187/3992882129.py:1 for make_jaxpr. This concrete value was not available in Python because it depends on the value of the argument n.

Passing it thorough AutoGraph converts the structure of the function to native PennyLane control flow
with :func:`~.cond`, :func:`~.for_loop`, and :func:`~.while_loop`, making it possible to capture:

>>> ag_fn = run_autograph(f)
>>> jax.make_jaxpr(ag_fn)(2, 4)
{ lambda ; a:i64[] b:i64[]. let
    c:i64[] = for_loop[
      args_slice=slice(0, None, None)
      consts_slice=slice(0, 0, None)
      jaxpr_body_fn={ lambda ; d:i64[] e:i64[]. let f:i64[] = add e 1 in (f,) }
    ] 0 b 1 a
  in (c,) }

## `autograph_source`

```python
def autograph_source(fn)
```

Utility function to retrieve the source code of a function converted by AutoGraph.

.. warning::

    Nested functions are only lazily converted by AutoGraph. Make sure that the function has
    been traced at least once before accessing its transformed source code, for example by
    specifying the signature of the compiled program or by running it at least once.

Args:
    fn (Callable): the original function object that was converted

Returns:
    str: the source code of the converted function

Raises:
    AutoGraphError: If the given function was not converted by AutoGraph, an error will be
                    raised.

**Example**

.. code-block:: python

    from pennylane.capture.autograph import run_autograph, autograph_source

    def decide(x):
        if x < 5:
            y = 15
        else:
            y = 1
        return y

    ag_decide = run_autograph(decide)

>>> print(autograph_source(ag_fn))
def ag__decide(x):
    with ag__.FunctionScope('decide', 'fscope', ag__.ConversionOptions(recursive=True, user_requested=True, optional_features=ag__.Feature.BUILTIN_FUNCTIONS, internal_convert_user_code=True)) as fscope:
        do_return = False
        retval_ = ag__.UndefinedReturnValue()

        def get_state():
            return (y,)

        def set_state(vars_):
            nonlocal y
            y, = vars_

        def if_body():
            nonlocal y
            y = 15

        def else_body():
            nonlocal y
            y = 1
        y = ag__.Undefined('y')
        ag__.if_stmt(ag__.ld(x) < 5, if_body, else_body, get_state, set_state, ('y',), 1)
        try:
            do_return = True
            retval_ = ag__.ld(y)
        except:
            do_return = False
            raise
        return fscope.ret(retval_, do_return)

## `DisableAutograph`

```python
class DisableAutograph(ag_ctx.ControlStatusCtx, ContextDecorator)
```

Context decorator that disables AutoGraph for the given function/context.

.. note::

    A singleton instance is used for discarding parentheses usage:

    @disable_autograph
    instead of
    @DisableAutograph()

    with disable_autograph:
    instead of
    with DisableAutograph()

**Example**

We can see this works by considering a simple example.
In this case, we expect to see a ``cond`` primitive captured in the jaxpr from the function ``f``.

.. code-block::

    import pennylane as qp
    import jax

    from jax import make_jaxpr
    from pennylane.capture.autograph import disable_autograph, run_autograph

    qp.capture.enable()

    def f(x):
        if x > 1:
            return x**2
        return x

    def g():
        x = 2
        return f(x)

>>> make_jaxpr(run_autograph(g))()
{ lambda ; . let
    _:bool[] a:i32[] = cond[
    args_slice=slice(2, None, None)
    consts_slices=[slice(2, 2, None), slice(2, 2, None)]
    jaxpr_branches=[{ lambda ; . let  in (True:bool[], 4:i32[]) }, { lambda ; . let  in (True:bool[], 2:i32[]) }]
    ] True:bool[] True:bool[]
in (a,) }

Now if we add the decorator the function is evaluated and not captured in the jaxpr,

.. code-block:: python

    @disable_autograph
    def f(x):
        if x > 1:
            return x**2
        return x

>>> make_jaxpr(run_autograph(g))()
{ lambda ; . let  in (4:i32[],) }

Or we can also use the context manager,

.. code-block:: python

    def g():
        x = 2
        with disable_autograph:
            return f(x)

>>> make_jaxpr(run_autograph(g))()
{ lambda ; . let  in (4:i32[],) }
