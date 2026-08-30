---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/optimize/spsa.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/optimize/spsa.py
license: Apache-2.0
---

## Module `pennylane/optimize/spsa.py`

SPSA optimizer

## `SPSAOptimizer`

```python
class SPSAOptimizer
```

The Simultaneous Perturbation Stochastic Approximation method (SPSA)
is a stochastic approximation algorithm for optimizing cost functions whose evaluation may involve noise.

While other gradient-based optimization methods usually attempt to compute
the gradient analytically, SPSA involves approximating gradients at the cost of
evaluating the cost function twice in each iteration step. This cost may result in
a significant decrease in the overall cost of function evaluations for the entire optimization.
It is based on an approximation of the unknown gradient :math:`\hat{g}(\hat{\theta}_{k})`
through a simultaneous perturbation of the input parameters:

.. math::
    \hat{g}_k(\hat{\theta}_k) = \frac{y(\hat{\theta}_k+c_k\Delta_k)-
    y(\hat{\theta}_k-c_k\Delta_k)}{2c_k} \begin{bmatrix}
       \Delta_{k1}^{-1} \\
       \Delta_{k2}^{-1} \\
       \vdots \\
       \Delta_{kp}^{-1}
     \end{bmatrix}\text{,}

where

* :math:`k` is the current iteration step,
* :math:`\hat{\theta}_k` are the input parameters at iteration step :math:`k`,
* :math:`y` is the objective function,
* :math:`c_k=\frac{c}{k^\gamma}` is the gain sequence corresponding to evaluation step size
  and it can be controlled with

  * scaling parameter :math:`c` and
  * scaling exponent :math:`\gamma`

* :math:`\Delta_{ki}^{-1} \left(1 \leq i \leq p \right)` are the inverted elements of
  random pertubation vector :math:`\Delta_k`.

:math:`\hat{\theta}_k` is updated to a new set of parameters with

.. math::
    \hat{\theta}_{k+1} = \hat{\theta}_{k} - a_k\hat{g}_k(\hat{\theta}_k)\text{,}

where the gain sequences :math:`a_k=\frac{a}{(A+k)^\alpha}` controls parameter update step size.

The gain sequence :math:`a_k` can be controlled with

* scaling parameter :math:`a`,
* scaling exponent :math:`\alpha` and
* stability constant :math:`A`

For more details, see `Spall (1998a)
<https://www.jhuapl.edu/SPSA/PDF-SPSA/Spall_An_Overview.PDF>`_.

.. note::

    * One SPSA iteration step of a cost function that involves computing the expectation value of
      a Hamiltonian with ``M`` terms requires :math:`2*M` quantum device executions.
    * The forward-pass value of the cost function is not computed when stepping the optimizer.
      Therefore, in case of using ``step_and_cost`` method instead of ``step``, the number
      of executions will include the cost function evaluations.

Args:
    maxiter (int): the maximum number of iterations expected to be performed.
        Used to determine :math:`A`, if :math:`A` is not supplied, otherwise ignored.
    alpha (float): a hyperparameter to calculate :math:`a_k=\frac{a}{(A+k+1)^\alpha}`
        for each iteration. Its asymptotically optimal value is 1.0 (default value: 0.602).
    gamma (float): a hyperparameter to calculate :math:`c_k=\frac{c}{(k+1)^\gamma}`
        for each iteration. Its asymptotically optimal value is 1/6 (default value: 0.101).
    c (float): a hyperparameter related to the expected noise. It should be
        approximately the standard deviation of the expected noise of the cost function (default value: 0.2).
    A (float): stability constant. If not provided, it is set to be 10% of the maximum number
        of expected iterations.
    a (float): a hyperparameter expected to be small in noisy situations,
        its value could be picked using `A`, :math:`\alpha` and :math:`\hat{g_0} (\hat{\theta_0})`.
        For more details, see `Spall (1998b)
        <https://www.jhuapl.edu/spsa/PDF-SPSA/Spall_Implementation_of_the_Simultaneous.PDF>`_.

**Examples:**

For VQE/VQE-like problems, the objective function can be the following:

