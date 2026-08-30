---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/templates/clifford/clifford_6_5.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/templates/clifford/clifford_6_5.py
license: Apache-2.0
---

## `clifford_6_5`

```python
def clifford_6_5()
```

Clifford template 6_5:

.. code-block:: text

                  ┌───┐
    q_0: ─■───■───┤ S ├───■───────
          │ ┌─┴─┐┌┴───┴┐┌─┴─┐┌───┐
    q_1: ─■─┤ X ├┤ SDG ├┤ X ├┤ S ├
            └───┘└─────┘└───┘└───┘

Returns:
    QuantumCircuit: template as a quantum circuit.
