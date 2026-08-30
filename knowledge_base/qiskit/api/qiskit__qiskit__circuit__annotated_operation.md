---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/annotated_operation.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/annotated_operation.py
license: Apache-2.0
---

## Module `qiskit/circuit/annotated_operation.py`

Annotated Operations.

## `Modifier`

```python
class Modifier
```

The base class that all modifiers of :class:`~.AnnotatedOperation` should
inherit from.

## `InverseModifier`

```python
class InverseModifier(Modifier)
```

Inverse modifier: specifies that the operation is inverted.

## `ControlModifier`

```python
class ControlModifier(Modifier)
```

Control modifier: specifies that the operation is controlled by ``num_ctrl_qubits``
and has control state ``ctrl_state``.

## `PowerModifier`

```python
class PowerModifier(Modifier)
```

Power modifier: specifies that the operation is raised to the power ``power``.

## `AnnotatedOperation`

```python
class AnnotatedOperation(Operation)
```

Annotated operation.

### `__init__`

```python
def __init__(self, base_op: Operation, modifiers: Modifier | list[Modifier])
```

Create a new AnnotatedOperation.

An "annotated operation" allows to add a list of modifiers to the
"base" operation. For now, the only supported modifiers are of
types :class:`~.InverseModifier`, :class:`~.ControlModifier` and
:class:`~.PowerModifier`.

An annotated operation can be viewed as an extension of
:class:`~.ControlledGate` (which also allows adding control to the
base operation). However, an important difference is that the
circuit definition of an annotated operation is not constructed when
the operation is declared, and instead happens during transpilation,
specifically during the :class:`~.HighLevelSynthesis` transpiler pass.

An annotated operation can be also viewed as a "higher-level"
or "more abstract" object that can be added to a quantum circuit.
This enables writing transpiler optimization passes that make use of
this higher-level representation, for instance removing a gate
that is immediately followed by its inverse.

Args:
    base_op: base operation being modified
    modifiers: ordered list of modifiers. Supported modifiers include
        ``InverseModifier``, ``ControlModifier`` and ``PowerModifier``.

Examples::

    op1 = AnnotatedOperation(SGate(), [InverseModifier(), ControlModifier(2)])

    op2_inner = AnnotatedGate(SGate(), InverseModifier())
    op2 = AnnotatedGate(op2_inner, ControlModifier(2))

Both op1 and op2 are semantically equivalent to an ``SGate()`` which is first
inverted and then controlled by 2 qubits.

### `name`

```python
def name(self)
```

Unique string identifier for operation type.

### `num_qubits`

```python
def num_qubits(self)
```

Number of qubits.

### `num_clbits`

```python
def num_clbits(self)
```

Number of classical bits.

### `__eq__`

```python
def __eq__(self, other) -> bool
```

Checks if two AnnotatedOperations are equal.

### `copy`

```python
def copy(self) -> AnnotatedOperation
```

Return a copy of the :class:`~.AnnotatedOperation`.

### `to_matrix`

```python
def to_matrix(self)
```

Return a matrix representation (allowing to construct Operator).

### `control`

```python
def control(self, num_ctrl_qubits: int=1, label: str | None=None, ctrl_state: int | str | None=None, annotated: bool | None=None) -> AnnotatedOperation
```

Return the controlled version of itself.

Implemented as :class:`.AnnotatedOperation`, regardless of the value of
``annotated``.

Args:
    num_ctrl_qubits: Number of controls to add. Defaults to ``1``.
    label: Ignored.
    ctrl_state: The control state of the gate, specified either as an integer or a bitstring
        (e.g. ``"110"``). If ``None``, defaults to the all-ones state ``2**num_ctrl_qubits - 1``.
    annotated: Ignored.

Returns:
    A controlled version of the given operation.

### `inverse`

```python
def inverse(self, annotated: bool=True)
```

Return the inverse version of itself.

Implemented as an annotated operation, see  :class:`.AnnotatedOperation`.

Args:
    annotated: ignored (used for consistency with other inverse methods)

Returns:
    Inverse version of the given operation.

### `power`

```python
def power(self, exponent: float, annotated: bool=False)
```

Raise this gate to the power of ``exponent``.

Implemented as an annotated operation, see  :class:`.AnnotatedOperation`.

Args:
    exponent: the power to raise the gate to
    annotated: ignored (used for consistency with other power methods)

Returns:
    An operation implementing ``gate^exponent``

### `params`

```python
def params(self) -> list[ParameterValueType]
```

The params of the underlying base operation.

### `validate_parameter`

```python
def validate_parameter(self, parameter: ParameterValueType) -> ParameterValueType
```

Validate a parameter for the underlying base operation.
