---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/optimize/adam.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/optimize/adam.py
license: Apache-2.0
---

## Module `pennylane/optimize/adam.py`

Adam optimizer

## `AdamOptimizer`

```python
class AdamOptimizer(GradientDescentOptimizer)
```

Gradient-descent optimizer with adaptive learning rate, first and second moment.

Adaptive Moment Estimation uses a step-dependent learning rate,
a first moment :math:`a` and a second moment :math:`b`, reminiscent of
the momentum and velocity of a particle:

.. math::
    x^{(t+1)} = x^{(t)} - \eta^{(t+1)} \frac{a^{(t+1)}}{\sqrt{b^{(t+1)}} + \epsilon },

where the update rules for the two moments are given by

.. math::
    a^{(t+1)} &= \beta_1 a^{(t)} + (1-\beta_1) \nabla f(x^{(t)}),\\
    b^{(t+1)} &= \beta_2 b^{(t)} + (1-\beta_2) (\nabla f(x^{(t)}))^{\odot 2},\\
    \eta^{(t+1)} &= \eta \frac{\sqrt{(1-\beta_2^{t+1})}}{(1-\beta_1^{t+1})}.

Above, :math:`( \nabla f(x^{(t-1)}))^{\odot 2}` denotes the element-wise square operation,
which means that each element in the gradient is multiplied by itself. The hyperparameters
:math:`\beta_1` and :math:`\beta_2` can also be step-dependent. Initially, the first and
second moment are zero.

The shift :math:`\epsilon` avoids division by zero.

For more details, see `arXiv:1412.6980 <https://arxiv.org/abs/1412.6980>`_.

Args:
    stepsize (float): the user-defined hyperparameter :math:`\eta` (default value: 0.1).
    beta1 (float): a hyperparameter governing the first and second moment updates (default value: 0.9).
    beta2 (float): a hyperparameter governing the first and second moment updates (default value: 0.99).
    eps (float): offset :math:`\epsilon` added for numerical stability (default value: 1e-08).

.. note::

    When using ``torch``, ``tensorflow`` or ``jax`` interfaces, refer to :doc:`Gradients and training </introduction/interfaces>` for suitable optimizers.

### `apply_grad`

```python
def apply_grad(self, grad, args)
```

Update the variables args to take a single optimization step. Flattens and unflattens
the inputs to maintain nested iterables as the parameters of the optimization.

Args:
    grad (tuple[ndarray]): the gradient of the objective
        function at point :math:`x^{(t)}`: :math:`\nabla f(x^{(t)})`
    args (tuple): the current value of the variables :math:`x^{(t)}`

Returns:
    list: the new values :math:`x^{(t+1)}`

### `reset`

```python
def reset(self)
```

Reset optimizer by erasing memory of past steps.

### `fm`

```python
def fm(self)
```

Returns estimated first moments of gradient

### `sm`

```python
def sm(self)
```

Returns estimated second moments of gradient

### `t`

```python
def t(self)
```

Returns accumulated timesteps
