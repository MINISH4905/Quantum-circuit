---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/classical/expr/constructors.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/classical/expr/constructors.py
license: Apache-2.0
---

## Module `qiskit/circuit/classical/expr/constructors.py`

User-space constructor functions for the expression tree, which do some of the inference and
lifting boilerplate work.

## `lift_legacy_condition`

```python
def lift_legacy_condition(condition: tuple[qiskit.circuit.Clbit | qiskit.circuit.ClassicalRegister, int], /) -> Expr
```

Lift a legacy two-tuple equality condition into a new-style :class:`Expr`.

## `lift`

```python
def lift(value: typing.Any, /, type: types.Type | None=None) -> Expr
```

Lift the given Python ``value`` to a :class:`~.expr.Value` or :class:`~.expr.Var`.

If an explicit ``type`` is given, the typing in the output will reflect that.

Examples:
    Lifting simple circuit objects to be :class:`~.expr.Var` instances::

        >>> from qiskit.circuit import Clbit, ClassicalRegister
        >>> from qiskit.circuit.classical import expr
        >>> expr.lift(Clbit())
        Var(<clbit>, Bool())
        >>> expr.lift(ClassicalRegister(3, "c"))
        Var(ClassicalRegister(3, "c"), Uint(3))

    The type of the return value can be influenced, if the given value could be interpreted
    losslessly as the given type (use :func:`cast` to perform a full set of casting
    operations, including lossy ones)::

        >>> from qiskit.circuit import ClassicalRegister
        >>> from qiskit.circuit.classical import expr, types
        >>> expr.lift(ClassicalRegister(3, "c"), types.Uint(5))
        Var(ClassicalRegister(3, "c"), Uint(5))
        >>> expr.lift(5, types.Uint(4))
        Value(5, Uint(4))

## `cast`

```python
def cast(operand: typing.Any, type: types.Type, /) -> Expr
```

Create an explicit cast from the given value to the given type.

Examples:
    Add an explicit cast node that explicitly casts a higher precision type to a lower precision
    one::

        >>> from qiskit.circuit.classical import expr, types
        >>> value = expr.value(5, types.Uint(32))
        >>> expr.cast(value, types.Uint(8))
        Cast(Value(5, types.Uint(32)), types.Uint(8), implicit=False)

## `bit_not`

```python
def bit_not(operand: typing.Any, /) -> Expr
```

Create a bitwise 'not' expression node from the given value, resolving any implicit casts and
lifting the value into a :class:`Value` node if required.

Examples:
    Bitwise negation of a :class:`.ClassicalRegister`::

        >>> from qiskit.circuit import ClassicalRegister
        >>> from qiskit.circuit.classical import expr
        >>> expr.bit_not(ClassicalRegister(3, "c"))
        Unary(Unary.Op.BIT_NOT, Var(ClassicalRegister(3, 'c'), Uint(3)), Uint(3))

## `logic_not`

```python
def logic_not(operand: typing.Any, /) -> Expr
```

Create a logical 'not' expression node from the given value, resolving any implicit casts and
lifting the value into a :class:`Value` node if required.

Examples:
    Logical negation of a :class:`.ClassicalRegister`::

        >>> from qiskit.circuit import ClassicalRegister
        >>> from qiskit.circuit.classical import expr
        >>> expr.logic_not(ClassicalRegister(3, "c"))
        Unary(Unary.Op.LOGIC_NOT, Cast(Var(ClassicalRegister(3, 'c'), Uint(3)), Bool(), implicit=True), Bool())

## `bit_and`

```python
def bit_and(left: typing.Any, right: typing.Any, /) -> Expr
```

Create a bitwise 'and' expression node from the given value, resolving any implicit casts and
lifting the values into :class:`Value` nodes if required.

Examples:
    Bitwise 'and' of a classical register and an integer literal::

        >>> from qiskit.circuit import ClassicalRegister
        >>> from qiskit.circuit.classical import expr
        >>> expr.bit_and(ClassicalRegister(3, "c"), 0b111)
        Binary(Binary.Op.BIT_AND, Var(ClassicalRegister(3, 'c'), Uint(3)), Value(7, Uint(3)), Uint(3))

## `bit_or`

```python
def bit_or(left: typing.Any, right: typing.Any, /) -> Expr
```

Create a bitwise 'or' expression node from the given value, resolving any implicit casts and
lifting the values into :class:`Value` nodes if required.

