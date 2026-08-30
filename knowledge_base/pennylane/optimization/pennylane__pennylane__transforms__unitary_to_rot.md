---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/unitary_to_rot.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/unitary_to_rot.py
license: Apache-2.0
---

## Module `pennylane/transforms/unitary_to_rot.py`

A transform for decomposing arbitrary single-qubit QubitUnitary gates into elementary gates.

## `unitary_to_rot`

```python
def unitary_to_rot(tape: QuantumScript) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Decompose all single-qubit and two-qubit :class:`~.QubitUnitary` operations to parametrized single-qubit operations and CNOTs.

Single-qubit gates will be converted to a sequence of Y and Z rotations in the form
:math:`RZ(\omega) RY(\theta) RZ(\phi)` that implements the original operation up
to a global phase. Two-qubit gates will be decomposed according to the
:func:`pennylane.transforms.two_qubit_decomposition` function.

.. warning::

    This transform is not fully differentiable for 2-qubit ``QubitUnitary``
    operations. See usage details below.

Args:
    tape (QNode or QuantumTape or Callable): A quantum circuit (QNode or quantum function).

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]: The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

**Example**

Suppose we would like to apply the following unitary operation:

.. code-block:: python

    U = np.array([
        [-0.17111489+0.58564875j, -0.69352236-0.38309524j],
        [ 0.25053735+0.75164238j,  0.60700543-0.06171855j]
    ])

The ``unitary_to_rot`` transform enables us to decompose such numerical
operations while preserving differentiability.

.. code-block:: python

    @qp.transforms.unitary_to_rot
    @qp.qnode(qp.device("default.qubit"))
    def circuit():
        qp.QubitUnitary(U, wires=0)
        return qp.expval(qp.Z(0))

The original circuit is:

>>> print(qp.draw(circuit, level=0)())
0: ──U(M0)─┤  <Z>
M0 =
[[-0.171...+0.5856...j -0.693...-0.383...j]
[ 0.250...+0.751...j  0.607...-0.061...j]]

We can use the transform to decompose the gate:

>>> print(qp.draw(circuit, level=1)())
0: ──RZ(11.22)──RY(1.83)──RZ(11.96)─┤  <Z>


.. details::
    :title: Usage Details

    This decomposition is not fully differentiable. We **can** differentiate
    with respect to input QNode parameters when they are not used to
    explicitly construct a :math:`4 \times 4` unitary matrix being
    decomposed. So for example, the following will work:

    .. code-block:: python

        import scipy
        import pennylane.numpy as pnp

        U = scipy.stats.unitary_group.rvs(4, random_state=12345)

        @qp.transforms.unitary_to_rot
        @qp.qnode(qp.device("default.qubit"))
        def circuit(angles):
            qp.QubitUnitary(U, wires=["a", "b"])
            qp.RX(angles[0], wires="a")
            qp.RY(angles[1], wires="b")
            qp.CNOT(wires=["b", "a"])
            return qp.expval(qp.Z("a"))

    >>> g = qp.grad(circuit)
    >>> params = pnp.array([0.2, 0.3], requires_grad=True)
    >>> g(params)
    array([ 0.342..., -0.077...])

    However, the following example will **not** be differentiable:

    .. code-block:: python

        @qp.transforms.unitary_to_rot
        @qp.qnode(qp.device("default.qubit"))
        def circuit(angles):
            z = angles[0]
            x = angles[1]

            Z_mat = pnp.array([[pnp.exp(-1j * z / 2), 0.0], [0.0, pnp.exp(1j * z / 2)]])

            c = pnp.cos(x / 2)
            s = pnp.sin(x / 2) * 1j
            X_mat = pnp.array([[c, -s], [-s, c]])

            U = pnp.kron(Z_mat, X_mat)

            qp.Hadamard(wires="a")

            # U depends on the input parameters
            qp.QubitUnitary(U, wires=["a", "b"])

            qp.CNOT(wires=["b", "a"])
            return qp.expval(qp.X("a"))

    >>> g = qp.grad(circuit)
    >>> params = pnp.array([0.2, 0.3], requires_grad=True)
    >>> g(params)
    array([nan, nan])
