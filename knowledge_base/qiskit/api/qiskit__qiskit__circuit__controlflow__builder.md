---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/controlflow/builder.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/controlflow/builder.py
license: Apache-2.0
---

## Module `qiskit/circuit/controlflow/builder.py`

Builder types for the basic control-flow constructs.

## `CircuitScopeInterface`

```python
class CircuitScopeInterface(abc.ABC)
```

An interface that circuits and builder blocks explicitly fulfill, which contains the primitive
methods of circuit construction and object validation.

This allows core circuit methods to be applied to the currently open builder scope, and allows
the builders to hook into all places where circuit resources might be used.  This allows the
builders to track the resources being used, without getting in the way of
:class:`.QuantumCircuit` doing its own thing.

### `instructions`

```python
def instructions(self) -> Sequence[CircuitInstruction]
```

Indexable view onto the :class:`.CircuitInstruction` objects backing this scope.

### `append`

```python
def append(self, instruction: CircuitInstruction, *, _standard_gate=False) -> CircuitInstruction
```

Low-level 'append' primitive; this may assume that the qubits, clbits and operation are
all valid for the circuit.

Abstraction of :meth:`.QuantumCircuit._append` (the low-level one, not the high-level).

Args:
    instruction: the resource-validated instruction context object.

Returns:
    the instruction context object actually appended.  This is not required to be the same
    as the object given (but typically will be).

### `extend`

```python
def extend(self, data: CircuitData, qubits: list[Qubit] | None=None, clbits: list[Clbit] | None=None)
```

Appends all instructions from ``data`` to the scope.

Args:
    data: The instruction listing.
    qubits: an optional qubit remapping to apply
    clbits: an optional clbit remapping to apply

### `resolve_classical_resource`

```python
def resolve_classical_resource(self, specifier: Clbit | ClassicalRegister | int) -> Clbit | ClassicalRegister
```

Resolve a single bit-like classical-resource specifier.

A resource refers to either a classical bit or a register, where integers index into the
classical bits of the greater circuit.

This is called whenever a classical bit or register is being used outside the standard
:class:`.Clbit` usage of instructions in :meth:`append`, such as in a legacy two-tuple
condition.

Args:
    specifier: the classical resource specifier.

Returns:
    the resolved resource.  This cannot be an integer any more; an integer input is resolved
    into a classical bit.

Raises:
    CircuitError: if the resource cannot be used by the scope, such as an out-of-range index
        or a :class:`.Clbit` that isn't actually in the circuit.

### `add_uninitialized_var`

```python
def add_uninitialized_var(self, var: expr.Var)
```

Add an uninitialized variable to the circuit scope.

The general circuit context is responsible for ensuring the variable is initialized.  These
uninitialized variables are guaranteed to be standalone.

Args:
    var: the variable to add, if valid.

Raises:
    CircuitError: if the variable cannot be added, such as because it invalidly shadows or
        redefines an existing name.

### `add_stretch`

```python
def add_stretch(self, stretch: expr.Stretch)
```

Add a stretch to the circuit scope.

Args:
    stretch: the stretch to add, if valid.

Raises:
    CircuitError: if the stretch cannot be added, such as because it invalidly shadows or
        redefines an existing name.

### `use_var`

```python
def use_var(self, var: expr.Var)
```

Called for every standalone classical real-time variable being used by some circuit
instruction.

The given variable is guaranteed to be a stand-alone variable; bit-like resource-wrapping
variables will have been filtered out and their resources given to
:meth:`resolve_classical_resource`.

Args:
    var: the variable to validate.

Raises:
    CircuitError: if the variable is not valid for this scope.

### `use_stretch`

```python
def use_stretch(self, stretch: expr.Stretch)
```

Called for every stretch being used by some circuit instruction.

Args:
    stretch: the stretch to validate.

Raises:
    CircuitError: if the stretch is not valid for this scope.

### `get_var`

```python
def get_var(self, name: str) -> expr.Var | None
```

Get the variable (if any) in scope with the given name.

This should call up to the parent scope if in a control-flow builder scope, in case the
variable exists in an outer scope.

Args:
    name: the name of the symbol to lookup.

Returns:
    the variable if it is found, otherwise ``None``.

### `get_stretch`

```python
def get_stretch(self, name: str) -> expr.Stretch | None
```

Get the stretch (if any) in scope with the given name.

This should call up to the parent scope if in a control-flow builder scope, in case the
stretch exists in an outer scope.

Args:
    name: the name of the symbol to lookup.

Returns:
    the stretch if it is found, otherwise ``None``.

### `use_qubit`

```python
def use_qubit(self, qubit: Qubit)
```

Called to mark that a :class:`~.circuit.Qubit` should be considered "used" by this scope,
without appending an explicit instruction.

The subclass may assume that the ``qubit`` is valid for the root scope.

## `InstructionResources`

```python
class InstructionResources(typing.NamedTuple)
```

The quantum and classical resources used within a particular instruction.

.. warning::

    This is an internal interface and no part of it should be relied upon outside of Qiskit
    Terra.

