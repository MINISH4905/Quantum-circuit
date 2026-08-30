---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/io/to_openqasm.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/io/to_openqasm.py
license: Apache-2.0
---

## Module `pennylane/io/to_openqasm.py`

The conversion of a circuit to openqasm

## `to_openqasm`

```python
def to_openqasm(circuit, wires: Wires | None=None, rotations: bool=True, measure_all: bool=True, precision: None | int=None)
```

Convert a circuit to an OpenQASM 2.0 program.

Terminal measurements are assumed to be performed on all qubits in the computational basis.
An optional ``rotations`` argument can be provided so that the output of the OpenQASM circuit
is diagonal in the eigenbasis of the quantum circuit's observables.
The measurement outputs can be restricted to only those specified in the circuit by setting ``measure_all=False``.

Args:
    circuit (QNode or QuantumScript): the quantum circuit to be serialized.
    wires (Wires or None): the wires to use when serializing the circuit.
        Default is ``None``, such that all the wires of the circuit are used for serialization.
    rotations (bool): if ``True``, add gates that rotate the quantum state into the eigenbasis
        of the circuit's observables. Default is ``True``.
    measure_all (bool): if ``True``, add a computational basis measurement on all the qubits.
        Default is ``True``.
    precision (int or None): number of decimal digits to display for the parameters.

Returns:
    str: OpenQASM 2.0 program corresponding to the circuit.

**Example**

The following QNode can be serialized to an OpenQASM 2.0 program:

.. code-block:: python

    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def circuit(theta, phi):
        qp.RX(theta, wires=0)
        qp.CNOT(wires=[0,1])
        qp.RZ(phi, wires=1)
        return qp.sample()

>>> output = qp.to_openqasm(circuit)(1.2, 0.9)
>>> print(output)
OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
rx(1.2) q[0];
cx q[0],q[1];
rz(0.9) q[1];
measure q[0] -> c[0];
measure q[1] -> c[1];

Note that the terminal measurements will be re-imported as mid-circuit measurements
when used with ``from_qasm`` or ``from_qasm3``.

>>> print(qp.draw(qp.from_qasm(output))())
0: ──RX(1.20)─╭●──┤↗├───────────┤
1: ───────────╰X──RZ(0.90)──┤↗├─┤

.. details::
    :title: Usage Details

    By default, the resulting OpenQASM code will have terminal measurements on all qubits,
    where all the measurements are performed in the computational basis.
    However, if terminal measurements in the circuit act only on a subset of the qubits
    and ``measure_all=False``, the OpenQASM code will include measurements on those
    specific qubits only.

    .. code-block:: python

        dev = qp.device("default.qubit", wires=2)

        @qp.qnode(dev)
        def circuit():
            qp.Hadamard(0)
            qp.CNOT(wires=[0,1])
            return qp.sample(wires=1)

    >>> print(qp.to_openqasm(circuit, measure_all=False)())
    OPENQASM 2.0;
    include "qelib1.inc";
    qreg q[2];
    creg c[2];
    h q[0];
    cx q[0],q[1];
    measure q[1] -> c[1];

    If the circuit returns an expectation value of a given observable and ``rotations=True``,
    the OpenQASM 2.0 program will also include the gates that rotate the quantum state into
    the eigenbasis of the measured observable.

    .. code-block:: python

        dev = qp.device("default.qubit", wires=2)

        @qp.qnode(dev)
        def circuit():
            qp.Hadamard(0)
            qp.CNOT(wires=[0,1])
            return qp.expval(qp.PauliX(0) @ qp.PauliY(1))

    >>> print(qp.to_openqasm(circuit, rotations=True)())
    OPENQASM 2.0;
    include "qelib1.inc";
    qreg q[2];
    creg c[2];
    h q[0];
    cx q[0],q[1];
    h q[0];
    z q[1];
    s q[1];
    h q[1];
    measure q[0] -> c[0];
    measure q[1] -> c[1];
