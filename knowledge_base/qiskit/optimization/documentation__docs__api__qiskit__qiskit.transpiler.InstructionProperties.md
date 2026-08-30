---
framework: qiskit
api_version: 1a3b8eb3e102
doc_type: optimization
source_path: docs/api/qiskit/qiskit.transpiler.InstructionProperties.mdx
source_url: https://github.com/Qiskit/documentation/blob/1a3b8eb3e102668f9612ac64c80f384b28683681/docs/api/qiskit/qiskit.transpiler.InstructionProperties.mdx
license: CC-BY-SA-4.0
---

# InstructionProperties

<Class id="qiskit.transpiler.InstructionProperties" isDedicatedPage={true} github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/target.py#L49-L84" signature="qiskit.transpiler.InstructionProperties(duration=None, error=None, *args, **kwargs)" modifiers="class">
  Bases: `BaseInstructionProperties`

  A representation of the properties of a gate implementation.

  This class provides the optional properties that a backend can provide about an instruction. These represent the set that the transpiler can currently work with if present. However, if your backend provides additional properties for instructions you should subclass this to add additional custom attributes for those custom/additional properties by the backend.

  Create a new `InstructionProperties` object

  **Parameters**

  *   **duration** – The duration, in seconds, of the instruction on the specified set of qubits
  *   **error** – The average error rate for the instruction on the specified set of qubits.

  ## Attributes

  ### duration

  <Attribute id="qiskit.transpiler.InstructionProperties.duration" />

  ### error

  <Attribute id="qiskit.transpiler.InstructionProperties.error" />
</Class>
