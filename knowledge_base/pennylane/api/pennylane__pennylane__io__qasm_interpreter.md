---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/io/qasm_interpreter.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/io/qasm_interpreter.py
license: Apache-2.0
---

## Module `pennylane/io/qasm_interpreter.py`

This submodule contains the interpreter for OpenQASM 3.0.

## `Variable`

```python
class Variable
```

A data class that represents a variables.

Args:
    ty (type): The type of the variable.
    val (any): The value of the variable.
    size (int): The size of the variable if it has a size, like an array.
    line (int): The line number at which the variable was most recently updated.
    constant (bool): Whether the variable is a constant.
    scope (str): The name of the scope of the variable.

## `Context`

```python
class Context
```

Class with helper methods for managing, updating, checking context.

### `__init__`

```python
def __init__(self, context: dict)
```

Initializes the context.

Args:
    context (dict): A dictionary that contains some information about the context.

### `init_custom_gate_scope`

```python
def init_custom_gate_scope(self, node: ast.QuantumGateDefinition)
```

Initializes a context for a custom quantum gate.

Args:
    node (QuantumGateDefinition): the custom quantum gate definition.

### `init_subroutine_scope`

```python
def init_subroutine_scope(self, node: ast.SubroutineDefinition)
```

Initializes a sub context with all the params, constants, subroutines and qubits it has access to.

Args:
    node (SubroutineDefinition): the subroutine definition.

### `retrieve_variable`

```python
def retrieve_variable(self, name: str)
```

Attempts to retrieve a variable from the current context by name.

Args:
    name (str): the name of the variable to retrieve.

Returns:
    The value of the variable in the current context.

Raises:
     NameError: if the variable is not initialized.
     TypeError: if the variable is not declared.

### `update_var`

```python
def update_var(self, value: any, name: str, operator: str, line: int)
```

Updates a variable, or raises if it is constant.

Args:
    value (any): the value to set.
    name (str): the name of the variable.
    operator (str): the assignment operator.
    line (int): the line number at which we encountered the assignment node.

Raises:
    ValueError: if the variable we are trying to update is a constant.

### `require_wires`

```python
def require_wires(self, wires: list)
```

Simple helper that checks if we have wires in the current context.

Args:
    wires (list): The wires that are required.

Raises:
    NameError: If the context is missing a wire.

### `__getattr__`

```python
def __getattr__(self, name: str)
```

If the attribute is not found on the class, instead uses the attr name as an index
into the context dictionary, for easy access.

Args:
    name (str): the name of the attribute.

Returns:
    Any: the value of the attribute.

Raises:
    KeyError: if the attribute is not found on the context.

### `__getitem__`

```python
def __getitem__(self, item)
```

Allows accessing items on the context by subscripting.

Args:
    item: the name of the key to retrieve.

Returns:
    Any: the value corresponding to the key.

## `preprocess_operands`

```python
def preprocess_operands(operand)
```

Interprets a string operand as an appropriate type.

Args:
    operand (str): the string operand to interpret.

Returns:
    The interpreted operand as an appropriate type.

## `BreakException`

```python
class BreakException(Exception)
```

Exception raised when encountering a break statement.

## `ContinueException`

```python
class ContinueException(Exception)
```

Exception raised when encountering a continue statement.

## `EndProgram`

```python
class EndProgram(Exception)
```

Exception raised when it encounters an end statement in the QASM circuit.

## `QasmInterpreter`

```python
class QasmInterpreter
```

Takes the top level node of the AST as a parameter and recursively descends the AST, calling the
visitor function on each node.

### `__init__`

```python
def __init__(self)
```

Initializes the QASM interpreter.

### `visit`

```python
def visit(self, node: QASMNode, context: Context, aliasing: bool=False)
```

Visitor function is called on each node in the AST, which is traversed using recursive descent.
The purpose of this function is to pass each node to the appropriate handler.

Args:
    node (QASMNode): the QASMNode to visit next.
    context (Context): the current context populated with any locally available variables, etc.
    aliasing (bool): whether we are aliasing a variable in the context.

