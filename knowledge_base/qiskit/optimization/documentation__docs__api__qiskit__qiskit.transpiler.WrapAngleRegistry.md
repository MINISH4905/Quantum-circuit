---
framework: qiskit
api_version: 1a3b8eb3e102
doc_type: optimization
source_path: docs/api/qiskit/qiskit.transpiler.WrapAngleRegistry.mdx
source_url: https://github.com/Qiskit/documentation/blob/1a3b8eb3e102668f9612ac64c80f384b28683681/docs/api/qiskit/qiskit.transpiler.WrapAngleRegistry.mdx
license: CC-BY-SA-4.0
---

# WrapAngleRegistry

<Class id="qiskit.transpiler.WrapAngleRegistry" isDedicatedPage={true} signature="qiskit.transpiler.WrapAngleRegistry" modifiers="class">
  Bases: [`object`](https://docs.python.org/3/library/functions.html#object)

  Registry of Angle Wrapping function

  This class internally contains a mapping of instruction names from a [`Target`](qiskit.transpiler.Target "qiskit.transpiler.Target") to callbacks for wrapping angles that are outside the specified bounds.

  ## Methods

  ### add\_wrapper

  <Function id="qiskit.transpiler.WrapAngleRegistry.add_wrapper" signature="add_wrapper(name, callback)" />

  ### substitute\_angle\_bounds

  <Function id="qiskit.transpiler.WrapAngleRegistry.substitute_angle_bounds" signature="substitute_angle_bounds(name, angles, qubits)">
    Get a replacement circuit for
  </Function>
</Class>
