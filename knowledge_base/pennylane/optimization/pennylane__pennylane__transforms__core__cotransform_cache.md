---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/core/cotransform_cache.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/core/cotransform_cache.py
license: Apache-2.0
---

## Module `pennylane/transforms/core/cotransform_cache.py`

This submodule contains the CotransformCache for handling the classical cotransform part of a transform.

## `CotransformCache`

```python
class CotransformCache
```

A cache of the qnode, args, and kwargs that will can
be used to calculate the argnums and classical jacobian for the application
of a transform.

This class is an a implementation component for `CompilePipeline`.

### `get_classical_jacobian`

```python
def get_classical_jacobian(self, transform: BoundTransform, tape_idx: int)
```

Calculate the classical jacobian for a given transform.

Note that this function assumes that the transform exists at most one in the compile pipeline.
Given transforms with classical cotransforms tend to be final transforms, this is a safe bet.

.. code-block:: python

    @qp.gradients.param_shift
    @qp.transforms.split_non_commuting
    @qp.qnode(qp.device('default.qubit'))
    def c(x, y):
        qp.RX(2*x, 0)
        qp.RY(x*y, 0)
        return qp.expval(qp.Z(0)), qp.expval(qp.X(0))


    ps_container = c.compile_pipeline[-1]
    x, y = qp.numpy.array(0.5), qp.numpy.array(3.0)

    cc = CotransformCache(c, (x, y), {})

>>> cc.get_classical_jacobian(ps_container, tape_idx = 0)
(array([2., 3.]), array([0. , 0.5]))

### `get_argnums`

```python
def get_argnums(self, transform: BoundTransform) -> list[set[int]] | None
```

Calculate the trainable params from the argnums in the transform.

.. code-block:: python

    @qp.transforms.split_non_commuting
    @qp.qnode(qp.device('default.qubit'))
    def c(x, y):
        qp.RX(x[0], 0)
        qp.RX(y, 0)
        qp.RY(x[1], 0)
        return qp.expval(qp.Z(0)), qp.expval(qp.X(0))

    c = qp.gradients.param_shift(c, argnums=[0])

    ps_container = c.compile_pipeline[-1]
    x, y = jax.numpy.array([0.5, 0.7]), jax.numpy.array(3.0)

    cc = CotransformCache(c, (x, y), {})

>>> cc.get_argnums(ps_container)
[{0, 2}, {0, 2}]
