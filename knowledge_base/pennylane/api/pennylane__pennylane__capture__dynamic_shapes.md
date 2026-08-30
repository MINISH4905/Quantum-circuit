---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/capture/dynamic_shapes.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/capture/dynamic_shapes.py
license: Apache-2.0
---

## Module `pennylane/capture/dynamic_shapes.py`

Contains a utility for handling inputs with dynamically shaped arrays.

## `determine_abstracted_axes`

```python
def determine_abstracted_axes(args)
```

Compute the abstracted axes and extract the abstract shapes from the arguments.

Args:
    args (tuple): the arguments for a higher order primitive

Returns:
    tuple, tuple: the corresponding abstracted axes and dynamic shapes

Note that "dynamic shapes" only refers to the size of dimensions, but not the number of dimensions.
Even with dynamic shapes mode enabled, we cannot change the number of dimensions.

See the ``intro_to_dynamic_shapes.md`` document for more information on how dynamic shapes work.

To make jaxpr from arguments with dynamic shapes, the ``abstracted_axes`` keyword argument must be set.
Then, when calling the jaxpr, variables for the dynamic shapes must be passed.

.. code-block:: python

    jax.config.update("jax_dynamic_shapes", True)

    def f(n):
        x = jax.numpy.ones((n,))
        abstracted_axes, abstract_shapes = qp.capture.determine_abstracted_axes((x,))
        jaxpr = jax.make_jaxpr(jax.numpy.sum, abstracted_axes=abstracted_axes)(x)
        return jax.core.eval_jaxpr(jaxpr.jaxpr, jaxpr.consts, *abstract_shapes, x)


For cases where the shape of an argument matches a previous argument like:

>>> def f(i, x):
...    return x
>>> def workflow(i):
...     args = (i, jax.numpy.ones((i, )))
...     abstracted_axes, abstract_shapes = qp.capture.determine_abstracted_axes(args)
...     print("abstracted_axes: ", abstracted_axes)
...     print("abstract_shapes: ", abstract_shapes)
...     print("jaxpr: ", jax.make_jaxpr(f, abstracted_axes=abstracted_axes)(*args))
>>> _ = jax.make_jaxpr(workflow)(2)
abstracted_axes:  ({}, {0: '0_arg'})
abstract_shapes:  []
jaxpr:  { lambda ; a:i32[] b:f32[a]. let  in (b,) }

We allow Jax to identify that the shape of ``b`` matches our first argument, ``a``. This is
demonstrated by the fact that we do not have any additional ``abstract_shapes``, as it is already
present in the call signature. The abstracted axis is also ``"0_arg"`` instead of ``0``.
The ``"_arg"`` at the end indicates that the corresponding abstract axis
was already in the argument loop.

## `register_custom_staging_rule`

```python
def register_custom_staging_rule(primitive, get_jaxpr_from_params: Callable[[dict], 'jax.extend.core.Jaxpr'], setup_env: Callable=_default_setup_env) -> None
```

Register a custom staging rule for a higher order primitive that can handle dynamic shapes.

Args:
    primitive (jax.extend.core.Primitive): a jax primitive we want to register a custom staging rule for
    get_jaxpr_from_params (Callable[[dict], "jax.extend.core.Jaxpr"]): A function that takes in the equation's ``params``
        and returns a target jaxpr
    setup_env (Callable): A function that setups a dictionary for mapping from the inner jaxpr variables to the tracers
        that are inputs to the equation.  The inputs are the tracers that are inputs to the equation
        and the params for the equation. By default, returns an empty dictionary.

For example, the ``cond_prim`` will request its custom staging rule like:

.. code-block:: python

    register_custom_staging_rule(cond_prim, lambda params: params['jaxpr_branches'][0])

``cond`` cannot support ``setup_env``, because different branches may have different dynamic shapes.

Compare this to ``while_loop_prim``:

.. code-block:: python

    def setup_env(tracers, params):
        tracers = tracers[slice(*params['args_slice'])] + tracers[slice(*params['consts_slice'])]
        vars = params['jaxpr_body_fn'].invars + params['jaxpr_body_fn'].constvars
        return dict(zip(vars, tracers), strict=True)

    register_custom_staging_rule(
        while_loop_prim,
        get_jaxpr_from_params=lambda params: params["jaxpr_body_fn"],
        matching_eqn_inputs=matching_eqn_inputs,
    )

``for_loop_prim`` gets more complicated, as we have to slice out the ``start``, ``stop``, ``step`` from the ``tracers``,
and the loop index for the ``jaxpr_invars``.
