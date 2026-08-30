---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/qasm3/ast.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/qasm3/ast.py
license: Apache-2.0
---

## Module `qiskit/qasm3/ast.py`

QASM3 AST Nodes

## `ASTNode`

```python
class ASTNode
```

Base abstract class for AST nodes

## `Statement`

```python
class Statement(ASTNode)
```

statement
    : expressionStatement
    | assignmentStatement
    | classicalDeclarationStatement
    | branchingStatement
    | loopStatement
    | endStatement
    | aliasStatement
    | quantumStatement

## `Pragma`

```python
class Pragma(ASTNode)
```

pragma
    : '#pragma' LBRACE statement* RBRACE  // match any valid openqasm statement

## `Annotation`

```python
class Annotation(ASTNode)
```

An annotation.

## `CalibrationGrammarDeclaration`

```python
class CalibrationGrammarDeclaration(Statement)
```

calibrationGrammarDeclaration
    : 'defcalgrammar' calibrationGrammar SEMICOLON

## `Program`

```python
class Program(ASTNode)
```

program
    : header (globalStatement | statement)*

## `Header`

```python
class Header(ASTNode)
```

header
    : version? include*

## `Include`

```python
class Include(ASTNode)
```

include
    : 'include' StringLiteral SEMICOLON

## `Version`

```python
class Version(ASTNode)
```

version
    : 'OPENQASM'(Integer | RealNumber) SEMICOLON

## `QuantumInstruction`

```python
class QuantumInstruction(ASTNode)
```

quantumInstruction
    : quantumGateCall
    | quantumPhase
    | quantumMeasurement
    | quantumReset
    | quantumBarrier

## `ClassicalType`

```python
class ClassicalType(ASTNode)
```

Information about a classical type.  This is just an abstract base for inheritance tests.

## `FloatType`

```python
class FloatType(ClassicalType, enum.Enum)
```

Allowed values for the width of floating-point types.

## `BoolType`

```python
class BoolType(ClassicalType)
```

Type information for a Boolean.

## `IntType`

```python
class IntType(ClassicalType)
```

Type information for a signed integer.

## `UintType`

```python
class UintType(ClassicalType)
```

Type information for an unsigned integer.

## `BitType`

```python
class BitType(ClassicalType)
```

Type information for a single bit.

## `DurationType`

```python
class DurationType(ClassicalType)
```

Type information for a duration.

## `BitArrayType`

```python
class BitArrayType(ClassicalType)
```

Type information for a sized number of classical bits.

## `SubscriptedIdentifier`

```python
class SubscriptedIdentifier(Identifier)
```

An identifier with subscripted access.

## `Constant`

```python
class Constant(Expression, enum.Enum)
```

A constant value defined by the QASM 3 spec.

## `DurationUnit`

```python
class DurationUnit(enum.Enum)
```

Valid values for the unit of durations.

## `IndexSet`

```python
class IndexSet(ASTNode)
```

A literal index set of values::

    { Expression (, Expression)* }

## `QuantumMeasurement`

```python
class QuantumMeasurement(ASTNode)
```

quantumMeasurement
    : 'measure' indexIdentifierList

## `QuantumMeasurementAssignment`

```python
class QuantumMeasurementAssignment(Statement)
```

quantumMeasurementAssignment
    : quantumMeasurement ARROW indexIdentifierList
    | indexIdentifier EQUALS quantumMeasurement  # eg: bits = measure qubits;

## `Designator`

```python
class Designator(ASTNode)
```

designator
    : LBRACKET expression RBRACKET

## `ClassicalDeclaration`

```python
class ClassicalDeclaration(Statement)
```

Declaration of a classical type, optionally initializing it to a value.

## `StretchDeclaration`

```python
class StretchDeclaration(Statement)
```

Declaration of a stretch variable, optionally with a lower bound
expression.

## `AssignmentStatement`

```python
class AssignmentStatement(Statement)
```

Assignment of an expression to an l-value.

## `QuantumDeclaration`

```python
class QuantumDeclaration(ASTNode)
```

quantumDeclaration
    : 'qreg' Identifier designator? |   # NOT SUPPORTED
     'qubit' designator? Identifier

## `AliasStatement`

```python
class AliasStatement(ASTNode)
```

aliasStatement
    : 'let' Identifier EQUALS indexIdentifier SEMICOLON

## `QuantumGateModifierName`

```python
class QuantumGateModifierName(enum.Enum)
```

The names of the allowed modifiers of quantum gates.

## `QuantumGateModifier`

