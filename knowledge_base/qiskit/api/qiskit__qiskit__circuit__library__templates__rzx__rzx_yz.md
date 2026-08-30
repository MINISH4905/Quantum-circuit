---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/templates/rzx/rzx_yz.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/templates/rzx/rzx_yz.py
license: Apache-2.0
---

## `rzx_yz`

```python
def rzx_yz(theta: ParameterValueType | None=None)
```

RZX-based template for CX - RYGate - CX.

.. code-block:: text

              ┌────────┐     ┌─────────┐┌─────────┐┌──────────┐
    q_0: ──■──┤ RY(-ϴ) ├──■──┤ RX(π/2) ├┤0        ├┤ RX(-π/2) ├
         ┌─┴─┐└────────┘┌─┴─┐└─────────┘│  RZX(ϴ) │└──────────┘
    q_1: ┤ X ├──────────┤ X ├───────────┤1        ├────────────
         └───┘          └───┘           └─────────┘