Raises:
    NotImplementedError: when an unsupported QASMNode type is found.

### `visit_list`

```python
def visit_list(self, node_list: list, context: Context, allow_end: bool=True)
```

Visits a list of QASMNodes.

Args:
    node_list (list): the list of QASMNodes to visit.
    context (Context): the current context.

Raises:
    NotImplementedError: if an end statement is encountered in an unsupported context.

### `interpret`

```python
def interpret(self, node: QASMNode, context: dict, **inputs)
```

Entry point for visiting the QASMNodes of a parsed OpenQASM 3.0 program.

Args:
    node (QASMNode): The top-most QASMNode.
    context (dict): The initial context populated with the name of the program (the outermost scope).
    inputs (dict): Additional inputs to the OpenQASM 3.0 program.

Returns:
    dict: The context updated after the compilation of all nodes by the visitor.

Raises:
    ValueError: If the wrong parameters are provided in **inputs.

### `visit_quantum_measurement`

```python
def visit_quantum_measurement(self, node: ast.QuantumMeasurement, context: Context)
```

Registers a quantum measurement statement.

Args:
    node (QuantumMeasurement): the quantum measurement to interpret
    context (Context): the current context.

### `visit_quantum_measurement_statement`

```python
def visit_quantum_measurement_statement(self, node: ast.QuantumMeasurementStatement, context: Context)
```

Registers a quantum measurement statement.

Args:
    node (QuantumMeasurementStatement): the quantum measurement statement to register.
    context (Context): the current context.

### `visit_break_statement`

```python
def visit_break_statement(self, node: ast.BreakStatement, context: Context)
```

Registers a break statement.

Args:
    node (BreakStatement): the break QASMNode.
    context (Context): the current context.

Raises:
    BreakException: the exception facilitates interrupting the corresponding loop execution.

### `visit_continue_statement`

```python
def visit_continue_statement(self, node: ast.ContinueStatement, context: Context)
```

Registers a continue statement.

Args:
    node (ContinueStatement): the continue QASMNode.
    context (Context): the current context.

Raises:
    ContinueException: the exception facilitates interrupting the corresponding loop execution.

### `visit_branching_statement`

```python
def visit_branching_statement(self, node: ast.BranchingStatement, context: Context)
```

Registers a branching statement. Like switches, uses qp.cond.

Args:
    node (BranchingStatement): the branch QASMNode.
    context (Context): the current context.

### `visit_switch_statement`

```python
def visit_switch_statement(self, node: ast.SwitchStatement, context: Context)
```

Registers a switch statement.

Args:
    node (SwitchStatement): the switch QASMNode.
    context (Context): the current context.

### `execute_loop`

```python
def execute_loop(loop: Callable, execution_context: Context)
```

Handles when a break is encountered in the loop.

Args:
    loop (Callable): the loop function.
    execution_context (Context): the context passed at execution time with current variable values, etc.

### `visit_while_loop`

```python
def visit_while_loop(self, node: ast.WhileLoop, context: Context)
```

Registers a while loop.

Args:
    node (QASMNode): the loop node.
    context (Context): the current context.

Raises:
    ValueError: if a mid circuit measurement outcome is used as a condition to a loop.

### `visit_for_in_loop`

```python
def visit_for_in_loop(self, node: ast.ForInLoop, context: Context)
```

Registers a for loop.

Args:
    node (QASMNode): the loop node.
    context (Context): the current context.

Raises:
    TypeError: if we are trying to loop over something not iterable and not a range.

### `visit_quantum_reset`

```python
def visit_quantum_reset(self, node: QASMNode, context: dict)
```

Registers a reset of a quantum gate.

Args:
    node (QASMNode): the quantum reset node.
    context (dict): the current context.

### `execute_custom_gate`

```python
def execute_custom_gate(self, node: ast.QuantumGate, context: Context)
```

Executes a custom gate.

