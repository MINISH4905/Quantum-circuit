---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/_grad/value_and_grad.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/_grad/value_and_grad.py
license: Apache-2.0
---

## Module `pennylane/_grad/value_and_grad.py`

Defines qp.value_and_grad.

## `value_and_grad`

```python
class value_and_grad
```

A :func:`~.qjit`-compatible transformation for returning the result and jacobian of a
function.

This function allows the value and the gradient of a hybrid quantum-classical function to be
computed within the compiled program.

Note that ``value_and_grad`` can be more efficient, and reduce overall quantum executions,
compared to separately executing the function and then computing its gradient.

.. warning::

    Currently, higher-order differentiation is only supported by the finite-difference
    method.

Args:
    fn (Callable): a function or a function object to differentiate
    method (str): The method used for differentiation, which can be any of ``["auto", "fd"]``,
                  where:

                  - ``"auto"`` represents deferring the quantum differentiation to the method
                    specified by the QNode, while the classical computation is differentiated
                    using traditional auto-diff. Catalyst supports ``"parameter-shift"`` and
                    ``"adjoint"`` on internal QNodes. Notably, QNodes with
                    ``diff_method="finite-diff"`` are not supported with ``"auto"``.

                  - ``"fd"`` represents first-order finite-differences for the entire hybrid
                    function.

    h (float): the step-size value for the finite-difference (``"fd"``) method
    argnums (Tuple[int, List[int]]): the argument indices to differentiate

Returns:
    Callable: A callable object that computes the value and gradient of the wrapped function
    for the given arguments.

Raises:
    ValueError: Invalid method or step size parameters.
    DifferentiableCompilerError: Called on a function that doesn't return a single scalar.

.. note::

    Any JAX-compatible optimization library, such as `Optax
    <https://optax.readthedocs.io/en/stable/index.html>`_, can be used
    alongside ``value_and_grad`` for JIT-compatible variational workflows.
    See the :doc:`quickstart guide <catalyst:dev/quick_start>` for examples.

.. seealso:: :func:`~.grad`, :func:`~.jacobian`

**Example 1 (Classical preprocessing)**

.. code-block:: python

    dev = qp.device("lightning.qubit", wires=1)

    @qp.qjit
    def workflow(x):
        @qp.qnode(dev)
        def circuit(x):
            qp.RX(jnp.pi * x, wires=0)
            return qp.expval(qp.PauliY(0))
        return qp.value_and_grad(circuit)(x)

>>> workflow(0.2)
(Array(-0.58778525, dtype=float64), Array(-2.54160185, dtype=float64))

**Example 2 (Classical preprocessing and postprocessing)**

.. code-block:: python

    dev = qp.device("lightning.qubit", wires=1)

    @qp.qjit
    def value_and_grad_loss(theta):
        @qp.qnode(dev, diff_method="adjoint")
        def circuit(theta):
            qp.RX(jnp.exp(theta ** 2) / jnp.cos(theta / 4), wires=0)
            return qp.expval(qp.PauliZ(wires=0))

        def loss(theta):
            return jnp.pi / jnp.tanh(circuit(theta))

        return qp.value_and_grad(loss, method="auto")(theta)

>>> value_and_grad_loss(1.0)
(Array(-4.2622289, dtype=float64), Array(5.04324559, dtype=float64))

**Example 3 (Purely classical functions)**

.. code-block:: python

    def square(x: float):
        return x ** 2

    @qp.qjit
    def dsquare(x: float):
        return qp.value_and_grad(square)(x)

>>> dsquare(2.3)
(Array(5.29, dtype=float64), Array(4.6, dtype=float64))
