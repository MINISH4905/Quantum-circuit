---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/preset_passmanagers/level3.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/preset_passmanagers/level3.py
license: Apache-2.0
---

## Module `qiskit/transpiler/preset_passmanagers/level3.py`

Pass manager for optimization level 3, providing heavy optimization.

Level 3 pass manager: heavy optimization by noise adaptive qubit mapping and
gate cancellation using commutativity rules and unitary synthesis.

## `level_3_pass_manager`

```python
def level_3_pass_manager(pass_manager_config: PassManagerConfig) -> StagedPassManager
```

Level 3 pass manager: heavy optimization by noise adaptive qubit mapping and
gate cancellation using commutativity rules and unitary synthesis.

This pass manager applies the user-given initial layout. If none is given, a search
for a perfect layout (i.e. one that satisfies all 2-qubit interactions) is conducted.
If no such layout is found, and device calibration information is available, the
circuit is mapped to the qubits with best readouts and to CX gates with highest fidelity.

The pass manager then transforms the circuit to match the coupling constraints.
It is then unrolled to the basis, and any flipped cx directions are fixed.
Finally, optimizations in the form of commutative gate cancellation, resynthesis
of two-qubit unitary blocks, redundant reset removal and final layout improvements are
performed.

Args:
    pass_manager_config: configuration of the pass manager.

Returns:
    a level 3 pass manager.

Raises:
    TranspilerError: if the passmanager config is invalid.
