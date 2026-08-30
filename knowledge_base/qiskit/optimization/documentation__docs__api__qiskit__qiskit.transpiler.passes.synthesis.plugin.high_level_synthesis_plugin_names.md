---
framework: qiskit
api_version: 1a3b8eb3e102
doc_type: optimization
source_path: docs/api/qiskit/qiskit.transpiler.passes.synthesis.plugin.high_level_synthesis_plugin_names.mdx
source_url: https://github.com/Qiskit/documentation/blob/1a3b8eb3e102668f9612ac64c80f384b28683681/docs/api/qiskit/qiskit.transpiler.passes.synthesis.plugin.high_level_synthesis_plugin_names.mdx
license: CC-BY-SA-4.0
---

<span id="qiskit-transpiler-passes-synthesis-plugin-high-level-synthesis-plugin-names" />

# qiskit.transpiler.passes.synthesis.plugin.high\_level\_synthesis\_plugin\_names

<Function id="qiskit.transpiler.passes.synthesis.plugin.high_level_synthesis_plugin_names" isDedicatedPage={true} github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/passes/synthesis/plugin.py#L723-L739" signature="qiskit.transpiler.passes.synthesis.plugin.high_level_synthesis_plugin_names(op_name)">
  Return a list of plugin names installed for a given high level object name

  **Parameters**

  **op\_name** ([*str*](https://docs.python.org/3/library/stdtypes.html#str)) – The operation name to find the installed plugins for. For example, if you provide `"clifford"` as the input it will find all the installed clifford synthesis plugins that can synthesize [`Clifford`](qiskit.quantum_info.Clifford "qiskit.quantum_info.Clifford") objects. The name refers to the [`Operation.name`](qiskit.circuit.Operation#name "qiskit.circuit.Operation.name") attribute of the relevant objects.

  **Returns**

  A list of installed plugin names for the specified high level operation

  **Return type**

  [list](https://docs.python.org/3/library/stdtypes.html#list)\[[str](https://docs.python.org/3/library/stdtypes.html#str)]
</Function>
