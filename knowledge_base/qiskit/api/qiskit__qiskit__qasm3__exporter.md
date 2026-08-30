---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/qasm3/exporter.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/qasm3/exporter.py
license: Apache-2.0
---

## Module `qiskit/qasm3/exporter.py`

QASM3 Exporter

## `DefcalInstruction`

```python
class DefcalInstruction
```

An instruction that should be assumed by the exporter to have an associated ``defcal``
statement for it.

.. note::

    This is not a complete implementation of ``defcal``\ s in OpenQASM 3, and might require
    expansion in the future to support a broader set of statements.

    For example:

    .. code-block:: openqasm3

        // We support statements that look like these:

        defcal my_measure q -> bit {}
        defcal my_reset q {}
        defcal my_rz(angle phase) q {}

        // ... and _not_ ones that look like these:

        // Uses a non-angle argument.
        defcal my_multiplied_rz(angle phase, uint amount) q;
        // Only applies to fixed hardware qubits.
        defcal my_cx $0, $1 {}

## `Exporter`

```python
class Exporter
```

QASM3 exporter main class.

### `__init__`

```python
def __init__(self, includes: Sequence[str]=('stdgates.inc',), basis_gates: Sequence[str]=('U',), disable_constants: bool=False, alias_classical_registers: bool | None=None, allow_aliasing: bool | None=None, indent: str='  ', experimental: ExperimentalFeatures=ExperimentalFeatures(0), annotation_handlers: dict[str, OpenQASM3Serializer] | None=None, implicit_defcals: dict[str, DefcalInstruction] | None=None)
```

Args:
    includes: the filenames that should be emitted as includes.

        .. note::

            At present, only the standard-library file ``stdgates.inc`` is properly
            understood by the exporter, in the sense that it knows the gates it defines.
            You can specify other includes, but you will need to pass the names of the gates
            they define in the ``basis_gates`` argument to avoid the exporter outputting a
            separate ``gate`` definition.

    basis_gates: the basic defined gate set of the backend.
    disable_constants: if ``True``, always emit floating-point constants for numeric
        parameter values.  If ``False`` (the default), then values close to multiples of
        OpenQASM 3 constants (``pi``, ``euler``, and ``tau``) will be emitted in terms of those
        constants instead, potentially improving accuracy in the output.
    alias_classical_registers: If ``True``, then bits may be contained in more than one
        register.  If so, the registers will be emitted using "alias" definitions, which
        might not be well supported by consumers of OpenQASM 3.

        .. seealso::
            Parameter ``allow_aliasing``
                A value for ``allow_aliasing`` overrides any value given here, and
                supersedes this parameter.
    allow_aliasing: If ``True``, then bits may be contained in more than one register.  If
        so, the registers will be emitted using "alias" definitions, which might not be
        well supported by consumers of OpenQASM 3.  Defaults to ``False`` or the value of
        ``alias_classical_registers``.

        .. versionadded:: 0.25.0
    indent: the indentation string to use for each level within an indented block.  Can be
        set to the empty string to disable indentation.
    experimental: any experimental features to enable during the export.  See
        :class:`ExperimentalFeatures` for more details.
    annotation_handlers: a mapping of namespaces to annotation serializers.  When an
        :class:`.Annotation` object is encountered, the most specific namespace in this
        mapping that matches the annotation's :attr:`~.Annotation.namespace` attribute will
        be used to serialize it.
    implicit_defcals: mapping of :attr:`.Instruction.name`\ s to an associated
        :class:`.DefcalInstruction` object.  All instructions with the key name in the input
        circuit should be output as if there is a ``defcal`` statement corresponding to the
        given :class:`.DefcalInstruction` defined.  The key name and the
        :attr:`.DefcalInstruction.name` do not need to match.  The ``defcal`` name cannot
        collide with an OpenQASM 3 keyword.

### `dumps`

```python
def dumps(self, circuit)
```

Convert the circuit to OpenQASM 3, returning the result as a string.

### `dump`

```python
def dump(self, circuit, stream)
```

Convert the circuit to OpenQASM 3, dumping the result to a file or text stream.

## `GateInfo`

```python
class GateInfo
```

Symbol-table information on a gate.

## `SymbolTable`

```python
class SymbolTable
```

Track Qiskit objects and the OQ3 identifiers used to refer to them.

### `push_scope`

```python
def push_scope(self)
```

Enter a new variable scope.

### `pop_scope`

```python
def pop_scope(self)
```

