---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/templates/rzx/rzx_zz1.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/templates/rzx/rzx_zz1.py
license: Apache-2.0
---

## `rzx_zz1`

```python
def rzx_zz1(theta: ParameterValueType | None=None)
```

RZX-based template for CX - RZGate - CX.

.. code-block:: text

    global phase: π/2
                                                                                  »
      q_0: ──■────────────────────────────────────────────■───────────────────────»
           ┌─┴─┐┌───────┐┌────┐┌───────┐┌────┐┌────────┐┌─┴─┐┌────────┐┌─────────┐»
      q_1: ┤ X ├┤ Rz(ϴ) ├┤ √X ├┤ Rz(π) ├┤ √X ├┤ Rz(3π) ├┤ X ├┤ Rz(-ϴ) ├┤ Rz(π/2) ├»
           └───┘└───────┘└────┘└───────┘└────┘└────────┘└───┘└────────┘└─────────┘»
      «                                    ┌──────────┐                      »
      «q_0: ───────────────────────────────┤0         ├──────────────────────»
      «     ┌─────────┐┌─────────┐┌───────┐│  Rzx(-ϴ) │┌─────────┐┌─────────┐»
      «q_1: ┤ Rx(π/2) ├┤ Rz(π/2) ├┤ Rx(ϴ) ├┤1         ├┤ Rz(π/2) ├┤ Rx(π/2) ├»
      «     └─────────┘└─────────┘└───────┘└──────────┘└─────────┘└─────────┘»
      «
      «q_0: ───────────
      «     ┌─────────┐
      «q_1: ┤ Rz(π/2) ├
      «     └─────────┘
