---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/templates/rzx/rzx_xz.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/templates/rzx/rzx_xz.py
license: Apache-2.0
---

## `rzx_xz`

```python
def rzx_xz(theta: ParameterValueType | None=None)
```

RZX-based template for CX - RXGate - CX.

.. code-block:: text

    global phase: π
         ┌───┐         ┌───┐┌─────────┐┌─────────┐┌─────────┐┌──────────┐»
    q_0: ┤ X ├─────────┤ X ├┤ Rz(π/2) ├┤ Rx(π/2) ├┤ Rz(π/2) ├┤0         ├»
         └─┬─┘┌───────┐└─┬─┘└─────────┘└─────────┘└─────────┘│  Rzx(-ϴ) │»
    q_1: ──■──┤ Rx(ϴ) ├──■───────────────────────────────────┤1         ├»
              └───────┘                                      └──────────┘»
    «     ┌─────────┐┌─────────┐┌─────────┐
    «q_0: ┤ Rz(π/2) ├┤ Rx(π/2) ├┤ Rz(π/2) ├
    «     └─────────┘└─────────┘└─────────┘
    «q_1: ─────────────────────────────────
    «
