---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/functions/equal.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/functions/equal.py
license: Apache-2.0
---

## Module `pennylane/ops/functions/equal.py`

This module contains the qp.equal function.

## `equal`

```python
def equal(op1: Operator | MeasurementProcess | QuantumScript | PauliWord | PauliSentence, op2: Operator | MeasurementProcess | QuantumScript | PauliWord | PauliSentence, check_interface=True, check_trainability=True, rtol=1e-05, atol=1e-09) -> bool
```

Function for determining operator, measurement, and tape equality.

.. Warning::

    The ``qp.equal`` function is based on a comparison of the types and attributes of the
    measurements or operators, not their mathematical representations. Mathematically equivalent
    operators defined via different classes may return False when compared via ``qp.equal``.
    To be more thorough would require the matrix forms to be calculated, which may drastically
    increase runtime.

.. Warning::

    The interfaces and trainability of data within some observables including ``Prod`` and
    ``Sum`` are sometimes ignored, regardless of what the user specifies for ``check_interface``
    and ``check_trainability``.

Args:
    op1 (.Operator or .MeasurementProcess or .QuantumTape or .PauliWord or .PauliSentence): First object to compare
    op2 (.Operator or .MeasurementProcess or .QuantumTape or .PauliWord or .PauliSentence): Second object to compare
    check_interface (bool, optional): Whether to compare interfaces. Default: ``True``.
    check_trainability (bool, optional): Whether to compare trainability status. Default: ``True``.
    rtol (float, optional): Relative tolerance for parameters.
    atol (float, optional): Absolute tolerance for parameters.

Returns:
    bool: ``True`` if the operators, measurement processes, or tapes are equal, else ``False``

**Example**

Given two operators or measurement processes, ``qp.equal`` determines their equality.

>>> op1 = qp.RX(np.array(.12), wires=0)
>>> op2 = qp.RY(np.array(1.23), wires=0)
>>> qp.equal(op1, op1), qp.equal(op1, op2)
(True, False)

>>> prod1 = qp.X(0) @ qp.Y(1)
>>> prod2 = qp.Y(1) @ qp.X(0)
>>> prod3 = qp.X(1) @ qp.Y(0)
>>> qp.equal(prod1, prod2), qp.equal(prod1, prod3)
(True, False)

>>> H1 = qp.Hamiltonian([0.5, 0.5], [qp.Z(0) @ qp.Y(1), qp.Y(1) @ qp.Z(0) @ qp.Identity("a")])
>>> H2 = qp.Hamiltonian([1], [qp.Z(0) @ qp.Y(1)])
>>> H3 = qp.Hamiltonian([2], [qp.Z(0) @ qp.Y(1)])
>>> qp.equal(H1, H2), qp.equal(H1, H3)
(True, False)

>>> qp.equal(qp.expval(qp.X(0)), qp.expval(qp.X(0)))
True
>>> qp.equal(qp.probs(wires=(0,1)), qp.probs(wires=(1,2)))
False
>>> qp.equal(qp.classical_shadow(wires=[0,1]), qp.classical_shadow(wires=[0,1]))
True
>>> tape1 = qp.tape.QuantumScript([qp.RX(1.2, wires=0)], [qp.expval(qp.Z(0))])
>>> tape2 = qp.tape.QuantumScript([qp.RX(1.2 + 1e-6, wires=0)], [qp.expval(qp.Z(0))])
>>> qp.equal(tape1, tape2, rtol=0, atol=1e-7)
False
>>> qp.equal(tape1, tape2, rtol=0, atol=1e-5)
True

.. details::
    :title: Usage Details

    You can use the optional arguments to get more specific results:

    >>> op1 = qp.RX(torch.tensor(1.2), wires=0)
    >>> op2 = qp.RX(jax.numpy.array(1.2), wires=0)
    >>> qp.equal(op1, op2)
    False

    >>> qp.equal(op1, op2, check_interface=False, check_trainability=False)
    True

    >>> op3 = qp.RX(pnp.array(1.2, requires_grad=True), wires=0)
    >>> op4 = qp.RX(pnp.array(1.2, requires_grad=False), wires=0)
    >>> qp.equal(op3, op4)
    False

    >>> qp.equal(op3, op4, check_trainability=False)
    True

    >>> qp.equal(Controlled(op3, control_wires=1), Controlled(op4, control_wires=1))
    False

    >>> qp.equal(Controlled(op3, control_wires=1), Controlled(op4, control_wires=1), check_trainability=False)
    True

## `assert_equal`

```python
def assert_equal(op1: Operator | MeasurementProcess | QuantumScript, op2: Operator | MeasurementProcess | QuantumScript, check_interface=True, check_trainability=True, rtol=1e-05, atol=1e-09) -> None
```

Function to assert that two operators, measurements, or tapes are equal

Args:
    op1 (.Operator or .MeasurementProcess or .QuantumTape): First object to compare
    op2 (.Operator or .MeasurementProcess or .QuantumTape): Second object to compare
    check_interface (bool, optional): Whether to compare interfaces. Default: ``True``.
    check_trainability (bool, optional): Whether to compare trainability status. Default: ``True``.
    rtol (float, optional): Relative tolerance for parameters.
    atol (float, optional): Absolute tolerance for parameters.

Returns:
    None

Raises:
    AssertionError: An ``AssertionError`` is raised if the two operators are not equal.

.. seealso::

    :func:`~.equal`

**Example**

>>> op1 = qp.RX(np.array(0.12), wires=0)
>>> op2 = qp.RX(np.array(1.23), wires=0)
>>> qp.assert_equal(op1, op2)
Traceback (most recent call last):
    ...
AssertionError: op1 and op2 have different data. Got (array(0.12),) and (array(1.23),)

>>> h1 = qp.Hamiltonian([1, 2], [qp.PauliX(0), qp.PauliY(1)])
>>> h2 = qp.Hamiltonian([1, 1], [qp.PauliX(0), qp.PauliY(1)])
>>> qp.assert_equal(h1, h2)
Traceback (most recent call last):
    ...
AssertionError: op1 and op2 have different operands because op1 and op2 have different scalars. Got 2 and 1
