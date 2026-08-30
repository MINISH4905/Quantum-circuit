---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/convert_to_pauli_rotations.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/convert_to_pauli_rotations.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/convert_to_pauli_rotations.py`

Convert standard gates into Pauli product rotation gates for Pauli Based Computation

## `ConvertToPauliRotations`

```python
class ConvertToPauliRotations(TransformationPass)
```

Convert a quantum circuit into an equivalent circuit composed of
:class:`.PauliProductRotationGate` gates and :class:`.PauliProductMeasurement`
instructions.

The pass converts all single-qubit, two-qubit and three-qubit standard gates into
Pauli product rotations, converts measures to Pauli product measurements,
and leaves barriers, delays, resets, Pauli product rotations, and
Pauli product measurements unchanged.

For example::

  from qiskit.circuit import QuantumCircuit
  from qiskit.transpiler.passes import ConvertToPauliRotations
  from qiskit.quantum_info import Operator

  qc = QuantumCircuit(3)
  qc.h(0)
  qc.cx(0, 1)
  qc.ry(0.123, 0)
  qc.t(2)
  qc.rzz(pi/4, 0, 2)

  # The transformed circuit consists of PauliProductRotationGate gates
  qct = ConvertToPauliRotations()(qc)
  ops_names = set(qct.count_ops().keys())
  self.assertEqual(ops_names, {"pauli_product_rotation"})

  # The circuits before and after the transformation are equivalent
  assert Operator(qc) == Operator(qct)

### `run`

```python
def run(self, dag: DAGCircuit) -> DAGCircuit
```

Run the ConvertToPauliRotations optimization pass on ``dag``.

Args:
    dag: the input DAG.

Returns:
    The output DAG.

Raises:
    TranspilerError: if the circuit contains instructions not supported by the pass.