Examples:
    Bitwise 'or' of a classical register and an integer literal::

        >>> from qiskit.circuit import ClassicalRegister
        >>> from qiskit.circuit.classical import expr
        >>> expr.bit_or(ClassicalRegister(3, "c"), 0b101)
        Binary(Binary.Op.BIT_OR, Var(ClassicalRegister(3, 'c'), Uint(3)), Value(5, Uint(3)), Uint(3))

## `bit_xor`

```python
def bit_xor(left: typing.Any, right: typing.Any, /) -> Expr
```

Create a bitwise 'exclusive or' expression node from the given value, resolving any implicit
casts and lifting the values into :class:`Value` nodes if required.

Examples:
    Bitwise 'exclusive or' of a classical register and an integer literal::

        >>> from qiskit.circuit import ClassicalRegister
        >>> from qiskit.circuit.classical import expr
        >>> expr.bit_xor(ClassicalRegister(3, "c"), 0b101)
        Binary(Binary.Op.BIT_XOR, Var(ClassicalRegister(3, 'c'), Uint(3)), Value(5, Uint(3)), Uint(3))

## `logic_and`

```python
def logic_and(left: typing.Any, right: typing.Any, /) -> Expr
```

Create a logical 'and' expression node from the given value, resolving any implicit casts and
lifting the values into :class:`Value` nodes if required.

Examples:
    Logical 'and' of two classical bits::

        >>> from qiskit.circuit import Clbit
        >>> from qiskit.circuit.classical import expr
        >>> expr.logic_and(Clbit(), Clbit())
        Binary(Binary.Op.LOGIC_AND, Var(<clbit 0>, Bool()), Var(<clbit 1>, Bool()), Bool())

## `logic_or`

```python
def logic_or(left: typing.Any, right: typing.Any, /) -> Expr
```

Create a logical 'or' expression node from the given value, resolving any implicit casts and
lifting the values into :class:`Value` nodes if required.

Examples:
    Logical 'or' of two classical bits

        >>> from qiskit.circuit import Clbit
        >>> from qiskit.circuit.classical import expr
        >>> expr.logic_or(Clbit(), Clbit())
        Binary(Binary.Op.LOGIC_OR, Var(<clbit 0>, Bool()), Var(<clbit 1>, Bool()), Bool())

## `equal`

```python
def equal(left: typing.Any, right: typing.Any, /) -> Expr
```

Create an 'equal' expression node from the given value, resolving any implicit casts and
lifting the values into :class:`Value` nodes if required.

Examples:
    Equality between a classical register and an integer::

        >>> from qiskit.circuit import ClassicalRegister
        >>> from qiskit.circuit.classical import expr
        >>> expr.equal(ClassicalRegister(3, "c"), 7)
        Binary(Binary.Op.EQUAL, Var(ClassicalRegister(3, "c"), Uint(3)), Value(7, Uint(3)), Uint(3))

## `not_equal`

```python
def not_equal(left: typing.Any, right: typing.Any, /) -> Expr
```

Create a 'not equal' expression node from the given value, resolving any implicit casts and
lifting the values into :class:`Value` nodes if required.

Examples:
    Inequality between a classical register and an integer::

        >>> from qiskit.circuit import ClassicalRegister
        >>> from qiskit.circuit.classical import expr
        >>> expr.not_equal(ClassicalRegister(3, "c"), 7)
        Binary(Binary.Op.NOT_EQUAL, Var(ClassicalRegister(3, "c"), Uint(3)), Value(7, Uint(3)), Uint(3))

## `less`

```python
def less(left: typing.Any, right: typing.Any, /) -> Expr
```

Create a 'less than' expression node from the given value, resolving any implicit casts and
lifting the values into :class:`Value` nodes if required.

Examples:
    Query if a classical register is less than an integer::

        >>> from qiskit.circuit import ClassicalRegister
        >>> from qiskit.circuit.classical import expr
        >>> expr.less(ClassicalRegister(3, "c"), 5)
        Binary(Binary.Op.LESS, Var(ClassicalRegister(3, "c"), Uint(3)), Value(5, Uint(3)), Uint(3))

## `less_equal`

```python
def less_equal(left: typing.Any, right: typing.Any, /) -> Expr
```

Create a 'less than or equal to' expression node from the given value, resolving any implicit
casts and lifting the values into :class:`Value` nodes if required.

