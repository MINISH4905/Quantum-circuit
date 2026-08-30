---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/capture/jax_patches.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/capture/jax_patches.py
license: Apache-2.0
---

## Module `pennylane/capture/jax_patches.py`

Runtime patches for JAX 0.7.x dynamic-shape compatibility.

For a detailed explanation of these patches, see:
    pennylane/capture/JAX_PATCHES_EXPLAINED.md

Problem
-------
JAX 0.7.x has a bug where `_dyn_shape_staging_rule` and `pjit_staging_rule` create
`JaxprEqn` objects, but `trace.frame.add_eqn` asserts for `TracingEqn`. This breaks
ALL array creation with traced dimensions::

    jnp.arange(n)       # n is traced → AssertionError
    jnp.ones((n,))      # n is traced → AssertionError
    jnp.zeros(n)        # n is traced → AssertionError

Solution
--------
We inject a `make_eqn` helper into `DynamicJaxprTrace` that properly creates
`TracingEqn` objects, then patch the buggy staging rules to use this helper.

Patches Applied
---------------
1. ``DynamicJaxprTrace.make_eqn`` — Helper to create TracingEqn with proper context
2. ``lax._dyn_shape_staging_rule`` — Fixed to use make_eqn helper
3. ``pjit.pjit_staging_rule`` — Fixed to use make_eqn helper
4. ``pe.custom_staging_rules[jit_p]`` — Registry entry for patched pjit rule

Usage
-----
Apply patches via the Patcher context manager::

    from pennylane.capture.patching import Patcher
    from pennylane.capture.jax_patches import get_jax_patches

    with Patcher(*get_jax_patches()):
        jaxpr = jax.make_jaxpr(fn, abstracted_axes={0: 'n'})(x)

Inspiration
-----------
This approach is modeled after Catalyst's JAX patches (see catalyst.jax_extras.patches).

Note
----
JAX 0.7.x only has ``DynamicJaxprTrace`` — the ``StagingJaxprTrace`` from older
JAX versions no longer exists. All patches assume DynamicJaxprTrace.

## `get_jax_patches`

```python
def get_jax_patches()
```

Get patch tuples for use with Patcher context manager.

Returns a tuple of (obj, attr, new_value) tuples that can be passed to Patcher.
These patches fix JAX 0.7.0+ compatibility issues for dynamic shapes and pjit.

Returns:
    tuple: Patch tuples for Patcher, or empty tuple if patches not needed

Example:
    >>> from pennylane.capture.patching import Patcher
    >>> from pennylane.capture.jax_patches import get_jax_patches
    >>> with Patcher(*get_jax_patches()):
    ...     # JAX operations with patches applied
    ...     jaxpr = jax.make_jaxpr(my_function)(args)
