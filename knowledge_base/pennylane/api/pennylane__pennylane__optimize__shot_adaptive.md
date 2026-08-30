---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/optimize/shot_adaptive.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/optimize/shot_adaptive.py
license: Apache-2.0
---

## Module `pennylane/optimize/shot_adaptive.py`

Shot adaptive optimizer

## `ShotAdaptiveOptimizer`

```python
class ShotAdaptiveOptimizer(GradientDescentOptimizer)
```

Optimizer where the shot rate is adaptively calculated using the variances of the
parameter-shift gradient.

By keeping a running average of the parameter-shift gradient and the *variance*
of the parameter-shift gradient, this optimizer frugally distributes a shot
budget across the partial derivatives of each parameter.

In addition, weighted random sampling can be used to further distribute the
shot budget across the local terms from which the Hamiltonian is constructed.

.. note::

    The shot adaptive optimizer only supports single QNode objects as objective functions.
    The bound device must also be instantiated with a finite number of shots.

Args:
    min_shots (int): the minimum number of shots used to estimate the expectations
        of each term in the Hamiltonian. Note that this must be larger than 2 for the variance
        of the gradients to be computed.
    term_sampling (str): the random sampling algorithm to multinomially distribute the shot
        budget across terms in the Hamiltonian expectation value. Currently, only
        ``"weighted_random_sampling"`` is supported. The default value is ``None``, which
        disables the random sampling behaviour.
    mu (float): the running average constant :math:`\mu \in [0, 1]`. Used to control how
        quickly the number of shots recommended for each gradient component changes (default value: 0.99).
    b (float): the regularization bias. The bias should be kept small, but non-zero (default value: 1e-06).
    stepsize (float): the learning rate :math:`\eta` (default value: 0.07). The learning rate *must* be such
        that :math:`\eta < 2/L = 2/\sum_i|c_i|`, where:

        * :math:`L \leq \sum_i|c_i|` is the bound on the `Lipschitz constant
          <https://en.wikipedia.org/wiki/Lipschitz_continuity>`__ of the variational quantum
          algorithm objective function, and

        * :math:`c_i` are the coefficients of the Hamiltonian used in the objective function.

**Example**

For VQE/VQE-like problems, the objective function for the optimizer can be realized
as a :class:`~.QNode` object measuring the expectation of a :class:`~.ops.LinearCombination`.

>>> from pennylane import numpy as np
>>> from functools import partial
>>> coeffs = [2, 4, -1, 5, 2]
>>> obs = [
...   qp.X(1),
...   qp.Z(1),
...   qp.X(0) @ qp.X(1),
...   qp.Y(0) @ qp.Y(1),
...   qp.Z(0) @ qp.Z(1)
... ]
>>> H = qp.Hamiltonian(coeffs, obs)
>>> dev = qp.device("default.qubit", wires=2)
>>> @qp.set_shots(shots=100)
... @qp.qnode(dev)
... def cost(weights):
...     qp.StronglyEntanglingLayers(weights, wires=range(2))
...     return qp.expval(H)

Once constructed, the cost function can be passed directly to the
optimizer's ``step`` method. The attributes ``opt.shots_used`` and
``opt.total_shots_used`` can be used to track the number of shots per
iteration, and across the life of the optimizer, respectively.

>>> shape = qp.templates.StronglyEntanglingLayers.shape(n_layers=2, n_wires=2)
>>> params = np.random.random(shape)
>>> opt = qp.ShotAdaptiveOptimizer(min_shots=10, term_sampling="weighted_random_sampling")
>>> for i in range(60):
...    params = opt.step(cost, params)
...    print(f"Step {i}: cost = {cost(params):.2f}, shots_used = {opt.total_shots_used}")
Step 0: cost = -5.69, shots_used = 240
Step 1: cost = -2.98, shots_used = 336
Step 2: cost = -4.97, shots_used = 624
Step 3: cost = -5.53, shots_used = 1054
Step 4: cost = -6.50, shots_used = 1798
Step 5: cost = -6.68, shots_used = 2942
Step 6: cost = -6.99, shots_used = 4350
Step 7: cost = -6.97, shots_used = 5814
Step 8: cost = -7.00, shots_used = 7230
Step 9: cost = -6.69, shots_used = 9006
Step 10: cost = -6.85, shots_used = 11286
Step 11: cost = -6.63, shots_used = 14934
Step 12: cost = -6.86, shots_used = 17934
Step 13: cost = -7.19, shots_used = 22950
Step 14: cost = -6.99, shots_used = 28302
Step 15: cost = -7.38, shots_used = 34134
Step 16: cost = -7.66, shots_used = 41022
Step 17: cost = -7.21, shots_used = 48918
Step 18: cost = -7.53, shots_used = 56286
Step 19: cost = -7.46, shots_used = 63822
Step 20: cost = -7.31, shots_used = 72534
Step 21: cost = -7.23, shots_used = 82014
Step 22: cost = -7.31, shots_used = 92838

