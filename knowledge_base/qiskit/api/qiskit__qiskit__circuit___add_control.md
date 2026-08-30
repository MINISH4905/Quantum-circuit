---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/_add_control.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/_add_control.py
license: Apache-2.0
---

## Module `qiskit/circuit/_add_control.py`

Add control to operation if supported.

## `add_control`

```python
def add_control(operation: Gate | ControlledGate, num_ctrl_qubits: int, label: str | None, ctrl_state: str | int | None) -> ControlledGate
```

Return the controlled version of the gate.

This function first checks whether the gate's name corresponds to a known
method for generating its controlled version. Currently, these methods exist
for gates in ``EFFICIENTLY_CONTROLLED_GATES``.

For gates not in ``EFFICIENTLY_CONTROLLED_GATES``, the function calls the unroller
to decompose the gate into gates in ``EFFICIENTLY_CONTROLLED_GATES``,
and then generates the controlled version by controlling every gate in this
decomposition.

Open controls are implemented by conjugating the control line with X gates.

This function is meant to be called from the
:method:`qiskit.circuit.gate.Gate.control()` method.

Args:
    operation: The operation to be controlled.
    num_ctrl_qubits: The number of controls to add to gate.
    label: An optional gate label.
    ctrl_state: The control state in decimal or as a bitstring
        (e.g. '111'). If specified as a bitstring the length
        must equal num_ctrl_qubits, MSB on left. If None, use
        2**num_ctrl_qubits-1.

Returns:
    Controlled version of gate.

## `control`

```python
def control(operation: Gate | ControlledGate, num_ctrl_qubits: int | None=1, label: str | None=None, ctrl_state: str | int | None=None) -> ControlledGate
```

Return the controlled version of the gate.

This function first checks whether the gate's name corresponds to a known
method for generating its controlled version. Currently, these methods exist
for gates in ``EFFICIENTLY_CONTROLLED_GATES``.

For gates not in ``EFFICIENTLY_CONTROLLED_GATES``, the function calls the unroller
to decompose the gate into gates in ``EFFICIENTLY_CONTROLLED_GATES``,
and then generates the controlled version by controlling every gate in this
decomposition.

Open controls are implemented by conjugating the control line with X gates.

Args:
    operation: The gate used to create the ControlledGate.
    num_ctrl_qubits: The number of controls to add to gate (default=1).
    label: An optional gate label.
    ctrl_state: The control state in decimal or as
        a bitstring (e.g. '111'). If specified as a bitstring the length
        must equal num_ctrl_qubits, MSB on left. If None, use
        2**num_ctrl_qubits-1.

Returns:
    Controlled version of gate.

Raises:
    CircuitError: gate contains non-gate in definition

## `apply_basic_controlled_gate`

```python
def apply_basic_controlled_gate(circuit, gate, controls, target)
```

Apply a controlled version of ``gate`` to the circuit.

This implements multi-control operations for every gate in
``EFFICIENTLY_CONTROLLED_GATES``.