```python
class QuantumGateModifier(ASTNode)
```

A modifier of a gate. For example, in ``ctrl @ x $0``, the ``ctrl @`` is the modifier.

## `QuantumGateCall`

```python
class QuantumGateCall(QuantumInstruction)
```

quantumGateCall
    : quantumGateModifier* quantumGateName ( LPAREN expressionList? RPAREN )? indexIdentifierList

## `DefcalCallStatement`

```python
class DefcalCallStatement(Statement)
```

A quantum-like call that may have an assignment location.

## `QuantumBarrier`

```python
class QuantumBarrier(QuantumInstruction)
```

quantumBarrier
    : 'barrier' indexIdentifierList

## `QuantumReset`

```python
class QuantumReset(QuantumInstruction)
```

A built-in ``reset q0;`` statement.

## `QuantumDelay`

```python
class QuantumDelay(QuantumInstruction)
```

A built-in ``delay[duration] q0;`` statement.

## `ProgramBlock`

```python
class ProgramBlock(ASTNode)
```

programBlock
    : statement | controlDirective
    | LBRACE(statement | controlDirective) * RBRACE

## `ReturnStatement`

```python
class ReturnStatement(ASTNode)
```

returnStatement
    : 'return' ( expression | quantumMeasurement )? SEMICOLON;

## `QuantumBlock`

```python
class QuantumBlock(ProgramBlock)
```

quantumBlock
    : LBRACE ( quantumStatement | quantumLoop )* RBRACE

## `SubroutineBlock`

```python
class SubroutineBlock(ProgramBlock)
```

subroutineBlock
    : LBRACE statement* returnStatement? RBRACE

## `QuantumGateDefinition`

```python
class QuantumGateDefinition(Statement)
```

quantumGateDefinition
    : 'gate' quantumGateSignature quantumBlock

## `SubroutineDefinition`

```python
class SubroutineDefinition(Statement)
```

subroutineDefinition
    : 'def' Identifier LPAREN anyTypeArgumentList? RPAREN
    returnSignature? subroutineBlock

## `CalibrationArgument`

```python
class CalibrationArgument(ASTNode)
```

calibrationArgumentList
    : classicalArgumentList | expressionList

## `CalibrationDefinition`

```python
class CalibrationDefinition(Statement)
```

calibrationDefinition
    : 'defcal' Identifier
    ( LPAREN calibrationArgumentList? RPAREN )? identifierList
    returnSignature? LBRACE .*? RBRACE  // for now, match anything inside body
    ;

## `BranchingStatement`

```python
class BranchingStatement(Statement)
```

branchingStatement
    : 'if' LPAREN booleanExpression RPAREN programBlock ( 'else' programBlock )?

## `ForLoopStatement`

```python
class ForLoopStatement(Statement)
```

AST node for ``for`` loops.

::

    ForLoop: "for" Identifier "in" SetDeclaration ProgramBlock
    SetDeclaration:
        | Identifier
        | "{" Expression ("," Expression)* "}"
        | "[" Range "]"

## `WhileLoopStatement`

```python
class WhileLoopStatement(Statement)
```

AST node for ``while`` loops.

::

    WhileLoop: "while" "(" Expression ")" ProgramBlock

## `BoxStatement`

```python
class BoxStatement(Statement)
```

Like ``box[duration] { statements* }``.

## `BreakStatement`

```python
class BreakStatement(Statement)
```

AST node for ``break`` statements.  Has no associated information.

## `ContinueStatement`

```python
class ContinueStatement(Statement)
```

AST node for ``continue`` statements.  Has no associated information.

## `IOModifier`

```python
class IOModifier(enum.Enum)
```

IO Modifier object

## `IODeclaration`

```python
class IODeclaration(ClassicalDeclaration)
```

A declaration of an IO variable.

## `DefaultCase`

```python
class DefaultCase(Expression)
```

An object representing the `default` special label in switch statements.

## `SwitchStatementPreview`

```python
class SwitchStatementPreview(Statement)
```

AST node for the proposed 'switch-case' extension to OpenQASM 3, before the syntax was
stabilized.  This corresponds to the :attr:`.ExperimentalFeatures.SWITCH_CASE_V1` logic.

The stabilized form of the syntax instead uses :class:`.SwitchStatement`.

## `SwitchStatement`

```python
class SwitchStatement(Statement)
```

AST node for the stable 'switch' statement of OpenQASM 3.

The only real difference from an AST form is that the default is required to be separate; it
cannot be joined with other cases (even though that's meaningless, the V1 syntax permitted it).
