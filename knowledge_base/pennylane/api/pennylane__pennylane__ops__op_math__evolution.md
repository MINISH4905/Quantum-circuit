---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/evolution.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/evolution.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/evolution.py`

This submodule defines the Evolution class.

## `Evolution`

```python
class Evolution(Exp)
```

Create an exponential operator that defines a generator, of the form :math:`e^{-ix\hat{G}}`

Args:
    base (~.operation.Operator): The operator to be used as a generator, G.
    param (float): The evolution parameter, x. This parameter is expected not to have
        any complex component.
    id (str): id for the Evolution operator. Default is None.

Returns:
   :class:`Evolution`: A :class:`~.operation.Operator` representing an operator exponential of the form :math:`e^{-ix\hat{G}}`,
   where x is real.


**Usage Details**

In contrast to the general :class:`~.Exp` class, the ``Evolution`` operator :math:`e^{-ix\hat{G}}` is constrained to have a single trainable
parameter, x. Any parameters contained in the base operator are not trainable. This allows the operator
to be differentiated with regard to the evolution parameter. Defining a mathematically identical operator
using the :class:`~.Exp` class will be incompatible with a variety of PennyLane functions that require only a single
trainable parameter.

**Example**

This symbolic operator can be used to make general rotation operators:

>>> theta = np.array(1.23)
>>> op = Evolution(qp.X(0), 0.5 * theta)
>>> qp.math.allclose(op.matrix(), qp.RX(theta, wires=0).matrix())
True

Or to define a time evolution operator for a time-independent Hamiltonian:

>>> H = qp.Hamiltonian([1, 1], [qp.Y(0), qp.X(1)])
>>> t = 10e-6
>>> U = Evolution(H, t)

If the base operator is Hermitian, then the gate can be used in a circuit,
though it may not be supported by the device and may not be differentiable.

>>> @qp.qnode(qp.device('default.qubit', wires=1))
... def circuit(x):
...     qp.ops.Evolution(qp.X(0), 0.5 * x)
...     return qp.expval(qp.Z(0))
>>> print(qp.draw(circuit)(1.23))
0: ──Exp(-0.61j X)─┤  <Z>

### `param`

```python
def param(self)
```

A real coefficient with ``1j`` factored out.

### `generator`

```python
def generator(self)
```

Generator of an operator that is in single-parameter-form.

For example, for operator

.. math::

    U(\phi) = e^{-i\phi (0.5 Y + Z\otimes X)}

we get the generator

>>> U = qp.ops.op_math.Evolution(0.5 * qp.Y(0) + qp.Z(0) @ qp.X(1), 1)
>>> print(U)
Evolution(-1j 0.5 * Y(0) + Z(0) @ X(1))
>>> U.generator()
-1 * (0.5 * Y(0) + Z(0) @ X(1))

## `pauli_rot_decomp`

```python
def pauli_rot_decomp(*params, wires, base, **_)
```

Decompose the operator into a single PauliRot operator.
