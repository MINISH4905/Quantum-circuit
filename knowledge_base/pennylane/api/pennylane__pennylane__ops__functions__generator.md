---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/functions/generator.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/functions/generator.py
license: Apache-2.0
---

## Module `pennylane/ops/functions/generator.py`

This module contains the qp.generator function.

## `generator`

```python
def generator(op: qp.operation.Operator, format='prefactor')
```

Returns the generator of an operation.

Args:
    op (.Operator or Callable): A single operator, or a function that
        applies a single quantum operation.
    format (str): The format to return the generator in. Must be one of ``'prefactor'``,
        ``'observable'``, or ``'hamiltonian'``. See below for more details.

Returns:
    .Operator or tuple[.Operator, float]: The returned generator, with format/type
    dependent on the ``format`` argument.

    * ``"prefactor"``: Return the generator as ``(obs, prefactor)`` (representing
      :math:`G=p \hat{O}`), where:

      - observable :math:`\hat{O}` is one of :class:`~.Hermitian`,
        :class:`~.SparseHamiltonian`, or a tensor product
        of Pauli words.
      - prefactor :math:`p` is a float.

    * ``"observable"``: Return the generator as a single observable as directly defined
      by ``op``. Returned generators may be any type of observable, including
      :class:`~.Hermitian`, :class:`~.SparseHamiltonian`, or :class:`~.ops.LinearCombination`.

    * ``"hamiltonian"``: Similar to ``"observable"``, however the returned observable
      will always be converted into :class:`~.ops.LinearCombination` regardless of how ``op``
      encodes the generator.

    * ``"arithmetic"``: Similar to ``"hamiltonian"``, however the returned observable
      will always be converted into an arithmetic operator. The returned generator may be
      any type, including:
      :class:`~.ops.op_math.SProd`, :class:`~.ops.op_math.Prod`, :class:`~.ops.op_math.Sum`, or the operator itself.

**Example**

Given an operation, ``qp.generator`` returns the generator representation:

>>> op = qp.CRX(0.6, wires=[0, 1])
>>> qp.generator(op)
(X(1) @ Projector(array([1]), wires=[0]), np.float64(-0.5))

It can also be used in a functional form:

>>> qp.generator(qp.CRX)(0.6, wires=[0, 1])
(X(1) @ Projector(array([1]), wires=[0]), np.float64(-0.5))

By default, ``generator`` will return the generator in the format of ``(obs, prefactor)``,
corresponding to :math:`G=p \hat{O}`, where the observable :math:`\hat{O}` will
always be given in tensor product form, or as a dense/sparse matrix.

By using the ``format`` argument, the returned generator representation can
be altered:

>>> op = qp.RX(0.2, wires=0)
>>> qp.generator(op, format="prefactor")  # output will always be (obs, prefactor)
(X(0), -0.5)
>>> qp.generator(op, format="hamiltonian")  # output will be a LinearCombination
-0.5 * X(0)
>>> qp.generator(qp.PhaseShift(0.1, wires=0), format="observable")  # output will be a simplified obs where possible
Projector(array([1]), wires=[0])
>>> qp.generator(op, format="arithmetic")  # output is an instance of `SProd`
-0.5 * X(0)