Attributes:
    qubits: A collection of qubits that will be used by the instruction.
    clbits: A collection of clbits that will be used by the instruction.
    qregs: A collection of quantum registers that are used by the instruction.
    cregs: A collection of classical registers that are used by the instruction.

## `InstructionPlaceholder`

```python
class InstructionPlaceholder(Instruction, abc.ABC)
```

A fake instruction that lies about its number of qubits and clbits.

These instances are used to temporarily represent control-flow instructions during the builder
process, when their lengths cannot be known until the end of the block.  This is necessary to
allow constructs like::

    with qc.for_loop(range(5)):
        qc.h(0)
        qc.measure(0, 0)
        with qc.if_test((0, 0)):
            qc.break_loop()

``qc.break_loop()`` needed to return a (mostly) functional
:obj:`~qiskit.circuit.Instruction` in order for the historical ``.InstructionSet.c_if``
to work correctly.

When appending a placeholder instruction into a circuit scope, you should create the
placeholder, and then ask it what resources it should be considered as using from the start by
calling :meth:`.InstructionPlaceholder.placeholder_instructions`.  This set will be a subset of
the final resources it asks for, but it is used for initializing resources that *must* be
supplied, such as the bits used in the conditions of placeholder ``if`` statements.

.. warning::

    This is an internal interface and no part of it should be relied upon outside of Qiskit
    Terra.

### `concrete_instruction`

```python
def concrete_instruction(self, qubits: frozenset[Qubit], clbits: frozenset[Clbit]) -> tuple[Instruction, InstructionResources]
```

Get a concrete, complete instruction that is valid to act over all the given resources.

The returned resources may not be the full width of the given resources, but will certainly
be a subset of them; this can occur if (for example) a placeholder ``if`` statement is
present, but does not itself contain any placeholder instructions.  For resource efficiency,
the returned :class:`.ControlFlowOp` will not unnecessarily span all resources, but only the
ones that it needs.

.. note::

    The caller of this function is responsible for ensuring that the inputs to this function
    are non-strict supersets of the bits returned by :meth:`placeholder_resources`.


Args:
    qubits: The qubits the created instruction should be defined across.
    clbits: The clbits the created instruction should be defined across.

Returns:
    A full version of the relevant control-flow instruction, and the resources that it uses.
    This is a "proper" instruction instance, as if it had been defined with the correct
    number of qubits and clbits from the beginning.

### `placeholder_resources`

```python
def placeholder_resources(self) -> InstructionResources
```

Get the qubit and clbit resources that this placeholder instruction should be considered
as using before construction.

This will likely not include *all* resources after the block has been built, but using the
output of this method ensures that all resources will pass through a
:meth:`.QuantumCircuit.append` call, even if they come from a placeholder, and consequently
will be tracked by the scope managers.

Returns:
    A collection of the quantum and classical resources this placeholder instruction will
    certainly use.

## `ControlFlowBuilderBlock`

```python
class ControlFlowBuilderBlock(CircuitScopeInterface)
```

A lightweight scoped block for holding instructions within a control-flow builder context.

This class is designed only to be used by :obj:`.QuantumCircuit` as an internal context for
control-flow builder instructions, and in general should never be instantiated by any code other
than that.

Note that the instructions that are added to this scope may not be valid yet, so this elides
some of the type-checking of :obj:`.QuantumCircuit` until those things are known.

The general principle of the resource tracking through these builder blocks is that every
necessary resource should pass through an :meth:`.append` call, so that at the point that
:meth:`.build` is called, the scope knows all the concrete resources that it requires.  However,
the scope can also contain "placeholder" instructions, which may need extra resources filling in
from outer scopes (such as a ``break`` needing to know the width of its containing ``for``
loop).  This means that :meth:`.build` takes all the *containing* scope's resources as well.
This does not break the "all resources pass through an append" rule, because the containing
scope will only begin to build its instructions once it has received them all.

In short, :meth:`.append` adds resources, and :meth:`.build` may use only a subset of the extra
ones passed.  This ensures that all instructions know about all the resources they need, even in
the case of ``break``, but do not block any resources that they do *not* need.

.. warning::

    This is an internal interface and no part of it should be relied upon outside of Qiskit
    Terra.

### `__init__`

```python
def __init__(self, qubits: Iterable[Qubit], clbits: Iterable[Clbit], *, parent: CircuitScopeInterface, registers: Iterable[Register]=(), allow_jumps: bool=True, forbidden_message: str | None=None, loop_var: expr.Var | None=None)
```

