---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/optimize/adagrad.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/optimize/adagrad.py
license: Apache-2.0
---

## Module `pennylane/optimize/adagrad.py`

Adagrad optimizer

## `AdagradOptimizer`

```python
class AdagradOptimizer(GradientDescentOptimizer)
```

Gradient-descent optimizer with past-gradient-dependent
learning rate in each dimension.

Adagrad adjusts the learning rate for each parameter :math:`x_i`
in :math:`x` based on past gradients. We therefore have to consider
each parameter update individually,

.. math::
    x^{(t+1)}_i = x^{(t)}_i - \eta_i^{(t+1)} \partial_{w_i} f(x^{(t)}),

where the gradient is replaced by a (scalar) partial derivative.

The learning rate in step :math:`t` is given by

.. math::
    \eta_i^{(t+1)} = \frac{ \eta_{\mathrm{init}} }{ \sqrt{a_i^{(t+1)} + \epsilon } },
    ~~~ a_i^{(t+1)} = \sum_{k=1}^t (\partial_{x_i} f(x^{(k)}))^2.

The offset :math:`\epsilon` avoids division by zero.

:math:`\eta` is the step size, a user defined parameter.

Args:
    stepsize (float): the user-defined hyperparameter :math:`\eta` (default value: 0.1).
    eps (float): offset :math:`\epsilon` added for numerical stability (default value: 1e-08).

.. note::

    When using ``torch``, ``tensorflow`` or ``jax`` interfaces, refer to :doc:`Gradients and training </introduction/interfaces>` for suitable optimizers.

### `apply_grad`

```python
def apply_grad(self, grad, args)
```

Update the variables in args to take a single optimization step. Flattens and unflattens
the inputs to maintain nested iterables as the parameters of the optimization.

Args:
    grad (tuple[array]): the gradient of the objective
        function at point :math:`x^{(t)}`: :math:`\nabla f(x^{(t)})`
    args (tuple): the current value of the variables :math:`x^{(t)}`

Returns:
    list: the new values :math:`x^{(t+1)}`

### `reset`

```python
def reset(self)
```

Reset optimizer by erasing memory of past steps.
