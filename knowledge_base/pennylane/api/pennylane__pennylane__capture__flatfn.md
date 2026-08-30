---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/capture/flatfn.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/capture/flatfn.py
license: Apache-2.0
---

## Module `pennylane/capture/flatfn.py`

Defines a utility for capturing higher order primitives that return pytrees.

## `FlatFn`

```python
class FlatFn
```

Wrap a function so that it caches the pytree shape of the output into the ``out_tree``
property, so that the results can be repacked later. It also returns flattened results
instead of the original result object.

If an ``in_tree`` is provided, the function accepts flattened inputs instead of the
original inputs with tree structure given by ``in_tree``.

**Example**

>>> import jax
>>> from pennylane.capture.flatfn import FlatFn
>>> def f(x):
...     return {"y": 2+x["x"]}
>>> flat_f = FlatFn(f)
>>> arg = {"x": 0.5}
>>> res = flat_f(arg)
>>> res
[2.5]
>>> jax.tree_util.tree_unflatten(flat_f.out_tree, res)
{'y': 2.5}

If we want to use a fully flattened function that also takes flat inputs instead of
the original inputs with tree structure, we can provide the ``PyTreeDef`` for this input
structure:

>>> flat_args, in_tree = jax.tree_util.tree_flatten((arg,))
>>> flat_f = FlatFn(f, in_tree)
>>> res = flat_f(*flat_args)
>>> res
[2.5]
>>> jax.tree_util.tree_unflatten(flat_f.out_tree, res)
{'y': 2.5}

Note that the ``in_tree`` has to be  created by flattening a tuple of all input
arguments, even if there is only a single argument.
