---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/templates/nct/template_nct_5a_4.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/templates/nct/template_nct_5a_4.py
license: Apache-2.0
---

## `template_nct_5a_4`

```python
def template_nct_5a_4()
```

Template 5a_4:

.. code-block:: text

              ┌───┐     ┌───┐
    q_0: ──■──┤ X ├──■──┤ X ├
         ┌─┴─┐└───┘┌─┴─┐├───┤
    q_1: ┤ X ├─────┤ X ├┤ X ├
         └───┘     └───┘└───┘

Returns:
    QuantumCircuit: template as a quantum circuit.
