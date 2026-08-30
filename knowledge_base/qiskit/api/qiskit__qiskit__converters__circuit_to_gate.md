---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/converters/circuit_to_gate.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/converters/circuit_to_gate.py
license: Apache-2.0
---

## Module `qiskit/converters/circuit_to_gate.py`

Helper function for converting a circuit to a gate

## `circuit_to_gate`

```python
def circuit_to_gate(circuit, parameter_map=None, equivalence_library=None, label=None)
```

Build a :class:`.Gate` object from a :class:`.QuantumCircuit`.

The gate is anonymous (not tied to a named quantum register),
and so can be inserted into another circuit. The gate will
have the same string name as the circuit.

Args:
    circuit (QuantumCircuit): the input circuit.
    parameter_map (dict): For parameterized circuits, a mapping from
       parameters in the circuit to parameters to be used in the gate.
       If None, existing circuit parameters will also parameterize the
       Gate.
    equivalence_library (EquivalenceLibrary): Optional equivalence library
       where the converted gate will be registered.
    label (str): Optional gate label.

Raises:
    QiskitError: if circuit is non-unitary or if
        parameter_map is not compatible with circuit

Return:
    Gate: a Gate equivalent to the action of the
    input circuit. Upon decomposition, this gate will
    yield the components comprising the original circuit.
