---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/qpy/binary_io/parse_sympy_repr.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/qpy/binary_io/parse_sympy_repr.py
license: Apache-2.0
---

## Module `qiskit/qpy/binary_io/parse_sympy_repr.py`

Parser for sympy expressions srepr from ParameterExpression internals.

## `ParseSympyWalker`

```python
class ParseSympyWalker(ast.NodeVisitor)
```

A custom ast walker that is passed the sympy srepr from QPY < 13 and creates a custom
expression.

### `visit_UnaryOp`

```python
def visit_UnaryOp(self, node: ast.UnaryOp)
```

Visit a python unary op node

### `visit_Constant`

```python
def visit_Constant(self, node: ast.Constant)
```

Visit a constant node.

### `visit_Call`

```python
def visit_Call(self, node: ast.Call)
```

Visit a call node

This can only be parameter expression allowed sympy call types.

## `parse_sympy_repr`

```python
def parse_sympy_repr(sympy_repr: str)
```

Parse a given sympy srepr into a symbolic expression object.
