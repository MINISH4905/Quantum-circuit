---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/converters/dag_to_circuit.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/converters/dag_to_circuit.py
license: Apache-2.0
---

## Module `qiskit/converters/dag_to_circuit.py`

Helper function for converting a dag to a circuit.

## `dag_to_circuit`

```python
def dag_to_circuit(dag, copy_operations=True)
```

Build a ``QuantumCircuit`` object from a ``DAGCircuit``.

This is also accessible as :meth:`.DAGCircuit.to_circuit`.

Args:
    dag (DAGCircuit): the input dag.
    copy_operations (bool): Deep copy the operation objects
        in the :class:`~.DAGCircuit` for the output :class:`~.QuantumCircuit`.
        This should only be set to ``False`` if the input :class:`~.DAGCircuit`
        will not be used anymore as the operations in the output
        :class:`~.QuantumCircuit` will be shared instances and
        modifications to operations in the :class:`~.DAGCircuit` will
        be reflected in the :class:`~.QuantumCircuit` (and vice versa).

Return:
    QuantumCircuit: the circuit representing the input dag.

Example:
    .. plot::
       :alt: Circuit diagram output by the previous code.
       :include-source:

       from qiskit import QuantumRegister, ClassicalRegister, QuantumCircuit
       from qiskit.dagcircuit import DAGCircuit
       from qiskit.converters import circuit_to_dag
       from qiskit.circuit.library.standard_gates import CHGate, U2Gate, CXGate
       from qiskit.converters import dag_to_circuit

       q = QuantumRegister(3, 'q')
       c = ClassicalRegister(3, 'c')
       circ = QuantumCircuit(q, c)
       circ.h(q[0])
       circ.cx(q[0], q[1])
       circ.measure(q[0], c[0])
       circ.rz(0.5, q[1])
       dag = circuit_to_dag(circ)
       circuit = dag_to_circuit(dag)
       circuit.draw('mpl')