Exit the current scope, returning to a previous scope.

### `new_context`

```python
def new_context(self) -> SymbolTable
```

Create a new context, such as for a gate definition.

Contexts share the same set of globally defined gates, but have no access to other variables
defined in any scope.

### `symbol_defined`

```python
def symbol_defined(self, name: str) -> bool
```

Whether this identifier has a defined meaning already.

### `can_shadow_symbol`

```python
def can_shadow_symbol(self, name: str) -> bool
```

Whether a new definition of this symbol can be made within the OpenQASM 3 shadowing
rules.

### `escaped_declarable_name`

```python
def escaped_declarable_name(self, name: str, *, allow_rename: bool, unique: bool=False)
```

Get an identifier based on ``name`` that can be safely shadowed within this scope.

If ``unique`` is ``True``, then the name is required to be unique across all live scopes,
not just able to be redefined.

### `register_variable`

```python
def register_variable(self, name: str, variable: object, *, allow_rename: bool, force_global: bool=False, allow_hardware_qubit: bool=False) -> ast.Identifier
```

Register a variable in the symbol table for the given scope, returning the name that
should be used to refer to the variable.  The same name will be returned by subsequent calls
to :meth:`get_variable` within the same scope.

Args:
    name: the name to base the identifier on.
    variable: the Qiskit object this refers to.  This can be ``None`` in the case of
        reserving a dummy variable name that does not actually have a Qiskit object backing
        it.
    allow_rename: whether to allow the name to be mutated to escape it and/or make it safe
        to define (avoiding keywords, subject to shadowing rules, etc).
    force_global: force this declaration to be in the global scope.
    allow_hardware_qubit: whether to allow hardware qubits to pass through as identifiers.
        Hardware qubits are a dollar sign followed by a non-negative integer, and cannot be
        declared, so are not suitable identifiers for most objects.

### `set_object_ident`

```python
def set_object_ident(self, ident: ast.Identifier, variable: object)
```

Set the identifier used to refer to a given object for this scope.

This overwrites any previously set identifier, such as during the original registration.

This is generally only useful for tracking "sub" objects, like bits out of a register, which
will have an `SubscriptedIdentifier` as their identifier.

### `get_variable`

```python
def get_variable(self, variable: object) -> ast.Identifier
```

Lookup a non-gate variable in the symbol table.

### `register_gate_without_definition`

```python
def register_gate_without_definition(self, name: str, gate: Gate | None) -> ast.Identifier
```

Register a gate that does not require an OQ3 definition.

If the ``gate`` is given, it will be used to validate that a call to it is compatible (such
as a known gate from an included file).  If it is not given, it is treated as a user-defined
"basis gate" that assumes that all calling signatures are valid and that all gates of this
name are exactly compatible, which is somewhat dangerous.

### `register_gate`

```python
def register_gate(self, name: str, source: Gate, params: Iterable[ast.Identifier], qubits: Iterable[ast.Identifier], body: ast.QuantumBlock) -> ast.Identifier
```

Register the given gate in the symbol table, using the given components to build up the
full AST definition.

### `register_defcal`

```python
def register_defcal(self, defcal: DefcalInstruction)
```

Register a ``defcal`` statement in the symbol table.

### `get_gate`

```python
def get_gate(self, gate: Gate) -> ast.Identifier | None
```

Lookup the identifier for a given `Gate`, if it exists.

## `BuildScope`

```python
class BuildScope
```

The structure used in the builder to store the contexts and re-mappings of bits from the
top-level scope where the bits were actually defined.

## `QASM3Builder`

```python
class QASM3Builder
```

QASM3 builder constructs an AST from a QuantumCircuit.

### `new_scope`

```python
def new_scope(self, circuit: QuantumCircuit, qubits: Iterable[Qubit], clbits: Iterable[Clbit])
```

Context manager that pushes a new scope (like a ``for`` or ``while`` loop body) onto the
current context stack.

### `new_context`

```python
def new_context(self, body: QuantumCircuit)
```

Push a new context (like for a ``gate`` or ``def`` body) onto the stack.

### `build_program`

```python
def build_program(self)
```

Builds a Program

### `build_includes`

```python
def build_includes(self)
```

Builds a list of included files.

### `define_gate`

```python
def define_gate(self, gate: Gate) -> ast.Identifier
```

Define a gate in the symbol table, including building the gate-definition statement for
it.

This recurses through gate-definition statements.

### `assert_global_scope`

```python
def assert_global_scope(self)
```

