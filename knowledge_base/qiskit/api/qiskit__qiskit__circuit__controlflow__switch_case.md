---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/controlflow/switch_case.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/controlflow/switch_case.py
license: Apache-2.0
---

## Module `qiskit/circuit/controlflow/switch_case.py`

Circuit operation representing an ``switch/case`` statement.

## `SwitchCaseOp`

```python
class SwitchCaseOp(ControlFlowOp)
```

A circuit operation that executes one particular circuit block based on matching a given
``target`` against an ordered list of ``values``.  The special value :data:`.CASE_DEFAULT` can
be used to represent a default condition.

### `__init__`

```python
def __init__(self, target: Clbit | ClassicalRegister | expr.Expr, cases: Iterable[tuple[Any, QuantumCircuit]], *, label: str | None=None)
```

Args:
    target: the real-time value to switch on.
    cases: an ordered iterable of the corresponding value of the ``target`` and the circuit
        block that should be executed if this is matched.  There is no fall-through between
        blocks, and the order matters.
    label: An optional label for identifying the instruction.

### `cases_specifier`

```python
def cases_specifier(self) -> Iterable[tuple[tuple, QuantumCircuit]]
```

Return an iterable where each element is a 2-tuple whose first element is a tuple of
jump values, and whose second is the single circuit block that is associated with those
values.

This is an abstract specification of the jump table suitable for creating new
:class:`.SwitchCaseOp` instances.

.. seealso::
    :meth:`.SwitchCaseOp.cases`
        Create a lookup table that you can use for your own purposes to jump from values to
        the circuit that would be executed.

### `cases`

```python
def cases(self)
```

Return a lookup table from case labels to the circuit that would be executed in that
case.  This object is not generally suitable for creating a new :class:`.SwitchCaseOp`
because any keys that point to the same object will not be grouped.

.. seealso::
    :meth:`.SwitchCaseOp.cases_specifier`
        An alternate method that produces its output in a suitable format for creating new
        :class:`.SwitchCaseOp` instances.

## `SwitchCasePlaceholder`

```python
class SwitchCasePlaceholder(InstructionPlaceholder)
```

A placeholder instruction to use in control-flow context managers, when calculating the
number of resources this instruction should block is deferred until the construction of the
outer loop.

This generally should not be instantiated manually; only :obj:`.SwitchContext` should do it when
it needs to defer creation of the concrete instruction.

.. warning::

    This is an internal interface and no part of it should be relied upon outside of Qiskit
    Terra.

## `SwitchContext`

```python
class SwitchContext
```

A context manager for building up ``switch`` statements onto circuits in a natural order,
without having to construct the case bodies first.

The return value of this context manager can be used within the created context to build up the
individual ``case`` statements.  No other instructions should be appended to the circuit during
the `switch` context.

This context should almost invariably be created by a :meth:`.QuantumCircuit.switch_case` call,
and the resulting instance is a "friend" of the calling circuit.  The context will manipulate
the circuit's defined scopes when it is entered (by pushing a new scope onto the stack) and
exited (by popping its scope, building it, and appending the resulting :obj:`.SwitchCaseOp`).

.. warning::

    This is an internal interface and no part of it should be relied upon outside of Qiskit
    Terra.

### `label_in_use`

```python
def label_in_use(self, label)
```

Return whether a case label is already accounted for in the switch statement.

### `add_case`

```python
def add_case(self, labels: tuple[int | Literal[CASE_DEFAULT], ...], block: ControlFlowBuilderBlock)
```

Add a sequence of conditions and the single block that should be run if they are
triggered to the context.  The labels are assumed to have already been validated using
:meth:`label_in_use`.

## `CaseBuilder`

```python
class CaseBuilder
```

A child context manager for building up the ``case`` blocks of ``switch`` statements onto
circuits in a natural order, without having to construct the case bodies first.

This context should never need to be created manually by a user; it is the return value of the
:class:`.SwitchContext` context manager, which in turn should only be created by suitable
:meth:`.QuantumCircuit.switch_case` calls.

.. warning::

    This is an internal interface and no part of it should be relied upon outside of Qiskit
    Terra.
