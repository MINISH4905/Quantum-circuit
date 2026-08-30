---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/templates/rzx/rzx_zz3.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/templates/rzx/rzx_zz3.py
license: Apache-2.0
---

## `rzx_zz3`

```python
def rzx_zz3(theta: ParameterValueType | None=None)
```

RZX-based template for CX - RZGate - CX.

.. code-block:: text

    global phase: π
                                                                                  »
      q_0: ──■─────────────■──────────────────────────────────────────────────────»
           ┌─┴─┐┌───────┐┌─┴─┐┌────────┐┌─────────┐┌─────────┐┌─────────┐┌───────┐»
      q_1: ┤ X ├┤ Rz(ϴ) ├┤ X ├┤ Rz(-ϴ) ├┤ Rz(π/2) ├┤ Rx(π/2) ├┤ Rz(π/2) ├┤ Rx(ϴ) ├»
           └───┘└───────┘└───┘└────────┘└─────────┘└─────────┘└─────────┘└───────┘»
      «     ┌──────────┐
      «q_0: ┤0         ├─────────────────────────────────
      «     │  Rzx(-ϴ) │┌─────────┐┌─────────┐┌─────────┐
      «q_1: ┤1         ├┤ Rz(π/2) ├┤ Rx(π/2) ├┤ Rz(π/2) ├
      «     └──────────┘└─────────┘└─────────┘└─────────┘
