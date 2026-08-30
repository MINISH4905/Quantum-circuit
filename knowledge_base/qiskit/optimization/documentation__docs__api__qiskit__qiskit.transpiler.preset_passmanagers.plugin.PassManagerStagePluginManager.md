---
framework: qiskit
api_version: 1a3b8eb3e102
doc_type: optimization
source_path: docs/api/qiskit/qiskit.transpiler.preset_passmanagers.plugin.PassManagerStagePluginManager.mdx
source_url: https://github.com/Qiskit/documentation/blob/1a3b8eb3e102668f9612ac64c80f384b28683681/docs/api/qiskit/qiskit.transpiler.preset_passmanagers.plugin.PassManagerStagePluginManager.mdx
license: CC-BY-SA-4.0
---

# PassManagerStagePluginManager

<Class id="qiskit.transpiler.preset_passmanagers.plugin.PassManagerStagePluginManager" isDedicatedPage={true} github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/preset_passmanagers/plugin.py#L235-L305" signature="qiskit.transpiler.preset_passmanagers.plugin.PassManagerStagePluginManager" modifiers="class">
  Bases: [`object`](https://docs.python.org/3/library/functions.html#object)

  Manager class for preset pass manager stage plugins.

  ## Methods

  ### get\_passmanager\_stage

  <Function id="qiskit.transpiler.preset_passmanagers.plugin.PassManagerStagePluginManager.get_passmanager_stage" github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/preset_passmanagers/plugin.py#L259-L292" signature="get_passmanager_stage(stage_name, plugin_name, pm_config, optimization_level=None)">
    Get a stage

    **Parameters**

    *   **stage\_name** ([*str*](https://docs.python.org/3/library/stdtypes.html#str))
    *   **plugin\_name** ([*str*](https://docs.python.org/3/library/stdtypes.html#str))
    *   **pm\_config** ([*PassManagerConfig*](qiskit.transpiler.PassManagerConfig "qiskit.transpiler.passmanager_config.PassManagerConfig"))

    **Return type**

    [*PassManager*](qiskit.transpiler.PassManager "qiskit.transpiler.passmanager.PassManager") | None
  </Function>
</Class>
