---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/qpy/type_keys.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/qpy/type_keys.py
license: Apache-2.0
---

## Module `qiskit/qpy/type_keys.py`

QPY Type keys for several namespace.

## `TypeKeyBase`

```python
class TypeKeyBase(bytes, Enum)
```

Abstract baseclass for type key Enums.

### `assign`

```python
def assign(cls, obj)
```

Assign type key to given object.

Args:
    obj (any): Arbitrary object to evaluate.

Returns:
    TypeKey: Corresponding key object.

### `retrieve`

```python
def retrieve(cls, type_key)
```

Get a class from given type key.

Args:
    type_key (bytes): Object type key.

Returns:
    any: Corresponding class.

## `Value`

```python
class Value(TypeKeyBase)
```

Type key enum for value object.

## `Condition`

```python
class Condition(IntEnum)
```

Type keys for the ``conditional_key`` field of the INSTRUCTION struct.

## `InstructionExtraFlags`

```python
class InstructionExtraFlags(IntFlag)
```

If an instruction has extra payloads associated with it.

## `Container`

```python
class Container(TypeKeyBase)
```

Type key enum for container-like object.

## `CircuitInstruction`

```python
class CircuitInstruction(TypeKeyBase)
```

Type key enum for circuit instruction object.

## `ScheduleOperand`

```python
class ScheduleOperand(TypeKeyBase)
```

Type key enum for schedule instruction operand object.

Note: This class is kept post pulse-removal to allow reading of
legacy payloads containing pulse gates without breaking the entire
load flow.

## `Program`

```python
class Program(TypeKeyBase)
```

Type key enum for program that QPY supports.

## `Expression`

```python
class Expression(TypeKeyBase)
```

Type keys for the ``EXPRESSION`` QPY item.

## `ExprVarDeclaration`

```python
class ExprVarDeclaration(TypeKeyBase)
```

Type keys for the ``EXPR_VAR_DECLARATION`` QPY item.

## `ExprType`

```python
class ExprType(TypeKeyBase)
```

Type keys for the ``EXPR_TYPE`` QPY item.

## `ExprVar`

```python
class ExprVar(TypeKeyBase)
```

Type keys for the ``EXPR_VAR`` QPY item.

## `ExprValue`

```python
class ExprValue(TypeKeyBase)
```

Type keys for the ``EXPR_VALUE`` QPY item.

## `CircuitDuration`

```python
class CircuitDuration(TypeKeyBase)
```

Type keys for the ``DURATION`` QPY item.

## `SymExprEncoding`

```python
class SymExprEncoding(TypeKeyBase)
```

Type keys for the symbolic encoding field in the file header.