Examples:
    Query if a classical register is less than or equal to another::

        >>> from qiskit.circuit import ClassicalRegister
        >>> from qiskit.circuit.classical import expr
        >>> expr.less_equal(ClassicalRegister(3, "a"), ClassicalRegister(3, "b"))
        Binary(Binary.Op.LESS_EQUAL, Var(ClassicalRegister(3, "a"), Uint(3)), Var(ClassicalRegister(3, "b"), Uint(3)), Uint(3))

## `greater`

```python
def greater(left: typing.Any, right: typing.Any, /) -> Expr
```

Create a 'greater than' expression node from the given value, resolving any implicit casts
and lifting the values into :class:`Value` nodes if required.

Examples:
    Query if a classical register is greater than an integer::

        >>> from qiskit.circuit import ClassicalRegister
        >>> from qiskit.circuit.classical import expr
        >>> expr.greater(ClassicalRegister(3, "c"), 5)
        Binary(Binary.Op.GREATER, Var(ClassicalRegister(3, "c"), Uint(3)), Value(5, Uint(3)), Uint(3))

## `greater_equal`

```python
def greater_equal(left: typing.Any, right: typing.Any, /) -> Expr
```

Create a 'greater than or equal to' expression node from the given value, resolving any
implicit casts and lifting the values into :class:`Value` nodes if required.

Examples:
    Query if a classical register is greater than or equal to another::

        >>> from qiskit.circuit import ClassicalRegister
        >>> from qiskit.circuit.classical import expr
        >>> expr.greater_equal(ClassicalRegister(3, "a"), ClassicalRegister(3, "b"))
        Binary(Binary.Op.GREATER_EQUAL, Var(ClassicalRegister(3, "a"), Uint(3)), Var(ClassicalRegister(3, "b"), Uint(3)), Uint(3))

## `shift_left`

```python
def shift_left(left: typing.Any, right: typing.Any, /, type: types.Type | None=None) -> Expr
```

Create a 'bitshift left' expression node from the given two values, resolving any implicit
casts and lifting the values into :class:`Value` nodes if required.

If ``type`` is given, the ``left`` operand will be coerced to it (if possible).

Examples:
    Shift the value of a standalone variable left by some amount::

        >>> from qiskit.circuit.classical import expr, types
        >>> a = expr.Var.new("a", types.Uint(8))
        >>> expr.shift_left(a, 4)
        Binary(Binary.Op.SHIFT_LEFT, Var(<UUID>, Uint(8), name='a'), Value(4, Uint(3)), Uint(8))

    Shift an integer literal by a variable amount, coercing the type of the literal::

        >>> expr.shift_left(3, a, types.Uint(16))
        Binary(Binary.Op.SHIFT_LEFT, Value(3, Uint(16)), Var(<UUID>, Uint(8), name='a'), Uint(16))

## `shift_right`

```python
def shift_right(left: typing.Any, right: typing.Any, /, type: types.Type | None=None) -> Expr
```

Create a 'bitshift right' expression node from the given values, resolving any implicit casts
and lifting the values into :class:`Value` nodes if required.

If ``type`` is given, the ``left`` operand will be coerced to it (if possible).

Examples:
    Shift the value of a classical register right by some amount::

        >>> from qiskit.circuit import ClassicalRegister
        >>> from qiskit.circuit.classical import expr
        >>> expr.shift_right(ClassicalRegister(8, "a"), 4)
        Binary(Binary.Op.SHIFT_RIGHT, Var(ClassicalRegister(8, "a"), Uint(8)), Value(4, Uint(3)), Uint(8))

## `index`

```python
def index(target: typing.Any, index: typing.Any, /) -> Expr
```

Index into the ``target`` with the given integer ``index``, lifting the values into
:class:`Value` nodes if required.

This can be used as the target of a :class:`.Store`, if the ``target`` is itself an lvalue.

Examples:
    Index into a classical register with a literal::

        >>> from qiskit.circuit import ClassicalRegister
        >>> from qiskit.circuit.classical import expr
        >>> expr.index(ClassicalRegister(8, "a"), 3)
        Index(Var(ClassicalRegister(8, "a"), Uint(8)), Value(3, Uint(2)), Bool())

## `add`

```python
def add(left: typing.Any, right: typing.Any, /) -> Expr
```

