---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/tape/expand_tape.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/tape/expand_tape.py
license: Apache-2.0
---

## Module `pennylane/tape/expand_tape.py`

This module contains functions for tape expansion

## `expand_tape`

```python
def expand_tape(tape, depth=1, stop_at=None, expand_measurements=False)
```

Expand all objects in a tape to a specific depth.

.. warning::
    The ``expand_tape`` function is deprecated in PennyLane v0.45 and will be removed in v0.46.
    Please use the ``qp.decompose`` function for decomposing circuits.

Args:
    tape (QuantumTape): The tape to expand
    depth (int): the depth the tape should be expanded
    stop_at (Callable): A function which accepts a queue object,
        and returns ``True`` if this object should *not* be expanded.
        If not provided, all objects that support expansion will be expanded.
    expand_measurements (bool): If ``True``, measurements will be expanded
        to basis rotations and computational basis measurements.

Returns:
    QuantumTape: The expanded version of ``tape``.

.. seealso:: :func:`~.pennylane.devices.preprocess.decompose` for a transform that
    performs the same job and fits into the current transform architecture.

.. warning::

    This method cannot be used with a tape with non-commuting measurements, even if
    ``expand_measurements=False``.

    >>> from pennylane.tape import expand_tape
    >>> mps = [qp.expval(qp.X(0)), qp.expval(qp.Y(0))]
    >>> tape = qp.tape.QuantumScript([], mps)
    >>> expand_tape(tape)  # doctest: +SKIP
    Traceback (most recent call last):
        ...
    pennylane.exceptions.QuantumFunctionError: Only observables that are qubit-wise commuting Pauli words can be returned on the same wire, some of the following measurements do not commute:
    [expval(X(0)), expval(Y(0))]

    Since commutation is determined by pauli word arithmetic, non-pauli words cannot share
    wires with other measurements, even if they commute:

    >>> measurements = [qp.expval(qp.Projector([0], 0)), qp.probs(wires=0)]
    >>> tape = qp.tape.QuantumScript([], measurements)
    >>> expand_tape(tape)  # doctest: +SKIP
    Traceback (most recent call last):
        ...
    pennylane.exceptions.QuantumFunctionError: Only observables that are qubit-wise commuting Pauli words can be returned on the same wire, some of the following measurements do not commute:
    [expval(Projector(array([0]), wires=[0])), probs(wires=[0])]

    For this reason, we recommend the use of :func:`~.pennylane.devices.preprocess.decompose` instead.

.. details::
    :title: Usage Details

    >>> from pennylane.tape import expand_tape
    >>> ops = [qp.Permute((2,1,0), wires=(0,1,2)), qp.X(0)]
    >>> measurements = [qp.expval(qp.X(0))]
    >>> tape = qp.tape.QuantumScript(ops, measurements)
    >>> expanded_tape = expand_tape(tape)  # doctest: +SKIP
    >>> print(expanded_tape.draw())  # doctest: +SKIP
    0: ─╭SWAP──RX─╭GlobalPhase─┤  <X>
    2: ─╰SWAP─────╰GlobalPhase─┤

    Specifying a depth greater than one decomposes operations multiple times.

    >>> expanded_tape2 = expand_tape(tape, depth=2)  # doctest: +SKIP
    >>> print(expanded_tape2.draw())  # doctest: +SKIP
    0: ─╭●─╭X─╭●──RX─┤  <X>
    2: ─╰X─╰●─╰X─────┤

    The ``stop_at`` callable allows the specification of terminal
    operations that should no longer be decomposed. In this example, the ``X``
    operator is not decomposed because ``stop_at(qp.X(0)) == True``.

    >>> def stop_at(obj):
    ...     return isinstance(obj, qp.X)
    >>> expanded_tape = expand_tape(tape, stop_at=stop_at)  # doctest: +SKIP
    >>> print(expanded_tape.draw())  # doctest: +SKIP
    0: ─╭SWAP──X─┤  <X>
    2: ─╰SWAP────┤

    .. warning::

        If an operator does not have a decomposition, it will not be decomposed, even if
        ``stop_at(obj) == False``.  If you want to decompose to reach a certain gateset,
        you will need an extra validation pass to ensure you have reached the gateset.

        >>> def stop_at(obj):
        ...     return getattr(obj, "name", "") in {"RX", "RY"}
        >>> tape = qp.tape.QuantumScript([qp.RZ(0.1, 0)])
        >>> expand_tape(tape, stop_at=stop_at).circuit  # doctest: +SKIP
        [RZ(0.1, wires=[0])]

    If more than one observable exists on a wire, the diagonalizing gates will be applied
    and the observable will be substituted for an analogous combination of ``qp.Z`` operators.
    This will happen even if ``expand_measurements=False``.

    >>> mps = [qp.expval(qp.X(0)), qp.expval(qp.X(0) @ qp.X(1))]
    >>> tape = qp.tape.QuantumScript([], mps)
    >>> expanded_tape = expand_tape(tape)  # doctest: +SKIP
    >>> print(expanded_tape.draw())  # doctest: +SKIP
    0: ──RY─┤  <Z> ╭<Z@Z>
    1: ──RY─┤      ╰<Z@Z>

    Setting ``expand_measurements=True`` applies any diagonalizing gates and converts
    the measurement into a wires+eigvals representation.

    .. warning::
        Many components of PennyLane do not support the wires + eigvals representation.
        Setting ``expand_measurements=True`` should be used with extreme caution.

    >>> tape = qp.tape.QuantumScript([], [qp.expval(qp.X(0))])
    >>> expand_tape(tape, expand_measurements=True).circuit  # doctest: +SKIP
    [H(0), expval(eigvals=[ 1. -1.], wires=[0])]

## `expand_tape_state_prep`

```python
def expand_tape_state_prep(tape, skip_first=True)
```

Expand all instances of StatePrepBase operations in the tape.

.. warning::
    The ``expand_tape_state_prep`` function is deprecated in PennyLane v0.45 and will be removed in v0.46.
    Please use the ``qp.decompose`` function for decomposing circuits.

Args:
    tape (QuantumScript): The tape to expand.
    skip_first (bool): If ``True``, will not expand a ``StatePrepBase`` operation if
        it is the first operation in the tape.

Returns:
    QuantumTape: The expanded version of ``tape``.

**Example**

If a ``StatePrepBase`` occurs as the first operation of a tape, the operation will not be expanded:

>>> ops = [qp.StatePrep([0, 1], wires=0), qp.Z(1), qp.StatePrep([1, 0], wires=0)]
>>> tape = qp.tape.QuantumScript(ops, [])
>>> new_tape = qp.tape.expand_tape_state_prep(tape)  # doctest: +SKIP
>>> new_tape.operations  # doctest: +SKIP
[StatePrep(array([0, 1]), wires=[0]), Z(1), MottonenStatePreparation(array([1, 0]), wires=[0])]

To force expansion, the keyword argument ``skip_first`` can be set to ``False``:

>>> new_tape = qp.tape.expand_tape_state_prep(tape, skip_first=False)  # doctest: +SKIP
>>> new_tape.operations  # doctest: +SKIP
[MottonenStatePreparation(array([0, 1]), wires=[0]), Z(1), MottonenStatePreparation(array([1, 0]), wires=[0])]
