---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/multi_controlled/mcmt_xgate.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/multi_controlled/mcmt_xgate.py
license: Apache-2.0
---

## Module `qiskit/synthesis/multi_controlled/mcmt_xgate.py`

Synthesis for multiple-control, multiple-target X Gate.

## `synth_mcmt_xgate`

```python
def synth_mcmt_xgate(num_ctrl_qubits: int, num_target_qubits: int, ctrl_state: int | None=None) -> QuantumCircuit
```

Synthesize MCMT X gate.

This uses a special circuit structure that is efficient for MCMT X gates. It does not require
any ancillary qubits and benefits from efficient MCX decompositions.

E.g. a 3-control, 3-target X gate will be synthesized as::

    q_0: ─────────────■────────────
                      |
    q_1: ─────────────■────────────
                      |
    q_2: ─────────────■────────────
                    ┌─┴─┐
    q_3: ────────■──┤ X ├──■───────
               ┌─┴─┐└───┘┌─┴─┐
    q_4: ───■──┤ X ├─────┤ X ├──■──
          ┌─┴─┐└───┘     └───┘┌─┴─┐
    q_5: ─┤ X ├───────────────┤ X ├
          └───┘               └───┘

Args:
    num_ctrl_qubits: Number of control qubits.
    num_target_qubits: Number of target qubits.
    ctrl_state: Optional control state as an integer.

Returns:
    The synthesized circuit for the MCMT X gate.
