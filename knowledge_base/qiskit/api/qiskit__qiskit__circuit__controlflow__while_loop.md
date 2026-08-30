---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/controlflow/while_loop.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/controlflow/while_loop.py
license: Apache-2.0
---

## Module `qiskit/circuit/controlflow/while_loop.py`

Circuit operation representing a ``while`` loop.

## `WhileLoopOp`

```python
class WhileLoopOp(ControlFlowOp)
```

A circuit operation which repeatedly executes a subcircuit (``body``) until
a condition (``condition``) evaluates as False.

The classical bits used in ``condition`` must be a subset of those attached
to ``body``.

### `__init__`

```python
def __init__(self, condition: tuple[ClassicalRegister, int] | tuple[Clbit, int] | expr.Expr, body: QuantumCircuit, label: str | None=None)
```

Args:
    condition: A condition to be checked prior to executing ``body``. Can be
        specified as either a tuple of a ``ClassicalRegister`` to be tested
        for equality with a given ``int``, or as a tuple of a ``Clbit`` to
        be compared to either a ``bool`` or an ``int``.
    body: The loop body to be repeatedly executed.
    label: An optional label for identifying the instruction.

### `condition`

```python
def condition(self)
```

The condition for the while loop.

## `WhileLoopContext`

```python
class WhileLoopContext
```

A context manager for building up while loops onto circuits in a natural order, without
having to construct the loop body first.

Within the block, a lot of the bookkeeping is done for you; you do not need to keep track of
which qubits and clbits you are using, for example.  All normal methods of accessing the qubits
on the underlying :obj:`~QuantumCircuit` will work correctly, and resolve into correct accesses
within the interior block.

You generally should never need to instantiate this object directly.  Instead, use
:obj:`.QuantumCircuit.while_loop` in its context-manager form, i.e. by not supplying a ``body``
or sets of qubits and clbits.

Example usage::

    from qiskit.circuit import QuantumCircuit, Clbit, Qubit
    bits = [Qubit(), Qubit(), Clbit()]
    qc = QuantumCircuit(bits)

    with qc.while_loop((bits[2], 0)):
        qc.h(0)
        qc.cx(0, 1)
        qc.measure(0, 0)

.. warning::

    This is an internal interface and no part of it should be relied upon outside of Qiskit
    Terra.
