---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/templates/rzx/rzx_cy.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/templates/rzx/rzx_cy.py
license: Apache-2.0
---

## `rzx_cy`

```python
def rzx_cy(theta: ParameterValueType | None=None)
```

RZX-based template for CX - RYGate - CX.

.. code-block:: text

                                                             ┌──────────┐
      q_0: ──■─────────────■─────────────────────────────────┤0         ├───────────
           ┌─┴─┐┌───────┐┌─┴─┐┌────────┐┌──────────┐┌───────┐│  RZX(-ϴ) │┌─────────┐
      q_1: ┤ X ├┤ RY(ϴ) ├┤ X ├┤ RY(-ϴ) ├┤ RZ(-π/2) ├┤ RX(ϴ) ├┤1         ├┤ RZ(π/2) ├
           └───┘└───────┘└───┘└────────┘└──────────┘└───────┘└──────────┘└─────────┘
