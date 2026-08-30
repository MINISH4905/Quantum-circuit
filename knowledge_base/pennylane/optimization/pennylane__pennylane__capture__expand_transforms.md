---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/capture/expand_transforms.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/capture/expand_transforms.py
license: Apache-2.0
---

## Module `pennylane/capture/expand_transforms.py`

Helper function for expanding transforms with program capture

## `ExpandTransformsInterpreter`

```python
class ExpandTransformsInterpreter(PlxprInterpreter)
```

Interpreter for expanding transform primitives that are applied to plxpr.

This interpreter does not do anything special by itself. Instead, it is used
by the PennyLane transforms to expand transform primitives in plxpr by
applying the respective transform to the inner plxpr. When a transform is created
using :func:`~pennylane.transform`, a custom primitive interpretation rule for
that transform is automatically registered for ``ExpandTransformsInterpreter``.

## `expand_plxpr_transforms`

```python
def expand_plxpr_transforms(f: Callable) -> Callable
```

Function for applying transforms to plxpr.

Currently, when program capture is enabled, transforms are used as higher-order primitives.
These primitives are present in the program, but their respective transform is not applied
when a transformed function is called. ``expand_plxpr_transforms`` further "transforms" the
input function to apply any transform primitives that are present in the program being run.

**Example**

In the below example, we can see that the ``qp.transforms.cancel_inverses`` transform has been
applied to a function. However, the resulting program representation leaves the
``cancel_inverses`` transform as a primitive without actually transforming the program.

.. code-block:: python

    qp.capture.enable()

    @qp.transforms.cancel_inverses
    def circuit():
        qp.X(0)
        qp.S(1)
        qp.X(0)
        qp.adjoint(qp.S(1))
        return qp.expval(qp.Z(1))

>>> qp.capture.make_plxpr(circuit)()
{ lambda ; . let
    a:AbstractMeasurement(n_wires=None) = cancel_inverses_transform[
    args_slice=slice(0, 0, None)
    consts_slice=slice(0, 0, None)
    inner_jaxpr={ lambda ; . let
        _:AbstractOperator() = PauliX[n_wires=1] 0
        _:AbstractOperator() = S[n_wires=1] 1
        _:AbstractOperator() = PauliX[n_wires=1] 0
        b:AbstractOperator() = S[n_wires=1] 1
        _:AbstractOperator() = Adjoint b
        c:AbstractOperator() = PauliZ[n_wires=1] 1
        d:AbstractMeasurement(n_wires=None) = expval_obs c
      in (d,) }
    targs_slice=slice(0, None, None)
    tkwargs={}
    ]
  in (a,) }

To apply the transform, we can use ``expand_plxpr_transforms`` as follows:

>>> transformed_circuit = qp.capture.expand_plxpr_transforms(circuit)
>>> qp.capture.make_plxpr(transformed_circuit)()
{ lambda ; . let
    a:AbstractOperator() = PauliZ[n_wires=1] 1
    b:AbstractMeasurement(n_wires=None) = expval_obs a
  in (b,) }

As seen, the transform primitive is no longer present, but it has been applied
to the original program, indicated by the inverse operators being cancelled.

Args:
    f (Callable): The callable to which any present transforms should be applied.

Returns:
    Callable: Callable with transforms applied.
