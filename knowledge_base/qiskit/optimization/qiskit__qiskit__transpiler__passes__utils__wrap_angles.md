---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/utils/wrap_angles.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/utils/wrap_angles.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/utils/wrap_angles.py`

Wrap angles pass for respecting target angle bounds.

## `WrapAngles`

```python
class WrapAngles(TransformationPass)
```

Wrap angles outside the bound specified in the target.

This pass will check all the gates in the circuit and check if there are any gates outside the
bound specified in the target. If any gates outside the bound are identified, the callback in
the target will be called to substitute the gate outside the bound with an equivalent subcircuit.
This pass does not run on gates that are parameterized, even if the gate has unparameterized
parameters outside a specified bound. If there are parameterized gates in the circuit they will
be ignored by this pass as bound angles are necessary to transform the gate. For example the below
example demonstrates how the callback mechanism and registration works, but doesn't show a useful
transformation, but is simple to follow:

.. plot::
   :alt: Circuit diagram of the output from running the WrapAngles pass
   :include-source:

   from qiskit.circuit import Gate, Parameter, Qubit, QuantumCircuit
   from qiskit.circuit.library import RZGate
   from qiskit.dagcircuit import DAGCircuit
   from qiskit.transpiler.passes import WrapAngles
   from qiskit.transpiler import Target, WrapAngleRegistry

   param = Parameter("a")
   circuit = QuantumCircuit(1)
   circuit.rz(6.8, 0)
   target = Target(num_qubits=1)
   target.add_instruction(RZGate(param), angle_bounds=[(0, 0.5)])

   def callback(angles, _qubits):
       angle = angles[0]
       if angle > 0:
           number_of_gates = angle / 0.5
       else:
           number_of_gates = (6.28 - angle) / 0.5
       dag = DAGCircuit()
       dag.add_qubits([Qubit()])
       for _ in range(int(number_of_gates)):
           dag.apply_operation_back(RZGate(0.5), [dag.qubits[0]])
       return dag

   registry = WrapAngleRegistry()
   registry.add_wrapper("rz", callback)
   wrap_pass = WrapAngles(target, registry)
   res = wrap_pass(circuit)
   res.draw("mpl")

Args:
    target (Target): The :class:`.Target` representing the target QPU.
    registry (WrapAngleRegistry): The registry of wrapping functions used
        by the pass to wrap the angles of a gate. If not specified the
        global :attr:`DEFAULT_REGISTRY` object will be used.

        Unless you are planning to run this pass standalone or are building a
        custom :class:`~.transpiler.PassManager` including this pass you will want
        to rely on :attr:`DEFAULT_REGISTRY`.
