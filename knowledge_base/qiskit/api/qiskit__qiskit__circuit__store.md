---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/store.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/store.py
license: Apache-2.0
---

## Module `qiskit/circuit/store.py`

The 'Store' operation.

## `Store`

```python
class Store(Instruction)
```

A manual storage of some classical value to a classical memory location.

This is a low-level primitive of the classical-expression handling (similar to how
:class:`~.circuit.Measure` is a primitive for quantum measurement), and is not safe for
subclassing.

### `__init__`

```python
def __init__(self, lvalue: expr.Expr, rvalue: expr.Expr)
```

Args:
    lvalue: the memory location being stored into.
    rvalue: the expression result being stored.

### `lvalue`

```python
def lvalue(self)
```

Get the l-value :class:`~.expr.Expr` node that is being stored to.

### `rvalue`

```python
def rvalue(self)
```

Get the r-value :class:`~.expr.Expr` node that is being written into the l-value.
