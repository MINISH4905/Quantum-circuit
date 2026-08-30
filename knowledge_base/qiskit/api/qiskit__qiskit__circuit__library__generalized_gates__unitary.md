---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/generalized_gates/unitary.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/generalized_gates/unitary.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/generalized_gates/unitary.py`

Arbitrary unitary circuit instruction.

## `UnitaryGate`

```python
class UnitaryGate(Gate)
```

Class for quantum gates specified by a unitary matrix.

Example:

We can create a unitary gate from a unitary matrix then add it to a
quantum circuit. The matrix can also be directly applied to the quantum
circuit, see :meth:`.QuantumCircuit.unitary`.

.. plot::
    :include-source:
    :nofigs:

    from qiskit import QuantumCircuit
    from qiskit.circuit.library import UnitaryGate

    matrix = [[0, 0, 0, 1],
                [0, 0, 1, 0],
                [1, 0, 0, 0],
                [0, 1, 0, 0]]
    gate = UnitaryGate(matrix)

    circuit = QuantumCircuit(2)
    circuit.append(gate, [0, 1])

### `__init__`

```python
def __init__(self, data: numpy.ndarray | Gate | BaseOperator, label: str | None=None, check_input: bool=True, *, num_qubits: int | None=None) -> None
```

Args:
    data: Unitary operator.
    label: Unitary name for backend [Default: ``None``].
    check_input: If set to ``False`` this asserts the input
        is known to be unitary and the checking to validate this will
        be skipped. This should only ever be used if you know the
        input is unitary, setting this to ``False`` and passing in
        a non-unitary matrix will result unexpected behavior and errors.
    num_qubits: If given, the number of qubits in the matrix.  If not given, it is inferred.

Raises:
    ValueError: If input data is not an N-qubit unitary operator.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return matrix for the unitary.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return the adjoint of the unitary.

### `conjugate`

```python
def conjugate(self)
```

Return the conjugate of the unitary.

### `adjoint`

```python
def adjoint(self)
```

Return the adjoint of the unitary.

### `transpose`

```python
def transpose(self)
```

Return the transpose of the unitary.

### `control`

```python
def control(self, num_ctrl_qubits: int=1, label: str | None=None, ctrl_state: int | str | None=None, annotated: bool | None=None) -> ControlledGate | AnnotatedOperation
```

Return a controlled version of itself.

The controlled gate is implemented as :class:`.ControlledGate` when ``annotated``
is ``False``, and as :class:`.AnnotatedOperation` when ``annotated`` is ``True``.

Args:
    num_ctrl_qubits: Number of controls to add. Defaults to ``1``.
    label: Optional gate label. Defaults to ``None``. Ignored if the controlled gate
        is implemented as an annotated operation.
    ctrl_state: The control state of the gate, specified either as an integer or a bitstring
        (e.g. ``"110"``). If ``None``, defaults to the all-ones state ``2**num_ctrl_qubits - 1``.
    annotated: Indicates whether the controlled gate should be implemented as a controlled gate
        or as an annotated operation. If ``None``, treated as ``False``.

Returns:
    A controlled version of this gate.

### `validate_parameter`

```python
def validate_parameter(self, parameter)
```

Unitary gate parameter has to be an ndarray.
