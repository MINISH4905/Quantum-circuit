---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/boolean/boolean_expression_visitor.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/boolean/boolean_expression_visitor.py
license: Apache-2.0
---

## Module `qiskit/synthesis/boolean/boolean_expression_visitor.py`

Node visitor as defined in https://docs.python.org/3/library/ast.html#ast.NodeVisitor
This module is used internally by ``qiskit.synthesis.boolean.BooleanExpression``.

## `BooleanExpressionEvalVisitor`

```python
class BooleanExpressionEvalVisitor(ast.NodeVisitor)
```

Node visitor to compute the value of the expression, given the boolean values of the args
as defined in https://docs.python.org/3/library/ast.html#ast.NodeVisitor

### `bit_binop`

```python
def bit_binop(self, op, values)
```

Performs the operation, if it is recognized

### `visit_BinOp`

```python
def visit_BinOp(self, node)
```

Handles ``&``, ``^``, and ``|``.

### `visit_UnaryOp`

```python
def visit_UnaryOp(self, node)
```

Handles ``~``.

### `visit_Name`

```python
def visit_Name(self, node)
```

Reduce variable names.

### `visit_Module`

```python
def visit_Module(self, node)
```

Returns the value of the single expression comprising the boolean expression

### `visit_Expr`

```python
def visit_Expr(self, node)
```

Returns the value of the expression

### `generic_visit`

```python
def generic_visit(self, node)
```

Catch all for the unhandled nodes.

## `BooleanExpressionArgsCollectorVisitor`

```python
class BooleanExpressionArgsCollectorVisitor(ast.NodeVisitor)
```

Node visitor to collect the name of the args of the expression
as defined in https://docs.python.org/3/library/ast.html#ast.NodeVisitor

### `visit_Name`

```python
def visit_Name(self, node)
```

Collect arg name.

### `get_sorted_args`

```python
def get_sorted_args(self)
```

Returns a list of the args, sorted by their appearance locations
