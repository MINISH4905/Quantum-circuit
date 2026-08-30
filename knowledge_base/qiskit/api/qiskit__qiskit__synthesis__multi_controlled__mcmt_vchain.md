---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/multi_controlled/mcmt_vchain.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/multi_controlled/mcmt_vchain.py
license: Apache-2.0
---

## Module `qiskit/synthesis/multi_controlled/mcmt_vchain.py`

Synthesis for multiple-control, multiple-target Gate.

## `synth_mcmt_vchain`

```python
def synth_mcmt_vchain(gate: Gate, num_ctrl_qubits: int, num_target_qubits: int, ctrl_state: int | None=None) -> QuantumCircuit
```

Synthesize MCMT using a V-chain.

This uses a chain of CCX gates, using ``num_ctrl_qubits - 1`` auxiliary qubits.

For example, a 3-control and 2-target H gate will be synthesized as::

    q_0: ──■────────────────────────■──
           │                        │
    q_1: ──■────────────────────────■──
           │                        │
    q_2: ──┼────■──────────────■────┼──
           │    │  ┌───┐       │    │
    q_3: ──┼────┼──┤ H ├───────┼────┼──
           │    │  └─┬─┘┌───┐  │    │
    q_4: ──┼────┼────┼──┤ H ├──┼────┼──
         ┌─┴─┐  │    │  └─┬─┘  │  ┌─┴─┐
    q_5: ┤ X ├──■────┼────┼────■──┤ X ├
         └───┘┌─┴─┐  │    │  ┌─┴─┐└───┘
    q_6: ─────┤ X ├──■────■──┤ X ├─────
              └───┘          └───┘

Args:
    gate: Base gate to be applied to the targets.
    num_ctrl_qubits: Number of control qubits.
    num_target_qubits: Number of target qubits.
    ctrl_state: Optional control state as an integer.

Returns:
    The synthesized circuit for the MCMT gate.
