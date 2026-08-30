---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/optimize/qnspsa.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/optimize/qnspsa.py
license: Apache-2.0
---

## Module `pennylane/optimize/qnspsa.py`

Quantum natural SPSA optimizer

## `QNSPSAOptimizer`

```python
class QNSPSAOptimizer
```

Quantum natural SPSA (QNSPSA) optimizer. QNSPSA is a second-order SPSA algorithm, which
updates the ansatz parameters with the following equation:

.. math::

    \mathbf{x}^{(t + 1)} = \mathbf{x}^{(t)} -
    \eta \widehat{\mathbf{g}}^{-1}(\mathbf{x}^{(t)})\widehat{\nabla f}(\mathbf{x}^{(t)}),

where :math:`f(\mathbf{x})` is the objective function with input parameters :math:`\mathbf{x}`,
while :math:`\nabla f` is the gradient, :math:`\mathbf{g}` is the second-order Fubini-Study metric
tensor. With QNSPSA algorithm, both the gradient and the metric tensor are estimated
stochastically, with :math:`\widehat{\nabla f}` and :math:`\widehat{\mathbf{g}}`. This stochastic
approach requires only a fixed number of circuit executions per optimization step,
independent of the problem size. This preferred scaling makes
it a promising candidate for the optimization tasks for high-dimensional ansatzes. On the
other hand, the introduction of the Fubini-Study metric into the optimization helps to find
better minima and allows for faster convergence.

The gradient is estimated similarly as the `SPSA optimizer
<https://pennylane.readthedocs.io/en/stable/code/api/pennylane.SPSAOptimizer.html>`_, with a
pair of perturbations:

.. math::

    \widehat{\nabla f}(\mathbf{x}) = \widehat{\nabla f}(\mathbf{x}, \mathbf{h})
    \approx \frac{1}{2\epsilon}\big(f(\mathbf{x} + \epsilon \mathbf{h}) - f(\mathbf{x} - \epsilon \mathbf{h})\big),

where :math:`\epsilon` is the finite-difference step size specified by the user, and
:math:`\mathbf{h}` is a randomly sampled direction vector to perform the perturbation.

The Fubini-Study metric tensor is estimated with another two pairs of perturbations along
randomly sampled directions :math:`\mathbf{h_1}` and :math:`\mathbf{h_2}`:

.. math::

    \widehat{\mathbf{g}}(\mathbf{x}) = \widehat{\mathbf{g}}(\mathbf{x}, \mathbf{h}_1, \mathbf{h}_2)
    \approx \frac{\delta F}{8 \epsilon^2}\Big(\mathbf{h}_1 \mathbf{h}_2^\intercal + \mathbf{h}_2 \mathbf{h}_1^\intercal\Big),

where :math:`F(\mathbf{x}', \mathbf{x}) = \bigr\rvert\langle \phi(\mathbf{x}') | \phi(\mathbf{x}) \rangle \bigr\rvert ^ 2`
measures the state overlap between :math:`\phi(\mathbf{x}')` and :math:`\phi(\mathbf{x})`,
where :math:`\phi` is the parametrized ansatz. The finite difference :math:`\delta F` is
computed from the two perturbations:

.. math::

    \delta F = F(\mathbf{x, \mathbf{x} + \epsilon \mathbf{h}_1} + \epsilon \mathbf{h}_2)
    - F (\mathbf{x, \mathbf{x} + \epsilon \mathbf{h}_1}) - F(\mathbf{x, \mathbf{x}
    - \epsilon \mathbf{h}_1} + \epsilon \mathbf{h}_2)
    + F(\mathbf{x, \mathbf{x} - \epsilon \mathbf{h}_1}).

For more details, see:

    Julien Gacon, Christa Zoufal, Giuseppe Carleo, and Stefan Woerner.
    "Simultaneous Perturbation Stochastic Approximation of the Quantum Fisher Information."
    `Quantum, 5, 567 <https://quantum-journal.org/papers/q-2021-10-20-567/>`_, 2021.

You can also find a walkthrough of the implementation in this :doc:`tutorial <demo:demos/qnspsa>`.

Args:
    stepsize (float): the user-defined hyperparameter :math:`\eta` for learning rate (default value: 1e-3).
    regularization (float): regularization term :math:`\beta` to the Fubini-Study metric tensor
        for numerical stability (default value: 1e-3).
    finite_diff_step (float): step size :math:`\epsilon` to compute the finite difference
        gradient and the Fubini-Study metric tensor (default value: 1e-2).
    resamplings (int): the number of samples to average for each parameter update (default value: 1).
    blocking (boolean): when set to be True, the optimizer only accepts updates that lead to a
        loss value no larger than the loss value before update, plus a tolerance. The tolerance
        is set with the hyperparameter ``history_length``. The ``blocking`` option is
        observed to help the optimizer to converge significantly faster (default value: True).
    history_length (int): when ``blocking`` is True, the tolerance is set to be the average of
        the cost values in the last ``history_length`` steps (default value: 5).
    seed (int): seed for the random sampling (default value: None).

**Examples:**

For VQE/VQE-like problems, the objective function can be defined within a qnode:

>>> num_qubits = 2
>>> dev = qp.device("default.qubit", wires=num_qubits)
>>> @qp.qnode(dev)
... def cost(params):
...     qp.RX(params[0], wires=0)
...     qp.CRY(params[1], wires=[0, 1])
...     return qp.expval(qp.Z(0) @ qp.Z(1))

Once constructed, the qnode can be passed directly to the ``step`` or ``step_and_cost``
function of the optimizer.

>>> from pennylane import numpy as np
>>> params = np.random.rand(2)
>>> opt = QNSPSAOptimizer(stepsize=5e-2)
>>> for i in range(51):
>>>     params, loss = opt.step_and_cost(cost, params)
>>>     if i % 10 == 0:
...         print(f"Step {i}: cost = {loss:.4f}")
Step 0: cost = 0.9987
Step 10: cost = 0.9841
Step 20: cost = 0.8921
Step 30: cost = 0.0910
Step 40: cost = -0.9369
Step 50: cost = -0.9984

### `step`

```python
def step(self, cost, *args, **kwargs)
```

Update trainable arguments with one step of the optimizer.

.. note::
    When blocking is set to be True, ``step`` calls ``step_and_cost`` on the backend, as loss
    measurements are required by the algorithm in this scenario.

Args:
    cost (QNode): the QNode wrapper for the objective function for optimization
    args : variable length argument list for qnode
    kwargs : variable length of keyword arguments for the qnode

Returns:
    pnp.ndarray: the new variable values after step-wise update :math:`x^{(t+1)}`

### `step_and_cost`

```python
def step_and_cost(self, cost, *args, **kwargs)
```

Update trainable parameters with one step of the optimizer and return
the corresponding objective function value after the step.

Args:
    cost (QNode): the QNode wrapper for the objective function for optimization
    args : variable length argument list for qnode
    kwargs : variable length of keyword arguments for the qnode

Returns:
    (np.array, float): the new variable values :math:`x^{(t+1)}` and the objective
    function output prior to the step
