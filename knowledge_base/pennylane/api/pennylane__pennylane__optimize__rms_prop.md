---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/optimize/rms_prop.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/optimize/rms_prop.py
license: Apache-2.0
---

## Module `pennylane/optimize/rms_prop.py`

Root mean square propagation optimizer

## `RMSPropOptimizer`

```python
class RMSPropOptimizer(AdagradOptimizer)
```

Root mean squared propagation optimizer.

The root mean square propagation optimizer is a modified
:class:`Adagrad optimizer <pennylane.optimize.AdagradOptimizer>`,
with a decay of learning rate adaptation.

Extensions of the Adagrad optimization method generally
start the sum :math:`a` over past gradients in the denominator
of the learning rate at a finite :math:`t'` with :math:`0 < t' < t`,
or decay past gradients to avoid an ever-decreasing learning rate.

Root Mean Square propagation is such an adaptation, where

.. math::
    a_i^{(t+1)} = \gamma a_i^{(t)} + (1-\gamma) (\partial_{x_i} f(x^{(t)}))^2.

Args:
    stepsize (float): the user-defined hyperparameter :math:`\eta`
        used in the Adagrad optimization (default value: 0.01).
    decay (float): the learning rate decay :math:`\gamma` (default value: 0.9).
    eps (float): offset :math:`\epsilon` added for numerical stability (default value: 1e-08).
        See :class:`Adagrad <pennylane.optimize.AdagradOptimizer>` for more information.

### `apply_grad`

```python
def apply_grad(self, grad, args)
```

Update the variables args to take a single optimization step. Flattens and unflattens
the inputs to maintain nested iterables as the parameters of the optimization.

Args:
    grad (tuple [array]): the gradient of the objective function at
        point :math:`x^{(t)}`: :math:`\nabla f(x^{(t)})`.
    args (tuple): the current value of the variables :math:`x^{(t)}`.

Returns:
    list [array]: the new values :math:`x^{(t+1)}`
