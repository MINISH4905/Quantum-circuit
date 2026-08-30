---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/substitute_pi4_rotations.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/substitute_pi4_rotations.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/substitute_pi4_rotations.py`

Convert rotation gates into {Clifford,T,Tdg} when their angles are integer multiples of pi/4

## `SubstitutePi4Rotations`

```python
class SubstitutePi4Rotations(TransformationPass)
```

Convert rotation gates whose angles are integer multiples of :math:`\pi/4` into discrete
sets of Clifford, :class:`.TGate` and :class:`.TdgGate` gates.

For single-qubit rotation gates (:class:`.RXGate`, :class:`.RYGate`, :class:`.RZGate`,
:class:`.PhaseGate`) and two-qubit rotation gates (:class:`.RXXGate`, :class:`.RYYGate`,
:class:`.RZZGate`, :class:`.RZXGate`),
when the angle is a multiple of :math:`\pi/4`, the decomposition requires
a single :class:`.TGate` or :class:`.TdgGate` gate as well as some Clifford gates.
For two-qubit controlled rotation gates (:class:`.CPhaseGate`, :class:`.CRXGate`,
:class:`.CRYGate`, :class:`.CRZGate`), when the angle is a multiple of :math:`\pi/2`,
the decomposition requires
three :class:`.TGate` or :class:`.TdgGate` gates for :class:`.CPhaseGate` and two otherwise,
as well as some Clifford gates.
Note that even multiples of :math:`\pi/4` (respectively, :math:`\pi/2` for controlled rotations),
or equivalently, integer multiples of :math:`\pi/2`
(respectively :math:`\pi` for controlled rotations) can be written using only Clifford gates.

For example::

  from qiskit.circuit import QuantumCircuit
  from qiskit.transpiler.passes import SubstitutePi4Rotations
  from qiskit.quantum_info import Operator

  # The following quantum circuit consists of 5 Clifford gates,
  # four rotation gates whose angles are integer multiples of pi/4,
  # and one controlled rotation gate whose angle is an integer multiple of pi/2

  qc = QuantumCircuit(3)
  qc.cx(0, 1)
  qc.rz(pi/4, 0)
  qc.cz(0, 1)
  qc.rx(3*pi/4, 1)
  qc.h(1)
  qc.s(2)
  qc.ry(2*pi/4, 2)
  qc.cz(2, 0)
  qc.rzz(pi/4, 0, 2)
  qc.cry(3*pi/2, 2, 1)

  # The transformed circuit consists of Clifford, T and Tdg gates
  qct = SubstitutePi4Rotations()(qc)
  clifford_t_names = get_clifford_gate_names() + ["t"] + ["tdg"]
  assert(set(qct.count_ops().keys()).issubset(set(clifford_t_names)))

  # The circuits before and after the transformation are equivalent
  assert Operator(qc) == Operator(qct)

### `__init__`

```python
def __init__(self, approximation_degree: float=1.0)
```

Args:
    approximation_degree: Used in the tolerance computations.
        This gives the threshold for the average gate fidelity.

### `run`

```python
def run(self, dag: DAGCircuit) -> DAGCircuit
```

Run the Substitute Pi4-Rotations optimization pass on ``dag``.

Args:
    dag: the input DAG.

Returns:
    The output DAG.