>>> from pennylane import numpy as np
>>> coeffs = [0.2, -0.543, 0.4514]
>>> obs = [qp.X(0) @ qp.Z(1), qp.Z(0) @ qp.Hadamard(2),
...             qp.X(3) @ qp.Z(1)]
>>> H = qp.Hamiltonian(coeffs, obs)
>>> num_qubits = 4
>>> dev = qp.device("default.qubit", wires=num_qubits)
>>> @qp.qnode(dev)
... def cost(params, num_qubits=1):
...     qp.BasisState(np.array([1, 1, 0, 0]), wires=range(num_qubits))
...     for i in range(num_qubits):
...         qp.Rot(*params[i], wires=0)
...         qp.CNOT(wires=[2, 3])
...         qp.CNOT(wires=[2, 0])
...         qp.CNOT(wires=[3, 1])
...     return qp.expval(H)
...
>>> params = np.random.normal(0, np.pi, (num_qubits, 3), requires_grad=True)

Once constructed, the cost function can be passed directly to the
``step`` or ``step_and_cost`` function of the optimizer:

>>> max_iterations = 100
>>> opt = qp.SPSAOptimizer(maxiter=max_iterations)
>>> for _ in range(max_iterations):
...     params, energy = opt.step_and_cost(cost, params, num_qubits=num_qubits)
>>> print(energy)
-0.4294539602541956

The algorithm provided by SPSA does not rely on built-in automatic differentiation capabilities of the interface being used
and therefore the optimizer can be used in more complex hybrid classical-quantum workflow with any of the interfaces:

>>> import tensorflow as tf
>>> n_qubits = 1
>>> max_iterations = 20
>>> dev = qp.device("default.qubit", wires=n_qubits)
>>> @qp.qnode(dev, interface="tf")
... def layer_fn_spsa(inputs, weights):
...     qp.AngleEmbedding(inputs, wires=range(n_qubits))
...     qp.BasicEntanglerLayers(weights, wires=range(n_qubits))
...     return qp.expval(qp.Z(0))
...
>>> opt = qp.SPSAOptimizer(maxiter=max_iterations)
... def fn(params, tensor_in, tensor_out):
...     with tf.init_scope():
...             for _ in range(max_iterations):
...                     # Some classical steps before the quantum computation
...                     params_a, layer_res = opt.step_and_cost(layer_fn_spsa,
...                                     tf.constant(tensor_in),
...                                     tf.Variable(params))
...                     params = params_a[1]
...                     tensor_out = layer_res
...                     # Some classical steps after the quantum computation
...     return layer_res
...
>>> tensor_in = tf.Variable([0.27507603])
>>> tensor_out = tf.Variable([0])
>>> params = tf.Variable([[3.97507603],
...     [3.12950603],
...     [1.00854038],
...     [1.25907603]])
>>> loss = fn(params, tensor_in, tensor_out)
>>> print(loss)
tf.Tensor(-0.9995854230771829, shape=(), dtype=float64)

### `step_and_cost`

```python
def step_and_cost(self, objective_fn, *args, **kwargs)
```

Update the parameter array :math:`\hat{\theta}_k` with one step of the
optimizer and return the step and the corresponding objective function. The number
of steps stored by the ``k`` attribute of the optimizer is counted internally when calling ``step_and_cost`` and ``cost``.

Args:
    objective_fn (function): the objective function for optimization
    *args : variable length argument array for objective function
    **kwargs : variable length of keyword arguments for the objective function

Returns:
    tuple[list [array], float]: the new variable values :math:`\hat{\theta}_{k+1}` and the
    objective function output prior to the step.

### `step`

```python
def step(self, objective_fn, *args, **kwargs)
```

Update trainable arguments with one step of the optimizer. The number
of steps is being counted through calls to ``step_and_cost`` and ``cost``.

Args:
    objective_fn (function): the objective function for optimization
    *args : variable length argument array for objective function
    **kwargs : variable length of keyword arguments for the objective function

Returns:
    list [array]: the new variable values :math:`\hat{\theta}_{k+1}`.

### `compute_grad`

```python
def compute_grad(self, objective_fn, args, kwargs)
```

Approximate the gradient of the objective function at the
given point.

Args:
    objective_fn (function): The objective function for optimization
    args (tuple): tuple of NumPy array containing the current parameters
        for objective function
    kwargs (dict): keyword arguments for the objective function

Returns:
    tuple (array): NumPy array containing the gradient
        :math:`\hat{g}_k(\hat{\theta}_k)`

### `apply_grad`

```python
def apply_grad(self, grad, args)
```

Update the variables to take a single optimization step.

Args:
    grad (tuple [array]): the gradient approximation of the objective
        function at point :math:`\hat{\theta}_{k}`
    args (tuple): the current value of the variables :math:`\hat{\theta}_{k}`

Returns:
    list [array]: the new values :math:`\hat{\theta}_{k+1}`
