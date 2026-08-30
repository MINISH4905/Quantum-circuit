---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/optimize/rotoselect.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/optimize/rotoselect.py
license: Apache-2.0
---

## Module `pennylane/optimize/rotoselect.py`

Rotoselect gradient free optimizer

## `RotoselectOptimizer`

```python
class RotoselectOptimizer
```

Rotoselect gradient-free optimizer.

The Rotoselect optimizer minimizes an objective function with respect to the rotation gates and
parameters of a quantum circuit without the need for calculating the gradient of the function.
The algorithm works by updating the parameters :math:`\theta = \theta_1, \dots, \theta_D`
and rotation gate choices :math:`R = R_1,\dots,R_D` one at a time according to a closed-form
expression for the optimal value of the :math:`d^{th}` parameter :math:`\theta^*_d` when the
other parameters and gate choices are fixed:

.. math:: \theta^*_d = \underset{\theta_d}{\text{argmin}}\left<H\right>_{\theta_d}
          = -\frac{\pi}{2} - \text{arctan2}\left(2\left<H\right>_{\theta_d=0}
          - \left<H\right>_{\theta_d=\pi/2} - \left<H\right>_{\theta_d=-\pi/2},
          \left<H\right>_{\theta_d=\pi/2} - \left<H\right>_{\theta_d=-\pi/2}\right),

where :math:`\left<H\right>_{\theta_d}` is the expectation value of the objective function
optimized over the parameter :math:`\theta_d`. :math:`\text{arctan2}(x, y)` computes the
element-wise arc tangent of :math:`x/y` choosing the quadrant correctly, avoiding, in
particular, division-by-zero when :math:`y = 0`.

Which parameters and gates that should be optimized over is decided in the user-defined cost
function, where :math:`R` is a list of parametrized rotation gates in a quantum circuit, along
with their respective parameters :math:`\theta` for the circuit and its gates. Note that the
number of generators should match the number of parameters.

The algorithm is described in further detail in
`Ostaszewski et al. (2021) <https://doi.org/10.22331/q-2021-01-28-391>`_.

Args:
    possible_generators (list[~.Operation]): list containing the possible
        ``pennylane.ops.qubit`` operators that are allowed in the circuit.
        Default is the set of Pauli rotations :math:`\{R_x, R_y, R_z\}`.

**Example:**

Initialize the Rotoselect optimizer, set the initial values of  the weights ``x``,
choose the initial generators, and set the number of steps to optimize over.

>>> opt = qp.optimize.RotoselectOptimizer()
>>> x = [0.3, 0.7]
>>> generators = [qp.RX, qp.RY]
>>> n_steps = 10

Set up the PennyLane circuit using the ``default.qubit`` simulator device.

>>> dev = qp.device("default.qubit", wires=2)
>>> @qp.qnode(dev)
... def circuit(params, generators=None):  # generators will be passed as a keyword arg
...     generators[0](params[0], wires=0)
...     generators[1](params[1], wires=1)
...     qp.CNOT(wires=[0, 1])
...     return qp.expval(qp.Z(0)), qp.expval(qp.X(1))

Define a cost function based on the above circuit.

>>> def cost(x, generators):
...     Z_1, X_2 = circuit(x, generators=generators)
...     return 0.2 * Z_1 + 0.5 * X_2

Run the optimization step-by-step for ``n_steps`` steps.

>>> cost_rotosel = []
>>> for _ in range(n_steps):
...     cost_rotosel.append(cost(x, generators))
...     x, generators = opt.step(cost, x, generators)

The optimized values for x should now be stored in ``x`` together with the optimal gates for
the circuit, while steps-vs-cost can be seen by plotting ``cost_rotosel``.

### `step_and_cost`

```python
def step_and_cost(self, objective_fn, x, generators, **kwargs)
```

Update trainable arguments with one step of the optimizer and return the corresponding
objective function value prior to the step.

Args:
    objective_fn (function): The objective function for optimization. It must have the
        signature ``objective_fn(x, generators=None)`` with a sequence of the values ``x``
        and a list of the gates ``generators`` as inputs, returning a single value.
    x (Union[Sequence[float], float]): sequence containing the initial values of the
        variables to be optimized over or a single float with the initial value
    generators (list[~.Operation]): list containing the initial ``pennylane.ops.qubit``
        operators to be used in the circuit and optimized over
    **kwargs : variable length of keyword arguments for the objective function.

Returns:
    tuple: the new variable values :math:`x^{(t+1)}`, the new generators, and the objective
    function output prior to the step

### `step`

```python
def step(self, objective_fn, x, generators, **kwargs)
```

Update trainable arguments with one step of the optimizer.

Args:
    objective_fn (function): The objective function for optimization. It must have the
        signature ``objective_fn(x, generators=None)`` with a sequence of the values ``x``
        and a list of the gates ``generators`` as inputs, returning a single value.
    x (Union[Sequence[float], float]): sequence containing the initial values of the
        variables to be optimized over or a single float with the initial value
    generators (list[~.Operation]): list containing the initial ``pennylane.ops.qubit``
        operators to be used in the circuit and optimized over
    **kwargs : variable length of keyword arguments for the objective function.

Returns:
    array: The new variable values :math:`x^{(t+1)}` as well as the new generators.
