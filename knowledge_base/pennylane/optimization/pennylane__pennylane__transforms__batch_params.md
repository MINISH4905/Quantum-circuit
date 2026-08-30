---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/batch_params.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/batch_params.py
license: Apache-2.0
---

## Module `pennylane/transforms/batch_params.py`

Contains the batch dimension transform.

## `batch_params`

```python
def batch_params(tape: QuantumScript, all_operations=False) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Transform a QNode to support an initial batch dimension
for operation parameters.

.. note::

    This transform will create multiple circuits inside the QNode, one per batch dimension.
    As a result, it is both simulator and hardware compatible. When using
    a simulator device, however, this means that a separate simulation
    will be performed per batch dimension.

.. warning::

    Currently, not all templates have been updated to support a batch
    dimension. If you run into an error attempting to use a template
    with this transform, please open a GitHub issue detailing
    the error.

Args:
    tape (QNode or QuantumTape or Callable): a quantum circuit to add a batch dimension to
    all_operations (bool): If ``True``, a batch dimension will be added to *all* operations
        in the QNode, rather than just trainable QNode parameters.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]:

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`. Executing this circuit
    will provide the batched results, with the first dimension treated as the batch dimension.

**Example**

Consider the following circuit:

.. code-block:: python

    dev = qp.device("default.qubit", wires=3)

    @qp.batch_params
    @qp.qnode(dev)
    def circuit(x, weights):
        qp.RX(x, wires=0)
        qp.RY(0.2, wires=1)
        qp.templates.StronglyEntanglingLayers(weights, wires=[0, 1, 2])
        return qp.expval(qp.Hadamard(0))

The ``qp.batch_params`` decorator allows us to pass arguments ``x`` and ``weights``
that have a batch dimension. For example,

>>> batch_size = 3
>>> x = pnp.linspace(0.1, 0.5, batch_size)
>>> rng = np.random.default_rng(seed=1234)
>>> weights = pnp.array(rng.random((batch_size, 10, 3, 3)))

If we evaluate the QNode with these inputs, we will get an output
of shape ``(batch_size,)``:

>>> circuit(x, weights)
tensor([ 0.008...,  0.273..., -0.24...], requires_grad=True)

QNodes with a batch dimension remain fully differentiable:

>>> def cost_fn(x, weights): return qp.math.sum(circuit(x, weights))
>>> cost_fn(x, weights)
tensor(0.037..., requires_grad=True)
>>> qp.grad(cost_fn)(x, weights)[0]
array([-0.302...,  0.0632...  0.0081...])

If we pass the ``all_operations`` argument, we can specify that
*all* operation parameters in the transformed QNode, regardless of whether they
are QNode input parameters, have a batch dimension:

.. code-block:: python

    @qp.batch_params(all_operations=True)
    @qp.qnode(dev)
    def circuit(x, weights):
        qp.RX(x, wires=0)
        qp.RY([0.2, 0.2, 0.2], wires=1)
        qp.templates.StronglyEntanglingLayers(weights, wires=[0, 1, 2])
        return qp.expval(qp.Hadamard(0))

>>> def cost_fn(x, weights): return qp.math.sum(circuit(x, weights))
>>> weights.requires_grad = False
>>> cost_fn(x, weights)
tensor(0.037..., requires_grad=True)
>>> qp.grad(cost_fn)(x, weights)[0]
np.float64(-0.302...)
