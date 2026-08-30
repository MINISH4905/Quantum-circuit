---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/gate.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/gate.py
license: Apache-2.0
---

## Module `qiskit/circuit/gate.py`

Unitary gate.

## `Gate`

```python
class Gate(Instruction)
```

Unitary gate.

### `__init__`

```python
def __init__(self, name: str, num_qubits: int, params: list, label: str | None=None) -> None
```

Args:
    name: The name of the gate.
    num_qubits: The number of qubits the gate acts on.
    params: A list of parameters.
    label: An optional label for the gate.

### `to_matrix`

```python
def to_matrix(self) -> np.ndarray
```

Return a Numpy.array for the gate unitary matrix.

Returns:
    np.ndarray: if the Gate subclass has a matrix definition.

Raises:
    CircuitError: If a Gate subclass does not implement this method an
        exception will be raised when this base class method is called.

### `power`

```python
def power(self, exponent: float, annotated: bool=False)
```

Raise this gate to the power of ``exponent``.

Implemented either as a unitary gate (ref. :class:`~.library.UnitaryGate`)
or as an annotated operation (ref. :class:`.AnnotatedOperation`). In the case of several standard
gates, such as :class:`.RXGate`, when the power of a gate can be expressed in terms of another
standard gate that is returned directly.

Args:
    exponent (float): the power to raise the gate to
    annotated (bool): indicates whether the power gate can be implemented
        as an annotated operation. In the case of several standard
        gates, such as :class:`.RXGate`, this argument is ignored when
        the power of a gate can be expressed in terms of another
        standard gate.

Returns:
    An operation implementing ``gate^exponent``

Raises:
    CircuitError: If gate is not unitary

### `control`

```python
def control(self, num_ctrl_qubits: int=1, label: str | None=None, ctrl_state: int | str | None=None, annotated: bool | None=None)
```

Return the controlled version of itself.

The controlled gate is implemented as :class:`.ControlledGate` when ``annotated``
is ``False``, and as :class:`.AnnotatedOperation` when ``annotated`` is ``True``.

Args:
    num_ctrl_qubits: Number of controls to add. Defaults to ``1``.
    label: Optional gate label. Defaults to ``None``.
        Ignored if the controlled gate is implemented as an annotated operation.
    ctrl_state: The control state of the gate, specified either as an integer or a bitstring
        (e.g. ``"110"``). If ``None``, defaults to the all-ones state ``2**num_ctrl_qubits - 1``.
    annotated: Indicates whether the controlled gate should be implemented as a controlled gate
        or as an annotated operation. If ``None``, treated as ``False``.

Returns:
    A controlled version of this gate.

Raises:
    QiskitError: invalid ``num_ctrl_qubits`` or ``ctrl_state``.

### `broadcast_arguments`

```python
def broadcast_arguments(self, qargs: list, cargs: list) -> Iterable[tuple[list, list]]
```

Validation and handling of the arguments and its relationship.

For example, ``cx([q[0],q[1]], q[2])`` means ``cx(q[0], q[2]); cx(q[1], q[2])``. This
method yields the arguments in the right grouping. In the given example::

    in: [[q[0],q[1]], q[2]],[]
    outs: [q[0], q[2]], []
          [q[1], q[2]], []

The general broadcasting rules are:

    * If len(qargs) == 1::

        [q[0], q[1]] -> [q[0]],[q[1]]

    * If len(qargs) == 2::

        [[q[0], q[1]], [r[0], r[1]]] -> [q[0], r[0]], [q[1], r[1]]
        [[q[0]], [r[0], r[1]]]       -> [q[0], r[0]], [q[0], r[1]]
        [[q[0], q[1]], [r[0]]]       -> [q[0], r[0]], [q[1], r[0]]

    * If len(qargs) >= 3::

        [q[0], q[1]], [r[0], r[1]],  ...] -> [q[0], r[0], ...], [q[1], r[1], ...]

Args:
    qargs: List of quantum bit arguments.
    cargs: List of classical bit arguments.

Returns:
    A tuple with single arguments.

Raises:
    CircuitError: If the input is not valid. For example, the number of
        arguments does not match the gate expectation.

### `validate_parameter`

```python
def validate_parameter(self, parameter)
```

Gate parameters should be int, float, or ParameterExpression
