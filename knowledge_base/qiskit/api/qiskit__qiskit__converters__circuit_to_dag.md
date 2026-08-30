---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/converters/circuit_to_dag.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/converters/circuit_to_dag.py
license: Apache-2.0
---

## Module `qiskit/converters/circuit_to_dag.py`

Helper function for converting a circuit to a dag

## `circuit_to_dag`

```python
def circuit_to_dag(circuit, copy_operations=True, *, qubit_order=None, clbit_order=None)
```

Build a :class:`.DAGCircuit` object from a :class:`.QuantumCircuit`.

This is also accessible as :meth:`.QuantumCircuit.to_dag`.

Args:
    circuit (QuantumCircuit): the input circuit.
    copy_operations (bool): Deep copy the operation objects
        in the :class:`~.QuantumCircuit` for the output :class:`~.DAGCircuit`.
        This should only be set to ``False`` if the input :class:`~.QuantumCircuit`
        will not be used anymore as the operations in the output
        :class:`~.DAGCircuit` will be shared instances and modifications to
        operations in the :class:`~.DAGCircuit` will be reflected in the
        :class:`~.QuantumCircuit` (and vice versa).
    qubit_order (Iterable[~qiskit.circuit.Qubit] or None): the order that the qubits should be
        indexed in the output DAG.  Defaults to the same order as in the circuit.
    clbit_order (Iterable[Clbit] or None): the order that the clbits should be indexed in the
        output DAG.  Defaults to the same order as in the circuit.

Return:
    DAGCircuit: the DAG representing the input circuit.

Raises:
    ValueError: if the ``qubit_order`` or ``clbit_order`` parameters do not match the bits in
        the circuit.

Example:
    .. plot::
        :include-source:
        :nofigs:

        from qiskit import QuantumRegister, ClassicalRegister, QuantumCircuit
        from qiskit.dagcircuit import DAGCircuit
        from qiskit.converters import circuit_to_dag

        q = QuantumRegister(3, 'q')
        c = ClassicalRegister(3, 'c')
        circ = QuantumCircuit(q, c)
        circ.h(q[0])
        circ.cx(q[0], q[1])
        circ.measure(q[0], c[0])
        circ.rz(0.5, q[1])
        dag = circuit_to_dag(circ)
