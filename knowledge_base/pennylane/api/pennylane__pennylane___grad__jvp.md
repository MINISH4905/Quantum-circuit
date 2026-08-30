---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/_grad/jvp.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/_grad/jvp.py
license: Apache-2.0
---

## Module `pennylane/_grad/jvp.py`

Defines qp.jvp

## `jvp`

```python
def jvp(f, params, tangents, method=None, h=None, argnums=None)
```

A :func:`~.qjit` compatible Jacobian-vector product of PennyLane programs.

This function allows the Jacobian-vector Product of a hybrid quantum-classical function to be
computed within the compiled program.

.. warning::

    ``jvp`` is intended to be used with :func:`~.qjit` only.

.. note::

    When used with :func:`~.qjit`, this function only supports the Catalyst compiler;
    see :func:`catalyst.jvp` for more details.

    Please see the Catalyst :doc:`quickstart guide <catalyst:dev/quick_start>`,
    as well as the :doc:`sharp bits and debugging tips <catalyst:dev/sharp_bits>`
    page for an overview of the differences between Catalyst and PennyLane.

Args:
    f (Callable): Function-like object to calculate JVP for
    params (List[Array]): List (or a tuple) of the function arguments specifying the point
                          to calculate JVP at. A subset of these parameters are declared as
                          differentiable by listing their indices in the ``argnums`` parameter.
    tangents(List[Array]): List (or a tuple) of tangent values to use in JVP. The list size and
                           shapes must match the ones of differentiable params.
    method(str): Differentiation method to use, same as in :func:`~.grad`.
    h (float): the step-size value for the finite-difference (``"fd"``) method
    argnums (Union[int, List[int]]): the params' indices to differentiate.

Returns:
    Tuple[Array]: Return values of ``f`` paired with the JVP values.

Raises:
    TypeError: invalid parameter types
    ValueError: invalid parameter values

.. seealso:: :func:`~.grad`, :func:`~.vjp`, :func:`~.jacobian`

**Example 1 (basic usage)**

.. code-block:: python

    @qp.qjit
    def jvp(params, tangent):
      def f(x):
          y = [jnp.sin(x[0]), x[1] ** 2, x[0] * x[1]]
          return jnp.stack(y)

      return qp.jvp(f, [params], [tangent])

>>> x = jnp.array([0.1, 0.2])
>>> tangent = jnp.array([0.3, 0.6])
>>> jvp(x, tangent)
(Array([0.09983342, 0.04      , 0.02      ], dtype=float64), Array([0.29850125, 0.24      , 0.12      ], dtype=float64))

**Example 2 (argnums usage)**

Here we show how to use ``argnums`` to ignore the non-differentiable parameter ``n`` of the
target function. Note that the length and shapes of tangents must match the length and shape of
primal parameters, which we mark as differentiable by passing their indices to ``argnums``.

.. code-block:: python

    @qp.qjit
    @qp.qnode(qp.device("lightning.qubit", wires=2))
    def circuit(n, params):
        qp.RX(params[n, 0], wires=n)
        qp.RY(params[n, 1], wires=n)
        return qp.expval(qp.Z(1))

    @qp.qjit
    def workflow(primals, tangents):
        return qp.jvp(circuit, [1, primals], [tangents], argnums=[1])

>>> params = jnp.array([[0.54, 0.3154], [0.654, 0.123]])
>>> dy = jnp.array([[1.0, 1.0], [1.0, 1.0]])
>>> workflow(params, dy)
(Array(0.78766064, dtype=float64), Array(-0.70114352, dtype=float64))
