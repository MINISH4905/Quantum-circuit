---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/qcircuit/qcircuit_diagram.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/qcircuit/qcircuit_diagram.py
license: Apache-2.0
---

## `qcircuit_qubit_namer`

```python
def qcircuit_qubit_namer(qubit: cirq.Qid) -> str
```

Returns the latex code for a QCircuit label of given qubit.

Args:
    qubit: The qubit which name to represent.

Returns:
    Latex code for the label.

## `circuit_to_latex_using_qcircuit`

```python
def circuit_to_latex_using_qcircuit(circuit: cirq.Circuit, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT) -> str
```

Returns a QCircuit-based latex diagram of the given circuit.

Args:
    circuit: The circuit to represent in latex.
    qubit_order: Determines the order of qubit wires in the diagram.

Returns:
    Latex code for the diagram.
