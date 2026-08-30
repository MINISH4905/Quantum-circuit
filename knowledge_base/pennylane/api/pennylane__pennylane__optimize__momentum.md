---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/optimize/momentum.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/optimize/momentum.py
license: Apache-2.0
---

## Module `pennylane/optimize/momentum.py`

Momentum optimizer

## `MomentumOptimizer`

```python
class MomentumOptimizer(GradientDescentOptimizer)
```

Gradient-descent optimizer with momentum.

The momentum optimizer adds a "momentum" term to gradient descent
which considers the past gradients:

.. math:: x^{(t+1)} = x^{(t)} - a^{(t+1)}.

The accumulator term :math:`a` is updated as follows:

.. math:: a^{(t+1)} = m a^{(t)} + \eta \nabla f(x^{(t)}),

with user defined parameters:

* :math:`\eta`: the step size
* :math:`m`: the momentum

Args:
    stepsize (float): the user-defined hyperparameter :math:`\eta` (default value: 0.01).
    momentum (float): the user-defined hyperparameter :math:`m` (default value: 0.9).

.. note::

    When using ``torch``, ``tensorflow`` or ``jax`` interfaces, refer to :doc:`Gradients and training </introduction/interfaces>` for suitable optimizers.

### `apply_grad`

```python
def apply_grad(self, grad, args)
```

Update the trainable args to take a single optimization step. Flattens and unflattens
the inputs to maintain nested iterables as the parameters of the optimization.

Args:
    grad (tuple [array]): the gradient of the objective
        function at point :math:`x^{(t)}`: :math:`\nabla f(x^{(t)})`.
    args (tuple): the current value of the variables :math:`x^{(t)}`.

Returns:
    list [array]: the new values :math:`x^{(t+1)}`.

### `reset`

```python
def reset(self)
```

Reset optimizer by erasing memory of past steps.
