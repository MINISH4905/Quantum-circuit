---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/optimize/momentum_qng_qjit.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/optimize/momentum_qng_qjit.py
license: Apache-2.0
---

## Module `pennylane/optimize/momentum_qng_qjit.py`

Quantum natural gradient optimizer with momentum for Jax/Catalyst interface

## `MomentumQNGOptimizerQJIT`

```python
class MomentumQNGOptimizerQJIT(QNGOptimizerQJIT)
```

Optax-like and ``jax.jit``/``qp.qjit``-compatible implementation of the :class:`~.MomentumQNGOptimizer`,
a generalized Quantum Natural Gradient (QNG) optimizer considering a discrete-time Langevin equation
with QNG force.

For more theoretical details, see the :class:`~.MomentumQNGOptimizer` documentation.

.. note::

    Please be aware of the following:

    - As with ``MomentumQNGOptimizer``, ``MomentumQNGOptimizerQJIT`` supports a single QNode to encode the objective function.

    - ``MomentumQNGOptimizerQJIT`` does not support any QNode with multiple arguments. A potential workaround
      would be to combine all parameters into a single objective function argument.

    - ``MomentumQNGOptimizerQJIT`` does not work correctly if there is any classical processing in the QNode circuit
      (e.g., ``2 * theta`` as a gate parameter).

Parameters:
    stepsize (float): the stepsize hyperparameter (default value: 0.01).
    momentum (float): the momentum coefficient hyperparameter (default value: 0.9).
    approx (str): approximation method for the metric tensor (default value: "block-diag").

        - If ``None``, the full metric tensor is computed

        - If ``"block-diag"``, the block-diagonal approximation is computed, reducing
          the number of evaluated circuits significantly

        - If ``"diag"``, the diagonal approximation is computed, slightly
          reducing the classical overhead but not the quantum resources
          (compared to ``"block-diag"``)

    lam (float): metric tensor regularization to be applied at each optimization step (default value: 0).

**Example:**

Consider a hybrid workflow to optimize an objective function defined by a quantum circuit.
To make the entire workflow faster, the update step and the whole optimization
can be just-in-time compiled using the :func:`~.qjit` decorator:

.. code-block:: python

    import pennylane as qp
    import jax.numpy as jnp

    dev = qp.device("lightning.qubit", wires=2)

    @qp.qnode(dev)
    def circuit(params):
        qp.RX(params[0], wires=0)
        qp.RY(params[1], wires=1)
        return qp.expval(qp.Z(0) + qp.X(1))

    opt = qp.MomentumQNGOptimizerQJIT(stepsize=0.1, momentum=0.2)

    @qp.qjit
    def update_step_qjit(i, args):
        params, state = args
        return opt.step(circuit, params, state)

    @qp.qjit
    def optimization_qjit(params, iters):
        state = opt.init(params)
        args = (params, state)
        params, state = qp.for_loop(iters)(update_step_qjit)(args)
        return params

>>> params = jnp.array([0.1, 0.2])
>>> iters = 1000
>>> optimization_qjit(params=params, iters=iters)
Array([ 3.14159265, -1.57079633], dtype=float64)

Make sure you are using the ``lightning.qubit`` device along with ``qp.qjit``.

### `init`

```python
def init(self, params)
```

Return the initial state of the optimizer. This state is always initialized as an
array of zeros with the same shape and type of the given array of parameters.

Args:
    params (array): QNode parameters

Returns:
    array: initial state of the optimizer
