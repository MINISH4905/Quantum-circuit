---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/reflection.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/reflection.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/reflection.py`

This submodule contains the template for the Reflection operation.

## `Reflection`

```python
class Reflection(Operation)
```

Apply a reflection about a state :math:`|\Psi\rangle`.

This operator works by providing an operation, :math:`U`, that prepares the desired state, :math:`\vert \Psi \rangle`,
that we want to reflect about. We can also provide a reflection angle :math:`\alpha`
to define the operation in a more generic form:

.. math::

   R(U, \alpha) = -I + (1 - e^{i\alpha}) |\Psi\rangle \langle \Psi|

This operator is an important component of quantum algorithms such as amplitude amplification [`arXiv:quant-ph/0005055 <https://arxiv.org/abs/quant-ph/0005055>`__]
and oblivious amplitude amplification [`arXiv:1312.1414 <https://arxiv.org/abs/1312.1414>`__].

Args:
    U (Operator): the operator that prepares the state :math:`|\Psi\rangle`
    alpha (float): the angle of the operator, default is :math:`\pi`
    reflection_wires (Any or Iterable[Any]): subsystem of wires on which to reflect, the
        default is ``None`` and the reflection will be applied on the ``U`` wires.

**Example**

This example shows how to apply the reflection :math:`-I + 2|+\rangle \langle +|` to the state :math:`|1\rangle`.

.. code-block:: python

    U = qp.Hadamard(wires=0)
    dev = qp.device('default.qubit')

    @qp.qnode(dev)
    def circuit():
        qp.PauliX(wires=0)
        qp.Reflection(U)
        return qp.state()

>>> circuit() # doctest: +SKIP
array([1.+6.123234e-17j, 0.-6.123234e-17j])

For cases when :math:`U` comprises many operations, you can create a quantum
function containing each operation, one per line, then decorate the quantum
function with ``@qp.prod``:

.. code-block:: python

    @qp.prod
    def U(wires):
        qp.Hadamard(wires=wires[0])
        qp.RY(0.1, wires=wires[1])

    @qp.qnode(dev)
    def circuit():
        qp.Reflection(U([0, 1]))
        return qp.state()

>>> circuit() # doctest: +SKIP
array([-0.0025-6.1385e-17j,  0.0499+3.0565e-18j,  0.9975+6.1079e-17j,
        0.0499+3.0565e-18j])

.. details::
    :title: Theory

    The operator is built as follows:

    .. math::

        \text{R}(U, \alpha) = -I + (1 - e^{i\alpha}) |\Psi\rangle \langle \Psi| = U(-I + (1 - e^{i\alpha}) |0\rangle \langle 0|)U^{\dagger}.

    The central block is obtained through a :class:`~.PhaseShift` controlled operator.

    In the case of specifying the reflection wires, the operator would have the following expression.

    .. math::

        U(-I + (1 - e^{i\alpha}) |0\rangle^{\otimes m} \langle 0|^{\otimes m}\otimes I^{n-m})U^{\dagger},

    where :math:`m` is the number of reflection wires and :math:`n` is the total number of wires.

### `alpha`

```python
def alpha(self)
```

The alpha angle for the operation.

### `reflection_wires`

```python
def reflection_wires(self)
```

The reflection wires for the operation.