Args:
    qubits: Any qubits this scope should consider itself as using from the beginning.
    clbits: Any clbits this scope should consider itself as using from the beginning.  Along
        with ``qubits``, this is useful for things such as ``if`` and ``while`` loop
        builders, where the classical condition has associated resources, and is known when
        this scope is created.
    registers: Any registers this scope should consider itself as using from the
        beginning.  This is useful for :obj:`.IfElseOp` and :obj:`.WhileLoopOp` instances
        which use a classical register as their condition.
    allow_jumps: Whether this builder scope should allow ``break`` and ``continue``
        statements within it.  This is intended to help give sensible error messages when
        dangerous behavior is encountered, such as using ``break`` inside an ``if`` context
        manager that is not within a ``for`` manager.  This can only be safe if the user is
        going to place the resulting :obj:`.QuantumCircuit` inside a :obj:`.ForLoopOp` that
        uses *exactly* the same set of resources.  We cannot verify this from within the
        builder interface (and it is too expensive to do when the ``for`` op is made), so we
        fail safe, and require the user to use the more verbose, internal form.
    parent: The scope interface of the containing scope.
    forbidden_message: If a string is given here, a :exc:`.CircuitError` will be raised on
        any attempts to append instructions to the scope with this message.  This is used by
        pseudo scopes where the state machine of the builder scopes has changed into a
        position where no instructions should be accepted, such as when inside a ``switch``
        but outside any cases.
    loop_var: If given, a classical var used for the loop counter

### `qubits`

```python
def qubits(self)
```

The set of qubits associated with this scope.

### `clbits`

```python
def clbits(self)
```

The set of clbits associated with this scope.

### `allow_jumps`

```python
def allow_jumps(self)
```

Whether this builder scope should allow ``break`` and ``continue`` statements within it.

This is intended to help give sensible error messages when dangerous behavior is
encountered, such as using ``break`` inside an ``if`` context manager that is not within a
``for`` manager.  This can only be safe if the user is going to place the resulting
:obj:`.QuantumCircuit` inside a :obj:`.ForLoopOp` that uses *exactly* the same set of
resources.  We cannot verify this from within the builder interface (and it is too expensive
to do when the ``for`` op is made), so we fail safe, and require the user to use the more
verbose, internal form.

### `iter_local_vars`

```python
def iter_local_vars(self)
```

Iterator over the variables currently declared in this scope.

### `iter_local_stretches`

```python
def iter_local_stretches(self)
```

Iterator over the stretches currently declared in this scope.

### `iter_captured_vars`

```python
def iter_captured_vars(self)
```

Iterator over the variables currently captured in this scope.

### `iter_captured_stretches`

```python
def iter_captured_stretches(self)
```

Iterator over the stretches currently captured in this scope.

### `peek`

```python
def peek(self) -> CircuitInstruction
```

Get the value of the most recent instruction tuple in this scope.

### `pop`

```python
def pop(self) -> CircuitInstruction
```

Get the value of the most recent instruction in this scope, and remove it from this
object.

### `add_bits`

```python
def add_bits(self, bits: Iterable[Qubit | Clbit])
```

Add extra bits to this scope that are not associated with any concrete instruction yet.

This is useful for expanding a scope's resource width when it may contain ``break`` or
``continue`` statements, or when its width needs to be expanded to match another scope's
width (as in the case of :obj:`.IfElseOp`).

Args:
    bits: The qubits and clbits that should be added to a scope.  It is not an error if
        there are duplicates, either within the iterable or with the bits currently in
        scope.

Raises:
    TypeError: if the provided bit is of an incorrect type.

### `add_register`

```python
def add_register(self, register: Register)
```

Add a :obj:`.Register` to the set of resources used by this block, ensuring that
all bits contained within are also accounted for.

Args:
    register: the register to add to the block.

### `build`

```python
def build(self, all_qubits: frozenset[Qubit], all_clbits: frozenset[Clbit]) -> qiskit.circuit.QuantumCircuit
```

Build this scoped block into a complete :obj:`.QuantumCircuit` instance.

This will build a circuit which contains all of the necessary qubits and clbits and no
others.

The ``qubits`` and ``clbits`` arguments should be sets that contain all the resources in
the outer scope; these will be passed down to inner placeholder instructions, so they can
apply themselves across the whole scope should they need to.  The resulting
:obj:`.QuantumCircuit` will be defined over a (nonstrict) subset of these resources.  This
is used to let ``break`` and ``continue`` span all resources, even if they are nested within
several :obj:`.IfElsePlaceholder` objects, without requiring :obj:`.IfElsePlaceholder`
objects *without* any ``break`` or ``continue`` statements to be full-width.

Args:
    all_qubits: all the qubits in the containing scope of this block.  The block may expand
        to use some or all of these qubits, but will never gain qubits that are not in this
        set.
    all_clbits: all the clbits in the containing scope of this block.  The block may expand
        to use some or all of these clbits, but will never gain clbits that are not in this
        set.

Returns:
    A circuit containing concrete versions of all the instructions that were in the scope,
    and using the minimal set of resources necessary to support them, within the enclosing
    scope.

### `copy`

```python
def copy(self) -> ControlFlowBuilderBlock
```

Return a semi-shallow copy of this builder block.

The instruction lists and sets of qubits and clbits will be new instances (so mutations will
not propagate), but any :obj:`.Instruction` instances within them will not be copied.

Returns:
    a semi-shallow copy of this object.
