---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/optimize/momentum_qng.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/optimize/momentum_qng.py
license: Apache-2.0
---

## Module `pennylane/optimize/momentum_qng.py`

Quantum natural gradient optimizer with momentum

## `MomentumQNGOptimizer`

```python
class MomentumQNGOptimizer(QNGOptimizer)
```

A generalization of the Quantum Natural Gradient (QNG) optimizer by considering a discrete-time Langevin equation
with QNG force. For details of the theory and derivation of Momentum-QNG, please see:

    Oleksandr Borysenko, Mykhailo Bratchenko, Ilya Lukin, Mykola Luhanko, Ihor Omelchenko,
    Andrii Sotnikov and Alessandro Lomi.
    "Application of Langevin Dynamics to Advance the Quantum Natural Gradient Optimization Algorithm"
    `arXiv:2409.01978 <https://arxiv.org/abs/2409.01978>`__

We are grateful to David Wierichs for his generous help with the multi-argument variant of the ``MomentumQNGOptimizer`` class.

``MomentumQNGOptimizer`` is a subclass of ``QNGOptimizer`` that requires one additional
hyperparameter (the momentum coefficient) :math:`0 \leq \rho < 1`, the default value being :math:`\rho=0.9`. For :math:`\rho=0` Momentum-QNG
reduces to the basic QNG.
In this way, the parameter update rule in Momentum-QNG reads:

.. math::
    x^{(t+1)} = x^{(t)} + \rho (x^{(t)} - x^{(t-1)}) - \eta g(f(x^{(t)}))^{-1} \nabla f(x^{(t)}),

where :math:`\eta` is a stepsize (learning rate) value, :math:`g(f(x^{(t)}))^{-1}` is the pseudo-inverse
of the Fubini-Study metric tensor and :math:`f(x^{(t)}) = \langle 0 | U(x^{(t)})^\dagger \hat{B} U(x^{(t)}) | 0 \rangle`
is an expectation value of some observable measured on the variational
quantum circuit :math:`U(x^{(t)})`.

Args:
    stepsize (float): the user-defined hyperparameter :math:`\eta` (default value: 0.01).
    momentum (float): the user-defined hyperparameter :math:`\rho` (default value: 0.9).
    approx (str): approximation method for the metric tensor (default value: "block-diag").

        - If ``None``, the full metric tensor is computed.

        - If ``"block-diag"``, the block-diagonal approximation is computed, reducing
          the number of evaluated circuits significantly.

        - If ``"diag"``, only the diagonal approximation is computed, slightly
          reducing the classical overhead but not the quantum resources
          (compared to ``"block-diag"``).

    lam (float): metric tensor regularization :math:`G_{ij}+\lambda I`
        to be applied at each optimization step (default value: 0).

**Examples:**

Consider an objective function realized as a :class:`~.QNode` that returns the
expectation value of a Hamiltonian.

>>> dev = qp.device("default.qubit", wires=(0, 1, "aux"))
>>> @qp.qnode(dev)
... def circuit(params):
...     qp.RX(params[0], wires=0)
...     qp.RY(params[1], wires=0)
...     return qp.expval(qp.X(0))

Once constructed, the cost function can be passed directly to the
optimizer's :meth:`~.step` function. In addition to the standard learning
rate, the ``MomentumQNGOptimizer`` takes a ``momentum`` parameter:

>>> eta = 0.01
>>> rho = 0.93
>>> init_params = qp.numpy.array([0.5, 0.23], requires_grad=True)
>>> opt = qp.MomentumQNGOptimizer(stepsize=eta, momentum=rho)
>>> theta_new = opt.step(circuit, init_params)
>>> theta_new
tensor([0.50437193, 0.18562052], requires_grad=True)

An alternative function to calculate the metric tensor of the QNode can be provided to ``step``
via the ``metric_tensor_fn`` keyword argument, see :class:`~.pennylane.QNGOptimizer` for
details.

.. seealso::

    For details on quantum natural gradient, see :class:`~.pennylane.QNGOptimizer`.
    See :class:`~.pennylane.MomentumOptimizer` for a first-order optimizer with momentum.
    Also see the examples from the reference above, benchmarking the Momentum-QNG optimizer
    against the basic QNG, Momentum and Adam:

    - `QAOA <https://github.com/borbysh/Momentum-QNG/blob/main/QAOA_depth4.ipynb>`__
    - `VQE <https://github.com/borbysh/Momentum-QNG/blob/main/portfolio_optimization.ipynb>`__

    See :class:`~.MomentumQNGOptimizerQJIT` for an Optax-like and ``jax.jit``/``qp.qjit``-compatible implementation.

### `apply_grad`

```python
def apply_grad(self, grad, args)
```

Update the parameter array :math:`x` for a single optimization step. Flattens and
unflattens the inputs to maintain nested iterables as the parameters of the optimization.

Args:
    grad (array): The gradient of the objective
        function at point :math:`x^{(t)}`: :math:`\nabla f(x^{(t)})`
    args (array): the current value of the variables :math:`x^{(t)}`

Returns:
    array: the new values :math:`x^{(t+1)}`
