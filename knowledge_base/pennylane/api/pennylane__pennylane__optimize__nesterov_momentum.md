---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/optimize/nesterov_momentum.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/optimize/nesterov_momentum.py
license: Apache-2.0
---

## Module `pennylane/optimize/nesterov_momentum.py`

Nesterov momentum optimizer

## `NesterovMomentumOptimizer`

```python
class NesterovMomentumOptimizer(MomentumOptimizer)
```

Gradient-descent optimizer with Nesterov momentum.

Nesterov Momentum works like the
:class:`Momentum optimizer <.pennylane.optimize.MomentumOptimizer>`,
but shifts the current input by the momentum term when computing the gradient
of the objective function:

.. math:: a^{(t+1)} = m a^{(t)} + \eta \nabla f(x^{(t)} - m a^{(t)}).

The user defined parameters are:

* :math:`\eta`: the step size
* :math:`m`: the momentum

Args:
    stepsize (float): the user-defined hyperparameter :math:`\eta` (default value: 0.01).
    momentum (float): the user-defined hyperparameter :math:`m` (default value: 0.9).

.. note::

    When using ``torch``, ``tensorflow`` or ``jax`` interfaces, refer to :doc:`Gradients and training </introduction/interfaces>` for suitable optimizers.

### `compute_grad`

```python
def compute_grad(self, objective_fn, args, kwargs, grad_fn=None)
```

Compute the gradient of the objective function at the shifted point :math:`(x -
m\times\text{accumulation})` and return it along with the objective function forward pass
(if available).

Args:
    objective_fn (function): the objective function for optimization.
    args (tuple): tuple of NumPy arrays containing the current values for the
        objection function.
    kwargs (dict): keyword arguments for the objective function.
    grad_fn (function): optional gradient function of the objective function with respect to
        the variables ``x``. If ``None``, the gradient function is computed automatically.
        Must return the same shape of tuple [array] as the autograd derivative.

Returns:
    tuple [array]: the NumPy array containing the gradient :math:`\nabla f(x^{(t)})` and the
    objective function output. If ``grad_fn`` is provided, the objective function
    will not be evaluated and instead ``None`` will be returned.