Args:
    node (QuantumGate): the custom gate call.
    context (Context): the current context.

### `visit_function_call`

```python
def visit_function_call(self, node: ast.FunctionCall, context: Context)
```

Registers a function call. The node must refer to a subroutine that has been defined and
is available in the current scope.

Args:
    node (FunctionCall): The FunctionCall QASMNode.
    context (Context): The current context.

Raises:
    NameError: When the subroutine is not defined.

### `visit_range`

```python
def visit_range(self, node: ast.RangeDefinition, context: Context)
```

Processes a range definition.

Args:
    node (RangeDefinition): The range to process.
    context (Context): the current context.

Returns:
    slice: The slice that corresponds to the range.

### `visit_io_declaration`

```python
def visit_io_declaration(self, node: ast.IODeclaration, context: Context)
```

Registers an input or output declaration.

Args:
    node (IODeclaration): The IODeclaration QASMNode.
    context (Context): the current context.

Raises:
    ValueError: if an input is missing.

### `visit_end_statement`

```python
def visit_end_statement(self, node: ast.EndStatement, context: Context)
```

Ends the program.

Args:
    node (EndStatement): The end statement QASMNode.
    context (Context): the current context.

Raises:
    EndProgram: facilitates interrupting the program execution.

### `visit_qubit_declaration`

```python
def visit_qubit_declaration(self, node: ast.QubitDeclaration, context: Context)
```

Registers a qubit declaration. Named qubits are mapped to numbered wires by their indices
in context.wires. Note: Qubit declarations must be global.

Args:
    node (QASMNode): The QubitDeclaration QASMNode.
    context (Context): The current context.

Raises:
    TypeError: if it is a qubit register declaration.

### `visit_classical_assignment`

```python
def visit_classical_assignment(self, node: ast.ClassicalAssignment, context: Context)
```

Registers a classical assignment.

Args:
    node (ClassicalAssignment): the assignment QASMNode.
    context (Context): the current context.

### `visit_alias_statement`

```python
def visit_alias_statement(self, node: ast.AliasStatement, context: Context)
```

Registers an alias statement.

Args:
    node (AliasStatement): the alias QASMNode.
    context (Context): the current context.

### `visit_return_statement`

```python
def visit_return_statement(self, node: ast.ReturnStatement, context: Context)
```

Registers a return statement. Points to the var that needs to be set in an outer scope when this
subroutine is called.

Args:
    node (ReturnStatement): The return statement QASMNode.
    context (Context): the current context.

### `visit_constant_declaration`

```python
def visit_constant_declaration(self, node: ast.ConstantDeclaration, context: Context)
```

Registers a constant declaration. Traces data flow through the context, transforming QASMNodes into
Python type variables that can be readily used in expression eval, etc.

Args:
    node (ConstantDeclaration): The constant QASMNode.
    context (Context): The current context.

### `visit_classical_declaration`

```python
def visit_classical_declaration(self, node: ast.ClassicalDeclaration, context: Context, constant: bool=False)
```

Registers a classical declaration. Traces data flow through the context, transforming QASMNodes into Python
type variables that can be readily used in expression evaluation, for example.

Args:
    node (ClassicalDeclaration): The ClassicalDeclaration QASMNode.
    context (Context): The current context.
    constant (bool): Whether the classical variable is a constant.

### `visit_imaginary_literal`

```python
def visit_imaginary_literal(self, node: ast.ImaginaryLiteral, context: Context)
```

Registers an imaginary literal.

Args:
    node (ImaginaryLiteral): The imaginary literal QASMNode.
    context (Context): the current context.

Returns:
    complex: a complex number corresponding to the imaginary literal.

### `visit_discrete_set`

```python
def visit_discrete_set(self, node: ast.DiscreteSet, context: Context)
```

Evaluates a discrete set literal.

Args:
    node (DiscreteSet): The set literal QASMNode.
    context (Context): The current context.

Returns:
    list: The evaluated set.

### `visit_array_literal`

