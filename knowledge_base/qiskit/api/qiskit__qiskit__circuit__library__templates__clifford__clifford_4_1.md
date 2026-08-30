---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/templates/clifford/clifford_4_1.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/templates/clifford/clifford_4_1.py
license: Apache-2.0
---

## `clifford_4_1`

```python
def clifford_4_1()
```

Clifford template 4_1:

.. code-block:: text

              ┌───┐
    q_0: ──■──┤ X ├──■───X─
         ┌─┴─┐└─┬─┘┌─┴─┐ │
    q_1: ┤ X ├──■──┤ X ├─X─
         └───┘     └───┘

Returns:
    QuantumCircuit: template as a quantum circuit.