Create an addition expression node from the given values, resolving any implicit casts and
lifting the values into :class:`Value` nodes if required.

Examples:
    Addition of two floating point numbers::

        >>> from qiskit.circuit.classical import expr
        >>> expr.add(5.0, 2.0)
        Binary(Binary.Op.ADD, Value(5.0, Float()), Value(2.0, Float()), Float())

    Addition of two durations::

        >>> from qiskit.circuit import Duration
        >>> from qiskit.circuit.classical import expr
        >>> expr.add(Duration.dt(1000), Duration.dt(1000))
        Binary(Binary.Op.ADD, Value(Duration.dt(1000), Duration()), Value(Duration.dt(1000), Duration()), Duration())

## `sub`

```python
def sub(left: typing.Any, right: typing.Any, /) -> Expr
```

Create a subtraction expression node from the given values, resolving any implicit casts and
lifting the values into :class:`Value` nodes if required.

Examples:
    Subtraction of two floating point numbers::

        >>> from qiskit.circuit.classical import expr
        >>> expr.sub(5.0, 2.0)
        Binary(Binary.Op.SUB, Value(5.0, Float()), Value(2.0, Float()), Float())

    Subtraction of two durations::

        >>> from qiskit.circuit import Duration
        >>> from qiskit.circuit.classical import expr
        >>> expr.add(Duration.dt(1000), Duration.dt(1000))
        Binary(Binary.Op.SUB, Value(Duration.dt(1000), Duration()), Value(Duration.dt(1000), Duration()), Duration())

## `mul`

```python
def mul(left: typing.Any, right: typing.Any) -> Expr
```

Create a multiplication expression node from the given values, resolving any implicit casts and
lifting the values into :class:`Value` nodes if required.

This can be used to multiply numeric operands of the same type kind, or to multiply a duration
operand by a numeric operand.

Examples:
    Multiplication of two floating point numbers::

        >>> from qiskit.circuit.classical import expr
        >>> expr.mul(5.0, 2.0)
        Binary(Binary.Op.MUL, Value(5.0, Float()), Value(2.0, Float()), Float())

    Multiplication of a duration by a float::

        >>> from qiskit.circuit import Duration
        >>> from qiskit.circuit.classical import expr
        >>> expr.mul(Duration.dt(1000), 0.5)
        Binary(Binary.Op.MUL, Value(Duration.dt(1000), Duration()), Value(0.5, Float()), Duration())

## `div`

```python
def div(left: typing.Any, right: typing.Any) -> Expr
```

Create a division expression node from the given values, resolving any implicit casts and
lifting the values into :class:`Value` nodes if required.

This can be used to divide numeric operands of the same type kind, to divide a
:class:`~.types.Duration` operand by a numeric operand, or to divide two
:class:`~.types.Duration` operands which yields an expression of type
:class:`~.types.Float`.

Examples:
    Division of two floating point numbers::

        >>> from qiskit.circuit.classical import expr
        >>> expr.div(5.0, 2.0)
        Binary(Binary.Op.DIV, Value(5.0, Float()), Value(2.0, Float()), Float())

    Division of two durations::

        >>> from qiskit.circuit import Duration
        >>> from qiskit.circuit.classical import expr
        >>> expr.div(Duration.dt(10000), Duration.dt(1000))
        Binary(Binary.Op.DIV, Value(Duration.dt(10000), Duration()), Value(Duration.dt(1000), Duration()), Float())


    Division of a duration by a float::

        >>> from qiskit.circuit import Duration
        >>> from qiskit.circuit.classical import expr
        >>> expr.div(Duration.dt(10000), 12.0)
        Binary(Binary.Op.DIV, Value(Duration.dt(10000), Duration()), Value(12.0, types.Float()), Duration())

## `negate`

```python
def negate(operand: typing.Any, /) -> Expr
```

Negate an expression node from the given value, resolving any implicit casts and
lifting the value into a :class:`Value` node if required.

Examples:
    Negation of a floating point number::

        >>> from qiskit.circuit.classical import expr
        >>> expr.negate(5.0)
        Unary(Unary.Op.NEGATE, Value(5.0, Float()), Float())

    Negation of a duration::

        >>> from qiskit.circuit import Duration
        >>> from qiskit.circuit.classical import expr
        >>> expr.negate(Duration.dt(1000))
        Unary(Unary.Op.NEGATE, Value(Duration.dt(1000), Duration()), Duration())
