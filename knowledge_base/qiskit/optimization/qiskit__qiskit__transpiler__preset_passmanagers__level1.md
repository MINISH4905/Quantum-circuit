---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/preset_passmanagers/level1.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/preset_passmanagers/level1.py
license: Apache-2.0
---

## Module `qiskit/transpiler/preset_passmanagers/level1.py`

Pass manager for optimization level 1, providing light optimization.

Level 1 pass manager: light optimization by simple adjacent gate collapsing.

## `level_1_pass_manager`

```python
def level_1_pass_manager(pass_manager_config: PassManagerConfig) -> StagedPassManager
```

Level 1 pass manager: light optimization by simple adjacent gate collapsing.

This pass manager applies the user-given initial layout. If none is given,
and a trivial layout (i-th virtual -> i-th physical) makes the circuit fit
the coupling map, that is used.
Otherwise, the circuit is mapped to the most densely connected coupling subgraph,
and swaps are inserted to map. Any unused physical qubit is allocated as ancilla space.
The pass manager then unrolls the circuit to the desired basis, and transforms the
circuit to match the coupling map. Finally, optimizations in the form of adjacent
gate collapse and redundant reset removal are performed.

Args:
    pass_manager_config: configuration of the pass manager.

Returns:
    a level 1 pass manager.

Raises:
    TranspilerError: if the passmanager config is invalid.
