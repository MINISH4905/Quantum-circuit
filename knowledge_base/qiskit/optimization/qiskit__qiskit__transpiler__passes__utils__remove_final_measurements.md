---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/utils/remove_final_measurements.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/utils/remove_final_measurements.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/utils/remove_final_measurements.py`

Remove final measurements and barriers at the end of a circuit.

## `calc_final_ops`

```python
def calc_final_ops(dag: DAGCircuit, final_op_names: set[str]) -> list[DAGOpNode]
```

Find the final operations of a circuit of a given type.
Args:
    dag: the DAG circuit
    final_op_names: names of the operations to find at the end of the circuit.

Returns:
List of nodes corresponding to the relevant operations at the end of the circuit.

## `RemoveFinalMeasurements`

```python
class RemoveFinalMeasurements(TransformationPass)
```

Remove final measurements and barriers at the end of a circuit.

This pass removes final barriers and final measurements, as well as all
unused classical registers and bits they are connected to.
Measurements and barriers are considered final if they are
followed by no other operations (aside from other measurements or barriers.)

Classical registers are removed iff they reference at least one bit
that has become unused by the circuit as a result of the operation, and all
of their other bits are also unused. Separately, classical bits are removed
iff they have become unused by the circuit as a result of the operation,
or they appear in a removed classical register, but do not appear
in a classical register that will remain.

### `run`

```python
def run(self, dag)
```

Run the RemoveFinalMeasurements pass on `dag`.

Args:
    dag (DAGCircuit): the DAG to be optimized.

Returns:
    DAGCircuit: the optimized DAG.
