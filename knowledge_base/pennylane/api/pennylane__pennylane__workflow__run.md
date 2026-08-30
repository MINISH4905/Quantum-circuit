---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/workflow/run.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/run.py
license: Apache-2.0
---

## Module `pennylane/workflow/run.py`

This module contains a developer focused execution function for internal executions

## `run`

```python
def run(tapes: QuantumScriptBatch, device: Device, config: ExecutionConfig, inner_transform_program: CompilePipeline) -> ResultBatch
```

Execute a batch of quantum scripts on a device with optional gradient computation.

Args:
    tapes (qp.tape.QuantumScriptBatch): batch of quantum scripts
    device (qp.devices.Device): a Pennylane device
    config (qp.devices.ExecutionConfig): Resolved configuration detailing
        execution and differentiation settings.
    inner_transform_program (CompilePipeline): The transformation program to apply
        to the quantum scripts before execution.

Returns:
    ResultBatch: results of the execution
