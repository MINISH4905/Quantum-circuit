---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/controlflow/for_loop.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/controlflow/for_loop.py
license: Apache-2.0
---

## Module `qiskit/circuit/controlflow/for_loop.py`

Circuit operation representing a ``for`` loop.

## `ForLoopOp`

```python
class ForLoopOp(ControlFlowOp)
```

A circuit operation which repeatedly executes a subcircuit
(``body``) parameterized by a parameter ``loop_parameter`` through
the set of integer values provided in ``indexset``.

Data model
----------

There is exactly one "block" in a for-loop op, which is the body of the loop.  The circuit block
may take exactly zero or one ``input`` variable (see :meth:`.QuantumCircuit.add_input_var`).  If
the body takes one input variable, then ``loop_parameter`` must be equal to that variable, and
it represents the loop variable.  If the body takes zero input variables, ``loop_parameter`` may
be either ``None`` (to indicate no binding) or a :class:`.Parameter`.  The :class:`.Parameter`
form is a legacy form that should be avoided.

### `__init__`

```python
def __init__(self, indexset: Iterable[int], loop_parameter: Parameter | expr.Var | None, body: QuantumCircuit, label: str | None=None)
```

Args:
    indexset: A collection of integers to loop over.
    loop_parameter: The placeholder parameter to which
        the values from ``indexset`` will be assigned. Can be a
        ``Parameter``, ``expr.Var`` of type ``Uint``, or ``None``.
    body: The loop body to be repeatedly executed.
    label: An optional label for identifying the instruction.

## `ForLoopContext`

```python
class ForLoopContext
```

A context manager for building up ``for`` loops onto circuits in a natural order, without
having to construct the loop body first.

Within the block, a lot of the bookkeeping is done for you; you do not need to keep track of
which qubits and clbits you are using, for example, and a loop parameter will be allocated for
you, if you do not supply one yourself.  All normal methods of accessing the qubits on the
underlying :obj:`~QuantumCircuit` will work correctly, and resolve into correct accesses within
the interior block.

You generally should never need to instantiate this object directly.  Instead, use
:obj:`.QuantumCircuit.for_loop` in its context-manager form, i.e. by not supplying a ``body`` or
sets of qubits and clbits.

Example usage::

    import math
    from qiskit import QuantumCircuit
    qc = QuantumCircuit(2, 1)

    with qc.for_loop(range(5)) as i:
        qc.rx(i * math.pi/4, 0)
        qc.cx(0, 1)
        qc.measure(0, 0)
        with qc.if_test((0, True)):
            qc.break_loop()

This context should almost invariably be created by a :meth:`.QuantumCircuit.for_loop` call, and
the resulting instance is a "friend" of the calling circuit.  The context will manipulate the
circuit's defined scopes when it is entered (by pushing a new scope onto the stack) and exited
(by popping its scope, building it, and appending the resulting :obj:`.ForLoopOp`).

.. warning::

    This is an internal interface and no part of it should be relied upon outside of Qiskit
    Terra.