Raise an error if we are not in the global scope, as a defensive measure.

### `hoist_global_parameter_declarations`

```python
def hoist_global_parameter_declarations(self)
```

Extend ``self._global_io_declarations`` and ``self._global_classical_declarations`` with
any implicit declarations used to support the early IBM efforts to use :class:`.Parameter`
as an input variable.

### `hoist_classical_register_declarations`

```python
def hoist_classical_register_declarations(self)
```

Extend the global classical declarations with AST nodes declaring all the global-scope
circuit :class:`.Clbit` and :class:`.ClassicalRegister` instances.  Qiskit's data model
doesn't involve the declaration of *new* bits or registers in inner scopes; only the
:class:`.expr.Var` mechanism allows that.

The behavior of this function depends on the setting ``allow_aliasing``. If this
is ``True``, then the output will be in the same form as the output of
:meth:`.build_classical_declarations`, with the registers being aliases.  If ``False``, it
will instead return a :obj:`.ast.ClassicalDeclaration` for each classical register, and one
for the loose :obj:`.Clbit` instances, and will raise :obj:`QASM3ExporterError` if any
registers overlap.

### `hoist_classical_io_var_declarations`

```python
def hoist_classical_io_var_declarations(self)
```

Hoist the declarations of classical IO :class:`.expr.Var` nodes into the global state.

Local :class:`.expr.Var` declarations are handled by the regular local-block scope builder,
and the :class:`.QuantumCircuit` data model ensures that the only time an IO variable can
occur is in an outermost block.

### `build_quantum_declarations`

```python
def build_quantum_declarations(self)
```

Return a list of AST nodes declaring all the qubits in the current scope, and all the
alias declarations for these qubits.

### `build_aliases`

```python
def build_aliases(self, registers: Iterable[Register]) -> list[ast.AliasStatement]
```

Return a list of alias declarations for the given registers.  The registers can be either
classical or quantum.

### `build_current_scope`

```python
def build_current_scope(self) -> list[ast.Statement]
```

Build the instructions that occur in the current scope.

In addition to everything literally in the circuit's ``data`` field, this also includes
declarations for any local :class:`.expr.Var` nodes.

### `build_if_statement`

```python
def build_if_statement(self, instruction: CircuitInstruction) -> ast.BranchingStatement
```

Build an :obj:`.IfElseOp` into a :obj:`.ast.BranchingStatement`.

### `build_switch_statement`

```python
def build_switch_statement(self, instruction: CircuitInstruction) -> Iterable[ast.Statement]
```

Build a :obj:`.SwitchCaseOp` into a :class:`.ast.SwitchStatement`.

### `build_box`

```python
def build_box(self, instruction: CircuitInstruction) -> ast.BoxStatement
```

Build a :class:`.BoxOp` into a :class:`.ast.BoxStatement`.

### `build_while_loop`

```python
def build_while_loop(self, instruction: CircuitInstruction) -> ast.WhileLoopStatement
```

Build a :obj:`.WhileLoopOp` into a :obj:`.ast.WhileLoopStatement`.

### `build_for_loop`

```python
def build_for_loop(self, instruction: CircuitInstruction) -> ast.ForLoopStatement
```

Build a :obj:`.ForLoopOp` into a :obj:`.ast.ForLoopStatement`.

### `build_annotation`

```python
def build_annotation(self, annotation: Annotation) -> ast.Annotation
```

Use the custom serializers to construct an annotation object.

### `build_expression`

```python
def build_expression(self, node: expr.Expr) -> ast.Expression
```

Build an expression.

### `build_delay`

```python
def build_delay(self, instruction: CircuitInstruction) -> ast.QuantumDelay
```

Build a built-in delay statement.

### `build_duration`

```python
def build_duration(self, duration, unit) -> ast.Expression | None
```

Build the expression of a given duration (if not ``None``).

### `build_integer`

```python
def build_integer(self, value) -> ast.IntegerLiteral
```

Build an integer literal, raising a :obj:`.QASM3ExporterError` if the input is not
actually an
integer.

### `build_defcal_call`

```python
def build_defcal_call(self, instruction: CircuitInstruction, defcal: DefcalInstruction)
```

Build a statement associated with a defcal instruction.

### `build_gate_call`

```python
def build_gate_call(self, instruction: CircuitInstruction)
```

Builds a gate-call AST node.

This will also push the gate into the symbol table (if required), including recursively
defining the gate blocks.

If the operation identifier is found in the symbol table, symbol-resolution will be skipped.
