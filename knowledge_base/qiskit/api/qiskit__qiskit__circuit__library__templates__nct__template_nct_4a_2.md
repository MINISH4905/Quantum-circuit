---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/templates/nct/template_nct_4a_2.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/templates/nct/template_nct_4a_2.py
license: Apache-2.0
---

## `template_nct_4a_2`

```python
def template_nct_4a_2()
```

Template 4a_2:

.. code-block:: text

    q_0: ──■─────────■───────
           │         │
    q_1: ──■────■────■────■──
           │  ┌─┴─┐  │  ┌─┴─┐
    q_2: ──┼──┤ X ├──┼──┤ X ├
         ┌─┴─┐└───┘┌─┴─┐└───┘
    q_3: ┤ X ├─────┤ X ├─────
         └───┘     └───┘

Returns:
    QuantumCircuit: template as a quantum circuit.
