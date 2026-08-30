---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/optimize/qng_qjit.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/optimize/qng_qjit.py
license: Apache-2.0
---

## Module `pennylane/optimize/qng_qjit.py`

Quantum natural gradient optimizer for Jax/Catalyst interface

## `QNGOptimizerQJIT`

```python
class QNGOptimizerQJIT
```

Optax-like and ``jax.jit``/``qp.qjit``-compatible implementation of the :class:`~.QNGOptimizer`,
a step- and parameter-dependent learning rate optimizer, leveraging a reparameterization of
the optimization space based on the Fubini-Study metric tensor.

For more theoretical details, see the :class:`~.QNGOptimizer` documentation.

.. note::

    Please be aware of the following:

        - As with ``QNGOptimizer``, ``QNGOptimizerQJIT`` supports a single QNode to encode the objective function.

        - ``QNGOptimizerQJIT`` does not support any QNode with multiple arguments. A potential workaround
          would be to combine all parameters into a single objective function argument.

        - ``QNGOptimizerQJIT`` does not work correctly if there is any classical processing in the QNode circuit
          (e.g., ``2 * theta`` as a gate parameter).

Args:
    stepsize (float): the user-defined stepsize hyperparameter (default value: 0.01).
    approx (str): approximation method for the metric tensor (default value: "block-diag").

        - If ``None``, the full metric tensor is computed.

        - If ``"block-diag"``, the block-diagonal approximation is computed, reducing
          the number of evaluated circuits significantly.

        - If ``"diag"``, the diagonal approximation is computed, slightly
          reducing the classical overhead but not the quantum resources
          (compared to ``"block-diag"``).

    lam (float): metric tensor regularization to be applied at each optimization step (default value: 0).

**Example:**

Consider a hybrid workflow to optimize an objective function defined by a quantum circuit.
To make the optimization faster, the entire workflow can be just-in-time compiled using
the ``qp.qjit`` decorator:

.. code-block:: python

    import pennylane as qp
    import jax.numpy as jnp

    @qp.qjit(autograph=True)
    def workflow():
        dev = qp.device("lightning.qubit", wires=2)

        @qp.qnode(dev)
        def circuit(params):
            qp.RX(params[0], wires=0)
            qp.RY(params[1], wires=1)
            return qp.expval(qp.Z(0) + qp.X(1))

        opt = qp.QNGOptimizerQJIT(stepsize=0.2)

        params = jnp.array([0.1, 0.2])
        state = opt.init(params)
        for _ in range(100):
            params, state = opt.step(circuit, params, state)

        return params

>>> workflow()
Array([ 3.14159265, -1.57079633], dtype=float64)

Make sure you are using the ``lightning.qubit`` device along with ``qp.qjit`` with ``autograph`` enabled.
Using ``qp.qjit`` on the whole workflow with ``autograph`` not enabled may lead to a substantial increase
in compilation time and no runtime benefits.

The ``jax.jit`` decorator should not be used on the entire workflow.
However, it can be used with the ``default.qubit`` device to just-in-time
compile the ``step`` (or ``step_and_cost``) method of the optimizer, leading
to a significative increase in runtime performance:

.. code-block:: python

    import pennylane as qp
    import jax.numpy as jnp
    import jax
    from functools import partial

    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def circuit(params):
        qp.RX(params[0], wires=0)
        qp.RY(params[1], wires=1)
        return qp.expval(qp.Z(0) + qp.X(1))

    opt = qp.QNGOptimizerQJIT(stepsize=0.2)
    step = jax.jit(partial(opt.step, circuit))

    params = jnp.array([0.1, 0.2])
    state = opt.init(params)
    for _ in range(100):
        params, state = step(params, state)

>>> params
Array([ 3.14159265, -1.57079633], dtype=float64)

### `init`

```python
def init(self, params)
```

Return the initial state of the optimizer.

Args:
    params (array): QNode parameters

Returns:
    None

.. note::

    Since the Quantum Natural Gradient (QNG) algorithm doesn't actually require any particular state,
    this method always returns an empty ``None`` state. However, it is provided to match
    the ``optax``-like interface for all Jax-based quantum-specific optimizers.

### `step`

```python
def step(self, qnode, params, state, **kwargs)
```

Update the QNode parameters and the optimizer's state for a single optimization step.

Args:
    qnode (QNode): QNode objective function to be optimized
    params (array): QNode parameters to be updated
    state: current state of the optimizer
    **kwargs : variable-length keyword arguments for the QNode

Returns:
    tuple: (new parameters values, new optimizer's state)

### `step_and_cost`

```python
def step_and_cost(self, qnode, params, state, **kwargs)
```

Update the QNode parameters and the optimizer's state for a single optimization step
and return the corresponding objective function value prior to the step.

Args:
    qnode (QNode): QNode objective function to be optimized
    params (array): QNode parameters to be updated
    state: current state of the optimizer
    **kwargs : variable-length keyword arguments for the QNode

Returns:
    tuple: (new parameters values, new optimizer's state, objective function value)
