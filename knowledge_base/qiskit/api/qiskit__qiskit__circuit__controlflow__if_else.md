---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/controlflow/if_else.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/controlflow/if_else.py
license: Apache-2.0
---

## Module `qiskit/circuit/controlflow/if_else.py`

Circuit operation representing an ``if/else`` statement.

## `IfElseOp`

```python
class IfElseOp(ControlFlowOp)
```

A circuit operation which executes a program (``true_body``) if a
provided condition (``condition``) evaluates to true, and
optionally evaluates another program (``false_body``) otherwise.

If provided, ``false_body`` must be of the same ``num_qubits`` and
``num_clbits`` as ``true_body``.

The classical bits used in ``condition`` must be a subset of those attached
to the circuit on which this ``IfElseOp`` will be appended.

### `__init__`

```python
def __init__(self, condition: tuple[ClassicalRegister, int] | tuple[Clbit, int] | expr.Expr, true_body: QuantumCircuit, false_body: QuantumCircuit | None=None, label: str | None=None)
```

Args:
    condition: A condition to be evaluated in real time during circuit execution which,
        if true, will trigger the evaluation of ``true_body``. Can be
        specified as either a tuple of a ``ClassicalRegister`` to be
        tested for equality with a given ``int``, or as a tuple of a
        ``Clbit`` to be compared to either a ``bool`` or an ``int``.
    true_body: A program to be executed if ``condition`` evaluates
        to true.
    false_body: An optional program to be executed if ``condition``
        evaluates to false.
    label: An optional label for identifying the instruction.

### `condition`

```python
def condition(self)
```

The condition for the if else operation.

### `replace_blocks`

```python
def replace_blocks(self, blocks: Iterable[QuantumCircuit]) -> IfElseOp
```

Replace blocks and return new instruction.

Args:
    blocks: Iterable of circuits for "if" and "else" condition. If there is no "else"
        circuit it may be set to None or omitted.

Returns:
    New IfElseOp with replaced blocks.

## `IfElsePlaceholder`

```python
class IfElsePlaceholder(InstructionPlaceholder)
```

A placeholder instruction to use in control-flow context managers, when calculating the
number of resources this instruction should block is deferred until the construction of the
outer loop.

This generally should not be instantiated manually; only :obj:`.IfContext` and
:obj:`.ElseContext` should do it when they need to defer creation of the concrete instruction.

.. warning::

    This is an internal interface and no part of it should be relied upon outside of Qiskit
    Terra.

### `__init__`

```python
def __init__(self, condition: tuple[ClassicalRegister, int] | tuple[Clbit, int] | expr.Expr, true_block: ControlFlowBuilderBlock, false_block: ControlFlowBuilderBlock | None=None, *, label: str | None=None)
```

Args:
    condition: the condition to execute the true block on.  This has the same semantics as
        the ``condition`` argument to :obj:`.IfElseOp`.
    true_block: the unbuilt scope block that will become the "true" branch at creation time.
    false_block: if given, the unbuilt scope block that will become the "false" branch at
        creation time.
    label: the label to give the operator when it is created.

### `with_false_block`

```python
def with_false_block(self, false_block: ControlFlowBuilderBlock) -> IfElsePlaceholder
```

Return a new placeholder instruction, with the false block set to the given value,
updating the bits used by both it and the true body, if necessary.

It is an error to try and set the false block on a placeholder that already has one.

Args:
    false_block: The (unbuilt) instruction scope to set the false body to.

Returns:
    A new placeholder, with ``false_block`` set to the given input, and both true and false
    blocks expanded to account for all resources.

Raises:
    CircuitError: if the false block of this placeholder instruction is already set.

### `registers`

```python
def registers(self)
```

Get the registers used by the interior blocks.

### `blocks`

```python
def blocks(self)
```

Dummy blocks to allow this to be used duck-typed like a `ControlFlowOp`.

## `IfContext`

```python
class IfContext
```

A context manager for building up ``if`` statements onto circuits in a natural order, without
having to construct the statement body first.

The return value of this context manager can be used immediately following the block to create
an attached ``else`` statement.

This context should almost invariably be created by a :meth:`.QuantumCircuit.if_test` call, and
the resulting instance is a "friend" of the calling circuit.  The context will manipulate the
circuit's defined scopes when it is entered (by pushing a new scope onto the stack) and exited
(by popping its scope, building it, and appending the resulting :obj:`.IfElseOp`).

.. warning::

    This is an internal interface and no part of it should be relied upon outside of Qiskit
    Terra.

### `circuit`

```python
def circuit(self) -> QuantumCircuit
```

Get the circuit that this context manager is attached to.

### `condition`

```python
def condition(self) -> tuple[ClassicalRegister, int] | tuple[Clbit, int] | expr.Expr
```

Get the expression that this statement is conditioned on.

### `appended_instructions`

```python
def appended_instructions(self) -> InstructionSet | None
```

Get the instruction set that was created when this block finished.  If the block has not
yet finished, then this will be ``None``.

### `in_loop`

```python
def in_loop(self) -> bool
```

Whether this context manager is enclosed within a loop.

### `depth`

```python
def depth(self) -> int | None
```

The depth of this scope in the circuit (if the scope is entered).

### `appended`

```python
def appended(self) -> bool
```

Whether this context has appended its instruction to the circuit.

## `ElseContext`

```python
class ElseContext
```

A context manager for building up an ``else`` statements onto circuits in a natural order,
without having to construct the statement body first.

Instances of this context manager should only ever be gained as the output of the
:obj:`.IfContext` manager, so they know what they refer to.  Instances of this context are
"friends" of the circuit that created the :obj:`.IfContext` that in turn created this object.
The context will manipulate the circuit's defined scopes when it is entered (by popping the old
:obj:`.IfElseOp` if it exists and pushing a new scope onto the stack) and exited (by popping its
scope, building it, and appending the resulting :obj:`.IfElseOp`).

.. warning::

    This is an internal interface and no part of it should be relied upon outside of Qiskit
    Terra.