.. details::
    :title: Usage Details

    The shot adaptive optimizer is based on the iCANS1 optimizer by
    `Kübler et al. (2020) <https://quantum-journal.org/papers/q-2020-05-11-263/>`__, and works
    as follows:

    1. The initial step of the optimizer is performed with some specified minimum
       number of shots, :math:`s_{min}`, for all partial derivatives.

    2. The parameter-shift rule is then used to estimate the gradient :math:`g_i` with :math:`s_i` shots
       for each parameter :math:`\theta_i`, parameters, as well as the variances
       :math:`v_i` of the estimated gradients.

    3. Gradient descent is performed for each parameter :math:`\theta_i`, using
       the pre-defined learning rate :math:`\eta` and the gradient information :math:`g_i`:
       :math:`\theta_i \rightarrow \theta_i - \eta g_i`.

    4. A maximum shot number is set by maximizing the improvement in the expected gain per shot.
       For a specific parameter value, the improvement in the expected gain per shot
       is then calculated via

       .. math::
           \gamma_i = \frac{1}{s_i} \left[ \left(\eta - \frac{1}{2} L\eta^2\right)
                       g_i^2 - \frac{L\eta^2}{2s_i}v_i \right],

       where:

       * :math:`L \leq \sum_i|c_i|` is the bound on the `Lipschitz constant
         <https://en.wikipedia.org/wiki/Lipschitz_continuity>`__ of the variational quantum algorithm objective function,

       * :math:`c_i` are the coefficients of the Hamiltonian, and

       * :math:`\eta` is the learning rate, and *must* be bound such that :math:`\eta < 2/L`
         for the above expression to hold.

    5. Finally, the new values of :math:`s_{i+1}` (shots for partial derivative of parameter
       :math:`\theta_i`) is given by:

       .. math::

           s_{i+1} = \frac{2L\eta}{2-L\eta}\left(\frac{v_i}{g_i^2}\right)\propto
                 \frac{v_i}{g_i^2}.

    In addition to the above, to counteract the presence of noise in the system, a
    running average of :math:`g_i` and :math:`s_i` (:math:`\chi_i` and :math:`\xi_i` respectively)
    are used when computing :math:`\gamma_i` and :math:`s_i`.

    For more details, see:

    * Andrew Arrasmith, Lukasz Cincio, Rolando D. Somma, and Patrick J. Coles. "Operator Sampling
      for Shot-frugal Optimization in Variational Algorithms." `arXiv:2004.06252
      <https://arxiv.org/abs/2004.06252>`__ (2020).

    * Jonas M. Kübler, Andrew Arrasmith, Lukasz Cincio, and Patrick J. Coles. "An Adaptive Optimizer
      for Measurement-Frugal Variational Algorithms." `Quantum 4, 263
      <https://quantum-journal.org/papers/q-2020-05-11-263/>`__ (2020).

### `qnode_weighted_random_sampling`

```python
def qnode_weighted_random_sampling(qnode, coeffs, observables, shots, argnums, *args, **kwargs)
```

Returns an array of length ``shots`` containing single-shot estimates
of the Hamiltonian gradient. The shots are distributed randomly over
the terms in the Hamiltonian, as per a multinomial distribution.

Args:
    qnode (.QNode): A QNode that returns the expectation value of a Hamiltonian.
    coeffs (List[float]): The coefficients of the Hamiltonian being measured
    observables (List[Operator]]): The terms of the Hamiltonian being measured
    shots (int): The number of shots used to estimate the Hamiltonian expectation
        value. These shots are distributed over the terms in the Hamiltonian,
        as per a Multinomial distribution.
    argnums (Sequence[int]): the QNode argument indices which are trainable
    *args: Arguments to the QNode
    **kwargs: Keyword arguments to the QNode

Returns:
    array[float]: the single-shot gradients of the Hamiltonian expectation value

### `check_learning_rate`

```python
def check_learning_rate(self, coeffs)
```

Verifies that the learning rate is less than 2 over the Lipschitz constant,
where the Lipschitz constant is given by :math:`\sum |c_i|` for Hamiltonian
coefficients :math:`c_i`.

Args:
    coeffs (Sequence[float]): the coefficients of the terms in the Hamiltonian

Raises:
    ValueError: if the learning rate is large than :math:`2/\sum |c_i|`

### `compute_grad`

```python
def compute_grad(self, objective_fn, args, kwargs)
```

Compute the gradient of the objective function, as well as the variance of the gradient,
at the given point.

Args:
    objective_fn (function): the objective function for optimization
    args: arguments to the objective function
    kwargs: keyword arguments to the objective function

Returns:
    tuple[array[float], array[float]]: a tuple of NumPy arrays containing the gradient
    :math:`\nabla f(x^{(t)})` and the variance of the gradient

### `step`

```python
def step(self, objective_fn, *args, **kwargs)
```

Update trainable arguments with one step of the optimizer.

Args:
    objective_fn (function): the objective function for optimization
    *args: variable length argument list for objective function
    **kwargs: variable length of keyword arguments for the objective function

Returns:
    list[array]: The new variable values :math:`x^{(t+1)}`.
    If single arg is provided, list[array] is replaced by array.

### `step_and_cost`

```python
def step_and_cost(self, objective_fn, *args, **kwargs)
```

Update trainable arguments with one step of the optimizer and return the corresponding
objective function value prior to the step.

The objective function will be evaluated using the maximum number of shots
across all parameters as determined by the optimizer during the
optimization step.

.. warning::

    Unlike other gradient descent optimizers, the objective function will be evaluated
    **separately** to the gradient computation, and will result in extra
    device evaluations.

Args:
    objective_fn (function): the objective function for optimization
    *args : variable length argument list for objective function
    **kwargs : variable length of keyword arguments for the objective function

Returns:
    tuple[list [array], float]: the new variable values :math:`x^{(t+1)}` and the objective
    function output prior to the step.
    If single arg is provided, list [array] is replaced by array.
