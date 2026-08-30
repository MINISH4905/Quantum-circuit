---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/templates/clifford/clifford_6_4.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/templates/clifford/clifford_6_4.py
license: Apache-2.0
---

## `clifford_6_4`

```python
def clifford_6_4()
```

Clifford template 6_4:

.. code-block:: text

    global phase: 7π/4
       ┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐
    q: ┤ S ├┤ H ├┤ S ├┤ H ├┤ S ├┤ H ├
       └───┘└───┘└───┘└───┘└───┘└───┘

Returns:
    QuantumCircuit: template as a quantum circuit.
