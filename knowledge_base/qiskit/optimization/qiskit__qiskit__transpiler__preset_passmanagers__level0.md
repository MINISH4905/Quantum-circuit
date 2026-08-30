---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/preset_passmanagers/level0.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/preset_passmanagers/level0.py
license: Apache-2.0
---

## Module `qiskit/transpiler/preset_passmanagers/level0.py`

Pass manager for optimization level 0, providing no explicit optimization.

Level 0 pass manager: no explicit optimization other than mapping to backend.

## `level_0_pass_manager`

```python
def level_0_pass_manager(pass_manager_config: PassManagerConfig) -> StagedPassManager
```

Level 0 pass manager: no explicit optimization other than mapping to backend.

This pass manager applies the user-given initial layout. If none is given, a trivial
layout consisting of mapping the i-th virtual qubit to the i-th physical qubit is used.
Any unused physical qubit is allocated as ancilla space.

The pass manager then unrolls the circuit to the desired basis, and transforms the
circuit to match the coupling map.

Args:
    pass_manager_config: configuration of the pass manager.

Returns:
    a level 0 pass manager.

Raises:
    TranspilerError: if the passmanager config is invalid.