```python
def visit_array_literal(self, node: ast.ArrayLiteral, context: Context)
```

Evaluates an array literal.

Args:
    node (ArrayLiteral): The array literal QASMNode.
    context (Context): The current context.

Returns:
    list: The evaluated array.

### `visit_quantum_gate_definition`

```python
def visit_quantum_gate_definition(self, node: ast.QuantumGateDefinition, context: Context)
```

Registers a quantum gate definition.

Args:
    node (QuantumGateDefinition): The quantum gate definition QASMNode.
    context (Context): the current context.

### `visit_subroutine_definition`

```python
def visit_subroutine_definition(self, node: ast.SubroutineDefinition, context: Context)
```

Registers a subroutine definition. Maintains a namespace in the context, starts populating it with
its parameters.

Args:
    node (SubroutineDefinition): the subroutine node.
    context (Context): the current context.

### `visit_quantum_phase`

```python
def visit_quantum_phase(self, node: ast.QuantumPhase, context: Context)
```

Registers a global phase application.

Args:
    node (QuantumPhase): The QuantumPhase QASMNode.
    context (Context): The current context.

### `visit_quantum_gate`

```python
def visit_quantum_gate(self, node: ast.QuantumGate, context: Context)
```

Registers a quantum gate application. Calls the appropriate handler based on the sort of gate
(parameterized or non-parameterized).

Args:
    node (QuantumGate): The QuantumGate QASMNode.
    context (Context): The current context.

### `apply_modifier`

```python
def apply_modifier(self, mod: ast.QuantumGate, previous: Operator, context: Context, wires: list)
```

Applies a modifier to the previous gate or modified gate.

Args:
    mod (QASMNode): The modifier QASMNode.
    previous (Operator): The previous (called) operator.
    context (Context): The current context.
    wires (list): The wires that the operator is applied to.

Raises:
    NotImplementedError: If the modifier has a param of an as-yet unsupported type.

### `visit_expression_statement`

```python
def visit_expression_statement(self, node: ast.ExpressionStatement, context: Context)
```

Registers an expression statement.

Args:
    node (ExpressionStatement): The expression statement.
    context (Context): The current context.

### `visit_cast`

```python
def visit_cast(self, node: ast.Cast, context: Context)
```

Registers a Cast expression.

Args:
    node (Cast): The Cast expression.
    context (Context): The current context.

Returns:
    Any: The argument cast to the appropriate type.

Raises:
    TypeError: If the cast cannot be made.

### `visit_binary_expression`

```python
def visit_binary_expression(self, node: ast.BinaryExpression, context: Context)
```

Registers a binary expression.

Args:
    node (BinaryExpression): The binary expression.
    context (Context): The current context.

Returns:
    The result of the evaluated expression.

### `visit_unary_expression`

```python
def visit_unary_expression(self, node: ast.UnaryExpression, context: Context)
```

Registers a unary expression.

Args:
    node (UnaryExpression): The unary expression.
    context (Context): The current context.

Returns:
    The result of the evaluated expression.

### `visit_index_expression`

```python
def visit_index_expression(self, node: ast.IndexExpression, context: Context, aliasing: bool=False)
```

Registers an index expression.

Args:
    node (IndexExpression): The index expression.
    context (Context): The current context.
    aliasing (bool): If ``True``, the expression will be treated as an alias.

Returns:
    The slice of the indexed value.

### `visit_identifier`

```python
def visit_identifier(self, node: ast.Identifier, context: Context, aliasing: bool=False)
```

Registers an identifier.

Args:
    node (Identifier): The identifier.
    context (Context): The current context.
    aliasing (bool): If ``True``, the Identifier will be treated as an alias.

Returns:
    The de-referenced identifier.

Raises:
    TypeError: if we have a reference to an undeclared variable.

### `visit_literal`

```python
def visit_literal(self, node: ast.Expression, context: Context)
```

Visits a literal.

Args:
    node (Literal): The literal.
    context (Context): The current context.

Returns:
    The value of the literal.
