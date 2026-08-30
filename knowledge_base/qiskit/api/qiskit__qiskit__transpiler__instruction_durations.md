---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/transpiler/instruction_durations.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/instruction_durations.py
license: Apache-2.0
---

## Module `qiskit/transpiler/instruction_durations.py`

Durations of instructions, one of transpiler configurations.

## `InstructionDurations`

```python
class InstructionDurations
```

Helper class to provide durations of instructions for scheduling.

It stores durations (gate lengths) and dt to be used at the scheduling stage of transpiling.
It can be constructed from ``backend`` or ``instruction_durations``,
which is an argument of :func:`transpile`. The duration of an instruction depends on the
instruction (given by name), the qubits, and optionally the parameters of the instruction.
Note that these fields are used as keys in dictionaries that are used to retrieve the
instruction durations. Therefore, users must use the exact same parameter value to retrieve
an instruction duration as the value with which it was added.

### `__str__`

```python
def __str__(self)
```

Return a string representation of all stored durations.

### `from_backend`

```python
def from_backend(cls, backend: Backend)
```

Construct an :class:`InstructionDurations` object from the backend.

Args:
    backend: backend from which durations (gate lengths) and dt are extracted.

Returns:
    InstructionDurations: The InstructionDurations constructed from backend.

Raises:
    TranspilerError: If dt and dtm is different in the backend.
    TypeError: If the backend is the wrong type

### `update`

```python
def update(self, inst_durations: InstructionDurationsType | None, dt: float | None=None)
```

Update self with inst_durations (inst_durations overwrite self).

Args:
    inst_durations: Instruction durations to be merged into self (overwriting self).
    dt: Sampling duration in seconds of the target backend.

Returns:
    InstructionDurations: The updated InstructionDurations.

Raises:
    TranspilerError: If the format of instruction_durations is invalid.

### `get`

```python
def get(self, inst: str | qiskit.circuit.Instruction, qubits: int | list[int], unit: str='dt', parameters: list[float] | None=None) -> float
```

Get the duration of the instruction with the name, qubits, and parameters.

Some instructions may have a parameter dependent duration.

Args:
    inst: An instruction or its name to be queried.
    qubits: Qubit indices that the instruction acts on.
    unit: The unit of duration to be returned. It must be 's' or 'dt'.
    parameters: The value of the parameters of the desired instruction.

Returns:
    float|int: The duration of the instruction on the qubits.

Raises:
    TranspilerError: No duration is defined for the instruction.

### `units_used`

```python
def units_used(self) -> set[str]
```

Get the set of all units used in this instruction durations.

Returns:
    Set of units used in this instruction durations.
