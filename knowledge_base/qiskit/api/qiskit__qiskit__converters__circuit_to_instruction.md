---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/converters/circuit_to_instruction.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/converters/circuit_to_instruction.py
license: Apache-2.0
---

## Module `qiskit/converters/circuit_to_instruction.py`

Helper function for converting a circuit to an instruction.

## `circuit_to_instruction`

```python
def circuit_to_instruction(circuit, parameter_map=None, equivalence_library=None, label=None)
```

Build an :class:`~.circuit.Instruction` object from a :class:`.QuantumCircuit`.

The instruction is anonymous (not tied to a named quantum register),
and so can be inserted into another circuit. The instruction will
have the same string name as the circuit.

Args:
    circuit (QuantumCircuit): the input circuit.
    parameter_map (dict): For parameterized circuits, a mapping from
       parameters in the circuit to parameters to be used in the instruction.
       If None, existing circuit parameters will also parameterize the
       instruction.
    equivalence_library (EquivalenceLibrary): Optional equivalence library
       where the converted instruction will be registered.
    label (str): Optional instruction label.

Raises:
    QiskitError: if parameter_map is not compatible with circuit

Return:
    qiskit.circuit.Instruction: an instruction equivalent to the action of the
    input circuit. Upon decomposition, this instruction will
    yield the components comprising the original circuit.

Example:
    .. plot::
        :include-source:
        :nofigs:

        from qiskit import QuantumRegister, ClassicalRegister, QuantumCircuit
        from qiskit.converters import circuit_to_instruction

        q = QuantumRegister(3, 'q')
        c = ClassicalRegister(3, 'c')
        circ = QuantumCircuit(q, c)
        circ.h(q[0])
        circ.cx(q[0], q[1])
        circ.measure(q[0], c[0])
        circ.rz(0.5, q[1])
        circuit_to_instruction(circ)
