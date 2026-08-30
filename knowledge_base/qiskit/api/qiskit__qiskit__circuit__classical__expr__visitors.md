---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/classical/expr/visitors.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/classical/expr/visitors.py
license: Apache-2.0
---

## Module `qiskit/circuit/classical/expr/visitors.py`

Expression visitors.

## `ExprVisitor`

```python
class ExprVisitor(typing.Generic[_T_co])
```

Base class for visitors to the :class:`Expr` tree.  Subclasses should override whichever of
the ``visit_*`` methods that they are able to handle, and should be organized such that
non-existent methods will never be called.

## `iter_vars`

```python
def iter_vars(node: expr.Expr) -> typing.Iterator[expr.Var]
```

Get an iterator over the :class:`~.expr.Var` nodes referenced at any level in the given
:class:`~.expr.Expr`.

Examples:
    Print out the name of each :class:`.ClassicalRegister` encountered::

        from qiskit.circuit import ClassicalRegister
        from qiskit.circuit.classical import expr

        cr1 = ClassicalRegister(3, "a")
        cr2 = ClassicalRegister(3, "b")

        for node in expr.iter_vars(expr.bit_and(expr.bit_not(cr1), cr2)):
            if isinstance(node.var, ClassicalRegister):
                print(node.var.name)

.. seealso::
    :func:`iter_identifiers`
        Get an iterator over all identifier nodes in the expression, including
        both :class:`~.expr.Var` and :class:`~.expr.Stretch` nodes.

## `iter_identifiers`

```python
def iter_identifiers(node: expr.Expr) -> typing.Iterator[expr.Var | expr.Stretch]
```

Get an iterator over the :class:`~.expr.Var` and :class:`~.expr.Stretch`
nodes referenced at any level in the given :class:`~.expr.Expr`.

Examples:
    Print out the name of each :class:`.ClassicalRegister` encountered::

        from qiskit.circuit import ClassicalRegister
        from qiskit.circuit.classical import expr

        cr1 = ClassicalRegister(3, "a")
        cr2 = ClassicalRegister(3, "b")

        for node in expr.iter_vars(expr.bit_and(expr.bit_not(cr1), cr2)):
            if isinstance(node.var, ClassicalRegister):
                print(node.var.name)

.. seealso::
    :func:`iter_vars`
        Get an iterator over just the :class:`~.expr.Var` nodes in the expression.

## `structurally_equivalent`

```python
def structurally_equivalent(left: expr.Expr, right: expr.Expr, left_var_key: typing.Callable[[typing.Any], typing.Any] | None=None, right_var_key: typing.Callable[[typing.Any], typing.Any] | None=None) -> bool
```

Do these two expressions have exactly the same tree structure, up to some key function for
the :class:`~.expr.Var` objects?

In other words, are these two expressions the exact same trees, except we compare the
:attr:`.Var.var` fields by calling the appropriate ``*_var_key`` function on them, and comparing
that output for equality.  This function does not allow any semantic "equivalences" such as
asserting that ``a == b`` is equivalent to ``b == a``; the evaluation order of the operands
could, in general, cause such a statement to be false (consider hypothetical ``extern``
functions that access global state).

There's no requirements on the key functions, except that their outputs should have general
``__eq__`` methods.  If a key function returns ``None``, the variable will be used verbatim
instead.

Args:
    left: one of the :class:`~.expr.Expr` nodes.
    right: the other :class:`~.expr.Expr` node.
    left_var_key: a callable whose output should be used when comparing :attr:`.Var.var`
        attributes.  If this argument is ``None`` or its output is ``None`` for a given
        variable in ``left``, the variable will be used verbatim.
    right_var_key: same as ``left_var_key``, but used on the variables in ``right`` instead.

Examples:
    Comparing two expressions for structural equivalence, with no remapping of the variables.
    These are different because the different :class:`.Clbit` instances compare differently::

        >>> from qiskit.circuit import Clbit
        >>> from qiskit.circuit.classical import expr
        >>> left_bits = [Clbit(), Clbit()]
        >>> right_bits = [Clbit(), Clbit()]
        >>> left = expr.logic_and(expr.logic_not(left_bits[0]), left_bits[1])
        >>> right = expr.logic_and(expr.logic_not(right_bits[0]), right_bits[1])
        >>> expr.structurally_equivalent(left, right)
        False

    Comparing the same two expressions, but this time using mapping functions that associate
    the bits with simple indices::

        >>> left_key = {var: i for i, var in enumerate(left_bits)}.get
        >>> right_key = {var: i for i, var in enumerate(right_bits)}.get
        >>> expr.structurally_equivalent(left, right, left_key, right_key)
        True

## `is_lvalue`

```python
def is_lvalue(node: expr.Expr, /) -> bool
```

Return whether this expression can be used in l-value positions, that is, whether it has a
well-defined location in memory, such as one that might be writeable.

Being an l-value is necessary but not sufficient for this location to be writeable; it is
permissible that a larger object containing this memory location may not allow writing from
the scope that attempts to write to it.  This would be an access property of the containing
program, however, and not an inherent property of the expression system.

A constant expression is never an lvalue.

Examples:
    Literal values are never l-values; there's no memory location associated with (for example)
    the constant ``1``::

        >>> from qiskit.circuit.classical import expr
        >>> expr.is_lvalue(expr.lift(2))
        False

    :class:`~.expr.Var` nodes are always l-values, because they always have some associated
    memory location::

        >>> from qiskit.circuit.classical import types
        >>> from qiskit.circuit import Clbit
        >>> expr.is_lvalue(expr.Var.new("a", types.Bool()))
        True
        >>> expr.is_lvalue(expr.lift(Clbit()))
        True

    Currently there are no unary or binary operations on variables that can produce an l-value
    expression, but it is likely in the future that some sort of "indexing" operation will be
    added, which could produce l-values::

        >>> a = expr.Var.new("a", types.Uint(8))
        >>> b = expr.Var.new("b", types.Uint(8))
        >>> expr.is_lvalue(a) and expr.is_lvalue(b)
        True
        >>> expr.is_lvalue(expr.bit_and(a, b))
        False
